# Git & Docker Command Reference Guide
## Case Study 33 – SDG 5: Women Entrepreneurship Support Portal

---

## 1. Git Command Reference

### Repository Setup & Inspection
```bash
# Initialize new Git repository
git init

# View status of working directory and staging area
git status

# Inspect commit history graph
git log --oneline --graph --decorate --all

# View configured remote repositories
git remote -v
```

### Branching & Merging
```bash
# List all local branches
git branch

# Create and switch to a new feature branch
git checkout -b feature/funding-management

# Switch back to develop branch
git checkout develop

# Merge feature branch into current branch
git merge feature/funding-management

# Delete merged feature branch
git branch -d feature/funding-management
```

### Staging & Committing
```bash
# Stage specific modified file
git add client/src/components/FundingApplicationModal.jsx

# Stage all modified and new files
git add .

# Commit staged changes with message
git commit -m "feat: implement multi-step funding application modal"
```

---

## 2. Docker Command Reference

### Docker Container & Image Operations
```bash
# Check installed Docker version
docker --version

# Check Docker Compose version
docker compose version

# Build container image from Dockerfile
docker compose build

# Build and start containers in background (detached mode)
docker compose up -d

# List running containers
docker compose ps

# View container logs in real time
docker compose logs -f

# Stop and remove containers, networks, and volumes
docker compose down
```

### Troubleshooting & Utility Commands
```bash
# List all local Docker images
docker images

# Execute interactive shell inside running container
docker exec -it women_entrepreneurship_portal_app sh

# Inspect container health status
docker inspect --format='{{json .State.Health}}' women_entrepreneurship_portal_app
```
