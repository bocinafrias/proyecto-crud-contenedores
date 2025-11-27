# Imagen base de Node.js
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar todo el código
COPY . .

# Exponer puerto interno
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "server.js"]
