# Proyecto CRUD - Arquitectura de 3 Servicios

Aplicación CRUD completa con arquitectura de microservicios usando Docker y desplegada en Render.com.

## 🏗️ Arquitectura

- **NGINX Gateway**: Servidor web que sirve el frontend y hace proxy al API
- **API Service**: Backend Node.js/Express con endpoints CRUD
- **PostgreSQL**: Base de datos para almacenar usuarios

## 📁 Estructura del Proyecto

```
proyecto-crud/
├── api-service/          # Servicio API (Node.js/Express)
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── nginx/                # Servicio Gateway (Nginx)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── build.sh          # Script alternativo
├── frontend/             # Frontend React con Vite
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml    # Para desarrollo local
└── DESPLIEGUE_RENDER.md  # Guía completa de despliegue
```

## 🚀 Desarrollo Local

### Requisitos

- Docker y Docker Compose
- Node.js (para desarrollo del frontend)

### Ejecutar con Docker Compose

```bash
docker-compose up --build
```

La aplicación estará disponible en:

- Frontend y API: http://localhost

### Desarrollo del Frontend (sin Docker)

```bash
cd frontend
npm install
npm run dev
```

## 📦 Despliegue en Render.com

Consulta la guía completa en [DESPLIEGUE_RENDER.md](./DESPLIEGUE_RENDER.md)

### Resumen rápido:

1. **Subir código a GitHub**
2. **Crear PostgreSQL** en Render (copiar Internal Database URL)
3. **Crear Servicio API**:
   - Root Directory: `api-service`
   - Environment: Docker
   - Variable: `DATABASE_URL` = Internal Database URL
4. **Actualizar nginx.conf** con la URL del servicio API
5. **Crear Servicio Nginx**:
   - Root Directory: `nginx`
   - Environment: Docker
   - **Build Context**: Raíz del proyecto (configurar en Advanced)

## 🔧 Configuración

### Variables de Entorno

#### API Service

- `DATABASE_URL`: URL de conexión a PostgreSQL (proporcionada por Render)
- `PORT`: Puerto del servidor (asignado automáticamente por Render)

#### Nginx

- No requiere variables de entorno

## 📝 Endpoints API

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario por ID
- `POST /api/users` - Crear un usuario
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL (pg)
- **Gateway**: Nginx
- **Contenedores**: Docker
- **Despliegue**: Render.com

## 📚 Documentación

- [Guía de Despliegue en Render](./DESPLIEGUE_RENDER.md)
- [Frontend README](./frontend/README.md)
