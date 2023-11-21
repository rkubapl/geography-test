###############
# build stage #
###############

FROM node:18-alpine AS build

ARG NODE_ENV="development"

WORKDIR /app

COPY src ./src
COPY package.json package-lock.json tsconfig.json ./

# installs both production and dev dependencies
RUN npm ci

RUN npm run build

###############
# final stage #
###############

FROM node:18-alpine

ARG NODE_ENV="production"

COPY package.json package-lock.json ./

# installs only production dependencies
RUN npm ci

COPY --from=build /app/dist ./dist

USER node

CMD ["node", "dist/index.js"]