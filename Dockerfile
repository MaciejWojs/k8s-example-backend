FROM oven/bun:1.3.14-alpine AS builder

WORKDIR /workdir

COPY bun.lock package.json /workdir/

RUN bun install --ignore-scripts --frozen-lockfile || bun install --ignore-scripts

COPY . /workdir

RUN bun run minify

FROM oven/bun:1.3.14-alpine

WORKDIR /app

RUN apk add --no-cache curl  
COPY --from=builder /workdir/.dist /app/.dist
COPY --from=builder /workdir/package.json /app/
# COPY --from=builder /workdir/prisma /app/prisma
# COPY --from=builder /workdir/prisma.config.ts /app/

EXPOSE 3000

CMD ["bun", "run", "prod"]
