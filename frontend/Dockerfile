FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=/api
ENV VITE_KEYCLOAK_URL=http://localhost:8080
ENV VITE_KEYCLOAK_REALM=hypesoft
ENV VITE_KEYCLOAK_CLIENT_ID=hypesoft-frontend
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
