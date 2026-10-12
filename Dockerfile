FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install --global pnpm@11.20.0

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
ENV CI=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN \
  --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
  --mount=type=secret,id=NEXT_PUBLIC_SERVER_URL,env=NEXT_PUBLIC_SERVER_URL \
  --mount=type=secret,id=NEXT_PUBLIC_IS_LIVE,env=NEXT_PUBLIC_IS_LIVE \
  --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN,env=NEXT_PUBLIC_SENTRY_DSN \
  pnpm build

FROM node:24-alpine AS runner
RUN apk add --no-cache libc6-compat sqlite
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV DATABASE_URI=file:/app/data/payload.db
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 website \
  && mkdir -p /app/public/media /app/data && chown -R website:nodejs /app/public /app/data
COPY --from=builder --chown=website:nodejs /app/.output ./.output
USER website
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
