FROM node:24-alpine AS base
ARG NODE_ENV
ARG PORT
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
WORKDIR /app
COPY package*.json ./



#DEVELOPMENT
FROM base AS development
RUN npm install
COPY . .
EXPOSE $PORT
CMD ["npm", "run", "dev"]


#BUILD
FROM base AS build
RUN npm ci --include=dev
COPY . .
RUN npm run build


#PRODUCTION
FROM node:24-alpine AS production
ARG PORT
ENV PORT=$PORT
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --only=production
EXPOSE $PORT
CMD ["npm", "run", "start"]


