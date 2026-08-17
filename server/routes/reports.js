import express from 'express';
import { query, get } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reports/public-stats (Public stats for Landing Page)
router.get('/public-stats', async (req, res) => {
  try {
    const totalEntrepreneurs = (await get(`SELECT COUNT(*) as count FROM entrepreneurs`))?.count || 0;
    const totalSchemes = (await get(`SELECT COUNT(*) as count FROM schemes WHERE status = 'Active'`))?.count || 0;
    const totalFunding = (await get(`SELECT COUNT(*) as count FROM funding_opportunities WHERE status = 'Active'`))?.count || 0;
    const totalTraining = (await get(`SELECT COUNT(*) as count FROM training_programs WHERE status = 'Upcoming'`))?.count || 0;
    const totalMentors = (await get(`SELECT COUNT(*) as count FROM mentors WHERE status = 'Active'`))?.count || 0;
    const totalEvents = (await get(`SELECT COUNT(*) as count FROM networking_events WHERE status = 'Upcoming'`))?.count || 0;

    res.json({
      totalEntrepreneurs,
      totalSchemes,
      totalFunding,
      totalTraining,
      totalMentors,
      totalEvents
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public stats.' });
  }
});

// GET /api/reports/dashboard-stats
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const role = req.user.role;

    if (role === 'officer') {
      const totalEntrepreneurs = (await get(`SELECT COUNT(*) as count FROM entrepreneurs`))?.count || 0;
      const verifiedEntrepreneurs = (await get(`SELECT COUNT(*) as count FROM businesses WHERE status = 'Verified'`))?.count || 0;
      const pendingVerifications = (await get(`SELECT COUNT(*) as count FROM businesses WHERE status = 'Pending Verification'`))?.count || 0;
      
      const totalSchemes = (await get(`SELECT COUNT(*) as count FROM schemes WHERE status = 'Active'`))?.count || 0;
      const activeFunding = (await get(`SELECT COUNT(*) as count FROM funding_opportunities WHERE status = 'Active'`))?.count || 0;
      
      const totalApps = (await get(`SELECT COUNT(*) as count FROM funding_applications`))?.count || 0;
      const pendingApps = (await get(`SELECT COUNT(*) as count FROM funding_applications WHERE status IN ('Submitted', 'Under Review')`))?.count || 0;
      const approvedApps = (await get(`SELECT COUNT(*) as count FROM funding_applications WHERE status = 'Approved'`))?.count || 0;
      const rejectedApps = (await get(`SELECT COUNT(*) as count FROM funding_applications WHERE status = 'Rejected'`))?.count || 0;

      const totalRequestedFunding = (await get(`SELECT COALESCE(SUM(requested_amount), 0) as sum FROM funding_applications`))?.sum || 0;
      const totalApprovedFunding = (await get(`SELECT COALESCE(SUM(requested_amount), 0) as sum FROM funding_applications WHERE status = 'Approved'`))?.sum || 0;

      const totalTrainings = (await get(`SELECT COUNT(*) as count FROM training_programs`))?.count || 0;
      const totalMentors = (await get(`SELECT COUNT(*) as count FROM mentors WHERE status = 'Active'`))?.count || 0;
      const totalEvents = (await get(`SELECT COUNT(*) as count FROM networking_events`))?.count || 0;

      // Chart data: Applications by status
      const appsByStatus = await query(`SELECT status, COUNT(*) as count FROM funding_applications GROUP BY status`);
      
      // Chart data: Business sectors
      const sectorBreakdown = await query(`SELECT sector, COUNT(*) as count FROM businesses GROUP BY sector`);

      // Chart data: Entrepreneurs by location (city)
      const locationBreakdown = await query(`SELECT city, COUNT(*) as count FROM entrepreneurs WHERE city IS NOT NULL AND city != '' GROUP BY city`);

      // Chart data: Training enrollments
      const trainingEnrollments = await query(`SELECT name, current_participants, max_participants FROM training_programs LIMIT 5`);

      return res.json({
        totalEntrepreneurs,
        verifiedEntrepreneurs,
        pendingVerifications,
        totalSchemes,
        activeFunding,
        totalApps,
        pendingApps,
        approvedApps,
        rejectedApps,
        totalRequestedFunding,
        totalApprovedFunding,
        totalTrainings,
        totalMentors,
        totalEvents,
        appsByStatus,
        sectorBreakdown,
        locationBreakdown,
        trainingEnrollments
      });

    } else if (role === 'entrepreneur') {
      const ent = await get(`SELECT id, dob, address, city, state, education FROM entrepreneurs WHERE user_id = ?`, [req.user.id]);
      const biz = ent ? await get(`SELECT * FROM businesses WHERE entrepreneur_id = ?`, [ent.id]) : null;

      const activeApps = ent ? (await get(`SELECT COUNT(*) as count FROM funding_applications WHERE entrepreneur_id = ? AND status NOT IN ('Approved', 'Rejected', 'Withdrawn')`, [ent.id]))?.count || 0 : 0;
      const approvedApps = ent ? (await get(`SELECT COUNT(*) as count FROM funding_applications WHERE entrepreneur_id = ? AND status = 'Approved'`, [ent.id]))?.count || 0 : 0;
      const myTrainings = ent ? (await get(`SELECT COUNT(*) as count FROM training_registrations WHERE entrepreneur_id = ? AND status = 'Confirmed'`, [ent.id]))?.count || 0 : 0;
      const myEvents = ent ? (await get(`SELECT COUNT(*) as count FROM networking_registrations WHERE entrepreneur_id = ? AND status = 'Confirmed'`, [ent.id]))?.count || 0 : 0;
      const myMentorships = ent ? (await get(`SELECT COUNT(*) as count FROM mentorship_requests WHERE entrepreneur_id = ?`, [ent.id]))?.count || 0 : 0;
      
      // Dynamic profile completion calculation
      let completionScore = 20; // Base user registration
      const missingFields = [];

      if (ent && ent.dob && ent.city && ent.state) {
        completionScore += 30;
      } else {
        missingFields.push('Personal Address, DOB, and City');
      }

      if (biz) {
        completionScore += 30;
        if (biz.status === 'Verified') {
          completionScore += 20;
        } else {
          missingFields.push('Government Business Verification');
        }
      } else {
        missingFields.push('Registered Business Profile');
      }

      return res.json({
        entrepreneur: ent,
        business: biz,
        profileCompletion: completionScore,
        missingFields,
        activeApps,
        approvedApps,
        myTrainings,
        myEvents,
        myMentorships
      });

    } else if (role === 'mentor') {
      const mentor = await get(`SELECT id FROM mentors WHERE user_id = ?`, [req.user.id]);
      if (!mentor) return res.json({ mentor: null });

      const totalRequests = (await get(`SELECT COUNT(*) as count FROM mentorship_requests WHERE mentor_id = ?`, [mentor.id]))?.count || 0;
      const pendingRequests = (await get(`SELECT COUNT(*) as count FROM mentorship_requests WHERE mentor_id = ? AND status = 'Pending'`, [mentor.id]))?.count || 0;
      const acceptedRequests = (await get(`SELECT COUNT(*) as count FROM mentorship_requests WHERE mentor_id = ? AND status = 'Accepted'`, [mentor.id]))?.count || 0;
      const upcomingSessions = (await get(`SELECT COUNT(*) as count FROM mentorship_sessions WHERE mentor_id = ? AND status = 'Scheduled'`, [mentor.id]))?.count || 0;
      const completedSessions = (await get(`SELECT COUNT(*) as count FROM mentorship_sessions WHERE mentor_id = ? AND status = 'Completed'`, [mentor.id]))?.count || 0;

      return res.json({
        mentor,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        upcomingSessions,
        completedSessions
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate dashboard statistics. ' + err.message });
  }
});

// GET /api/reports/export
router.get('/export', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const { sector, status, funding_type, date_from, date_to } = req.query;

    let sql = `
      SELECT fa.application_no, fa.requested_amount, fa.status, fa.created_at, fa.officer_remarks,
             f.name as funding_name, f.funding_type,
             b.business_name, b.sector, b.reg_number,
             u.full_name as entrepreneur_name, u.email, u.phone
      FROM funding_applications fa
      JOIN funding_opportunities f ON fa.funding_id = f.id
      JOIN businesses b ON fa.business_id = b.id
      JOIN entrepreneurs e ON fa.entrepreneur_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (sector && sector !== 'All') {
      sql += ` AND b.sector = ?`;
      params.push(sector);
    }

    if (status && status !== 'All') {
      sql += ` AND fa.status = ?`;
      params.push(status);
    }

    if (funding_type && funding_type !== 'All') {
      sql += ` AND f.funding_type = ?`;
      params.push(funding_type);
    }

    if (date_from) {
      sql += ` AND fa.created_at >= ?`;
      params.push(date_from);
    }

    if (date_to) {
      sql += ` AND fa.created_at <= ?`;
      params.push(date_to);
    }

    sql += ` ORDER BY fa.id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export report data.' });
  }
});

export default router;
