import { exec } from './database.js';

export const initSchema = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('entrepreneur', 'officer', 'mentor')),
      full_name TEXT NOT NULL,
      phone TEXT,
      avatar TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS entrepreneurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      dob DATE,
      address TEXT,
      city TEXT,
      state TEXT,
      education TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entrepreneur_id INTEGER NOT NULL,
      business_name TEXT NOT NULL,
      business_type TEXT NOT NULL,
      sector TEXT NOT NULL,
      reg_number TEXT UNIQUE NOT NULL,
      start_date DATE,
      employees INTEGER DEFAULT 1,
      annual_turnover REAL DEFAULT 0,
      description TEXT,
      website TEXT,
      social_links TEXT,
      status TEXT DEFAULT 'Pending Verification' CHECK(status IN ('Pending Verification', 'Verified', 'Rejected', 'Active', 'Inactive')),
      officer_remarks TEXT,
      verified_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS schemes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scheme_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      description TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      benefits TEXT NOT NULL,
      min_funding REAL DEFAULT 0,
      max_funding REAL DEFAULT 0,
      start_date DATE,
      end_date DATE,
      required_docs TEXT,
      target_sector TEXT,
      target_category TEXT,
      guidelines_url TEXT,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Draft', 'Active', 'Closed', 'Archived')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS funding_opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      funding_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      provider TEXT NOT NULL,
      description TEXT NOT NULL,
      funding_type TEXT NOT NULL CHECK(funding_type IN ('Government Grant', 'Subsidy', 'Loan', 'Startup Funding', 'Business Development Assistance')),
      min_amount REAL NOT NULL,
      max_amount REAL NOT NULL,
      interest_rate REAL DEFAULT 0,
      eligibility TEXT NOT NULL,
      deadline DATE NOT NULL,
      required_docs TEXT,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Closed', 'Archived')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS funding_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_no TEXT UNIQUE NOT NULL,
      entrepreneur_id INTEGER NOT NULL,
      business_id INTEGER NOT NULL,
      funding_id INTEGER NOT NULL,
      requested_amount REAL NOT NULL,
      purpose TEXT NOT NULL,
      business_plan TEXT,
      expected_benefits TEXT,
      docs_json TEXT,
      status TEXT DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'Additional Information Required', 'Approved', 'Rejected', 'Withdrawn')),
      officer_remarks TEXT,
      approval_date DATETIME,
      reviewed_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs(id) ON DELETE CASCADE,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
      FOREIGN KEY (funding_id) REFERENCES funding_opportunities(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS training_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      trainer TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Business Management', 'Financial Literacy', 'Digital Marketing', 'E-Commerce', 'Leadership', 'Entrepreneurship', 'Accounting', 'Technology', 'Export Management')),
      description TEXT NOT NULL,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      location TEXT NOT NULL,
      mode TEXT DEFAULT 'Online' CHECK(mode IN ('Online', 'Offline')),
      max_participants INTEGER NOT NULL,
      current_participants INTEGER DEFAULT 0,
      deadline DATE NOT NULL,
      eligibility TEXT,
      status TEXT DEFAULT 'Upcoming' CHECK(status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS training_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_id INTEGER NOT NULL,
      entrepreneur_id INTEGER NOT NULL,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'Confirmed' CHECK(status IN ('Confirmed', 'Cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(training_id, entrepreneur_id),
      FOREIGN KEY (training_id) REFERENCES training_programs(id) ON DELETE CASCADE,
      FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mentors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      phone TEXT,
      profile_photo TEXT,
      professional_bg TEXT NOT NULL,
      industry TEXT NOT NULL,
      expertise TEXT NOT NULL,
      years_experience INTEGER DEFAULT 0,
      qualifications TEXT,
      bio TEXT,
      availability TEXT,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mentorship_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entrepreneur_id INTEGER NOT NULL,
      mentor_id INTEGER NOT NULL,
      business_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      preferred_date DATE NOT NULL,
      preferred_time TIME NOT NULL,
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs(id) ON DELETE CASCADE,
      FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mentorship_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER UNIQUE NOT NULL,
      mentor_id INTEGER NOT NULL,
      entrepreneur_id INTEGER NOT NULL,
      session_date DATE NOT NULL,
      session_time TIME NOT NULL,
      meeting_link TEXT,
      status TEXT DEFAULT 'Scheduled' CHECK(status IN ('Scheduled', 'Completed', 'Cancelled')),
      feedback TEXT,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES mentorship_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
      FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS networking_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      venue TEXT NOT NULL,
      city TEXT NOT NULL,
      event_type TEXT NOT NULL CHECK(event_type IN ('Networking Meetup', 'Business Conference', 'Women Entrepreneurs Forum', 'Startup Event', 'Industry Meetup', 'Government-Industry Interaction')),
      max_participants INTEGER NOT NULL,
      current_participants INTEGER DEFAULT 0,
      deadline DATE NOT NULL,
      organizer TEXT NOT NULL,
      status TEXT DEFAULT 'Upcoming' CHECK(status IN ('Upcoming', 'Completed', 'Cancelled')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS networking_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      entrepreneur_id INTEGER NOT NULL,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'Confirmed' CHECK(status IN ('Confirmed', 'Cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(event_id, entrepreneur_id),
      FOREIGN KEY (event_id) REFERENCES networking_events(id) ON DELETE CASCADE,
      FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Funding', 'Government Scheme', 'Training', 'Networking', 'Policy', 'General')),
      published_date DATE DEFAULT (DATE('now')),
      expiry_date DATE,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Archived')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT,
      file_path TEXT NOT NULL,
      file_size INTEGER DEFAULT 0,
      uploaded_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );
  `;

  await exec(sql);
  console.log('Database tables initialized successfully.');
};
