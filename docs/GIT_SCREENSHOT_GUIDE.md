# Git & GitHub Screenshot Evidence Guide
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## 1. Overview & Verification Policy

To adhere to university academic integrity standards:
- All screenshots must be captured directly from your local terminal/Git Bash and web browser.
- No secrets, tokens, API keys, or `.env` passwords should be visible in any screenshot.
- Each screenshot is assigned a standardized Figure number, command, expected evidence description, and target Annexure A question mapping.

---

## 2. Evidence Mapping Table (Figures 1 – 13)

| Figure | Evidence Topic | Terminal Command / Web View | Purpose / Description | Annexure A Question Supported |
| :--- | :--- | :--- | :--- | :--- |
| **Figure 1** | Git Repository Status | `git status` | Proves local Git repository state and working directory cleanliness | Question 3 – Repository Initialization |
| **Figure 2** | Git Branching Structure | `git branch -a` | Demonstrates branching model (`main`, `develop`, `feature/*`) | Question 4 – Branching Strategy |
| **Figure 3** | Git Commit History Graph | `git log --oneline --graph --all` | Displays commit history tree, commit hashes, and messages | Question 6 – Commit History Analysis |
| **Figure 4** | Modified Files Before Commit | `git status` | Shows untracked/modified files pre-commit | Question 5 – Version Control Workflow |
| **Figure 5** | Meaningful Git Commit | `git commit -m "..."` followed by `git log -n 3` | Demonstrates conventional commit execution | Question 5 – Version Control Workflow |
| **Figure 6** | Feature Branch Creation | `git checkout -b feature/...` | Demonstrates creating and switching to an isolated feature branch | Question 4 – Branching Strategy |
| **Figure 7** | Branch Integration / Merge | `git merge feature/...` followed by `git log` | Proves merging feature code into development branch | Question 5 – Version Control Workflow |
| **Figure 8** | GitHub Remote Repository | GitHub Web View (`https://github.com/USERNAME/women-entrepreneurship-support-portal`) | Shows online repository home page, description, and files | Question 10 – Container & Remote Setup |
| **Figure 9** | GitHub Branch Management | GitHub Web View (`/branches`) | Shows pushed branches (`main`, `develop`, `feature/*`) on GitHub | Question 4 – Branching Strategy |
| **Figure 10** | GitHub Online Commit History | GitHub Web View (`/commits`) | Displays commit history log on GitHub web interface | Question 6 – Commit History Analysis |
| **Figure 11** | Repository Folder Structure | GitHub Web View (`/tree/main`) | Displays `client/`, `server/`, `docs/`, `Dockerfile`, `README.md` | Question 2 – Project Structure Design |
| **Figure 12** | GitHub Project README | GitHub Web View (`README.md`) | Shows rendered README with setup commands and demo credentials | Question 6 – Setup Documentation |
| **Figure 13** | Local & Remote Sync | `git remote -v` and `git push` | Proves local repository synchronization with GitHub remote | Question 5 – Version Control Workflow |

---

## 3. GitHub Workflow Concept Diagram

```text
Local Machine Working Directory
     │
     ▼ (git add .)
Staging Area (Index)
     │
     ▼ (git commit -m "...")
Local Git Repository (.git/)
     │
     ▼ (git push origin main)
GitHub Remote Repository (Cloud)
```

### Explanation
1. **Working Directory**: The active directory containing `client/`, `server/`, and code files.
2. **Staging Area**: The index file tracking changes ready for the next commit snapshot.
3. **Local Repository**: The local `.git/` database recording the commit tree history.
4. **GitHub Remote**: The cloud-hosted Git service (`origin`) enabling team collaboration and backup.
