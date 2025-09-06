# Use Node.js 20-alpine for compatibility with tsx and your engines field
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Update and enable Corepack
RUN npm install -g corepack@latest

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone

# Update and enable Corepack
RUN npm install -g corepack@latest

# Build with secrets as environment variables
RUN \
  --mount=type=secret,id=DATABASE_URI,env=DATABASE_URI \
  --mount=type=secret,id=NEXT_PUBLIC_SERVER_URL,env=NEXT_PUBLIC_SERVER_URL \
  --mount=type=secret,id=PAYLOAD_SECRET,env=PAYLOAD_SECRET \
  --mount=type=secret,id=S3_ENABLED,env=S3_ENABLED \
  --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
  --mount=type=secret,id=NEXT_PUBLIC_IS_LIVE,env=NEXT_PUBLIC_IS_LIVE \
  --mount=type=secret,id=NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,env=NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
  --mount=type=secret,id=NEXT_PUBLIC_UPLOAD_PREFIX,env=NEXT_PUBLIC_UPLOAD_PREFIX \
  --mount=type=secret,id=NEXT_PUBLIC_USAEPAY_KEY,env=NEXT_PUBLIC_USAEPAY_KEY \
  --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN,env=NEXT_PUBLIC_SENTRY_DSN \
  --mount=type=secret,id=PREVIEW_SECRET,env=PREVIEW_SECRET \
  --mount=type=secret,id=S3_ACCESS_KEY_ID,env=S3_ACCESS_KEY_ID \
  --mount=type=secret,id=S3_SECRET_ACCESS_KEY,env=S3_SECRET_ACCESS_KEY \
  --mount=type=secret,id=S3_REGION,env=S3_REGION \
  --mount=type=secret,id=S3_ENDPOINT,env=S3_ENDPOINT \
  --mount=type=secret,id=S3_BUCKET,env=S3_BUCKET \
  --mount=type=secret,id=NEXT_PUBLIC_S3_HOSTNAME,env=NEXT_PUBLIC_S3_HOSTNAME \
  --mount=type=secret,id=UNSPLASH_ACCESS_KEY,env=UNSPLASH_ACCESS_KEY \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Runtime environment variables will be provided by docker-compose or deployment platform

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

