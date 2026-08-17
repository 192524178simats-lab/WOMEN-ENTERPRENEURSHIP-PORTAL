# University Project Demonstration Guide (5–10 Minutes)
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## Pre-Demo Checklist

1. Open terminal and navigate to project folder:
   ```bash
   cd C:\Users\kiran\.gemini\antigravity\scratch\women-entrepreneurship-portal
   ```
2. Reset and seed database:
   ```bash
   npm run seed
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
4. Open web browser at **`http://localhost:5000`**.

---

## Step-by-Step 7-Minute Demo Script

### Part 1: Public Landing Page & SDG 5 Overview (1 Minute)
- **Action**: Show landing page at `http://localhost:5000`.
- **Key Talking Points**:
  - Hero title: *"Women Entrepreneurship Support Portal"*.
  - Explain centralizing government schemes, funding, training, mentoring, and networking under SDG 5.
  - Highlight the **Live Database Counter** showing registered entrepreneurs, available schemes, funding opportunities, training programs, and certified mentors.
  - Show the 5-step *How It Works* section and portal footer.

### Part 2: Women Entrepreneur Workflow (3 Minutes)
- **Action**: Click **Entrepreneur** button on sticky Demo Toolbar (Log in as `entrepreneur@womenportal.test` / `Password123!`).
- **Key Talking Points**:
  - Show **Profile Completion Indicator** (80% complete with missing verification prompt).
  - Show **Rule-Based Opportunity Recommendations** matched to Priya Sharma's registered business sector (*Textiles & Handicrafts*).
  - Open **Government Schemes** page, demonstrate sector filtering.
  - Open **Funding** page, click **Apply Now** on *Women Entrepreneurship Capital Subsidy*.
  - Demonstrate the **Multi-Step Funding Modal** (Steps 1 to 5: Business Info → Grant Amount → Purpose → Documents → Review).
  - Submit application and navigate to **My Applications** page to showcase the **Visual Step Tracking Timeline** (`Submitted` → `Under Review` → `Approved`).
  - Show workshop registration under **Training** and 1-on-1 request under **Mentors**.

### Part 3: Government Officer Workflow (2 Minutes)
- **Action**: Click **Officer** button on sticky Demo Toolbar (Log in as `officer@womenportal.test` / `Password123!`).
- **Key Talking Points**:
  - Show **Officer Dashboard** with **Recharts Visual Graphs** (Applications Donut chart & Sector Bar chart).
  - Open **Entrepreneurs & Verification** page, audit Udyam reg credentials, and issue verification badge (point out mandatory rejection reason validation if rejecting).
  - Open **Applications** queue, locate Priya Sharma's submitted funding application, enter officer evaluation remarks, and click **Approve Application**.
  - Open **Reports & Analytics** page, demonstrate query filtering by sector/status, and click **Export Report (CSV)** to download spreadsheet.

### Part 4: Mentor Workflow (1 Minute)
- **Action**: Click **Mentor** button on sticky Demo Toolbar (Log in as `mentor@womenportal.test` / `Password123!`).
- **Key Talking Points**:
  - Show **Mentor Dashboard** pending queue.
  - Open **Mentorship Requests**, click **Accept & Schedule Session**, and show virtual meeting room link generation (Jitsi / Teams).
  - Open **Sessions & Feedback**, complete session, and submit advisory feedback.

### Part 5: Final Verification & Conclusion (1 Minute)
- **Action**: Switch back to Entrepreneur role.
- **Key Talking Points**:
  - Open **Notifications** drawer to show real-time alerts for business verification, application approval, and mentorship acceptance.
  - Re-open **My Applications** to show the updated `Approved` status badge and officer evaluation remarks.
  - Conclude demonstration.
