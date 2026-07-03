# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments – supply them with docker build --build-arg
ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_API_KEY

# These NEXT_PUBLIC_* variables are embedded into the client bundle
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_KEY=${NEXT_PUBLIC_API_KEY}

# Install dependencies (layer caching)
COPY package.json pnpm-lock.yaml* package-lock.json* ./
# Use pnpm if you have pnpm-lock, otherwise npm ci
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy all source files and build
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only the standalone server, static files, and public assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

USER node
CMD ["node", "server.js"]
