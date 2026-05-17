# Build stage
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/

RUN npm install --no-audit --no-fund

COPY apps/backend ./apps/backend

# Run build
RUN npm run build --workspace=@dtc/backend

# Production stage
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy built standalone application from builder
# .medusa/server contains medusa-config.js and all built assets
COPY --from=builder /app/apps/backend/.medusa/server ./
# Copy node_modules (we need all of them because of the monorepo structure)
COPY --from=builder /app/node_modules ./node_modules

# Install medusa-cli globally
RUN npm install -g @medusajs/cli@2.14.2

# Expose port
EXPOSE 9000

# Start command
# Standalone build output expects to be run from its root
CMD ["sh", "-c", "medusa db:migrate && medusa start"]
