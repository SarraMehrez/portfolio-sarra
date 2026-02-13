# Multi-stage build for production-ready portfolio

# ═══════════════════════════════════════════════════════════
# Stage 1: Build
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Generate feed data
RUN npm run generate-feed

# Build production bundle
RUN npm run build

# ═══════════════════════════════════════════════════════════
# Stage 2: Production
# ═══════════════════════════════════════════════════════════
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Add labels
LABEL maintainer="mehrez.sarra@yahoo.com"
LABEL description="DevOps Incident Command Portfolio"
LABEL version="1.0.0"

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
