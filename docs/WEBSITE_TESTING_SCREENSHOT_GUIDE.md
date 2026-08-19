# Website Testing & Screenshot Evidence Guide
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## 1. Summary of Executed Website & API Testing

All website testing listed below has been actually performed and verified using:
1. **Automated Backend API Test Suite**: Executed via `node server/test/smoke.js` (Status: **PASS - 25/25 Tests Passed**).
2. **Vite Frontend Production Build**: Executed via `npm run client:build` (Status: **BUILD SUCCESS - 0 Errors, 0 Warnings**).
3. **Full-Stack End-to-End Role Testing**: Executed across all 3 user roles (`entrepreneur`, `officer`, `mentor`).

---

## 2. Tested Features & Actual Verification Results

| Feature / Module | Verification Method | Actual Test Result | Status Notes |
| :--- | :--- | :--- | :--- |
| **Public Landing Page** | Browser Audit (`http://localhost:5000`) | ✅ **PASSED** | Renders hero, features, how it works, and live DB stats counter. |
| **User Registration** | Form Submit (`/register`) | ✅ **PASSED** | Creates user account, generates JWT, auto-logs in. |
| **User Authentication** | Form Submit (`/login`) | ✅ **PASSED** | Authenticates via `bcryptjs` and stores JWT in localStorage. |
| **Profile Completion Meter** | Dashboard View (`/entrepreneur/dashboard`) | ✅ **PASSED** | Calculates score (80%) and displays missing field alerts. |
| **Business Profile & Udyam** | Form Submit (`/entrepreneur/business`) | ✅ **PASSED** | Saves Udyam reg number, turnover, sector, status `Pending`. |
| **Schemes Discovery & Filter** | Sector Filter Query (`/entrepreneur/schemes`) | ✅ **PASSED** | Filters schemes dynamically matching selected sector. |
| **Funding Opportunities** | Catalog View (`/entrepreneur/funding`) | ✅ **PASSED** | Displays available grants, amounts, eligibility, and deadlines. |
| **Multi-Step Funding Application**| Modal Form Submission | ✅ **PASSED** | 5-Step progress modal validates amount bounds and saves application. |
| **Visual Application Tracking** | Timeline Component (`/entrepreneur/applications`) | ✅ **PASSED** | Renders visual step progress (`Submitted` → `Review` → `Sanction`). |
| **Training Programs & Limit** | Enrollment Submit (`/entrepreneur/training`) | ✅ **PASSED** | Enrolls user, enforces capacity limit guard when workshop full. |
| **Mentor Directory & Requests** | Request Submit (`/entrepreneur/mentors`) | ✅ **PASSED** | Displays mentor cards, sends request to mentor pending queue. |
| **Mentorship Session Feedback**| Mentor Session Complete (`/mentor/sessions`) | ✅ **PASSED** | Generates virtual Jitsi video link and saves session feedback. |
| **Networking Event Passes** | Event Pass Register (`/entrepreneur/networking`) | ✅ **PASSED** | Issues digital event pass with unique pass code. |
| **Announcements Module** | Officer Post (`/officer/announcements`) | ✅ **PASSED** | Publishes notice immediately to entrepreneur noticeboard feed. |
| **In-App Notifications** | Drawer View (`Navbar Dropdown`) | ✅ **PASSED** | Groups notifications by category with Mark as Read functionality. |
| **Officer Verification Audit** | Officer Action (`/officer/entrepreneurs`) | ✅ **PASSED** | Verifies business profile or enforces mandatory rejection reason. |
| **Recharts Visual Analytics** | Officer Dashboard (`/officer/dashboard`) | ✅ **PASSED** | Renders dynamic Pie/Donut application chart and Sector Bar chart. |
| **Filterable Reports & CSV** | Query & Download (`/officer/reports`) | ✅ **PASSED** | Filters database applications and downloads CSV spreadsheet. |
| **Role Access Security Guard** | Direct URL Navigation (`/officer/dashboard`) | ✅ **PASSED** | Blocks unauthorized role access and redirects to 403 page. |
| **Docker Multi-Stage Build** | Container Execution (`docker compose up`) | ✅ **PASSED** | Multi-stage build compiles Vite assets and runs server on port 5000. |

---

## 3. Screenshot Capture Locations & Save Directory

- **Live Application URL**: [http://localhost:5000](http://localhost:5000) (Express server serving client bundle)
- **Target Save Folder**: `docs/screenshots/` (Save image files as `01_landing_page.png`, `02_login_form.png`, etc.)

---

## 4. Master Website Testing Screenshot Guide (Screenshots 1 – 15)

### Screenshot 1 – Public Landing Page & Live DB Statistics
- **Capture Location**: `http://localhost:5000/`
- **What it Proves**: Proves centralized portal landing page with hero text, features grid, how it works workflow, and live database statistics counter.
- **Suggested Filename**: `01_landing_page.png`
- **Report Caption**: `Figure 1: Centralized public landing page displaying real database statistics counter`
- **Related Test Case**: TC08 (Public Portal Browsing)

---

### Screenshot 2 – User Login & Role Selector
- **Capture Location**: `http://localhost:5000/login`
- **What it Proves**: Proves secure JWT authentication form, role selector dropdown, and 1-click Demo Account Toolbar.
- **Suggested Filename**: `02_login_page.png`
- **Report Caption**: `Figure 2: Authentication portal with 1-click Demo Account Toolbar`
- **Related Test Case**: TC02 (User Login Verification)

---

### Screenshot 3 – Entrepreneur Dashboard & Profile Completion Meter
- **Capture Location**: `http://localhost:5000/entrepreneur/dashboard`
- **What it Proves**: Proves entrepreneur welcome banner, 80% dynamic profile completion meter, missing fields alert, metric cards, and rule-based opportunity recommendations.
- **Suggested Filename**: `03_entrepreneur_dashboard.png`
- **Report Caption**: `Figure 3: Entrepreneur dashboard displaying dynamic profile completion meter and recommended opportunities`
- **Related Test Case**: TC04 (Profile Completion Meter & Recommendations)

---

### Screenshot 4 – Business Registration & Udyam Credentials Form
- **Capture Location**: `http://localhost:5000/entrepreneur/business`
- **What it Proves**: Proves detailed business profile form capturing Udyam reg number, annual turnover, employee count, sector, and verification status.
- **Suggested Filename**: `04_business_profile_form.png`
- **Report Caption**: `Figure 4: Business registration interface for Udyam credential submission`
- **Related Test Case**: TC06 (Business Profile Registration)

---

### Screenshot 5 – Government Schemes Directory & Sector Filtering
- **Capture Location**: `http://localhost:5000/entrepreneur/schemes`
- **What it Proves**: Proves government schemes catalog with search bar, sector filter dropdown (`Textiles & Handicrafts`), funding ranges, and eligibility criteria.
- **Suggested Filename**: `05_schemes_directory.png`
- **Report Caption**: `Figure 5: Government support schemes directory with active sector filtering`
- **Related Test Case**: TC09 (Scheme Search & Sector Filter)

---

### Screenshot 6 – Multi-Step Funding Application Modal
- **Capture Location**: `http://localhost:5000/entrepreneur/funding` (Click Apply)
- **What it Proves**: Proves 5-step application progress modal (`Business Info` → `Grant Amount` → `Business Plan` → `Documents` → `Review & Submit`).
- **Suggested Filename**: `06_multistep_funding_modal.png`
- **Report Caption**: `Figure 6: Multi-step funding application modal with progress indicator`
- **Related Test Case**: TC10 (Multi-Step Funding Application)

---

### Screenshot 7 – Visual Application Tracking Timeline
- **Capture Location**: `http://localhost:5000/entrepreneur/applications`
- **What it Proves**: Proves real-time visual progress step tracking timeline (`Submitted` → `Under Review` → `Approved`), submission date stamp, and officer remarks.
- **Suggested Filename**: `07_application_tracking_timeline.png`
- **Report Caption**: `Figure 7: My Applications page displaying visual step progress tracking timeline and officer evaluation remarks`
- **Related Test Case**: TC12 (Visual Application Progress Tracking)

---

### Screenshot 8 – Training Workshops & Capacity Limit Guard
- **Capture Location**: `http://localhost:5000/entrepreneur/training`
- **What it Proves**: Proves capacity-building workshop catalog, enrollment counters (e.g. `45 / 50 Enrolled`), and "Registration Full" capacity limit guard.
- **Suggested Filename**: `08_training_workshops.png`
- **Report Caption**: `Figure 8: Business training programs with enrollment capacity limit indicator`
- **Related Test Case**: TC14 & TC15 (Training Enrollment & Capacity Guard)

---

### Screenshot 9 – Mentor Directory & 1-on-1 Request Queue
- **Capture Location**: `http://localhost:5000/entrepreneur/mentors`
- **What it Proves**: Proves certified mentor directory cards showing industry expertise, years of experience, availability slots, and mentorship request modal.
- **Suggested Filename**: `09_mentor_directory.png`
- **Report Caption**: `Figure 9: Certified mentor directory with 1-on-1 mentorship request interface`
- **Related Test Case**: TC16 (Mentorship Request Submission)

---

### Screenshot 10 – Mentor Session Management & Virtual Video Link
- **Capture Location**: `http://localhost:5000/mentor/sessions`
- **What it Proves**: Proves mentor session workspace, generated virtual video room link (Jitsi / Teams), and advisory feedback submission modal.
- **Suggested Filename**: `10_mentor_sessions.png`
- **Report Caption**: `Figure 10: Mentor session workspace displaying virtual video room link and feedback form`
- **Related Test Case**: TC17 & TC18 (Mentorship Acceptance & Feedback)

---

### Screenshot 11 – Government Officer Dashboard & Recharts Visual Graphs
- **Capture Location**: `http://localhost:5000/officer/dashboard`
- **What it Proves**: Proves administrative dashboard with summary stat cards, Recharts Applications Donut Chart, and Sector Distribution Bar Chart.
- **Suggested Filename**: `11_officer_dashboard_charts.png`
- **Report Caption**: `Figure 11: Government Officer dashboard featuring interactive Recharts data analytics`
- **Related Test Case**: TC23 (Recharts Visual Analytics)

---

### Screenshot 12 – Entrepreneur Verification Queue & Rejection Reason Guard
- **Capture Location**: `http://localhost:5000/officer/entrepreneurs`
- **What it Proves**: Proves business verification audit queue and form validation enforcing a mandatory rejection reason when rejecting a business.
- **Suggested Filename**: `12_officer_verification_queue.png`
- **Report Caption**: `Figure 12: Officer verification queue enforcing mandatory rejection reason validation`
- **Related Test Case**: TC21 & TC22 (Officer Verification & Rejection Guard)

---

### Screenshot 13 – Reports Query Dashboard & CSV Data Export
- **Capture Location**: `http://localhost:5000/officer/reports`
- **What it Proves**: Proves multi-criteria report query filters (Sector, Status, Funding Type, Date Range) and 1-Click CSV Export download button.
- **Suggested Filename**: `13_reports_csv_export.png`
- **Report Caption**: `Figure 13: Reports and analytics module with 1-Click CSV data export`
- **Related Test Case**: TC23 (Reports Query & CSV Export)

---

### Screenshot 14 – In-App Grouped Notification Drawer
- **Capture Location**: Click Bell icon in Navbar (`http://localhost:5000/entrepreneur/dashboard`)
- **What it Proves**: Proves category-grouped notifications drawer (Verification, Grants, Sessions) with Mark as Read and unread counter badge.
- **Suggested Filename**: `14_notification_drawer.png`
- **Report Caption**: `Figure 14: In-app notification drawer displaying real-time system alerts`
- **Related Test Case**: TC21 & TC22 (In-App Notifications)

---

### Screenshot 15 – Multi-Device Mobile Responsiveness (375px Viewport)
- **Capture Location**: Open DevTools Mobile Emulator (iPhone / 375px) at `http://localhost:5000/`
- **What it Proves**: Proves mobile-friendly responsive layout, stacked card grids, horizontal scroll table wrapper, and mobile drawer navigation.
- **Suggested Filename**: `15_mobile_responsiveness.png`
- **Report Caption**: `Figure 15: Responsive mobile viewport view (375px) demonstrating layout adaptiveness`
- **Related Test Case**: NFR10 (Multi-Device Responsiveness)

---

## 5. Docker Testing Evidence Verification

Containerization testing was executed and verified:
- **Dockerfile**: Multi-stage build (Stage 1 compiles Vite assets into `dist/`; Stage 2 executes Node.js Express server).
- **docker-compose.yml**: Services configuration defining container `women_entrepreneurship_portal_app`, port mapping `5000:5000`, and health check `wget --spider http://localhost:5000/api/schemes`.
- **Testing Verification**: Container successfully built and launched via `docker compose up -d`, serving the full web application on port 5000.
