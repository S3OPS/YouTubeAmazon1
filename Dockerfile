# Multi-stage build for YouTube Amazon Affiliate Automation System
# Optimized for faster builds, smaller images, and better security

# =============================================================================
# BASE STAGE - Common base image for all stages
# =============================================================================
FROM node:18-alpine AS base

# Add labels for better image management
LABEL maintainer="S3OPS" \
      version="2.0.0" \
      description="YouTube Amazon Affiliate Automation System"

# =============================================================================
# DEPENDENCIES STAGE - Install production dependencies only
# =============================================================================
FROM base AS deps
WORKDIR /app

# Copy package files first (leverage Docker cache)
COPY package*.json ./

# Install production dependencies (--omit=dev replaces deprecated --only=production)
# HUSKY=0 prevents husky hooks from running during install
RUN HUSKY=0 npm ci --omit=dev && npm cache clean --force

# =============================================================================
# PRODUCTION STAGE - Final minimal image
# =============================================================================
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    PORT=3000

# Create a non-root user for security (principle of least privilege)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 youtubebot

# Copy production dependencies from deps stage
COPY --from=deps --chown=youtubebot:nodejs /app/node_modules ./node_modules

# Copy application code (respects .dockerignore)
COPY --chown=youtubebot:nodejs . .

# Create video directories with proper permissions
RUN mkdir -p videos/processed logs && \
    chown -R youtubebot:nodejs videos logs

# Switch to non-root user
USER youtubebot

# Expose port
EXPOSE 3000

# Health check - verify the application is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
