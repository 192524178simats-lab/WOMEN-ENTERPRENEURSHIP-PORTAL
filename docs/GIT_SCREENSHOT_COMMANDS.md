# Step-by-Step Git & GitHub Screenshot Capturing Procedure
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## Prerequisite Setup

Open **Git Bash** or your command terminal and navigate to the project directory:
```bash
cd C:\Users\kiran\.gemini\antigravity\scratch\women-entrepreneurship-portal
```

Verify your Git identity (replace placeholders with your actual details):
```bash
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR EMAIL"
```

---

## Detailed Screenshot Instructions

### Screenshot 1: Repository Status
- **Target Filename**: `01_git_status.png`
- **Command**:
  ```bash
  git status
  ```
- **Visible Content**: Terminal showing active branch (`main` or `develop`) and working tree status.
- **Report Caption**: `Figure 1: Git repository status`
- **Supports**: Question 3 – Git Repository Initialization

---

### Screenshot 2: Branch Structure
- **Target Filename**: `02_git_branches.png`
- **Command**:
  ```bash
  git branch -a
  ```
- **Visible Content**: List of local branches (`main`, `develop`, `feature/authentication`, `feature/funding-management`, `feature/training-management`).
- **Report Caption**: `Figure 2: Git branching structure`
- **Supports**: Question 4 – Git Branching Strategy

---

### Screenshot 3: Commit History Graph
- **Target Filename**: `03_git_log_graph.png`
- **Command**:
  ```bash
  git log --oneline --graph --decorate --all -n 10
  ```
- **Visible Content**: Graph tree showing commit hashes, conventional commit messages, and branch pointers.
- **Report Caption**: `Figure 3: Git commit history graph`
- **Supports**: Question 6 – Commit History Analysis

---

### Screenshot 4: Modified Files Pre-Commit
- **Target Filename**: `04_git_status_modified.png`
- **Command**:
  ```bash
  git status
  ```
- **Visible Content**: Terminal showing untracked/modified documentation files under `docs/`.
- **Report Caption**: `Figure 4: Modified files before commit`
- **Supports**: Question 5 – Version Control Workflow

---

### Screenshot 5: Meaningful Commit Execution
- **Target Filename**: `05_git_commit.png`
- **Command**:
  ```bash
  git add .
  git commit -m "docs: finalize Annexure A Git and Docker documentation"
  git log -n 3
  ```
- **Visible Content**: Successful commit message summary and updated `git log`.
- **Report Caption**: `Figure 5: Meaningful Git commit execution`
- **Supports**: Question 5 – Version Control Workflow

---

### Screenshot 6: Feature Branch Creation
- **Target Filename**: `06_git_feature_branch.png`
- **Command**:
  ```bash
  git checkout -b feature/funding-management
  git branch
  ```
- **Visible Content**: Switch confirmation to `feature/funding-management` and active branch asterisk.
- **Report Caption**: `Figure 6: Feature branch creation`
- **Supports**: Question 4 – Git Branching Strategy

---

### Screenshot 7: Branch Integration / Merge
- **Target Filename**: `07_git_merge.png`
- **Command**:
  ```bash
  git checkout develop
  git merge feature/funding-management
  git log --oneline -5
  ```
- **Visible Content**: Terminal showing fast-forward or merge commit summary.
- **Report Caption**: `Figure 7: Feature branch merged into development branch`
- **Supports**: Question 5 – Version Control Workflow

---

### Screenshot 8: GitHub Repository Home
- **Target Filename**: `08_github_repo_home.png`
- **Action**: Open web browser to your GitHub repository:
  `https://github.com/YOUR_USERNAME/women-entrepreneurship-support-portal`
- **Visible Content**: Repository title, description, code files (`client/`, `server/`, `docs/`), and `README.md` preview.
- **Report Caption**: `Figure 8: GitHub remote repository home page`
- **Supports**: Question 10 – Container & Remote Setup

---

### Screenshot 9: GitHub Branch Management
- **Target Filename**: `09_github_branches.png`
- **Action**: In GitHub browser tab, click **Branches** (`/branches`).
- **Visible Content**: List of pushed branches (`main`, `develop`, `feature/*`).
- **Report Caption**: `Figure 9: GitHub branch management`
- **Supports**: Question 4 – Git Branching Strategy

---

### Screenshot 10: GitHub Commit History Log
- **Target Filename**: `10_github_commits.png`
- **Action**: In GitHub browser tab, click **Commits** (`/commits`).
- **Visible Content**: Online commit history log displaying commit authors and conventional messages.
- **Report Caption**: `Figure 10: GitHub online commit history`
- **Supports**: Question 6 – Commit History Analysis

---

### Screenshot 11: Repository Folder Structure
- **Target Filename**: `11_github_structure.png`
- **Action**: In GitHub browser tab, capture file tree view showing `Dockerfile`, `docker-compose.yml`, `package.json`, and `.gitignore`.
- **Visible Content**: Root directory layout.
- **Report Caption**: `Figure 11: Project repository structure on GitHub`
- **Supports**: Question 2 – Project Structure Design

---

### Screenshot 12: GitHub Project README
- **Target Filename**: `12_github_readme.png`
- **Action**: Scroll down to rendered `README.md` on GitHub home page.
- **Visible Content**: Rendered markdown header, SDG 5 badges, setup commands, and demo credentials table.
- **Report Caption**: `Figure 12: Project README on GitHub`
- **Supports**: Question 6 – Setup Documentation

---

### Screenshot 13: Local & Remote Synchronization
- **Target Filename**: `13_git_push_sync.png`
- **Command**:
  ```bash
  git remote -v
  git push -u origin main
  git status
  ```
- **Visible Content**: Configured remote origin URL (`https://github.com/USERNAME/women-entrepreneurship-support-portal.git`) and "Your branch is up to date with 'origin/main'".
- **Report Caption**: `Figure 13: Local Git repository synchronized with GitHub remote`
- **Supports**: Question 5 – Version Control Workflow
