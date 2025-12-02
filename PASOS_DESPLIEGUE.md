# 🚀 Pasos para Desplegar en Render - Guía Rápida

## ✅ Paso 1: Preparar y Subir a GitHub

### 1.1 Inicializar Git (si no lo has hecho)
```bash
git init
git add .
git commit -m "Proyecto CRUD listo para Render"
```

### 1.2 Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Crea un nuevo repositorio (público o privado)
3. **NO** inicialices con README, .gitignore o licencia

### 1.3 Conectar y subir
```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con tus datos reales**

---

## 🗄️ Paso 2: Crear Base de Datos PostgreSQL en Render

1. Ve a https://dashboard.render.com
2. Haz clic en **"New +"** → **"PostgreSQL"**
3. Configura:
   - **Name**: `crud-db`
   - **Database**: `crud_db`
   - **User**: (se genera automáticamente)
   - **Region**: Elige la más cercana (ej: `Oregon (US West)`)
   - **PostgreSQL Version**: `15`
   - **Plan**: Free (para empezar)
4. Haz clic en **"Create Database"**
5. ⚠️ **IMPORTANTE**: Espera a que se cree y luego:
   - Ve a la pestaña **"Info"**
   - Copia la **"Internal Database URL"** (algo como: `postgresql://user:pass@dpg-xxxxx-a/crud_db`)
   - **Guárdala**, la necesitarás en el siguiente paso

---

## 🔧 Paso 3: Crear Servicio API (Backend)

1. En Render Dashboard, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub:
   - Si es la primera vez, autoriza Render
   - Selecciona tu repositorio
3. Configura el servicio:
   - **Name**: `api-service`
   - **Region**: La misma que la base de datos
   - **Branch**: `main`
   - **Root Directory**: `api-service` ⚠️ **IMPORTANTE**
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile` (o déjalo vacío si está en la raíz de api-service)
4. **Variables de Entorno**:
   - Haz clic en **"Add Environment Variable"**
   - **Key**: `DATABASE_URL`
   - **Value**: Pega la **Internal Database URL** que copiaste en el Paso 2
   - Haz clic en **"Add"**
5. Haz clic en **"Create Web Service"**
6. ⚠️ **IMPORTANTE**: Espera a que el servicio se despliegue (5-10 minutos)
7. Una vez desplegado, copia la URL del servicio:
   - Ejemplo: `https://api-service-xxxx.onrender.com`
   - **Guárdala**, la necesitarás para Nginx

---

## 📝 Paso 4: Actualizar nginx.conf con la URL del API

1. Abre el archivo `nginx/nginx.conf` en tu editor
2. Busca la línea que dice:
   ```nginx
   proxy_pass https://TU_API_RENDER_URL/;
   ```
3. Reemplaza `TU_API_RENDER_URL` con la URL real que copiaste en el Paso 3
   - Ejemplo: `https://api-service-xxxx.onrender.com`
   - Debe quedar así:
   ```nginx
   proxy_pass https://api-service-xxxx.onrender.com/;
   ```
4. Guarda el archivo
5. Haz commit y push:
   ```bash
   git add nginx/nginx.conf
   git commit -m "Actualizar URL del API en nginx.conf"
   git push
   ```

---

## 🌐 Paso 5: Crear Servicio Nginx (Gateway)

1. En Render Dashboard, haz clic en **"New +"** → **"Web Service"**
2. Selecciona el mismo repositorio de GitHub
3. Configura el servicio:
   - **Name**: `nginx-gateway`
   - **Region**: La misma que los otros servicios
   - **Branch**: `main`
   - **Root Directory**: `nginx` ⚠️ **IMPORTANTE**
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile` (o déjalo vacío)
4. ⚠️ **CRÍTICO - Configurar Build Context**:
   - Haz clic en **"Advanced"** o busca la sección de configuración avanzada
   - Busca **"Build Command"** o **"Build Context"**
   - Si Render permite cambiar el build context, cámbialo a: `.` (punto, raíz del proyecto)
   - Si NO hay opción de build context, el Dockerfile ya está configurado para intentar copiar desde `../frontend`
   - **Alternativa**: Si falla el build, verás el error en los logs y podrás ajustar
5. **Variables de Entorno**: No se requieren para Nginx
6. Haz clic en **"Create Web Service"**
7. Espera a que se despliegue (10-15 minutos, ya que construye el frontend)

---

## ✅ Paso 6: Verificar que Todo Funcione

1. Una vez que ambos servicios estén desplegados (estado "Live"):
   - Ve a la URL del servicio Nginx (ej: `https://nginx-gateway-xxxx.onrender.com`)
2. Deberías ver:
   - ✅ El frontend React cargando
   - ✅ La tabla de usuarios (probablemente vacía)
   - ✅ El formulario para agregar usuarios
3. Prueba:
   - ✅ Crear un usuario nuevo
   - ✅ Editar un usuario
   - ✅ Eliminar un usuario
   - ✅ Ver la lista de usuarios

---

## 🐛 Si Algo Sale Mal

### El frontend no se construye en Nginx
- **Solución**: Revisa los logs del build en Render
- Si el error es "frontend not found", el build context no está bien configurado
- Intenta cambiar el Root Directory a `.` (raíz) y el Dockerfile Path a `nginx/Dockerfile`

### El API no se conecta a la base de datos
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de usar la **Internal Database URL** (no la externa)
- Revisa los logs del servicio API

### Nginx no puede hacer proxy al API
- Verifica que la URL en `nginx.conf` sea correcta
- Asegúrate de que el servicio API esté desplegado y funcionando
- Revisa los logs de Nginx

### CORS errors en el navegador
- El `server.js` ya tiene CORS habilitado
- Si persiste, verifica que las URLs sean correctas

---

## 📋 Checklist Final

Antes de considerar el despliegue completo, verifica:

- [ ] Código subido a GitHub
- [ ] Base de datos PostgreSQL creada en Render
- [ ] Servicio API creado y desplegado
- [ ] Variable `DATABASE_URL` configurada en el API
- [ ] `nginx.conf` actualizado con la URL real del API
- [ ] Cambios de `nginx.conf` subidos a GitHub
- [ ] Servicio Nginx creado y desplegado
- [ ] Frontend visible en la URL de Nginx
- [ ] CRUD funcionando (crear, leer, actualizar, eliminar usuarios)

---

## 🎉 ¡Listo!

Si todo funciona, tu aplicación CRUD está desplegada y accesible públicamente a través de Nginx.

**URL de acceso**: `https://nginx-gateway-xxxx.onrender.com`

