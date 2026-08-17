import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { initSchema } from './db/initSchema.js';
import { seedDatabase } from './db/seed.js';

import authRoutes from './routes/auth.js';
import entrepreneurRoutes from './routes/entrepreneurs.js';
import schemeRoutes from './routes/schemes.js';
import fundingRoutes from './routes/funding.js';
import trainingRoutes from './routes/training.js';
import mentorRoutes from './routes/mentors.js';
import networkingRoutes from './routes/networking.js';
import announcementRoutes from './routes/announcements.js';
import notificationRoutes from './routes/notifications.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB schema automatically
initSchema().then(async () => {
  // Check if database needs initial seeding
  try {
    const { get } = await import('./db/database.js');
    const userCount = await get('SELECT COUNT(*) as count FROM users');
    if (!userCount || userCount.count === 0) {
      console.log('Database empty. Seeding initial demo data...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('Error during database check:', err.message);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entrepreneurs', entrepreneurRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/networking-events', networkingRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Manual re-seed endpoint for demo testing
app.post('/api/system/reseed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Database successfully re-seeded with demo data!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reseed database: ' + err.message });
  }
});

// Serve frontend static build assets in production/dist
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Women Entrepreneurship Support Portal</title></head>
          <body style="font-family: system-ui; padding: 2rem; text-align: center;">
            <h2>Women Entrepreneurship Support Portal API Server Running</h2>
            <p>Backend API is active at <code>http://localhost:${PORT}/api</code></p>
            <p>Please run the Vite client using <code>npm run client:dev</code> or build static assets.</p>
          </body>
          </html>
        `);
      }
    });
  } else {
    res.status(404).json({ error: 'API endpoint not found.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Women Entrepreneurship Support Portal API Server`);
  console.log(`Running at: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
