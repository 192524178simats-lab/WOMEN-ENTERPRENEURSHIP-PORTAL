# ==========================================
# Dockerfile – Women Entrepreneurship Support Portal (SDG 5)
# Multi-stage production container build
# ==========================================

# ------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------
FROM node:18-alpine AS client-builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy entire application source
COPY . .

# Build Vite client production bundle to dist/
RUN npm run client:build

# ------------------------------------------
# Stage 2: Production Server Execution
# ------------------------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Copy root package files & install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled frontend build assets from stage 1
COPY --from=client-builder /app/dist ./dist

# Copy backend server code & database initialization scripts
COPY server ./server

# Expose backend API server port
EXPOSE 5000

# Seed database on startup if database file missing, then start Express server
CMD ["node", "server/index.js"]
