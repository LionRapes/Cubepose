FROM node:24-alpine AS base
WORKDIR /app
COPY package.json ./

#DEVELOPMENT
FROM base AS development
ENV NODE_ENV=development
ENV PORT=5173
RUN npm i
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# BUILD
FROM base AS build
RUN npm ci 
COPY . .
ENV NODE_ENV=production
RUN npm run build

# PRODUCTION
FROM nginx:alpine AS production
ENV PORT=80
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



