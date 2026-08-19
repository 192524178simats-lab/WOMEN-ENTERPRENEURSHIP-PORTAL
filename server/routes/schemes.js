import express from 'express';
import { query, get, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { notifyRoleUsers } from '../utils/notify.js';

const router = express.Router();

// GET /api/schemes (Public or Authenticated)
router.get('/', async (req, res) => {
  try {
    const { search, sector, category, status = 'Active', minFunding, maxFunding } = req.query;

    let sql = `SELECT s.*, u.full_name as creator_name FROM schemes s LEFT JOIN users u ON s.created_by = u.id WHERE 1=1`;
    const params = [];

    // Filter by status unless officer asks for all
    if (status !== 'All') {
      sql += ` AND s.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (s.name LIKE ? OR s.scheme_code LIKE ? OR s.department LIKE ? OR s.description LIKE ? OR s.eligibility LIKE ? OR s.benefits LIKE ? OR s.target_sector LIKE ? OR s.target_category LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term, term, term, term, term);
    }

    if (sector && sector !== 'All') {
      sql += ` AND (s.target_sector LIKE ? OR s.target_sector = 'All MSME Sectors')`;
      params.push(`%${sector}%`);
    }

    if (category && category !== 'All') {
      sql += ` AND s.target_category LIKE ?`;
      params.push(`%${category}%`);
    }

    if (minFunding) {
      sql += ` AND s.max_funding >= ?`;
      params.push(parseFloat(minFunding));
    }

    if (maxFunding) {
      sql += ` AND s.min_funding <= ?`;
      params.push(parseFloat(maxFunding));
    }

    sql += ` ORDER BY s.id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch government schemes. ' + err.message });
  }
});

// GET /api/schemes/:id
router.get('/:id', async (req, res) => {
  try {
    const scheme = await get('SELECT s.*, u.full_name as creator_name FROM schemes s LEFT JOIN users u ON s.created_by = u.id WHERE s.id = ?', [req.params.id]);
    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scheme details.' });
  }
});

// POST /api/schemes (Officer access)
router.post('/', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const {
      name,
      department,
      description,
      eligibility,
      benefits,
      min_funding,
      max_funding,
      start_date,
      end_date,
      required_docs,
      target_sector,
      target_category,
      guidelines_url,
      status = 'Active'
    } = req.body;

    if (!name || !department || !description) {
      return res.status(400).json({ error: 'Scheme name, department, and description are required.' });
    }

    const schemeCode = `WEP-SCH-${Math.floor(100 + Math.random() * 900)}`;

    const result = await run(
      `INSERT INTO schemes (scheme_code, name, department, description, eligibility, benefits, min_funding, max_funding, start_date, end_date, required_docs, target_sector, target_category, guidelines_url, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        schemeCode,
        name,
        department,
        description,
        eligibility || 'All eligible women businesses',
        benefits || 'Financial assistance',
        parseFloat(min_funding) || 0,
        parseFloat(max_funding) || 0,
        start_date || new Date().toISOString().split('T')[0],
        end_date || '2026-12-31',
        required_docs || 'Udyam Registration, Bank Passbook',
        target_sector || 'All MSME Sectors',
        target_category || 'General',
        guidelines_url || '',
        status,
        req.user.id
      ]
    );

    // Notify all entrepreneurs about new scheme
    if (status === 'Active') {
      await notifyRoleUsers(
        'entrepreneur',
        'New Government Scheme Published 📢',
        `A new scheme "${name}" has been published under ${department}. Check eligibility and benefits now.`,
        'info',
        `/entrepreneur/schemes`
      );
    }

    res.status(201).json({ message: 'Government scheme created successfully!', scheme_id: result.id, scheme_code: schemeCode });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create government scheme. ' + err.message });
  }
});

// PUT /api/schemes/:id (Officer access)
router.put('/:id', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const {
      name,
      department,
      description,
      eligibility,
      benefits,
      min_funding,
      max_funding,
      start_date,
      end_date,
      required_docs,
      target_sector,
      target_category,
      guidelines_url,
      status
    } = req.body;

    const existing = await get('SELECT id FROM schemes WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    await run(
      `UPDATE schemes SET
        name = ?, department = ?, description = ?, eligibility = ?, benefits = ?,
        min_funding = ?, max_funding = ?, start_date = ?, end_date = ?, required_docs = ?,
        target_sector = ?, target_category = ?, guidelines_url = ?, status = ?
       WHERE id = ?`,
      [
        name,
        department,
        description,
        eligibility,
        benefits,
        parseFloat(min_funding) || 0,
        parseFloat(max_funding) || 0,
        start_date,
        end_date,
        required_docs,
        target_sector,
        target_category,
        guidelines_url,
        status,
        req.params.id
      ]
    );

    res.json({ message: 'Scheme updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update scheme. ' + err.message });
  }
});

// DELETE /api/schemes/:id (Deactivate or Delete - Officer access)
router.delete('/:id', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    await run(`UPDATE schemes SET status = 'Archived' WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Scheme archived successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to archive scheme.' });
  }
});

export default router;
