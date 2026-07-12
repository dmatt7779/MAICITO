# =============================================
# UBI Frontend Admin - Multi-stage Dockerfile
# =============================================

# ── Development target ──
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ── Build stage ──
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Production target ──
# Imagen NO-root: nginx-unprivileged corre como uid 101 y escucha en 8080
# (puerto no privilegiado). El host sigue publicando el 80 (ver compose).
FROM nginxinc/nginx-unprivileged:alpine AS prod

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
