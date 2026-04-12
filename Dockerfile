FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ENV NEXT_PUBLIC_SUPABASE_URL=https://aytbujigrvjwdmgxzlyk.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dGJ1amlncnZqd2RtZ3h6bHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTY4NjQsImV4cCI6MjA4Nzc5Mjg2NH0.kbXnOQoas7yD8jdmgLStHRixgZczL7wv-ILElD1xfwo

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 1. standalone server (server.js + node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 2. static assets (CSS/JS) — MUST be at .next/static relative to server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 3. public folder (favicon, images)
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]
