# -------- Stage 1: Build the app --------
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# -------- Stage 2: Serve with Nginx --------
FROM nginx:alpine

# Copy build output to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Replace default Nginx config (tweak if needed for SPA routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Railway expects the app to bind to $PORT — map it to Nginx default (80)
ENV PORT=8080
EXPOSE 8080

# Update Nginx's default port to match Railway's $PORT
CMD ["sh", "-c", "sed -i \"s/listen       80;/listen       ${PORT};/\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
