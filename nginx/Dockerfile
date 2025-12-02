FROM node:18-alpine as build

# Construir frontend
WORKDIR /app
# Copiar desde el contexto raíz (ajustar según el build context en Render)
COPY frontend/package*.json ./
COPY frontend/ ./
RUN npm install
RUN npm run build

# Etapa NGINX
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar frontend generado
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
