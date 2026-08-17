# Comprehensive Software Engineering Test Cases
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## System Test Suite Summary

| Module | Total Tests | Passed | Failed | Pass Rate |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication & Profile** | 4 | 4 | 0 | 100% |
| **Business Registration** | 3 | 3 | 0 | 100% |
| **Government Schemes** | 2 | 2 | 0 | 100% |
| **Funding & Applications** | 4 | 4 | 0 | 100% |
| **Training Programs** | 2 | 2 | 0 | 100% |
| **Mentorship** | 3 | 3 | 0 | 100% |
| **Networking & Announcements**| 2 | 2 | 0 | 100% |
| **Officer Administration** | 3 | 3 | 0 | 100% |
| **Security & Authorization** | 2 | 2 | 0 | 100% |
| **Total Test Suite** | **25** | **25** | **0** | **100%** |

---

## Detailed Test Execution Records

| Test Case ID | Module | Test Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC01** | Auth | Entrepreneur Registration | User on `/register` page | 1. Fill full name, valid email, phone, password.<br>2. Select role `Women Entrepreneur`.<br>3. Click Register. | Account created, JWT stored, auto-redirect to Entrepreneur Dashboard. | Account registered, auto-login successful. | ✅ PASS |
| **TC02** | Auth | User Login Verification | Seeded user exists | 1. Navigate to `/login`.<br>2. Enter `entrepreneur@womenportal.test` / `Password123!`.<br>3. Click Login. | JWT token generated, user state loaded, dashboard rendered. | Authenticated successfully, token saved. | ✅ PASS |
| **TC03** | Auth | Logout | User logged in | 1. Click Logout in Navbar/Sidebar. | JWT cleared from localStorage, state reset, redirect to `/login`. | Token cleared, redirected to login page. | ✅ PASS |
| **TC04** | Profile | Profile Completion Meter | Entrepreneur logged in | 1. Navigate to `/entrepreneur/dashboard`. | Dynamic completion meter rendered (e.g. 80%) with missing fields alert. | Rendered 80% with missing verification prompt. | ✅ PASS |
| **TC05** | Profile | Entrepreneur Profile Update | Entrepreneur logged in | 1. Navigate to `/entrepreneur/profile`.<br>2. Update DOB, City, Address.<br>3. Click Save Profile. | Profile updated in database, Toast success displayed. | Database updated, success toast shown. | ✅ PASS |
| **TC06** | Business | Business Profile Registration | Entrepreneur profile exists | 1. Navigate to `/entrepreneur/business`.<br>2. Fill business name, sector, Udyam number, turnover.<br>3. Click Save Business. | Business profile saved with status `Pending Verification`. | Business record created with Pending Verification. | ✅ PASS |
| **TC07** | Business | Duplicate Udyam Reg Guard | Business exists | 1. Register new business with identical Udyam number. | API rejects duplicate Udyam registration with 400 error. | System blocked duplicate registration. | ✅ PASS |
| **TC08** | Schemes | Public Scheme Browsing | None | 1. Navigate to `/public-schemes`. | Active government schemes rendered with funding range & eligibility. | 5 active schemes rendered cleanly. | ✅ PASS |
| **TC09** | Schemes | Sector Filter Query | Schemes in DB | 1. On `/entrepreneur/schemes`, select filter `Textiles & Handicrafts`. | Table filters dynamically to display matching schemes. | Filtered correctly to matching sector schemes. | ✅ PASS |
| **TC10** | Funding | Multi-Step Application Modal | Business profile verified | 1. Open Funding page.<br>2. Click Apply on an active opportunity.<br>3. Complete Steps 1 to 5. | Multi-step progress bar updates, application saved with app number. | Application APP-2026-X created successfully. | ✅ PASS |
| **TC11** | Funding | Requested Amount Validation | Opportunity has max limit | 1. In application modal, enter amount > max limit. | Form validation blocks step progress and displays warning toast. | Blocked step progress with warning alert. | ✅ PASS |
| **TC12** | Funding | Visual Progress Tracking | Application submitted | 1. Navigate to `/entrepreneur/applications`. | Visual step timeline (`Submitted` → `Review` → `Sanction`) rendered. | Progress timeline rendered with submission date. | ✅ PASS |
| **TC13** | Funding | Application Withdrawal | Application status `Submitted` | 1. On `/entrepreneur/applications`, click Withdraw. | Confirmation dialog prompted, status updated to `Withdrawn`. | Application status updated to Withdrawn. | ✅ PASS |
| **TC14** | Training | Workshop Enrollment | Upcoming program exists | 1. Navigate to `/entrepreneur/training`.<br>2. Click Register. | Enrollment record saved, participant count incremented by 1. | Enrolled successfully, count incremented. | ✅ PASS |
| **TC15** | Training | Full Capacity Guard | Program at max capacity | 1. Attempt registration for full workshop. | Button disabled, badge displays "Registration Full". | Registration blocked, full badge rendered. | ✅ PASS |
| **TC16** | Mentorship | Request 1-on-1 Mentorship | Active mentor exists | 1. Navigate to `/entrepreneur/mentors`.<br>2. Click Request Mentorship.<br>3. Submit date & reason. | Mentorship request saved in queue with status `Pending`. | Request created in pending queue. | ✅ PASS |
| **TC17** | Mentorship | Mentor Acceptance & Link | Request pending | 1. Log in as Mentor (`mentor@womenportal.test`).<br>2. Click Accept & Schedule Session. | Status updated to `Accepted`, meeting link attached. | Session scheduled with Jitsi meeting room link. | ✅ PASS |
| **TC18** | Mentorship | Advisory Feedback Submission | Session scheduled | 1. Log in as Mentor, open Sessions page.<br>2. Enter session feedback & click Complete. | Status set to `Completed`, feedback displayed to entrepreneur. | Session completed and feedback saved. | ✅ PASS |
| **TC19** | Networking | Event Pass Registration | Active event exists | 1. Navigate to `/entrepreneur/networking`.<br>2. Click Register Event Pass. | Event pass issued with unique pass code. | Event pass registered cleanly. | ✅ PASS |
| **TC20** | Announcements| Ministry Announcement Post | Officer logged in | 1. Log in as Officer (`officer@womenportal.test`).<br>2. Open Announcements, publish notice. | Notice saved and rendered in public/entrepreneur feed. | Announcement published immediately. | ✅ PASS |
| **TC21** | Officer | Business Verification Approval | Business pending | 1. Log in as Officer, open Entrepreneurs page.<br>2. Audit Udyam reg and click Verify. | Business status updated to `Verified`, notification sent to founder. | Business verified, notification sent. | ✅ PASS |
| **TC22** | Officer | Rejection Reason Requirement | Business pending | 1. Log in as Officer, click Reject without entering remarks. | Form validation blocks rejection and demands rejection reason. | Validation error displayed: Remarks required. | ✅ PASS |
| **TC23** | Reports | Filterable Query & CSV Export | Applications exist | 1. Open `/officer/reports`, filter by sector, click Export CSV. | Query executed, CSV file generated and downloaded. | CSV file downloaded cleanly. | ✅ PASS |
| **TC24** | Security | Role Access Guard (UI) | Entrepreneur logged in | 1. Manually navigate URL to `/officer/dashboard`. | Route guard blocks rendering and redirects to `/unauthorized`. | Blocked and redirected to 403 page. | ✅ PASS |
| **TC25** | Security | Direct API Authorization Guard| Unauthenticated user | 1. Send `GET /api/users` request without Bearer token. | API returns `401 Unauthorized` JSON response. | HTTP 401 Unauthorized returned. | ✅ PASS |
