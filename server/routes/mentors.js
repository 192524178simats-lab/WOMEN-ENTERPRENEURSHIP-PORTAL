import express from 'express';
import { query, get, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { createNotification } from '../utils/notify.js';

const router = express.Router();

// GET /api/mentors (Browse mentor directory)
router.get('/', async (req, res) => {
  try {
    const { search, industry, expertise, availability, status = 'Active' } = req.query;

    let sql = `
      SELECT m.*, u.full_name, u.email, u.avatar
      FROM mentors m
      JOIN users u ON m.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status !== 'All') {
      sql += ` AND m.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (u.full_name LIKE ? OR m.industry LIKE ? OR m.expertise LIKE ? OR m.professional_bg LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (industry && industry !== 'All') {
      sql += ` AND m.industry = ?`;
      params.push(industry);
    }

    if (expertise && expertise !== 'All') {
      sql += ` AND m.expertise LIKE ?`;
      params.push(`%${expertise}%`);
    }

    if (availability && availability !== 'All') {
      sql += ` AND m.availability LIKE ?`;
      params.push(`%${availability}%`);
    }

    sql += ` ORDER BY m.years_experience DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mentor directory. ' + err.message });
  }
});

// GET /api/mentors/:id
router.get('/:id', async (req, res) => {
  try {
    const mentor = await get(
      `SELECT m.*, u.full_name, u.email, u.phone, u.avatar
       FROM mentors m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = ?`,
      [req.params.id]
    );

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mentor profile.' });
  }
});

// PUT /api/mentors/profile (Mentor updates profile & availability)
router.put('/profile', authenticateToken, authorizeRoles('mentor'), async (req, res) => {
  try {
    const {
      full_name,
      phone,
      professional_bg,
      industry,
      expertise,
      years_experience,
      qualifications,
      bio,
      availability
    } = req.body;

    await run('UPDATE users SET full_name = ?, phone = ? WHERE id = ?', [full_name, phone, req.user.id]);

    const m = await get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);

    if (m) {
      await run(
        `UPDATE mentors SET
          professional_bg = ?, industry = ?, expertise = ?, years_experience = ?,
          qualifications = ?, bio = ?, availability = ?
         WHERE id = ?`,
        [
          professional_bg,
          industry,
          expertise,
          parseInt(years_experience) || 0,
          qualifications,
          bio,
          availability,
          m.id
        ]
      );
    } else {
      await run(
        `INSERT INTO mentors (user_id, phone, professional_bg, industry, expertise, years_experience, qualifications, bio, availability)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, phone, professional_bg, industry, expertise, parseInt(years_experience) || 0, qualifications, bio, availability]
      );
    }

    res.json({ message: 'Mentor profile updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update mentor profile.' });
  }
});

// ==================== MENTORSHIP REQUESTS & SESSIONS ====================

// GET /api/mentors/requests/list
router.get('/requests/list', authenticateToken, async (req, res) => {
  try {
    let sql = `
      SELECT mr.*,
             e.id as entrepreneur_id, u_e.full_name as entrepreneur_name, u_e.email as entrepreneur_email, u_e.phone as entrepreneur_phone,
             b.business_name, b.sector,
             m.id as mentor_id, u_m.full_name as mentor_name, m.expertise, m.industry,
             ms.id as session_id, ms.session_date, ms.session_time, ms.meeting_link, ms.status as session_status, ms.feedback
      FROM mentorship_requests mr
      JOIN entrepreneurs e ON mr.entrepreneur_id = e.id
      JOIN users u_e ON e.user_id = u_e.id
      JOIN businesses b ON mr.business_id = b.id
      JOIN mentors m ON mr.mentor_id = m.id
      JOIN users u_m ON m.user_id = u_m.id
      LEFT JOIN mentorship_sessions ms ON ms.request_id = mr.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'entrepreneur') {
      const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
      if (!ent) return res.json([]);
      sql += ` AND mr.entrepreneur_id = ?`;
      params.push(ent.id);
    } else if (req.user.role === 'mentor') {
      const mentor = await get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
      if (!mentor) return res.json([]);
      sql += ` AND mr.mentor_id = ?`;
      params.push(mentor.id);
    }

    sql += ` ORDER BY mr.id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mentorship requests. ' + err.message });
  }
});

// POST /api/mentors/requests (Entrepreneur requests mentorship)
router.post('/requests', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const { mentor_id, reason, preferred_date, preferred_time } = req.body;

    if (!mentor_id || !reason || !preferred_date || !preferred_time) {
      return res.status(400).json({ error: 'Mentor selection, reason for request, preferred date and time are required.' });
    }

    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) {
      return res.status(400).json({ error: 'Entrepreneur profile required.' });
    }

    const biz = await get('SELECT id, business_name FROM businesses WHERE entrepreneur_id = ?', [ent.id]);
    if (!biz) {
      return res.status(400).json({ error: 'Please register your business before requesting mentorship.' });
    }

    const mentor = await get('SELECT m.*, u.user_id FROM mentors m JOIN users u ON m.user_id = u.id WHERE m.id = ?', [mentor_id]);
    if (!mentor) {
      return res.status(404).json({ error: 'Selected mentor not found.' });
    }

    const result = await run(
      `INSERT INTO mentorship_requests (entrepreneur_id, mentor_id, business_id, reason, preferred_date, preferred_time, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [ent.id, mentor_id, biz.id, reason, preferred_date, preferred_time]
    );

    // Notify mentor
    await createNotification(
      mentor.user_id,
      'New Mentorship Request Received 🤝',
      `${req.user.full_name} (${biz.business_name}) sent you a mentorship request for ${preferred_date}.`,
      'info',
      '/mentor/requests'
    );

    res.status(201).json({ message: 'Mentorship request sent successfully!', request_id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send mentorship request. ' + err.message });
  }
});

// PUT /api/mentors/requests/:id/respond (Mentor accepts/rejects request)
router.put('/requests/:id/respond', authenticateToken, authorizeRoles('mentor'), async (req, res) => {
  try {
    const { status, meeting_link } = req.body; // 'Accepted' or 'Rejected'
    const reqId = req.params.id;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Response status must be Accepted or Rejected.' });
    }

    const mentor = await get('SELECT id FROM mentors WHERE user_id = ?', [req.user.id]);
    const mRequest = await get(
      `SELECT mr.*, e.user_id as entrepreneur_user_id, u.full_name as entrepreneur_name
       FROM mentorship_requests mr
       JOIN entrepreneurs e ON mr.entrepreneur_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE mr.id = ? AND mr.mentor_id = ?`,
      [reqId, mentor.id]
    );

    if (!mRequest) {
      return res.status(404).json({ error: 'Mentorship request not found or unauthorized.' });
    }

    await run(`UPDATE mentorship_requests SET status = ? WHERE id = ?`, [status, reqId]);

    // If accepted, schedule session automatically
    if (status === 'Accepted') {
      const meetLink = meeting_link || `https://meet.jit.si/wep-mentorship-${reqId}-${Math.floor(Math.random()*1000)}`;
      await run(
        `INSERT INTO mentorship_sessions (request_id, mentor_id, entrepreneur_id, session_date, session_time, meeting_link, status)
         VALUES (?, ?, ?, ?, ?, ?, 'Scheduled')`,
        [reqId, mentor.id, mRequest.entrepreneur_id, mRequest.preferred_date, mRequest.preferred_time, meetLink]
      );

      await createNotification(
        mRequest.entrepreneur_user_id,
        'Mentorship Request Accepted! 🎉',
        `Mentor ${req.user.full_name} accepted your request! Session scheduled for ${mRequest.preferred_date} at ${mRequest.preferred_time}.`,
        'success',
        '/entrepreneur/mentorship'
      );
    } else {
      await createNotification(
        mRequest.entrepreneur_user_id,
        'Mentorship Request Update',
        `Mentor ${req.user.full_name} was unable to accept your request at this time.`,
        'warning',
        '/entrepreneur/mentorship'
      );
    }

    res.json({ message: `Mentorship request ${status.toLowerCase()}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to mentorship request. ' + err.message });
  }
});

// POST /api/mentors/sessions/:id/feedback (Mentor completes session & adds feedback)
router.post('/sessions/:id/feedback', authenticateToken, authorizeRoles('mentor'), async (req, res) => {
  try {
    const { feedback, status = 'Completed' } = req.body;
    const sessionId = req.params.id;

    await run(
      `UPDATE mentorship_sessions SET feedback = ?, status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [feedback || 'Session completed successfully.', status, sessionId]
    );

    res.json({ message: 'Session feedback recorded!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
});

export default router;
