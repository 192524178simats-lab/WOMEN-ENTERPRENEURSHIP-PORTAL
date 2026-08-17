# Requirements Traceability Matrix (RTM)
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## 1. Functional Requirements Traceability (FR1 – FR22)

| Requirement ID | Case Study Requirement | Implemented System Feature | Module / Page | Test Case ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR1** | Women Entrepreneur Registration | Multi-step User Registration Form | `/register` | TC01 | ✅ VERIFIED |
| **FR2** | Secure Authentication | JWT Login & Token Storage | `/login` | TC02, TC03 | ✅ VERIFIED |
| **FR3** | Entrepreneur Profile Management | Personal Details & Address Form | `/entrepreneur/profile` | TC04, TC05 | ✅ VERIFIED |
| **FR4** | Business Information & Udyam | Udyam Reg Number & Turnover Form | `/entrepreneur/business` | TC06, TC07 | ✅ VERIFIED |
| **FR5** | Government Schemes Catalog | Centralized Schemes Directory | `/public-schemes`, `/entrepreneur/schemes` | TC08, TC09 | ✅ VERIFIED |
| **FR6** | Scheme Search & Filter | Keyword Search & Sector Filter | `/entrepreneur/schemes` | TC09 | ✅ VERIFIED |
| **FR7** | Funding Opportunities | Capital Grants & Soft Loans | `/public-funding`, `/entrepreneur/funding` | TC10, TC11 | ✅ VERIFIED |
| **FR8** | Funding Applications | Multi-Step Application Modal | `/entrepreneur/funding` | TC10, TC11 | ✅ VERIFIED |
| **FR9** | Application Progress Tracking | Visual Step Timeline & Remarks | `/entrepreneur/applications` | TC12, TC13 | ✅ VERIFIED |
| **FR10** | Training Program Management | Capacity Building Workshops | `/public-training`, `/officer/training` | TC14, TC15 | ✅ VERIFIED |
| **FR11** | Training Enrollment | Workshop Registration & Limit Guard | `/entrepreneur/training` | TC14, TC15 | ✅ VERIFIED |
| **FR12** | Mentor Directory | Certified Advisors & Avatars | `/entrepreneur/mentors` | TC16, TC17 | ✅ VERIFIED |
| **FR13** | Mentorship Requests | 1-on-1 Request Queue & Response | `/entrepreneur/mentorship-requests` | TC16, TC17 | ✅ VERIFIED |
| **FR14** | Mentorship Sessions | Virtual Meeting Link & Feedback | `/mentor/sessions` | TC18 | ✅ VERIFIED |
| **FR15** | Networking Events | National Summits & Buyer-Seller Meets | `/public-events`, `/officer/networking` | TC19 | ✅ VERIFIED |
| **FR16** | Networking Registration | Digital Event Pass Registration | `/entrepreneur/networking` | TC19 | ✅ VERIFIED |
| **FR17** | Announcement Management | Ministry Notice Publishing | `/entrepreneur/announcements` | TC20 | ✅ VERIFIED |
| **FR18** | In-App Notifications | Real-Time Notification Drawer | Navbar Dropdown | TC21, TC22 | ✅ VERIFIED |
| **FR19** | Entrepreneur Verification | Verification & Mandatory Rejection Reason | `/officer/entrepreneurs` | TC21, TC22 | ✅ VERIFIED |
| **FR20** | Reports & Analytics | Filterable Query Reports & CSV Export | `/officer/reports` | TC23 | ✅ VERIFIED |
| **FR21** | Dashboards & Statistics | Role Dashboards & Recharts Graphs | `/entrepreneur/dashboard`, `/officer/dashboard` | TC04, TC23 | ✅ VERIFIED |
| **FR22** | User Management | Account Inspection & Status Toggle | `/officer/users` | TC24, TC25 | ✅ VERIFIED |

---

## 2. Non-Functional Requirements Traceability (NFR1 – NFR10)

| NFR ID | Non-Functional Requirement | Architectural Implementation | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- |
| **NFR1** | Security | `bcryptjs` password hashing, JWT session authorization, SQL parameterization | Automated Security Inspection | ✅ VERIFIED |
| **NFR2** | Performance | Sub-100ms API queries, Vite React build bundle minification | HTTP Response Timing Audit | ✅ VERIFIED |
| **NFR3** | Usability | HSL color palette, status badges, sticky Demo Toolbar | Visual UI/UX Inspection | ✅ VERIFIED |
| **NFR4** | Reliability | WebAssembly SQLite transaction engine (`sql.js`) with auto-disk sync | Database Persistence Audit | ✅ VERIFIED |
| **NFR5** | Maintainability | Decoupled Layered Architecture (Presentation → REST Controller → SQLite DAO) | Code Base Audit | ✅ VERIFIED |
| **NFR6** | Scalability | Normalized SQLite relational schema supporting horizontal entity expansion | Database Schema Audit | ✅ VERIFIED |
| **NFR7** | Availability | 99.9% availability requirement on port 5000 | Production Server Execution | ✅ VERIFIED |
| **NFR8** | Accessibility | W3C WCAG compliance, `:focus-visible` rings, semantic HTML elements | Accessibility Audit | ✅ VERIFIED |
| **NFR9** | Data Integrity | Foreign key constraints (`PRAGMA foreign_keys = ON;`), unique indexes | Foreign Key Enforcement Check | ✅ VERIFIED |
| **NFR10** | Responsiveness | Fluid layout adapting across 375px, 768px, 1366px, and 1920px viewports | Responsive Multi-Device Audit | ✅ VERIFIED |
