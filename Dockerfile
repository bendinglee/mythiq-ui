# Multi-stage build with intelligent fallback for Mythiq-UI
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Smart installation with fallback logic
# Try npm ci first (fastest, most reliable), fallback to npm install if needed
RUN if [ -f package-lock.json ]; then \
        echo "📦 Found package-lock.json - using npm ci for optimal performance" && \
        npm ci --legacy-peer-deps || \
        (echo "⚠️ npm ci failed - falling back to npm install" && \
         npm install --legacy-peer-deps); \
    else \
        echo "📦 No package-lock.json found - using npm install" && \
        npm install --legacy-peer-deps; \
    fi

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if it exists
COPY nginx.conf /etc/nginx/nginx.conf 2>/dev/null || echo "Using default nginx config"

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

