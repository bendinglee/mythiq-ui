# Advanced Multi-stage Dockerfile for Mythiq-UI with Intelligent Fallbacks
# Optimized for Railway deployment with enterprise-grade reliability

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

# Install additional tools for health checks and debugging
RUN apk add --no-cache curl wget

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create custom nginx configuration for SPA (FIXED HEREDOC SYNTAX)
RUN cat > /etc/nginx/nginx.conf <<EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 16M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

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
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot )$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Security: Deny access to hidden files
        location ~ /\. {
            deny all;
        }
    }
}
EOF

# Create health check script
RUN echo '#!/bin/sh' > /usr/local/bin/health-check.sh && \
    echo 'curl -f http://localhost/health || exit 1' >> /usr/local/bin/health-check.sh && \
    chmod +x /usr/local/bin/health-check.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /usr/local/bin/health-check.sh

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
