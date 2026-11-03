# 1) Install dependencies
FROM public.ecr.aws/docker/library/node:22-alpine AS deps

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .
ARG NODE_ENV=production
RUN npm run build --if-present && npm prune --production

# 2) Build / prepare runtime image
FROM public.ecr.aws/docker/library/node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/.next .next
COPY --from=deps /app/node_modules node_modules
COPY --from=deps /app/package*.json ./

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
