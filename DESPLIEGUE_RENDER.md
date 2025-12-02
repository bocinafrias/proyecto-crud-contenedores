# Guía de Despliegue en Render.com

Esta guía explica cómo desplegar la aplicación CRUD completa en Render.com con 3 servicios independientes.

## 📋 Requisitos Previos

1. Cuenta en [Render.com](https://render.com)
2. Código subido a un repositorio en GitHub
3. Acceso al repositorio desde Render

## 🏗️ Arquitectura

La aplicación consta de 3 servicios:

1. **NGINX Gateway** - Servicio Web (puerto 80)

   - Sirve el frontend React
   - Hace proxy de `/api/*` al servicio API

2. **API Service** - Servicio Web (puerto 3000)

   - Backend Node.js/Express
   - Endpoints CRUD para usuarios

3. **PostgreSQL** - Base de datos administrada
   - Almacena los datos de usuarios

## 📦 Paso 1: Subir código a GitHub

1. Inicializa un repositorio Git (si no lo has hecho):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Crea un repositorio en GitHub y súbelo:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

## 🗄️ Paso 2: Crear Base de Datos PostgreSQL

1. En Render Dashboard, haz clic en **"New +"** → **"PostgreSQL"**
2. Configura:
   - **Name**: `crud-db` (o el nombre que prefieras)
   - **Database**: `crud_db`
   - **User**: Se genera automáticamente
   - **Region**: Elige la más cercana
   - **PostgreSQL Version**: 15
3. Haz clic en **"Create Database"**
4. **IMPORTANTE**: Copia la **Internal Database URL** (la necesitarás para el servicio API)

## 🔧 Paso 3: Crear Servicio API

1. En Render Dashboard, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura el servicio:
   - **Name**: `api-service` (o el nombre que prefieras)
   - **Region**: La misma que la base de datos
   - **Branch**: `main` (o la rama que uses)
   - **Root Directory**: `api-service`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `api-service/Dockerfile` (o solo `Dockerfile` si el root es `api-service`)
4. **Variables de Entorno**:
   - `DATABASE_URL`: Pega la **Internal Database URL** que copiaste del paso 2
   - `PORT`: `3000` (Render lo asigna automáticamente, pero puedes dejarlo)
5. Haz clic en **"Create Web Service"**
6. **IMPORTANTE**: Copia la URL del servicio API (ej: `https://api-service-xxxx.onrender.com`)

## 🌐 Paso 4: Configurar Nginx y Actualizar nginx.conf

1. Antes de crear el servicio Nginx, actualiza `nginx/nginx.conf`:
   - Abre `nginx/nginx.conf`
   - Reemplaza `TU_API_RENDER_URL` con la URL real del servicio API que copiaste
   - Ejemplo:
     ```nginx
     location /api/ {
         proxy_pass https://api-service-xxxx.onrender.com/;
         ...
     }
     ```
2. Haz commit y push de este cambio:
   ```bash
   git add nginx/nginx.conf
   git commit -m "Actualizar URL del API en nginx.conf"
   git push
   ```

## 🚀 Paso 5: Crear Servicio Nginx

1. En Render Dashboard, haz clic en **"New +"** → **"Web Service"**
2. Selecciona el mismo repositorio
3. Configura el servicio:
   - **Name**: `nginx-gateway` (o el nombre que prefieras)
   - **Region**: La misma que los otros servicios
   - **Branch**: `main`
   - **Root Directory**: `nginx`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `nginx/Dockerfile` (o solo `Dockerfile` si el root es `nginx`)
4. **IMPORTANTE - Build Context**:
   - En la configuración avanzada, asegúrate de que el **Build Context** sea la **raíz del proyecto** (no `nginx`)
   - Esto permite que el Dockerfile acceda a la carpeta `frontend/`
5. **Variables de Entorno**: No se requieren para Nginx
6. Haz clic en **"Create Web Service"**

### ⚠️ Nota sobre Build Context en Render

Si Render no permite cambiar el build context desde la UI, puedes:

**Opción A**: Crear un script de build

- Crear `nginx/build.sh` que copie el frontend antes del build

**Opción B**: Ajustar la estructura

- Mover el frontend dentro de nginx/ temporalmente

**Opción C**: Usar el build context raíz

- En Render, cuando configures el servicio Nginx, en "Advanced" busca la opción de Build Context y cámbiala a la raíz del proyecto.

## ✅ Paso 6: Verificar el Despliegue

1. Espera a que ambos servicios terminen de desplegarse (puede tomar varios minutos)
2. Accede a la URL del servicio Nginx (ej: `https://nginx-gateway-xxxx.onrender.com`)
3. Deberías ver el frontend React funcionando
4. Prueba crear, editar y eliminar usuarios

## 🔄 Flujo de Solicitudes

```
Usuario → https://nginx-gateway-xxxx.onrender.com
         ↓
    NGINX (puerto 80)
         ↓
    / → Frontend React (servido por Nginx)
    /api/* → Proxy a → https://api-service-xxxx.onrender.com
                          ↓
                    API Node.js (puerto 3000)
                          ↓
                    PostgreSQL (Internal Database URL)
```

## 🐛 Solución de Problemas

### El frontend no se construye en Nginx

- Verifica que el Build Context en Render esté configurado como la raíz del proyecto
- Revisa los logs del build en Render para ver errores específicos

### El API no se conecta a la base de datos

- Verifica que la variable `DATABASE_URL` esté configurada correctamente
- Asegúrate de usar la **Internal Database URL** (no la externa)
- Revisa los logs del servicio API

### Nginx no puede hacer proxy al API

- Verifica que la URL en `nginx.conf` sea correcta
- Asegúrate de que el servicio API esté desplegado y funcionando
- Revisa los logs de Nginx

### CORS errors

- El `api-service/server.js` ya tiene CORS habilitado, pero si hay problemas, verifica que el origen permitido sea correcto

## 📝 Estructura de Carpetas para Render

```
proyecto-crud/
├── api-service/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
└── docker-compose.yml (solo para desarrollo local)
```

## 🔐 Variables de Entorno Requeridas

### Servicio API

- `DATABASE_URL`: URL interna de la base de datos PostgreSQL (proporcionada por Render)
- `PORT`: Puerto asignado automáticamente por Render (opcional)

### Servicio Nginx

- No requiere variables de entorno

## 📚 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Docker en Render](https://render.com/docs/docker)
- [PostgreSQL en Render](https://render.com/docs/databases)
