import express from 'express';
import bcrypt from 'bcryptjs';
import { run, get } from '../db/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      role = 'entrepreneur',
      full_name,
      phone,
      // Entrepreneur specific details
      dob,
      address,
      city,
      state,
      education,
      // Business details (optional on initial registration)
      business_name,
      business_type,
      sector,
      reg_number,
      start_date,
      employees,
      annual_turnover,
      description,
      website,
      social_links,
      // Mentor specific details
      professional_bg,
      industry,
      expertise,
      years_experience,
      qualifications,
      bio,
      availability
    } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    if (!['entrepreneur', 'officer', 'mentor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid user role specified.' });
    }

    // Check if email already registered
    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const userRes = await run(
      `INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?)`,
      [email.toLowerCase().trim(), passwordHash, role, full_name, phone || '']
    );
    const userId = userRes.id;

    // Insert Role specific records
    if (role === 'entrepreneur') {
      const entRes = await run(
        `INSERT INTO entrepreneurs (user_id, dob, address, city, state, education) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, dob || '', address || '', city || '', state || '', education || '']
      );

      // If business details provided
      if (business_name) {
        const regNum = reg_number || `REG-${(state || 'GEN').substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        await run(
          `INSERT INTO businesses (entrepreneur_id, business_name, business_type, sector, reg_number, start_date, employees, annual_turnover, description, website, social_links, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            entRes.id,
            business_name,
            business_type || 'Sole Proprietorship',
            sector || 'General Business',
            regNum,
            start_date || new Date().toISOString().split('T')[0],
            parseInt(employees) || 1,
            parseFloat(annual_turnover) || 0,
            description || '',
            website || '',
            social_links || '',
            'Pending Verification'
          ]
        );
      }
    } else if (role === 'mentor') {
      await run(
        `INSERT INTO mentors (user_id, phone, professional_bg, industry, expertise, years_experience, qualifications, bio, availability, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          phone || '',
          professional_bg || 'Professional Advisor',
          industry || 'General Business',
          expertise || 'Business Strategy',
          parseInt(years_experience) || 5,
          qualifications || 'Degree',
          bio || '',
          availability || 'Mon - Fri',
          'Active'
        ]
      );
    }

    const newUser = await get('SELECT id, email, role, full_name, phone FROM users WHERE id = ?', [userId]);
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Registration successful!',
      user: newUser,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to complete registration. ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const token = generateToken(user);
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful!',
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let profileData = {};

    if (req.user.role === 'entrepreneur') {
      const ent = await get('SELECT * FROM entrepreneurs WHERE user_id = ?', [req.user.id]);
      let biz = null;
      if (ent) {
        biz = await get('SELECT * FROM businesses WHERE entrepreneur_id = ?', [ent.id]);
      }
      profileData = { entrepreneur: ent, business: biz };
    } else if (req.user.role === 'mentor') {
      const m = await get('SELECT * FROM mentors WHERE user_id = ?', [req.user.id]);
      profileData = { mentor: m };
    }

    res.json({
      user: req.user,
      ...profileData
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;
