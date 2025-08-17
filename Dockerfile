# Minimal Dockerfile for Mythiq-UI - Fixed for Railway deployment
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with force flag
RUN npm install --force

# Copy source code
COPY . .

# Build the application and verify output
RUN npm run build && \
    echo "Build completed. Contents of dist:" && \
        ls -la dist/ && \
            echo "Total build size:" && \
                du -sh dist/

                # Production stage
                FROM nginx:alpine

                # Copy built files to nginx html directory
                COPY --from=builder /app/dist /usr/share/nginx/html

                # Create a simple nginx configuration for SPA
                RUN echo 'server { \
                    listen 80; \
                        server_name _; \
                            root /usr/share/nginx/html; \
                                index index.html; \
                                    location / { \
                                            try_files $uri $uri/ /index.html; \
                                                } \
                                                }' > /etc/nginx/conf.d/default.conf

                                                # Verify files are copied correctly
                                                RUN echo "Files in nginx html directory:" && \
                                                    ls -la /usr/share/nginx/html/

                                                    EXPOSE 80

                                                    CMD ["nginx", "-g", "daemon off;"]
