import express from 'express';
import { query, get, run } from '../db/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { createNotification, notifyRoleUsers } from '../utils/notify.js';

const router = express.Router();

// GET /api/funding (List funding opportunities)
router.get('/', async (req, res) => {
  try {
    const { search, funding_type, status = 'Active', minAmount, maxAmount } = req.query;

    let sql = `SELECT f.*, u.full_name as creator_name FROM funding_opportunities f LEFT JOIN users u ON f.created_by = u.id WHERE 1=1`;
    const params = [];

    if (status !== 'All') {
      sql += ` AND f.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (f.name LIKE ? OR f.funding_code LIKE ? OR f.provider LIKE ? OR f.description LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (funding_type && funding_type !== 'All') {
      sql += ` AND f.funding_type = ?`;
      params.push(funding_type);
    }

    if (minAmount) {
      sql += ` AND f.max_amount >= ?`;
      params.push(parseFloat(minAmount));
    }

    if (maxAmount) {
      sql += ` AND f.min_amount <= ?`;
      params.push(parseFloat(maxAmount));
    }

    sql += ` ORDER BY f.id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch funding opportunities. ' + err.message });
  }
});

// GET /api/funding/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await get('SELECT f.*, u.full_name as creator_name FROM funding_opportunities f LEFT JOIN users u ON f.created_by = u.id WHERE f.id = ?', [req.params.id]);
    if (!item) {
      return res.status(404).json({ error: 'Funding opportunity not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch funding details.' });
  }
});

// POST /api/funding (Create - Officer access)
router.post('/', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const {
      name,
      provider,
      description,
      funding_type,
      min_amount,
      max_amount,
      interest_rate,
      eligibility,
      deadline,
      required_docs,
      status = 'Active'
    } = req.body;

    if (!name || !provider || !funding_type || !deadline) {
      return res.status(400).json({ error: 'Name, provider, funding type, and application deadline are required.' });
    }

    const fundingCode = `WEP-FND-${Math.floor(100 + Math.random() * 900)}`;

    const resItem = await run(
      `INSERT INTO funding_opportunities (funding_code, name, provider, description, funding_type, min_amount, max_amount, interest_rate, eligibility, deadline, required_docs, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fundingCode,
        name,
        provider,
        description || '',
        funding_type,
        parseFloat(min_amount) || 0,
        parseFloat(max_amount) || 0,
        parseFloat(interest_rate) || 0,
        eligibility || 'All eligible businesses',
        deadline,
        required_docs || 'Udyam Certificate, Bank Statement, Pitch Deck',
        status,
        req.user.id
      ]
    );

    if (status === 'Active') {
      await notifyRoleUsers(
        'entrepreneur',
        'New Funding Opportunity Published 💰',
        `A new funding opportunity "${name}" (${funding_type}) up to ₹${parseFloat(max_amount).toLocaleString()} is now open for application.`,
        'success',
        `/entrepreneur/funding`
      );
    }

    res.status(201).json({ message: 'Funding opportunity created successfully!', funding_id: resItem.id, funding_code: fundingCode });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create funding opportunity. ' + err.message });
  }
});

// PUT /api/funding/:id (Officer access)
router.put('/:id', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const {
      name,
      provider,
      description,
      funding_type,
      min_amount,
      max_amount,
      interest_rate,
      eligibility,
      deadline,
      required_docs,
      status
    } = req.body;

    await run(
      `UPDATE funding_opportunities SET
        name = ?, provider = ?, description = ?, funding_type = ?, min_amount = ?,
        max_amount = ?, interest_rate = ?, eligibility = ?, deadline = ?, required_docs = ?, status = ?
       WHERE id = ?`,
      [
        name,
        provider,
        description,
        funding_type,
        parseFloat(min_amount) || 0,
        parseFloat(max_amount) || 0,
        parseFloat(interest_rate) || 0,
        eligibility,
        deadline,
        required_docs,
        status,
        req.params.id
      ]
    );

    res.json({ message: 'Funding opportunity updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update funding opportunity.' });
  }
});

// ==================== FUNDING APPLICATIONS ====================

// GET /api/funding-applications (Entrepreneur views own, Officer views all)
router.get('/applications/list', authenticateToken, async (req, res) => {
  try {
    const { status, search } = req.query;

    let sql = `
      SELECT fa.*, f.name as funding_name, f.funding_type, f.provider, f.max_amount as allowed_max_amount,
             b.business_name, b.sector, b.reg_number,
             u.full_name as entrepreneur_name, u.email as entrepreneur_email, u.phone as entrepreneur_phone
      FROM funding_applications fa
      JOIN funding_opportunities f ON fa.funding_id = f.id
      JOIN businesses b ON fa.business_id = b.id
      JOIN entrepreneurs e ON fa.entrepreneur_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'entrepreneur') {
      const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
      if (!ent) return res.json([]);
      sql += ` AND fa.entrepreneur_id = ?`;
      params.push(ent.id);
    }

    if (status && status !== 'All') {
      sql += ` AND fa.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (fa.application_no LIKE ? OR b.business_name LIKE ? OR f.name LIKE ? OR u.full_name LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY fa.id DESC`;

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch funding applications. ' + err.message });
  }
});

// POST /api/funding-applications (Submit Application - Entrepreneur only)
router.post('/applications', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const { funding_id, requested_amount, purpose, business_plan, expected_benefits, docs } = req.body;

    if (!funding_id || !requested_amount || !purpose) {
      return res.status(400).json({ error: 'Funding opportunity selection, requested amount, and business purpose are required.' });
    }

    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    if (!ent) {
      return res.status(400).json({ error: 'Entrepreneur profile not found. Please complete your registration.' });
    }

    const biz = await get('SELECT id, status, business_name FROM businesses WHERE entrepreneur_id = ?', [ent.id]);
    if (!biz) {
      return res.status(400).json({ error: 'Please register your business before applying for funding.' });
    }

    // Check funding opportunity details and deadline
    const funding = await get('SELECT * FROM funding_opportunities WHERE id = ?', [funding_id]);
    if (!funding) {
      return res.status(404).json({ error: 'Selected funding opportunity does not exist.' });
    }

    if (funding.status !== 'Active') {
      return res.status(400).json({ error: 'This funding opportunity is currently closed or archived.' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (funding.deadline < today) {
      return res.status(400).json({ error: `Application deadline (${funding.deadline}) has passed.` });
    }

    const reqAmt = parseFloat(requested_amount);
    if (reqAmt < funding.min_amount || reqAmt > funding.max_amount) {
      return res.status(400).json({
        error: `Requested amount (₹${reqAmt.toLocaleString()}) must be between ₹${funding.min_amount.toLocaleString()} and ₹${funding.max_amount.toLocaleString()}.`
      });
    }

    // Prevent duplicate application
    const existing = await get(
      `SELECT id FROM funding_applications WHERE entrepreneur_id = ? AND funding_id = ? AND status NOT IN ('Rejected', 'Withdrawn')`,
      [ent.id, funding_id]
    );
    if (existing) {
      return res.status(409).json({ error: 'You already have an active application for this funding opportunity.' });
    }

    const appNo = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const resApp = await run(
      `INSERT INTO funding_applications (application_no, entrepreneur_id, business_id, funding_id, requested_amount, purpose, business_plan, expected_benefits, docs_json, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')`,
      [
        appNo,
        ent.id,
        biz.id,
        funding_id,
        reqAmt,
        purpose,
        business_plan || '',
        expected_benefits || '',
        JSON.stringify(docs || ['business_plan.pdf', 'financials.pdf'])
      ]
    );

    // Notify entrepreneur
    await createNotification(
      req.user.id,
      'Funding Application Submitted 📝',
      `Your application ${appNo} for "${funding.name}" (₹${reqAmt.toLocaleString()}) has been submitted successfully.`,
      'info',
      '/entrepreneur/applications'
    );

    // Notify officers
    await notifyRoleUsers(
      'officer',
      'New Funding Application Submitted',
      `Application ${appNo} submitted by ${biz.business_name} for ${funding.name}.`,
      'info',
      '/officer/applications'
    );

    res.status(201).json({
      message: 'Funding application submitted successfully!',
      application_id: resApp.id,
      application_no: appNo
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit funding application. ' + err.message });
  }
});

// PUT /api/funding-applications/:id/status (Review / Approve / Reject - Officer access)
router.put('/applications/:id/status', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  try {
    const { status, officer_remarks } = req.body;
    const appId = req.params.id;

    if (!['Submitted', 'Under Review', 'Additional Information Required', 'Approved', 'Rejected', 'Withdrawn'].includes(status)) {
      return res.status(400).json({ error: 'Invalid application status.' });
    }

    const app = await get(
      `SELECT fa.*, f.name as funding_name, e.user_id, b.business_name
       FROM funding_applications fa
       JOIN funding_opportunities f ON fa.funding_id = f.id
       JOIN entrepreneurs e ON fa.entrepreneur_id = e.id
       JOIN businesses b ON fa.business_id = b.id
       WHERE fa.id = ?`,
      [appId]
    );

    if (!app) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    const approvalDateSql = status === 'Approved' ? ', approval_date = CURRENT_TIMESTAMP' : '';

    await run(
      `UPDATE funding_applications SET status = ?, officer_remarks = ?, reviewed_by = ? ${approvalDateSql} WHERE id = ?`,
      [status, officer_remarks || '', req.user.id, appId]
    );

    // Trigger notification to entrepreneur
    const notifType = status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning';
    await createNotification(
      app.user_id,
      `Funding Application Status: ${status}`,
      `Your application ${app.application_no} for "${app.funding_name}" has been updated to "${status}". Remarks: ${officer_remarks || 'None'}`,
      notifType,
      '/entrepreneur/applications'
    );

    res.json({ message: `Application ${app.application_no} updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application status.' });
  }
});

// PUT /api/funding-applications/:id/withdraw (Entrepreneur withdraws application)
router.put('/applications/:id/withdraw', authenticateToken, authorizeRoles('entrepreneur'), async (req, res) => {
  try {
    const ent = await get('SELECT id FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
    const app = await get('SELECT * FROM funding_applications WHERE id = ? AND entrepreneur_id = ?', [req.params.id, ent.id]);

    if (!app) {
      return res.status(404).json({ error: 'Application not found or unauthorized.' });
    }

    if (app.status === 'Approved') {
      return res.status(400).json({ error: 'Approved applications cannot be withdrawn.' });
    }

    await run(`UPDATE funding_applications SET status = 'Withdrawn' WHERE id = ?`, [req.params.id]);
    res.json({ message: `Application ${app.application_no} withdrawn.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to withdraw application.' });
  }
});

export default router;
