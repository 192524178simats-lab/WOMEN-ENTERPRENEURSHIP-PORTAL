import express from 'express';
import { query, run } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// PUT /api/notifications/mark-read
router.put('/mark-read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await run(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [id, req.user.id]);
    } else {
      await run(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [req.user.id]);
    }
    res.json({ message: 'Notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification status.' });
  }
});

export default router;
