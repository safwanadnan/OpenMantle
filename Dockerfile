FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY packages/sdk/package.json ./packages/sdk/package.json
RUN npm install
COPY tsconfig.json drizzle.config.ts ./
COPY src ./src
COPY test ./test
COPY drizzle ./drizzle
COPY docs ./docs
COPY packages ./packages
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY packages/sdk/package.json ./packages/sdk/package.json
RUN npm install --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/docs ./docs
USER node
CMD ["node", "dist/src/api.js"]
