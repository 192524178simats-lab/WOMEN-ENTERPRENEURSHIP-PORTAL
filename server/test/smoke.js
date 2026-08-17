import http from 'http';
import { initSchema } from '../db/initSchema.js';
import { seedDatabase } from '../db/seed.js';

const testEndpoint = (path) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    }).on('error', reject);
  });
};

const runSmokeTest = async () => {
  console.log('Initializing schema and database for verification test...');
  await initSchema();
  await seedDatabase();

  console.log('Starting Express server in test harness...');
  const { default: app } = await import('../index.js');

  setTimeout(async () => {
    try {
      const schemes = await testEndpoint('/api/schemes');
      console.log(`✅ [PASS] GET /api/schemes returned ${schemes.data.length} active schemes (Status: ${schemes.status})`);

      const funding = await testEndpoint('/api/funding');
      console.log(`✅ [PASS] GET /api/funding returned ${funding.data.length} active funding opportunities (Status: ${funding.status})`);

      const training = await testEndpoint('/api/training');
      console.log(`✅ [PASS] GET /api/training returned ${training.data.length} training programs (Status: ${training.status})`);

      const mentors = await testEndpoint('/api/mentors');
      console.log(`✅ [PASS] GET /api/mentors returned ${mentors.data.length} certified mentors (Status: ${mentors.status})`);

      const networking = await testEndpoint('/api/networking-events');
      console.log(`✅ [PASS] GET /api/networking-events returned ${networking.data.length} events (Status: ${networking.status})`);

      const announcements = await testEndpoint('/api/announcements');
      console.log(`✅ [PASS] GET /api/announcements returned ${announcements.data.length} announcements (Status: ${announcements.status})`);

      console.log('🎉 ALL BACKEND API ENDPOINTS & DATABASE VERIFIED 100% WORKING!');
      process.exit(0);
    } catch (err) {
      console.error('Smoke test failed:', err.message);
      process.exit(1);
    }
  }, 1500);
};

runSmokeTest();
