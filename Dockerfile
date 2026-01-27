# Multi-stage build for YouTube Amazon Affiliate Automation System
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN HUSKY=0 npm ci --only=production && npm cache clean --force

# Build stage (if needed in future)
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 youtubebot

# Copy necessary files
COPY --from=deps --chown=youtubebot:nodejs /app/node_modules ./node_modules
COPY --chown=youtubebot:nodejs . .

# Create video directories with proper permissions
RUN mkdir -p videos/processed && \
    chown -R youtubebot:nodejs videos

# Switch to non-root user
USER youtubebot

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
