# University Viva Preparation & Q&A Guide
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## Section 1: General & Case Study Context

### Q1: What is the project and what problem does it solve?
**Answer**: The Women Entrepreneurship Support Portal (Case Study 33) is an integrated full-stack digital platform designed to support female business founders. It solves the problem of information fragmentation where women entrepreneurs previously struggled to discover government support schemes, capital grants, capacity building training, mentorship, and networking opportunities across disconnected websites.

### Q2: What is SDG 5 and how does this project support it?
**Answer**: SDG 5 is UN Sustainable Development Goal 5: **Gender Equality**. Specifically, Target 5.a aims to give women equal rights to economic resources, financial services, and property ownership. Our portal directly advances SDG 5 by providing women-owned small businesses centralized access to government capital grants, soft loans, business training workshops, and 1-on-1 industry mentorship.

---

## Section 2: Software Engineering & Architecture

### Q3: What software development methodology was used for this project?
**Answer**: We followed **Agile Software Development**. Development was structured in 5 iterative sprints covering database schema design, security implementation, core feature development (schemes, funding, training, mentorship), officer administration workflows, and UI polish/testing.

### Q4: What are the main functional requirements (FRs) and non-functional requirements (NFRs)?
**Answer**:
- **Functional Requirements**: Multi-role registration/login, business profile management, government schemes discovery, multi-step funding applications, progress tracking timeline, workshop enrollment, 1-on-1 mentorship, officer evaluation workflows, Recharts visual analytics, and CSV report export.
- **Non-Functional Requirements**: Security (bcrypt hashing & JWT tokens), Performance (sub-100ms API responses), Usability (SDG 5 government aesthetic), Reliability (SQLite WASM transaction safety), and Responsiveness (375px to 1920px viewports).

### Q5: Who are the system actors?
**Answer**: The system defines 3 main actors:
1. **Women Entrepreneur**: Female founder managing business profiles, applying for funding, enrolling in training, and requesting mentorship.
2. **Government Officer**: Ministry administrator auditing business credentials, approving grant applications, creating schemes, and generating policy reports.
3. **Certified Mentor**: Industry advisor reviewing mentorship requests, conducting virtual sessions, and providing advisory feedback.

---

## Section 3: Technical Implementation & Database

### Q6: Explain the tech stack and system architecture.
**Answer**: We built a **Layered Architecture**:
- **Presentation Layer**: Single Page Application (SPA) built with React 18, Vite, React Router v6, Lucide icons, and Recharts.
- **Application & API Layer**: Node.js and Express REST API server providing role-based JWT middleware authorization.
- **Data Access & Database Layer**: WebAssembly SQLite engine (`sql.js`) with pure JavaScript execution and automatic disk persistence.

### Q7: Why use SQLite via `sql.js` instead of standard SQL drivers?
**Answer**: `sql.js` compiles SQLite to WebAssembly, running entirely in pure JavaScript. This guarantees 100% cross-platform compatibility across Windows, macOS, and Linux without requiring native C++ compilers (like Visual Studio Build Tools) to be pre-installed on the evaluation machine.

### Q8: How is database normalization implemented?
**Answer**: The database contains 16 normalized relational tables with explicit Primary Keys, Foreign Keys (`PRAGMA foreign_keys = ON;`), ON DELETE CASCADE rules, and unique composite indexes (e.g. `training_id, entrepreneur_id` to prevent duplicate enrollments).

---

## Section 4: Security & Workflow Verification

### Q9: How is security and Role-Based Access Control (RBAC) enforced?
**Answer**: Passwords are never stored in plain text; they are hashed using `bcryptjs` with salt factor 10. Upon login, a signed JSON Web Token (JWT) is issued containing user role payload. RBAC is enforced on **both** the React frontend (via `ProtectedRoute`) and the Express backend (via `authorizeRoles('entrepreneur', 'officer', 'mentor')` middleware).

### Q10: Walk through the Funding Application workflow.
**Answer**:
1. An entrepreneur selects an active opportunity and opens the **Multi-Step Funding Application Modal**.
2. She enters the requested amount (validated against max limit), business plan, and document payload.
3. Upon submission, status is set to `Submitted` and a notification is sent to the Government Officer.
4. The entrepreneur tracks progress on a visual step timeline (`Submitted` → `Under Review` → `Approved` / `Rejected`).
5. The Officer audits the application, enters evaluation remarks, and approves the grant. Status updates in real-time.

---

## Section 5: UML Diagrams & Testing

### Q11: Explain the UML Use Case Diagram and relationships used.
**Answer**: Use Case diagrams map actor goals to system boundaries. We used explicit `<<include>>` relationships for mandatory steps (e.g. Funding Application `<<include>>` Upload Documents & Validate Amount) and `<<extend>>` relationships for conditional flows (e.g. Application Review `<<extend>>` Approve / Reject Application).

### Q12: How was testing conducted?
**Answer**: We executed a 25-point automated and manual System Test Suite covering authentication, profile completion, opportunity recommendations, application tracking, capacity guards, officer verification, report CSV exports, and security guards with a 100% pass rate.
