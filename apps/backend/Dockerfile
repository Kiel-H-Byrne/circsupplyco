# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies (using --workspaces-only if needed, or just install everything)
RUN npm ci

# Copy backend source
COPY apps/backend ./apps/backend

# Build backend
RUN npm run build --workspace=@dtc/backend

# Production stage
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

# Install medusa-cli globally to run migrations
RUN npm install -g @medusajs/cli@2.14.2

# Copy built assets and production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/backend/.medusa/server ./apps/backend/.medusa/server
COPY --from=builder /app/apps/backend/medusa-config.js ./apps/backend/medusa-config.js
# Note: medusa build output is usually in .medusa/server for v2

WORKDIR /app/apps/backend

# Expose the default Medusa port
EXPOSE 9000

# Start command: run migrations then start
CMD ["sh", "-c", "medusa db:migrate && medusa start"]
