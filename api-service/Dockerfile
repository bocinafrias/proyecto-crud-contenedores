# Imagen base de Node.js
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar todo el código (incluyendo package.json)
# Esto asegura que todos los archivos estén disponibles
COPY . .

# Instalar dependencias
RUN npm install --production

# Exponer puerto interno
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "server.js"]
