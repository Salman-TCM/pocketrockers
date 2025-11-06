FROM node:21-alpine

# Install required packages for cross-platform compatibility
RUN apk add --no-cache \
    bash \
    curl \
    git \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm install if package-lock.json doesn't exist, otherwise use npm ci
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi && npm cache clean --force

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Copy and make entrypoint script executable
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || curl -f http://localhost:3000 || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]