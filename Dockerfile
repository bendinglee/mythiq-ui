# -------- Stage 1: Build the app --------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy manifest & lockfile first for better layer caching
COPY package*.json ./

# Install deps exactly as locked
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# -------- Stage 2: Serve with Nginx --------
FROM nginx:alpine

# Copy build output to Nginx HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional SPA-friendly routing config (uncomment COPY line if using nginx.conf)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Railway's dynamic port mapping
ENV PORT=8080
EXPOSE 8080

# Map Nginx's port to Railway's $PORT on container start
CMD ["sh", "-c", "sed -i \"s/listen       80;/listen       ${PORT};/\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
