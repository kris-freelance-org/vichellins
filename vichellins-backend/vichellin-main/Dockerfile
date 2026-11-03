# 1) Install dependencies
FROM public.ecr.aws/docker/library/node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

# 2) Build / prepare runtime image
FROM public.ecr.aws/docker/library/node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=staging
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5050
CMD ["npm", "run",  "serve"]
