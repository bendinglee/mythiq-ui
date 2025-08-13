# Stage 1 — build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy manifest & install deps (including devDeps for build)
COPY package*.json ./
RUN npm ci

# Copy the rest of your project & build
COPY . .
RUN npm run build

# Stage 2 — serve
FROM node:18-alpine AS runner
WORKDIR /app

# Install 'serve' globally for static hosting
RUN npm install -g serve

# Copy built output from builder stage
COPY --from=builder /app/dist ./dist

# Port Railway will bind automatically
ENV PORT=8080

# Expose for local runs if needed
EXPOSE $PORT

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
