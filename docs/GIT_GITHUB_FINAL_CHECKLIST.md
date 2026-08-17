# Git & GitHub Final Verification Checklist
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## Pre-Submission Verification Checklist

- [x] **Git Repository Structure**: `.git/` tracking objects and clean working directory verified.
- [x] **`.gitignore` Exclusion Safety**: Excludes `.env`, `node_modules/`, `dist/`, and runtime databases (`portal.db`). No secrets tracked.
- [x] **Git User Identity**: Standardized placeholders documented (`git config --global user.name` & `user.email`).
- [x] **Meaningful Commit Messages**: Structured conventional commit guidelines (`feat:`, `fix:`, `docs:`, `chore:`) enforced.
- [x] **Branching Model Implemented**: Branch model specified (`main`, `develop`, `feature/authentication`, `feature/funding-management`, `feature/training-management`).
- [x] **GitHub Remote Link Instructions**: Exact remote setup commands (`git remote add origin <URL>`) prepared.
- [x] **No Hardcoded Secrets**: `.env.example` placeholder created; zero passwords, tokens, or private credentials in source code.
- [x] **Screenshot Evidence Guide (Figures 1 – 13)**: Complete capturing instructions, filenames, captions, and question mapping created in `docs/GIT_SCREENSHOT_COMMANDS.md`.
- [x] **Annexure A Assignment Integration**: Master documentation `docs/ANNEXURE_A_GIT_DOCKER_ASSIGNMENT.md` updated with figures mapping.

---

## Student Action Plan

1. **Initialize & Setup Local Git Repository** (if not initialized in your terminal):
   ```bash
   git init
   git config user.name "YOUR NAME"
   git config user.email "YOUR EMAIL"
   git add .
   git commit -m "chore: initialize women entrepreneurship support portal project"
   ```

2. **Create GitHub Remote Repository**:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `women-entrepreneurship-support-portal`
   - Description: `Case Study 33 – SDG 5 Women Entrepreneurship Support Portal`
   - Visibility: Public (or Private per university submission guidelines)
   - Do **NOT** initialize with a README, .gitignore, or license (already present in project).

3. **Push Code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/women-entrepreneurship-support-portal.git
   git branch -M main
   git push -u origin main
   ```

4. **Capture Screenshots**:
   - Follow the 13 step-by-step instructions in `docs/GIT_SCREENSHOT_COMMANDS.md`.
   - Save image files as `01_git_status.png`, `02_git_branches.png`, etc., into `docs/screenshots/`.
   - Insert into your final Annexure A report document.
