# ビルドステージ
FROM node:20.18.0 AS builder

WORKDIR /app

COPY package*.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY src ./src
COPY public ./public

RUN npm ci
RUN npm run build

FROM node:20.18.0-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./

EXPOSE 1234

CMD ["npm", "start"]