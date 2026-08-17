import express from 'express';
import { query, get, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { createNotification, notifyRoleUsers } from '../utils/notify.js';

const router = express.Router();

// GET /api/networking-events
router.get('/', async (req, res) => {
  try {
    const { search, event_type, city, status = 'Upcoming' } = req.query;

    let sql = `SELECT e.*, u.full_name as creator_name FROM networking_events e LEFT JOIN users u ON e.created_by = u.id WHERE 1=1`;
    const params = [];

    if (status !== 'All') {
      sql += ` AND e.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (e.name LIKE ? OR e.event_code LIKE ? OR e.venue LIKE ? OR e.city LIKE ? OR e.organizer LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    if (event_type && event_type !== 'All') {
      sql += ` AND e.event_type = ?`;
      params.push(event_type);
    }

    if (city && city !== 'All') {
      sql += ` AND e.city = ?`;
      params.push(city);
    }

    sql += ` ORDER BY e.date ASC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch networking events. ' + err.message });
  }
});

// GET /api/networking-events/my-events (Entrepreneur)
router.get('/my-events', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) return res.json([]);

    const rows = await query(
      `SELECT nr.*, e.name, e.event_code, e.event_type, e.date, e.time, e.venue, e.city, e.organizer
       FROM networking_registrations nr
       JOIN networking_events e ON nr.event_id = e.id
       WHERE nr.entrepreneur_id = ? AND nr.status = 'Confirmed'
       ORDER BY e.date ASC`,
      [ent.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registered networking events.' });
  }
});

// POST /api/networking-events (Officer access)
router.post('/', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      time,
      venue,
      city,
      event_type,
      max_participants,
      deadline,
      organizer,
      status = 'Upcoming'
    } = req.body;

    if (!name || !date || !venue || !city || !event_type || !deadline) {
      return res.status(400).json({ error: 'Name, date, venue, city, event type, and deadline are required.' });
    }

    const code = `EVT-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`;

    const resEvt = await run(
      `INSERT INTO networking_events (event_code, name, description, date, time, venue, city, event_type, max_participants, current_participants, deadline, organizer, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [
        code,
        name,
        description || '',
        date,
        time || '10:00 AM',
        venue,
        city,
        event_type,
        parseInt(max_participants) || 100,
        deadline,
        organizer || 'Government MSME Board',
        status,
        req.user.id
      ]
    );

    if (status === 'Upcoming') {
      await notifyRoleUsers(
        'entrepreneur',
        'New Networking Event Announced 🌐',
        `Networking Event "${name}" (${event_type}) in ${city} on ${date}. Register before ${deadline}.`,
        'info',
        `/entrepreneur/networking`
      );
    }

    res.status(201).json({ message: 'Networking event created successfully!', event_id: resEvt.id, event_code: code });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create networking event. ' + err.message });
  }
});

// POST /api/networking-events/:id/register (Entrepreneur registers)
router.post('/:id/register', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const eventId = req.params.id;
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) return res.status(400).json({ error: 'Entrepreneur profile required.' });

    const event = await get('SELECT * FROM networking_events WHERE id = ?', [eventId]);
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ error: 'Event registration is full.' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (event.deadline < today) {
      return res.status(400).json({ error: `Registration deadline (${event.deadline}) has passed.` });
    }

    const existing = await get('SELECT id, status FROM networking_registrations WHERE event_id = ? AND entrepreneur_id = ?', [eventId, ent.id]);
    if (existing) {
      if (existing.status === 'Confirmed') {
        return res.status(409).json({ error: 'You are already registered for this event.' });
      } else {
        await run(`UPDATE networking_registrations SET status = 'Confirmed' WHERE id = ?`, [existing.id]);
      }
    } else {
      await run(`INSERT INTO networking_registrations (event_id, entrepreneur_id, status) VALUES (?, ?, 'Confirmed')`, [eventId, ent.id]);
    }

    await run(`UPDATE networking_events SET current_participants = current_participants + 1 WHERE id = ?`, [eventId]);

    await createNotification(
      req.user.id,
      'Event Pass Confirmed 🎫',
      `You are confirmed for "${event.name}" in ${event.city} on ${event.date}.`,
      'success',
      '/entrepreneur/my-events'
    );

    res.json({ message: 'Event registration confirmed!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register for event. ' + err.message });
  }
});

// DELETE /api/networking-events/:id/register (Cancel registration)
router.delete('/:id/register', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const eventId = req.params.id;
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    const reg = await get('SELECT id FROM networking_registrations WHERE event_id = ? AND entrepreneur_id = ? AND status = "Confirmed"', [eventId, ent.id]);

    if (!reg) return res.status(400).json({ error: 'No active event registration found.' });

    await run(`UPDATE networking_registrations SET status = 'Cancelled' WHERE id = ?`, [reg.id]);
    await run(`UPDATE networking_events SET current_participants = MAX(0, current_participants - 1) WHERE id = ?`, [eventId]);

    res.json({ message: 'Event registration cancelled.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel registration.' });
  }
});

export default router;
