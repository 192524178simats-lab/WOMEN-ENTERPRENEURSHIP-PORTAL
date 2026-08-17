import express from 'express';
import { query, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users (Officer access)
router.get('/', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const { role, search } = req.query;

    let sql = `SELECT id, email, role, full_name, phone, is_active, created_at FROM users WHERE 1=1`;
    const params = [];

    if (role && role !== 'All') {
      sql += ` AND role = ?`;
      params.push(role);
    }

    if (search) {
      sql += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// PUT /api/users/:id/status (Toggle user active status - Officer access)
router.put('/:id/status', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const { is_active } = req.body;
    const userId = req.params.id;

    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    await run(`UPDATE users SET is_active = ? WHERE id = ?`, [is_active ? 1 : 0, userId]);
    res.json({ message: `User status updated to ${is_active ? 'Active' : 'Deactivated'}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status.' });
  }
});

export default router;
