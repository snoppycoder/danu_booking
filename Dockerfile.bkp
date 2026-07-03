# ==========================================
# Stage 1: Install dependencies
# ==========================================
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package managers
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
# Install dependencies based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ==========================================
# Stage 2: Build the application
# ==========================================
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run the build command (Make sure 'output: standalone' is still in your next.config.js!)
RUN npm run build

# ==========================================
# Stage 3: Production Server
# ==========================================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static files
COPY --from=builder /app/public ./public

# Set permissions for the cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone output and static files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]