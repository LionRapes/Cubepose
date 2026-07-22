FROM node:24-alpine AS base
ARG NODE_ENV
ARG PORT
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
WORKDIR /app
COPY package*.json ./
RUN npm i --package-lock-only



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
FROM nginx:alpine AS production
ARG PORT
ENV PORT=$PORT
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]



