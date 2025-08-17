# Simplified Multi-stage Dockerfile for Mythiq-UI
# Optimized for Railway deployment without health checks

FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Install build dependencies for potential native modules
RUN apk add --no-cache python3 make g++

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Advanced installation strategy with multiple fallbacks
RUN set -e; \
    echo "🚀 Starting Mythiq-UI dependency installation..."; \
    \
    # Strategy 1: Try npm ci with package-lock.json (fastest, most reliable)
    if [ -f package-lock.json ]; then \
        echo "📦 Strategy 1: Found package-lock.json - attempting npm ci"; \
        if npm ci --legacy-peer-deps --no-audit --no-fund; then \
            echo "✅ Strategy 1 SUCCESS: npm ci completed successfully"; \
        else \
            echo "⚠️ Strategy 1 FAILED: npm ci failed, trying fallback..."; \
            rm -rf node_modules; \
            \
            # Strategy 2: Fresh npm install with legacy peer deps
            echo "🔄 Strategy 2: Attempting fresh npm install with legacy peer deps"; \
            if npm install --legacy-peer-deps --no-audit --no-fund; then \
                echo "✅ Strategy 2 SUCCESS: npm install with legacy peer deps completed"; \
            else \
                echo "⚠️ Strategy 2 FAILED: Trying with force flag..."; \
                rm -rf node_modules; \
                \
                # Strategy 3: Force installation (last resort)
                echo "🚨 Strategy 3: Force installation (last resort)"; \
                if npm install --force --no-audit --no-fund; then \
                    echo "✅ Strategy 3 SUCCESS: Force installation completed"; \
                else \
                    echo "❌ All installation strategies failed"; \
                    exit 1; \
                fi; \
            fi; \
        fi; \
    else \
        echo "📦 No package-lock.json found - using npm install directly"; \
        if npm install --legacy-peer-deps --no-audit --no-fund; then \
            echo "✅ npm install completed successfully"; \
        else \
            echo "⚠️ npm install failed, trying with force..."; \
            rm -rf node_modules; \
            npm install --force --no-audit --no-fund; \
        fi; \
    fi; \
    \
    echo "🎉 Dependency installation completed successfully"

# Copy source code (after dependencies for better caching)
COPY . .

# Build the application with error handling
RUN set -e; \
    echo "🏗️ Building Mythiq-UI application..."; \
    if npm run build; then \
        echo "✅ Build completed successfully"; \
    else \
        echo "❌ Build failed"; \
        exit 1; \
    fi; \
    \
    # Verify build output
    if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then \
        echo "❌ Build output directory is empty or missing"; \
        exit 1; \
    else \
        echo "✅ Build output verified - $(du -sh dist)"; \
    fi

# Production stage with optimized nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create simple nginx configuration for SPA
RUN cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Handle SPA routing - all routes go to index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Basic security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
