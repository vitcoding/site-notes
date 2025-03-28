FROM node:16-alpine as build

WORKDIR /app

COPY package.json .
RUN npm install

# Copy all files except those in .dockerignore
COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]