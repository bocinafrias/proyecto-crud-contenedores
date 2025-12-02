# Proyecto CRUD - Arquitectura de 3 Servicios

Aplicación CRUD completa con arquitectura de microservicios usando Docker.

## 🏗️ Arquitectura

- **NGINX Gateway**: Servidor web que sirve el frontend y hace proxy al API
- **API Service**: Backend Node.js/Express con endpoints CRUD
- **PostgreSQL**: Base de datos para almacenar usuarios

## 📁 Estructura del Proyecto

```
proyecto-crud/
├── api-service/          # Servicio API (Node.js/Express)
├── nginx/                # Servicio Gateway (Nginx)
├── frontend/             # Frontend React con Vite
└── docker-compose.yml    # Para desarrollo local
```

## 🚀 Desarrollo Local

```bash
docker-compose up --build
```

La aplicación estará disponible en: http://localhost

## 📝 Endpoints API

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario por ID
- `POST /api/users` - Crear un usuario
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL
- **Gateway**: Nginx
- **Contenedores**: Docker
