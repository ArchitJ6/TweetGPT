# -------------------
# Build Stage
# -------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files and install only what's needed
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app (output goes to /app/dist)
RUN npm run build


# -------------------
# Production Stage
# -------------------
FROM nginx:stable-alpine AS production

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Vite app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Copy custom nginx config (see below)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (default for nginx)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
