# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverage caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-privileged user for security
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
USER nextjs

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/index.js"]
