import express from 'express';
import { query, get, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { createNotification, notifyRoleUsers } from '../utils/notify.js';

const router = express.Router();

// GET /api/training
router.get('/', async (req, res) => {
  try {
    const { search, category, mode, status = 'Upcoming' } = req.query;

    let sql = `SELECT t.*, u.full_name as creator_name FROM training_programs t LEFT JOIN users u ON t.created_by = u.id WHERE 1=1`;
    const params = [];

    if (status !== 'All') {
      sql += ` AND t.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (t.name LIKE ? OR t.program_code LIKE ? OR t.trainer LIKE ? OR t.description LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (category && category !== 'All') {
      sql += ` AND t.category = ?`;
      params.push(category);
    }

    if (mode && mode !== 'All') {
      sql += ` AND t.mode = ?`;
      params.push(mode);
    }

    sql += ` ORDER BY t.date ASC, t.start_time ASC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch training programs. ' + err.message });
  }
});

// GET /api/training/my-registrations (Entrepreneur)
router.get('/my-registrations', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) return res.json([]);

    const rows = await query(
      `SELECT tr.*, t.name, t.program_code, t.category, t.trainer, t.date, t.start_time, t.end_time, t.location, t.mode
       FROM training_registrations tr
       JOIN training_programs t ON tr.training_id = t.id
       WHERE tr.entrepreneur_id = ? AND tr.status = 'Confirmed'
       ORDER BY t.date ASC`,
      [ent.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registered training programs.' });
  }
});

// GET /api/training/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await get('SELECT * FROM training_programs WHERE id = ?', [req.params.id]);
    if (!item) {
      return res.status(404).json({ error: 'Training program not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch training details.' });
  }
});

// POST /api/training (Officer access)
router.post('/', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const {
      name,
      trainer,
      category,
      description,
      date,
      start_time,
      end_time,
      location,
      mode = 'Online',
      max_participants,
      deadline,
      eligibility,
      status = 'Upcoming'
    } = req.body;

    if (!name || !trainer || !category || !date || !deadline) {
      return res.status(400).json({ error: 'Name, trainer, category, date, and deadline are required.' });
    }

    const code = `TRN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const result = await run(
      `INSERT INTO training_programs (program_code, name, trainer, category, description, date, start_time, end_time, location, mode, max_participants, current_participants, deadline, eligibility, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [
        code,
        name,
        trainer,
        category,
        description || '',
        date,
        start_time || '10:00',
        end_time || '13:00',
        location || 'Online',
        mode,
        parseInt(max_participants) || 50,
        deadline,
        eligibility || 'Open to all registered female entrepreneurs',
        status,
        req.user.id
      ]
    );

    if (status === 'Upcoming') {
      await notifyRoleUsers(
        'entrepreneur',
        'New Training Program Announced 🎓',
        `Training program "${name}" (${category}) by ${trainer} scheduled for ${date}. Register before ${deadline}.`,
        'info',
        `/entrepreneur/training`
      );
    }

    res.status(201).json({ message: 'Training program created successfully!', training_id: result.id, program_code: code });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create training program. ' + err.message });
  }
});

// POST /api/training/:id/register (Entrepreneur registers)
router.post('/:id/register', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const trainingId = req.params.id;
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);

    if (!ent) {
      return res.status(400).json({ error: 'Entrepreneur profile required to register.' });
    }

    const program = await get('SELECT * FROM training_programs WHERE id = ?', [trainingId]);
    if (!program) {
      return res.status(404).json({ error: 'Training program not found.' });
    }

    // Check capacity limit
    if (program.current_participants >= program.max_participants) {
      return res.status(400).json({ error: 'Registration closed. Maximum capacity reached for this training program.' });
    }

    // Check deadline
    const today = new Date().toISOString().split('T')[0];
    if (program.deadline < today) {
      return res.status(400).json({ error: `Registration deadline (${program.deadline}) has passed.` });
    }

    // Check if already registered
    const existing = await get(
      'SELECT id, status FROM training_registrations WHERE training_id = ? AND entrepreneur_id = ?',
      [trainingId, ent.id]
    );

    if (existing) {
      if (existing.status === 'Confirmed') {
        return res.status(409).json({ error: 'You are already registered for this training program.' });
      } else {
        // Re-confirm
        await run(`UPDATE training_registrations SET status = 'Confirmed' WHERE id = ?`, [existing.id]);
      }
    } else {
      await run(`INSERT INTO training_registrations (training_id, entrepreneur_id, status) VALUES (?, ?, 'Confirmed')`, [trainingId, ent.id]);
    }

    // Update count
    await run(`UPDATE training_programs SET current_participants = current_participants + 1 WHERE id = ?`, [trainingId]);

    // Send confirmation notification
    await createNotification(
      req.user.id,
      'Training Registration Confirmed 🎓',
      `You have successfully registered for "${program.name}" scheduled on ${program.date} at ${program.start_time}.`,
      'success',
      '/entrepreneur/my-training'
    );

    res.json({ message: 'Registration confirmed!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register for training. ' + err.message });
  }
});

// DELETE /api/training/:id/register (Entrepreneur cancels registration)
router.delete('/:id/register', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const trainingId = req.params.id;
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);

    const reg = await get('SELECT id, status FROM training_registrations WHERE training_id = ? AND entrepreneur_id = ?', [trainingId, ent.id]);
    if (!reg || reg.status !== 'Confirmed') {
      return res.status(400).json({ error: 'No active registration found to cancel.' });
    }

    await run(`UPDATE training_registrations SET status = 'Cancelled' WHERE id = ?`, [reg.id]);
    await run(`UPDATE training_programs SET current_participants = MAX(0, current_participants - 1) WHERE id = ?`, [trainingId]);

    res.json({ message: 'Registration cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel registration.' });
  }
});

export default router;
