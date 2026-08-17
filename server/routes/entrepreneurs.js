import express from 'express';
import { query, get, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { createNotification } from '../utils/notify.js';

const router = express.Router();

// GET /api/entrepreneurs/recommendations (Rule-based recommendation engine)
router.get('/recommendations', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) {
      return res.json({ schemes: [], funding: [], training: [], mentors: [] });
    }

    const biz = await get('SELECT * FROM businesses WHERE entrepreneur_id = ?', [ent.id]);
    const targetSector = biz?.sector || 'Textiles & Handicrafts';

    // 1. Recommended Schemes matching sector or general
    const schemes = await query(
      `SELECT * FROM schemes WHERE status = 'Active' AND (target_sector LIKE ? OR target_sector = 'All MSME Sectors') LIMIT 3`,
      [`%${targetSector}%`]
    );

    // 2. Recommended Funding Opportunities
    const funding = await query(
      `SELECT * FROM funding_opportunities WHERE status = 'Active' ORDER BY max_amount DESC LIMIT 3`
    );

    // 3. Recommended Training Programs matching category or general
    const training = await query(
      `SELECT * FROM training_programs WHERE status = 'Upcoming' ORDER BY date ASC LIMIT 3`
    );

    // 4. Recommended Mentors matching sector or industry
    const mentors = await query(
      `SELECT m.*, u.full_name, u.email, u.avatar FROM mentors m JOIN users u ON m.user_id = u.id WHERE m.status = 'Active' ORDER BY m.years_experience DESC LIMIT 3`
    );

    res.json({
      sector: targetSector,
      schemes,
      funding,
      training,
      mentors
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate opportunity recommendations. ' + err.message });
  }
});

// GET /api/entrepreneurs (Officer access)
router.get('/', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const { search, status, sector } = req.query;
    let sql = `
      SELECT e.*, u.full_name, u.email, u.phone, u.avatar, u.is_active,
             b.id as business_id, b.business_name, b.business_type, b.sector, b.reg_number,
             b.status as business_status, b.annual_turnover, b.employees
      FROM entrepreneurs e
      JOIN users u ON e.user_id = u.id
      LEFT JOIN businesses b ON b.entrepreneur_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR b.business_name LIKE ? OR b.reg_number LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (status) {
      sql += ` AND b.status = ?`;
      params.push(status);
    }

    if (sector) {
      sql += ` AND b.sector = ?`;
      params.push(sector);
    }

    sql += ` ORDER BY e.id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entrepreneurs. ' + err.message });
  }
});

// GET /api/entrepreneurs/my-business (Entrepreneur access)
router.get('/my-business', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const ent = await get('SELECT * FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) {
      return res.status(404).json({ error: 'Entrepreneur profile not found.' });
    }

    const biz = await get('SELECT * FROM businesses WHERE entrepreneur_id = ?', [ent.id]);
    res.json({ entrepreneur: ent, business: biz });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch business details.' });
  }
});

// GET /api/entrepreneurs/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const ent = await get(
      `SELECT e.*, u.full_name, u.email, u.phone, u.avatar
       FROM entrepreneurs e
       JOIN users u ON e.user_id = u.id
       WHERE e.id = ?`,
      [req.params.id]
    );

    if (!ent) {
      return res.status(404).json({ error: 'Entrepreneur not found' });
    }

    const biz = await get('SELECT * FROM businesses WHERE entrepreneur_id = ?', [ent.id]);
    res.json({ entrepreneur: ent, business: biz });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entrepreneur detail.' });
  }
});

// PUT /api/entrepreneurs/profile
router.put('/profile', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const { full_name, phone, dob, address, city, state, education } = req.body;

    await run('UPDATE users SET full_name = ?, phone = ? WHERE id = ?', [
      full_name,
      phone,
      req.user.id
    ]);

    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);

    if (ent) {
      await run(
        `UPDATE entrepreneurs SET dob = ?, address = ?, city = ?, state = ?, education = ? WHERE id = ?`,
        [dob, address, city, state, education, ent.id]
      );
    } else {
      await run(
        `INSERT INTO entrepreneurs (user_id, dob, address, city, state, education) VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, dob, address, city, state, education]
      );
    }

    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/entrepreneurs/business
router.post('/business', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const {
      business_name,
      business_type,
      sector,
      reg_number,
      start_date,
      employees,
      annual_turnover,
      description,
      website,
      social_links
    } = req.body;

    if (!business_name || !sector || !business_type) {
      return res.status(400).json({ error: 'Business name, sector, and business type are required.' });
    }

    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) {
      return res.status(400).json({ error: 'Please complete entrepreneur profile first.' });
    }

    const existingBiz = await get('SELECT id FROM businesses WHERE entrepreneur_id = ?', [ent.id]);
    const regNum = reg_number || `REG-IND-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    if (existingBiz) {
      await run(
        `UPDATE businesses SET
          business_name = ?, business_type = ?, sector = ?, reg_number = ?, start_date = ?,
          employees = ?, annual_turnover = ?, description = ?, website = ?, social_links = ?,
          status = 'Pending Verification'
         WHERE id = ?`,
        [
          business_name,
          business_type,
          sector,
          regNum,
          start_date,
          parseInt(employees) || 1,
          parseFloat(annual_turnover) || 0,
          description,
          website,
          social_links,
          existingBiz.id
        ]
      );
      res.json({ message: 'Business profile updated successfully and submitted for re-verification!' });
    } else {
      const resBiz = await run(
        `INSERT INTO businesses (entrepreneur_id, business_name, business_type, sector, reg_number, start_date, employees, annual_turnover, description, website, social_links, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Verification')`,
        [
          ent.id,
          business_name,
          business_type,
          sector,
          regNum,
          start_date,
          parseInt(employees) || 1,
          parseFloat(annual_turnover) || 0,
          description,
          website,
          social_links
        ]
      );
      res.status(201).json({ message: 'Business registered successfully and submitted for verification!', business_id: resBiz.id });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save business profile. ' + err.message });
  }
});

// PUT /api/entrepreneurs/business/:id/verify (Officer access - Requires rejection reason if rejected)
router.put('/business/:id/verify', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const { status, officer_remarks } = req.body;
    const bizId = req.params.id;

    if (!['Verified', 'Rejected', 'Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status.' });
    }

    if (status === 'Rejected' && (!officer_remarks || officer_remarks.trim().length === 0)) {
      return res.status(400).json({ error: 'A rejection reason is strictly required when rejecting a business verification.' });
    }

    const biz = await get('SELECT b.*, e.user_id FROM businesses b JOIN entrepreneurs e ON b.entrepreneur_id = e.id WHERE b.id = ?', [bizId]);
    if (!biz) {
      return res.status(404).json({ error: 'Business record not found.' });
    }

    await run(
      `UPDATE businesses SET status = ?, officer_remarks = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, officer_remarks || '', bizId]
    );

    // Trigger Notification
    const notifType = status === 'Verified' ? 'success' : status === 'Rejected' ? 'error' : 'info';
    await createNotification(
      biz.user_id,
      `Business Profile ${status}`,
      `Your business "${biz.business_name}" status has been updated to "${status}". Remarks: ${officer_remarks || 'None'}`,
      notifType,
      '/entrepreneur/business'
    );

    res.json({ message: `Business verification status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update business verification status.' });
  }
});

export default router;
