# Annexure A – Screenshot Evidence Index
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## 1. Overview & Capture Status

- **Status**: Pre-defined Specification & Index Guide.
- **Instruction for Student**: Start the live application (`npm start`), open `http://localhost:5000`, capture PNG screenshots as specified below, and place the image files in `docs/screenshots/`.

---

## 2. Website Testing Screenshot Evidence Index (Screenshots 1 – 15)

| Figure | Filename | Live Page / URL | Evidence Description | Related Test Case | Question Supported |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Figure 1** | `01_landing_page.png` | `http://localhost:5000/` | Centralized landing page with hero, features, and live DB stats counter | TC08 | Q1 – Problem Analysis |
| **Figure 2** | `02_login_page.png` | `http://localhost:5000/login` | Authentication portal with 1-click Demo Account Toolbar | TC02 | Q1 – Authentication |
| **Figure 3** | `03_entrepreneur_dashboard.png` | `http://localhost:5000/entrepreneur/dashboard` | Dashboard displaying 80% dynamic profile completion meter & recommendations | TC04 | Q1 – Dashboard |
| **Figure 4** | `04_business_profile_form.png` | `http://localhost:5000/entrepreneur/business` | Business registration interface for Udyam credential submission | TC06 | Q2 – Business Profile |
| **Figure 5** | `05_schemes_directory.png` | `http://localhost:5000/entrepreneur/schemes` | Government support schemes directory with active sector filtering | TC09 | Q1 – Schemes Catalog |
| **Figure 6** | `06_multistep_funding_modal.png` | `http://localhost:5000/entrepreneur/funding` | Multi-step funding application modal with progress indicator | TC10 | Q8 – Funding Modal |
| **Figure 7** | `07_application_tracking_timeline.png` | `http://localhost:5000/entrepreneur/applications` | My Applications page displaying visual step progress tracking timeline & remarks | TC12 | Q1 – Application Tracking |
| **Figure 8** | `08_training_workshops.png` | `http://localhost:5000/entrepreneur/training` | Business training programs with enrollment capacity limit indicator | TC14, TC15 | Q1 – Training Programs |
| **Figure 9** | `09_mentor_directory.png` | `http://localhost:5000/entrepreneur/mentors` | Certified mentor directory with 1-on-1 mentorship request interface | TC16 | Q1 – Mentorship |
| **Figure 10** | `10_mentor_sessions.png` | `http://localhost:5000/mentor/sessions` | Mentor session workspace displaying virtual video room link & feedback form | TC17, TC18 | Q1 – Mentorship Sessions |
| **Figure 11** | `11_officer_dashboard_charts.png` | `http://localhost:5000/officer/dashboard` | Government Officer dashboard featuring interactive Recharts data analytics | TC23 | Q1 – Officer Analytics |
| **Figure 12** | `12_officer_verification_queue.png` | `http://localhost:5000/officer/entrepreneurs` | Officer verification queue enforcing mandatory rejection reason validation | TC21, TC22 | Q1 – Verification Guard |
| **Figure 13** | `13_reports_csv_export.png` | `http://localhost:5000/officer/reports` | Reports and analytics module with 1-Click CSV data export | TC23 | Q1 – Reports & CSV |
| **Figure 14** | `14_notification_drawer.png` | Click Bell in Navbar | In-app notification drawer displaying real-time category alerts | TC21 | Q1 – Notifications |
| **Figure 15** | `15_mobile_responsiveness.png` | DevTools Mobile 375px | Responsive mobile viewport view demonstrating layout adaptiveness | NFR10 | Q1 – Responsiveness |

---

## 3. Git & GitHub Evidence Screenshot Index (Figures 1 – 13)

| Figure | Filename | Terminal Command / Web View | Evidence Description | Question Supported |
| :--- | :--- | :--- | :--- | :--- |
| **Figure 1** | `01_git_status.png` | `git status` | Proves local Git repository state and working directory cleanliness | Q3 – Git Initialization |
| **Figure 2** | `02_git_branches.png` | `git branch -a` | Demonstrates branching model (`main`, `develop`, `feature/*`) | Q4 – Branching Strategy |
| **Figure 3** | `03_git_log_graph.png` | `git log --oneline --graph --all` | Displays commit history tree, commit hashes, and messages | Q6 – Commit History |
| **Figure 4** | `04_git_status_modified.png` | `git status` | Shows untracked/modified files pre-commit | Q5 – Version Control Workflow |
| **Figure 5** | `05_git_commit.png` | `git commit -m "..."` | Demonstrates conventional commit execution | Q5 – Version Control Workflow |
| **Figure 6** | `06_git_feature_branch.png` | `git checkout -b feature/...` | Demonstrates creating and switching to an isolated feature branch | Q4 – Branching Strategy |
| **Figure 7** | `07_git_merge.png` | `git merge feature/...` | Proves merging feature code into development branch | Q5 – Version Control Workflow |
| **Figure 8** | `08_github_repo_home.png` | GitHub Web View | Shows online repository home page, description, and files | Q10 – Container & Remote Setup |
| **Figure 9** | `09_github_branches.png` | GitHub Web View (`/branches`) | Shows pushed branches (`main`, `develop`, `feature/*`) on GitHub | Q4 – Branching Strategy |
| **Figure 10** | `10_github_commits.png` | GitHub Web View (`/commits`) | Displays commit history log on GitHub web interface | Q6 – Commit History |
| **Figure 11** | `11_github_structure.png` | GitHub Web View (`/tree/main`)| Displays `client/`, `server/`, `docs/`, `Dockerfile`, `README.md` | Q2 – Project Structure |
| **Figure 12** | `12_github_readme.png` | GitHub Web View (`README.md`) | Shows rendered README with setup commands and demo credentials | Q6 – Setup Documentation |
| **Figure 13** | `13_git_push_sync.png` | `git remote -v` and `git push` | Proves local repository synchronization with GitHub remote | Q5 – Version Control Workflow |
