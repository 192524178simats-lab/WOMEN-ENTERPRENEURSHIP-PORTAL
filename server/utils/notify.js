import { run, query } from '../db/database.js';

export const createNotification = async (userId, title, message, type = 'info', link = null) => {
  try {
    await run(
      `INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)`,
      [userId, title, message, type, link]
    );
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

export const notifyRoleUsers = async (role, title, message, type = 'info', link = null) => {
  try {
    const users = await query(`SELECT id FROM users WHERE role = ? AND is_active = 1`, [role]);
    for (const u of users) {
      await createNotification(u.id, title, message, type, link);
    }
  } catch (err) {
    console.error('Failed to notify role users:', err);
  }
};
