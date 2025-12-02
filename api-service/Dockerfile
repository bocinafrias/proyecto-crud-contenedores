# Imagen base de Node.js
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar primero package.json y package-lock.json
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install --production

# Copiar todo el código restante
COPY . .

# Exponer puerto interno
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "server.js"]
