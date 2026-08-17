import express from 'express';
import { query, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { notifyRoleUsers } from '../utils/notify.js';

const router = express.Router();

// GET /api/announcements (Public / Authenticated)
router.get('/', async (req, res) => {
  try {
    const { category, status = 'Active' } = req.query;

    let sql = `SELECT a.*, u.full_name as publisher FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE 1=1`;
    const params = [];

    if (status !== 'All') {
      sql += ` AND a.status = ?`;
      params.push(status);
    }

    if (category && category !== 'All') {
      sql += ` AND a.category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY a.id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

// POST /api/announcements (Officer access)
router.post('/', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const { title, description, category, expiry_date, status = 'Active' } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required.' });
    }

    const result = await run(
      `INSERT INTO announcements (title, description, category, published_date, expiry_date, status, created_by)
       VALUES (?, ?, ?, DATE('now'), ?, ?, ?)`,
      [title, description, category, expiry_date || '2026-12-31', status, req.user.id]
    );

    if (status === 'Active') {
      await notifyRoleUsers(
        'entrepreneur',
        `Announcement: ${title}`,
        description.substring(0, 120) + '...',
        'info',
        '/entrepreneur/announcements'
      );
    }

    res.status(201).json({ message: 'Announcement published successfully!', announcement_id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish announcement.' });
  }
});

// DELETE /api/announcements/:id (Officer access)
router.delete('/:id', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    await run(`UPDATE announcements SET status = 'Archived' WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Announcement archived.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to archive announcement.' });
  }
});

export default router;
