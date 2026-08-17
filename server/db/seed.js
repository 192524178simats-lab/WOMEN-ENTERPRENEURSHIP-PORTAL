import bcrypt from 'bcryptjs';
import { run, get, exec } from './database.js';
import { initSchema } from './initSchema.js';

export const seedDatabase = async () => {
  console.log('Initializing schema for database seeding...');
  await initSchema();

  // Clear existing tables
  await exec(`
    DELETE FROM notifications;
    DELETE FROM documents;
    DELETE FROM networking_registrations;
    DELETE FROM networking_events;
    DELETE FROM mentorship_sessions;
    DELETE FROM mentorship_requests;
    DELETE FROM mentors;
    DELETE FROM training_registrations;
    DELETE FROM training_programs;
    DELETE FROM funding_applications;
    DELETE FROM funding_opportunities;
    DELETE FROM schemes;
    DELETE FROM businesses;
    DELETE FROM entrepreneurs;
    DELETE FROM announcements;
    DELETE FROM users;
  `);

  console.log('Cleared old data. Generating fresh seed data...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Users
  const usersData = [
    // Primary Demo Accounts
    { email: 'entrepreneur@womenportal.test', role: 'entrepreneur', full_name: 'Priya Sharma', phone: '+91 98765 43210' },
    { email: 'ananya@womenportal.test', role: 'entrepreneur', full_name: 'Ananya Verma', phone: '+91 98123 45678' },
    { email: 'meera@womenportal.test', role: 'entrepreneur', full_name: 'Meera Reddy', phone: '+91 97654 32109' },

    { email: 'officer@womenportal.test', role: 'officer', full_name: 'Rajesh Varma', phone: '+91 91234 56789' },
    { email: 'sunita.officer@womenportal.test', role: 'officer', full_name: 'Sunita Deshmukh', phone: '+91 92345 67890' },

    { email: 'mentor@womenportal.test', role: 'mentor', full_name: 'Dr. Sunita Rao', phone: '+91 93456 78901' },
    { email: 'kavita.mentor@womenportal.test', role: 'mentor', full_name: 'Kavita Krishnan', phone: '+91 94567 89012' },
    { email: 'radhika.mentor@womenportal.test', role: 'mentor', full_name: 'Radhika Nair', phone: '+91 95678 90123' },
  ];

  const userIds = {};
  for (const u of usersData) {
    const res = await run(
      `INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?)`,
      [u.email, passwordHash, u.role, u.full_name, u.phone]
    );
    userIds[u.email] = res.id;
  }

  // 2. Entrepreneurs
  const entPriya = await run(
    `INSERT INTO entrepreneurs (user_id, dob, address, city, state, education) VALUES (?, ?, ?, ?, ?, ?)`,
    [userIds['entrepreneur@womenportal.test'], '1990-05-15', '42 Artisan Guild Way', 'Jaipur', 'Rajasthan', 'B.Tech in Textile Technology']
  );
  const entAnanya = await run(
    `INSERT INTO entrepreneurs (user_id, dob, address, city, state, education) VALUES (?, ?, ?, ?, ?, ?)`,
    [userIds['ananya@womenportal.test'], '1988-11-20', '108 BioTech Park Road', 'Bengaluru', 'Karnataka', 'M.Sc in Biotechnology']
  );
  const entMeera = await run(
    `INSERT INTO entrepreneurs (user_id, dob, address, city, state, education) VALUES (?, ?, ?, ?, ?, ?)`,
    [userIds['meera@womenportal.test'], '1995-02-10', '75 EV Hub Drive', 'Hyderabad', 'Telangana', 'B.E in Mechanical Engineering']
  );

  // 3. Businesses
  const bizPriya = await run(
    `INSERT INTO businesses (entrepreneur_id, business_name, business_type, sector, reg_number, start_date, employees, annual_turnover, description, website, social_links, status, officer_remarks, verified_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      entPriya.id,
      'EcoCraft India Handicrafts',
      'Private Limited',
      'Textiles & Handicrafts',
      'REG-RJ-2022-88741',
      '2022-03-15',
      24,
      4500000,
      'Sustainable eco-friendly handcrafted textiles and heritage artisan products empowering 100+ rural women weavers.',
      'https://ecocraftindia.example.com',
      'https://instagram.com/ecocraftindia',
      'Verified',
      'Verified all tax and registration documents. Outstanding rural employment initiative.'
    ]
  );

  const bizAnanya = await run(
    `INSERT INTO businesses (entrepreneur_id, business_name, business_type, sector, reg_number, start_date, employees, annual_turnover, description, website, social_links, status, officer_remarks, verified_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      entAnanya.id,
      'BioNutra Organics Pvt Ltd',
      'Private Limited',
      'Biotechnology & Healthcare',
      'REG-KA-2021-99432',
      '2021-08-10',
      18,
      8200000,
      'Nutraceuticals derived from indigenous medicinal herbs processed using proprietary eco-friendly extraction techniques.',
      'https://bionutraorganics.example.com',
      'https://linkedin.com/company/bionutra-organics',
      'Verified',
      'Approved compliance certificates and FSSAI standards verification.'
    ]
  );

  const bizMeera = await run(
    `INSERT INTO businesses (entrepreneur_id, business_name, business_type, sector, reg_number, start_date, employees, annual_turnover, description, website, social_links, status, officer_remarks)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entMeera.id,
      'UrbanClean Mobility Systems',
      'Partnership',
      'Technology & CleanTech',
      'REG-TS-2024-11204',
      '2024-01-15',
      8,
      1500000,
      'Smart fleet management software and last-mile electric cargo three-wheeler solutions for urban logistics.',
      'https://urbancleanmobility.example.com',
      'https://twitter.com/urbancleanmobility',
      'Pending Verification',
      'Documents submitted. Pending physical site check.'
    ]
  );

  // 4. Mentors
  await run(
    `INSERT INTO mentors (user_id, phone, profile_photo, professional_bg, industry, expertise, years_experience, qualifications, bio, availability, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userIds['mentor@womenportal.test'],
      '+91 93456 78901',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      'Senior Partner at Venture Horizon Capital, Ex-Director SIDBI Venture Funds',
      'Finance & Venture Capital',
      'Financial Management, Debt & Equity Fundraising, Business Scale-up Strategy',
      18,
      'Ph.D. in Finance, IIM Ahmedabad Alumna',
      'Mentored over 80+ female-founded startups in securing government grants, institutional Series A funding, and financial governance.',
      'Mon & Thu (4:00 PM - 7:00 PM)',
      'Active'
    ]
  );

  await run(
    `INSERT INTO mentors (user_id, phone, profile_photo, professional_bg, industry, expertise, years_experience, qualifications, bio, availability, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userIds['kavita.mentor@womenportal.test'],
      '+91 94567 89012',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      'Founder & CEO at GrowthVeda Digital, Ex-VP Marketing Flipkart',
      'Digital Marketing & E-Commerce',
      'Brand Building, Performance Marketing, Global E-Commerce Export Strategy',
      12,
      'MBA in Marketing (ISB Hyderabad)',
      'Specialist in helping traditional manufacturing and handicraft brands build direct-to-consumer online channels and international storefronts.',
      'Wed & Sat (2:00 PM - 5:00 PM)',
      'Active'
    ]
  );

  await run(
    `INSERT INTO mentors (user_id, phone, profile_photo, professional_bg, industry, expertise, years_experience, qualifications, bio, availability, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userIds['radhika.mentor@womenportal.test'],
      '+91 95678 90123',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
      'Chief Supply Chain Officer at Apex Logistics, Director Export Promotion Council',
      'Export Management & Manufacturing',
      'Export Documentation, Customs Compliance, Global Supply Chain Logistics',
      16,
      'M.S. in Supply Chain Management (MIT), Certified Customs Specialist',
      'Passionate about guiding women entrepreneurs through regulatory compliance, IEC registration, and international buyer negotiations.',
      'Tue & Fri (3:00 PM - 6:00 PM)',
      'Active'
    ]
  );

  // 5. Government Schemes
  const schemesData = [
    {
      code: 'WEP-SCH-001',
      name: 'Stand-Up India Women Enterprise Incentive Scheme',
      department: 'Ministry of Micro, Small and Medium Enterprises',
      desc: 'Central government flagship initiative providing capital subsidy, soft loan interest subvention, and collateral-free credit guarantees for first-generation women entrepreneurs.',
      eligibility: 'Women entrepreneurs owning at least 51% shareholding in MSMEs or registered private limited firms in manufacturing or services.',
      benefits: 'Up to ₹25 Lakhs capital grant + 3% interest subvention for 5 years.',
      minF: 500000,
      maxF: 2500000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      docs: 'GST Certificate, Business Plan, 2 Years ITR, Bank Statements, ID Proof',
      sector: 'All MSME Sectors',
      category: 'First-time & Existing Women Entrepreneurs',
      guidelines: 'https://msme.gov.in/schemes/women-standup',
      status: 'Active'
    },
    {
      code: 'WEP-SCH-002',
      name: 'Mahila Samriddhi Yojana for Cottage & Handicrafts',
      department: 'Ministry of Textiles & Handlooms',
      desc: 'Targeted support scheme offering raw material subsidies, machinery modernizations grants, and direct buyer-seller meet representation for rural women artisan collectives.',
      eligibility: 'Self-Help Groups (SHGs) and women-owned handicraft businesses operating in rural or semi-urban districts.',
      benefits: '80% grant subsidy on machinery purchases up to ₹10 Lakhs and free stalls at national expos.',
      minF: 100000,
      maxF: 1000000,
      startDate: '2026-02-15',
      endDate: '2026-11-30',
      docs: 'Artisan Card / MSME Udyam Registration, Bank Passbook, SHG Member List',
      sector: 'Textiles & Handicrafts',
      category: 'Rural & Artisan Entrepreneurs',
      guidelines: 'https://textiles.gov.in/schemes/mahila-samriddhi',
      status: 'Active'
    },
    {
      code: 'WEP-SCH-003',
      name: 'Women Agri-Tech Innovation Fund',
      department: 'Ministry of Agriculture & Farmers Welfare',
      desc: 'Special innovation seed capital grant aimed at scaling sustainable agricultural solutions, organic processing, smart irrigation, and post-harvest storage led by female founders.',
      eligibility: 'DPIIT registered startups led by women founders in AgriTech, Food Processing, or Organic Farming.',
      benefits: 'Equity-free seed grant up to ₹15 Lakhs plus incubation support at ICAR centers.',
      minF: 300000,
      maxF: 1500000,
      startDate: '2026-03-01',
      endDate: '2026-09-30',
      docs: 'Startup India Recognition Certificate, Technical Pitch Deck, FSSAI / Organic Certifications',
      sector: 'Agriculture & Food Processing',
      category: 'AgriTech Founders',
      guidelines: 'https://agricoop.gov.in/women-agritech',
      status: 'Active'
    },
    {
      code: 'WEP-SCH-004',
      name: 'Stree Shakti Technology & CleanTech Accelerator',
      department: 'Department of Science & Technology (DST)',
      desc: 'Promotes tech-enabled female entrepreneurs in renewable energy, waste management, AI/ML, and SaaS with research grants and lab access.',
      eligibility: 'Women-led tech companies with working MVP and proven social/environmental impact.',
      benefits: '₹20 Lakhs grant + 6-month specialized mentorship by DST research fellows.',
      minF: 500000,
      maxF: 2000000,
      startDate: '2026-04-01',
      endDate: '2026-10-31',
      docs: 'Patent Filing / IP Details, Financial Projections, Founder Bios',
      sector: 'Technology & CleanTech',
      category: 'Tech Founders',
      guidelines: 'https://dst.gov.in/stree-shakti-tech',
      status: 'Active'
    },
    {
      code: 'WEP-SCH-005',
      name: 'Digital Sisterhood Global Export Incentive',
      department: 'Ministry of Commerce & Industry',
      desc: 'Financial support for women entrepreneurs participating in international trade fairs, digital export onboarding, and global trademark registrations.',
      eligibility: 'Valid IEC code holders with minimum 1-year operational history and female majority ownership.',
      benefits: '100% reimbursement of airfare and stall charges up to ₹5 Lakhs per international expo.',
      minF: 50000,
      maxF: 500000,
      startDate: '2026-01-15',
      endDate: '2026-12-15',
      docs: 'Import Export Code (IEC), Passport copies, Fair Participation Invoice',
      sector: 'Export & Trade',
      category: 'Exporters',
      guidelines: 'https://commerce.gov.in/women-export-grant',
      status: 'Active'
    }
  ];

  const schemeIds = [];
  for (const s of schemesData) {
    const res = await run(
      `INSERT INTO schemes (scheme_code, name, department, description, eligibility, benefits, min_funding, max_funding, start_date, end_date, required_docs, target_sector, target_category, guidelines_url, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.code, s.name, s.department, s.desc, s.eligibility, s.benefits, s.minF, s.maxF, s.startDate, s.endDate, s.docs, s.sector, s.category, s.guidelines, s.status, userIds['officer@womenportal.test']]
    );
    schemeIds.push(res.id);
  }

  // 6. Funding Opportunities
  const fundingData = [
    {
      code: 'WEP-FND-001',
      name: 'Women Green Business Expansion Grant',
      provider: 'National Clean Energy & Climate Fund',
      desc: 'Capital expansion grant for women-led sustainable businesses expanding production or hiring clean tech talent.',
      type: 'Government Grant',
      minA: 500000,
      maxA: 2000000,
      rate: 0,
      eligibility: 'Verified women-owned business in green manufacturing, recycling, or eco-textiles with at least 15 active employees.',
      deadline: '2026-10-15',
      docs: 'Audited balance sheets, Environmental impact statement, Payroll records',
      status: 'Active'
    },
    {
      code: 'WEP-FND-002',
      name: 'Tech-Innovation Concessional Micro-Loan',
      provider: 'Small Industries Development Bank of India (SIDBI)',
      desc: 'Low-interest collateral-free loan designed to support software purchase, cloud infrastructure, and hardware procurement.',
      type: 'Loan',
      minA: 200000,
      maxA: 1000000,
      rate: 4.5,
      eligibility: 'Early-stage tech startups owned by female entrepreneurs operating for over 6 months.',
      deadline: '2026-11-30',
      docs: 'KYC, Business Bank Statements (6 months), Software quotation',
      status: 'Active'
    },
    {
      code: 'WEP-FND-003',
      name: 'Handloom & Craft Modernization Subsidy',
      provider: 'Handicraft Development Board',
      desc: 'Direct subsidy covering 75% of expenses incurred on purchasing solar looms, natural dyeing equipment, and automated packaging.',
      type: 'Subsidy',
      minA: 100000,
      maxA: 750000,
      rate: 0,
      eligibility: 'Artisans and small businesses registered under Textile Ministry MSME portal.',
      deadline: '2026-09-30',
      docs: 'Udyam Registration, Equipment Proforma Invoice, Bank details',
      status: 'Active'
    },
    {
      code: 'WEP-FND-004',
      name: 'Early-Stage Women Startup Seed Capital',
      provider: 'State Innovation & Startup Mission',
      desc: 'Equity-free seed capital matching grant for tech and healthcare startups founded or co-founded by women.',
      type: 'Startup Funding',
      minA: 300000,
      maxA: 1500000,
      rate: 0,
      eligibility: 'Recognized DPIIT startups with female founder owning >51% equity.',
      deadline: '2026-12-01',
      docs: 'DPIIT Certificate, Pitch Deck, Cap Table, Incorporation Certificate',
      status: 'Active'
    },
    {
      code: 'WEP-FND-005',
      name: 'Rural Entrepreneurship Revival & Development Grant',
      provider: 'NABARD Rural Enterprise Fund',
      desc: 'Special revival grant for rural women-led enterprises recovering from market disruptions or expanding into new district clusters.',
      type: 'Business Development Assistance',
      minA: 150000,
      maxA: 800000,
      rate: 0,
      eligibility: 'Rural MSMEs, SHG Federations, or Producer Companies with female leadership.',
      deadline: '2026-08-31',
      docs: 'Gram Panchayat Recommendation, Business Operational Report',
      status: 'Active'
    }
  ];

  const fundingIds = [];
  for (const f of fundingData) {
    const res = await run(
      `INSERT INTO funding_opportunities (funding_code, name, provider, description, funding_type, min_amount, max_amount, interest_rate, eligibility, deadline, required_docs, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [f.code, f.name, f.provider, f.desc, f.type, f.minA, f.maxA, f.rate, f.eligibility, f.deadline, f.docs, f.status, userIds['officer@womenportal.test']]
    );
    fundingIds.push(res.id);
  }

  // 7. Funding Applications
  await run(
    `INSERT INTO funding_applications (application_no, entrepreneur_id, business_id, funding_id, requested_amount, purpose, business_plan, expected_benefits, docs_json, status, officer_remarks, approval_date, reviewed_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
    [
      'APP-2026-8801',
      entPriya.id,
      bizPriya.id,
      fundingIds[0], // Green Business Grant
      1500000,
      'Procurement of 10 solar-powered weaving machines and expansion of Jaipuri organic dyeing workshop.',
      'We plan to scale our active weaver base from 100 to 250 rural women, producing high-margin eco-friendly garments for export to Europe.',
      'Will double monthly revenue and create 150 direct sustainable livelihoods for rural women weavers.',
      JSON.stringify(['audited_financials_2025.pdf', 'environmental_certificate.pdf', 'machinery_quotation.pdf']),
      'Approved',
      'Outstanding application. Fully verified environmental compliance and strong community impact.',
      userIds['officer@womenportal.test']
    ]
  );

  await run(
    `INSERT INTO funding_applications (application_no, entrepreneur_id, business_id, funding_id, requested_amount, purpose, business_plan, expected_benefits, docs_json, status, officer_remarks, reviewed_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'APP-2026-8802',
      entAnanya.id,
      bizAnanya.id,
      fundingIds[3], // Startup Seed Capital
      1200000,
      'Clinical trial validation for organic herbal nutraceutical extractions and automated packaging line.',
      'Commercializing proprietary cold-pressed extraction technology to launch 4 new health supplements nationwide.',
      'Expected to increase company valuation and establish export channels in Southeast Asia.',
      JSON.stringify(['fssai_license.pdf', 'pitch_deck.pdf', 'patent_provisional_copy.pdf']),
      'Under Review',
      'Technical committee is evaluating the patent documentation and laboratory test certificates.',
      userIds['officer@womenportal.test']
    ]
  );

  await run(
    `INSERT INTO funding_applications (application_no, entrepreneur_id, business_id, funding_id, requested_amount, purpose, business_plan, expected_benefits, docs_json, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'APP-2026-8803',
      entMeera.id,
      bizMeera.id,
      fundingIds[1], // Micro loan
      500000,
      'Deploying IoT telemetry modules and purchasing 3 electric cargo three-wheelers for Hyderabad pilot.',
      'Pilot project providing zero-emission last-mile logistics for female-owned e-commerce micro-vendors.',
      'Will reduce last-mile delivery costs by 35% and cut urban carbon emissions.',
      JSON.stringify(['pilot_proposal.pdf', 'ev_quotation.pdf']),
      'Submitted'
    ]
  );

  // 8. Training Programs
  const trainingData = [
    {
      code: 'TRN-2026-101',
      name: 'Financial Literacy & Cash-Flow Management for Scale-up',
      trainer: 'CA Meenakshi Sundaram & Dr. Sunita Rao',
      category: 'Financial Literacy',
      desc: 'Master working capital management, tax planning, GST compliance, balance sheet analysis, and preparing pitch books for bank loans and venture capital.',
      date: '2026-09-15',
      sTime: '10:00',
      eTime: '13:00',
      loc: 'Online (Zoom Interactive Webinar)',
      mode: 'Online',
      maxP: 100,
      currP: 42,
      deadline: '2026-09-12',
      eligibility: 'Registered women entrepreneurs and MSME owners.'
    },
    {
      code: 'TRN-2026-102',
      name: 'Digital Marketing & D2C E-Commerce Growth Masterclass',
      trainer: 'Kavita Krishnan & GrowthVeda Team',
      category: 'Digital Marketing',
      desc: 'Practical hands-on training on Meta Ads, Google Shopping campaigns, Search Engine Optimization (SEO), Shopify storefront setup, and conversion rate optimization.',
      date: '2026-09-22',
      sTime: '14:00',
      eTime: '17:30',
      loc: 'MSME Development Institute Auditorium, Bengaluru',
      mode: 'Offline',
      maxP: 50,
      currP: 35,
      deadline: '2026-09-18',
      eligibility: 'Entrepreneurs looking to build online direct-to-consumer sales.'
    },
    {
      code: 'TRN-2026-103',
      name: 'Export Compliance, Customs & Global Trade Logistics',
      trainer: 'Radhika Nair & FIEO Experts',
      category: 'Export Management',
      desc: 'Step-by-step guide to obtaining IEC, understanding Free Trade Agreements (FTAs), shipping documentation, letters of credit (LC), and risk mitigation.',
      date: '2026-10-05',
      sTime: '11:00',
      eTime: '16:00',
      loc: 'World Trade Center Conference Room, Mumbai / Hybrid',
      mode: 'Offline',
      maxP: 60,
      currP: 28,
      deadline: '2026-10-01',
      eligibility: 'Manufacturers and handloom owners planning international export.'
    },
    {
      code: 'TRN-2026-104',
      name: 'Women Leadership & Strategic Human Resource Management',
      trainer: 'Prof. Reena Banerjee (IIM Ahmedabad)',
      category: 'Leadership',
      desc: 'Building high-performance teams, delegating effectively, managing workplace diversity, executive communication, and negotiation tactics for women founders.',
      date: '2026-10-18',
      sTime: '09:30',
      eTime: '12:30',
      loc: 'Online (Microsoft Teams)',
      mode: 'Online',
      maxP: 150,
      currP: 89,
      deadline: '2026-10-15',
      eligibility: 'Founders managing 5+ employees or growing leadership teams.'
    },
    {
      code: 'TRN-2026-105',
      name: 'AI Tools & Automation for Micro & Small Businesses',
      trainer: 'Tech4All Foundation Specialists',
      category: 'Technology',
      desc: 'Leverage generative AI, automated customer support bots, AI-assisted content creation, and no-code tools to boost business productivity tenfold.',
      date: '2026-11-02',
      sTime: '15:00',
      eTime: '18:00',
      loc: 'Online (Google Meet)',
      mode: 'Online',
      maxP: 200,
      currP: 110,
      deadline: '2026-10-30',
      eligibility: 'Open to all registered female business owners.'
    }
  ];

  const trainingIds = [];
  for (const t of trainingData) {
    const res = await run(
      `INSERT INTO training_programs (program_code, name, trainer, category, description, date, start_time, end_time, location, mode, max_participants, current_participants, deadline, eligibility, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.code, t.name, t.trainer, t.category, t.desc, t.date, t.sTime, t.eTime, t.loc, t.mode, t.maxP, t.currP, t.deadline, t.eligibility, 'Upcoming', userIds['officer@womenportal.test']]
    );
    trainingIds.push(res.id);
  }

  // Training Registrations
  await run(`INSERT INTO training_registrations (training_id, entrepreneur_id) VALUES (?, ?)`, [trainingIds[0], entPriya.id]);
  await run(`INSERT INTO training_registrations (training_id, entrepreneur_id) VALUES (?, ?)`, [trainingIds[1], entPriya.id]);
  await run(`INSERT INTO training_registrations (training_id, entrepreneur_id) VALUES (?, ?)`, [trainingIds[0], entAnanya.id]);

  // 9. Networking Events
  const eventsData = [
    {
      code: 'EVT-2026-01',
      name: 'National Women Entrepreneurs Innovation Summit 2026',
      desc: 'Annual flagship convention bringing together over 500 female founders, government policy makers, venture capitalists, and industry leaders.',
      date: '2026-10-10',
      time: '09:00 AM',
      venue: 'Bharat Mandapam Convention Centre',
      city: 'New Delhi',
      type: 'Women Entrepreneurs Forum',
      maxP: 500,
      currP: 215,
      deadline: '2026-10-05',
      organizer: 'Ministry of MSME & NITI Aayog Women Entrepreneurship Platform'
    },
    {
      code: 'EVT-2026-02',
      name: 'Women Tech Founders & Angel Investor Pitch Day',
      desc: 'Exclusive high-impact pitching session for tech, healthcare, and CleanTech women founders to present before top angel networks.',
      date: '2026-09-28',
      time: '02:00 PM',
      venue: 'T-Hub 2.0 Innovation Campus',
      city: 'Hyderabad',
      type: 'Startup Event',
      maxP: 80,
      currP: 64,
      deadline: '2026-09-20',
      organizer: 'State Innovation Council & TiE Women'
    },
    {
      code: 'EVT-2026-03',
      name: 'Handloom & Textile Exporters Buyer-Seller Meet',
      desc: 'B2B networking event connecting women artisan collectives directly with international apparel buyers and export houses.',
      date: '2026-11-12',
      time: '10:00 AM',
      venue: 'Jaipur Exhibition & Convention Centre (JECC)',
      city: 'Jaipur',
      type: 'Business Conference',
      maxP: 150,
      currP: 98,
      deadline: '2026-11-05',
      organizer: 'Handicrafts EPC & Department of Industries'
    },
    {
      code: 'EVT-2026-04',
      name: 'BioTech & HealthTech Women Innovators Meetup',
      desc: 'Interactive roundtable discussion on regulatory approvals, patent strategies, and clinical trials for healthcare entrepreneurs.',
      date: '2026-10-25',
      time: '03:00 PM',
      venue: 'Bangalore BioInnovation Centre (BBC)',
      city: 'Bengaluru',
      type: 'Industry Meetup',
      maxP: 60,
      currP: 45,
      deadline: '2026-10-20',
      organizer: 'KITS & ABLE Women Chapter'
    },
    {
      code: 'EVT-2026-05',
      name: 'Government-Industry Dialogue on SDG 5 & Women Procurement',
      desc: 'Policy forum discussing government public procurement reservation norms for women-owned micro and small enterprises.',
      date: '2026-12-05',
      time: '11:00 AM',
      venue: 'Vigyan Bhawan',
      city: 'New Delhi',
      type: 'Government-Industry Interaction',
      maxP: 200,
      currP: 140,
      deadline: '2026-11-30',
      organizer: 'Ministry of Commerce & FICCI Ladies Organisation'
    }
  ];

  const eventIds = [];
  for (const e of eventsData) {
    const res = await run(
      `INSERT INTO networking_events (event_code, name, description, date, time, venue, city, event_type, max_participants, current_participants, deadline, organizer, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.code, e.name, e.desc, e.date, e.time, e.venue, e.city, e.type, e.maxP, e.currP, e.deadline, e.organizer, 'Upcoming', userIds['officer@womenportal.test']]
    );
    eventIds.push(res.id);
  }

  // Event Registrations
  await run(`INSERT INTO networking_registrations (event_id, entrepreneur_id) VALUES (?, ?)`, [eventIds[0], entPriya.id]);
  await run(`INSERT INTO networking_registrations (event_id, entrepreneur_id) VALUES (?, ?)`, [eventIds[2], entPriya.id]);
  await run(`INSERT INTO networking_registrations (event_id, entrepreneur_id) VALUES (?, ?)`, [eventIds[3], entAnanya.id]);

  // 10. Mentorship Requests & Sessions
  const m1 = await get(`SELECT id FROM mentors WHERE user_id = ?`, [userIds['mentor@womenportal.test']]);
  const m2 = await get(`SELECT id FROM mentors WHERE user_id = ?`, [userIds['kavita.mentor@womenportal.test']]);

  const req1 = await run(
    `INSERT INTO mentorship_requests (entrepreneur_id, mentor_id, business_id, reason, preferred_date, preferred_time, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      entPriya.id,
      m1.id,
      bizPriya.id,
      'Seeking expert guidance on structuring capital grant funds for international export compliance and bank credit facilities.',
      '2026-09-08',
      '16:30',
      'Accepted'
    ]
  );

  const req2 = await run(
    `INSERT INTO mentorship_requests (entrepreneur_id, mentor_id, business_id, reason, preferred_date, preferred_time, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      entAnanya.id,
      m2.id,
      bizAnanya.id,
      'Need mentorship on building D2C organic health supplement brand online and setting up performance marketing channels.',
      '2026-09-10',
      '14:00',
      'Pending'
    ]
  );

  // Scheduled Session for Accepted Request
  await run(
    `INSERT INTO mentorship_sessions (request_id, mentor_id, entrepreneur_id, session_date, session_time, meeting_link, status, feedback)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req1.id,
      m1.id,
      entPriya.id,
      '2026-09-08',
      '16:30',
      'https://meet.jit.si/wep-mentorship-session-7701',
      'Scheduled',
      'Initial prep completed. Entrepreneur asked to bring audited financials and export plan.'
    ]
  );

  // 11. Announcements
  const announcementsData = [
    {
      title: 'New Grant Opportunity: Women Green Business Expansion Grant Open for FY 2026-27',
      desc: 'Applications are now officially open for female business owners working in clean energy, sustainable textiles, and eco-friendly manufacturing.',
      category: 'Funding',
      expiry: '2026-10-15'
    },
    {
      title: 'Special Registration Drive for Women Micro-Enterprises under Udyam Portal',
      desc: 'Government Officers are conducting free weekend assistance camps across all major district industry centers to assist women entrepreneurs with instant verification.',
      category: 'Government Scheme',
      expiry: '2026-09-30'
    },
    {
      title: 'Free International Trade & Export Training Workshops Announced',
      desc: 'Ministry of Commerce launches free hybrid workshop series covering IEC registration, FTAs, and international buyer negotiations for female founders.',
      category: 'Training',
      expiry: '2026-10-01'
    },
    {
      title: 'National Women Entrepreneurs Innovation Summit 2026 Registrations Live',
      desc: 'Join 500+ female founders, policymakers, and venture capitalists at Bharat Mandapam, New Delhi. Early bird pass available now.',
      category: 'Networking',
      expiry: '2026-10-05'
    },
    {
      title: 'Updated Policy Guidelines on Interest Subvention for Women MSME Loans',
      desc: 'Interest subvention rate for women-owned MSMEs increased from 2% to 3% across all public sector banks effective immediately.',
      category: 'Policy',
      expiry: '2026-12-31'
    }
  ];

  for (const a of announcementsData) {
    await run(
      `INSERT INTO announcements (title, description, category, expiry_date, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [a.title, a.desc, a.category, a.expiry, 'Active', userIds['officer@womenportal.test']]
    );
  }

  // 12. Notifications
  const notificationsData = [
    {
      user: userIds['entrepreneur@womenportal.test'],
      title: 'Business Profile Verified!',
      message: 'Your business "EcoCraft India Handicrafts" has been verified by Officer Rajesh Varma.',
      type: 'success',
      link: '/entrepreneur/business'
    },
    {
      user: userIds['entrepreneur@womenportal.test'],
      title: 'Funding Application Approved 🎉',
      message: 'Your application APP-2026-8801 for "Women Green Business Expansion Grant" has been Approved for ₹15,000,000!',
      type: 'success',
      link: '/entrepreneur/applications'
    },
    {
      user: userIds['entrepreneur@womenportal.test'],
      title: 'Mentorship Request Accepted',
      message: 'Dr. Sunita Rao has accepted your mentorship request. Session scheduled for Sept 8, 2026.',
      type: 'info',
      link: '/entrepreneur/mentorship'
    },
    {
      user: userIds['ananya@womenportal.test'],
      title: 'Funding Application Under Review',
      message: 'Your funding application APP-2026-8802 status has updated to "Under Review".',
      type: 'warning',
      link: '/entrepreneur/applications'
    },
    {
      user: userIds['mentor@womenportal.test'],
      title: 'New Mentorship Session Scheduled',
      message: 'You have an upcoming session with Priya Sharma on Sept 8 at 4:30 PM.',
      type: 'info',
      link: '/mentor/sessions'
    }
  ];

  for (const n of notificationsData) {
    await run(
      `INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)`,
      [n.user, n.title, n.message, n.type, n.link]
    );
  }

  console.log('Seed database completed successfully!');
  console.log('Demo accounts created:');
  console.log('1. Entrepreneur: entrepreneur@womenportal.test / Password123!');
  console.log('2. Officer:      officer@womenportal.test / Password123!');
  console.log('3. Mentor:       mentor@womenportal.test / Password123!');
};

// If called directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}
