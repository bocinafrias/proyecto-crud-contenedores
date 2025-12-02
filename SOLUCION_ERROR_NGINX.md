# 🔧 Solución al Error: "/nginx.conf": not found

## El Problema

El error indica que Render está usando **Root Directory = `nginx`** en lugar de **Root Directory = `.`** (raíz).

Cuando Root Directory = `nginx`:
- El build context solo ve archivos dentro de `nginx/`
- El Dockerfile intenta copiar `nginx.conf` pero no lo encuentra en el contexto
- No puede acceder a `../frontend/` porque Docker no permite salir del contexto

## ✅ Solución: Cambiar Root Directory en Render

### Paso 1: Editar el Servicio Nginx en Render

1. Ve a tu servicio Nginx en Render Dashboard
2. Haz clic en **"Settings"** (Configuración)
3. Busca la sección **"Build & Deploy"**
4. Encuentra **"Root Directory"**
5. Cambia de `nginx` a `.` (punto, significa raíz del proyecto)
6. Guarda los cambios
7. Render hará un nuevo deploy automáticamente

### Paso 2: Verificar Dockerfile Path

Asegúrate de que **"Dockerfile Path"** sea: `nginx/Dockerfile`

### Configuración Correcta:

```
Root Directory: .          ← CAMBIAR A ESTO
Dockerfile Path: nginx/Dockerfile
```

---

## 🔄 Si Render NO Permite Cambiar Root Directory

Si Render no te permite cambiar el Root Directory después de crear el servicio:

### Opción A: Recrear el Servicio

1. Elimina el servicio Nginx actual
2. Crea uno nuevo con:
   - **Root Directory**: `.` (punto)
   - **Dockerfile Path**: `nginx/Dockerfile`

### Opción B: Modificar Dockerfile para Root Directory = nginx

Si definitivamente no puedes cambiar el Root Directory, necesitas modificar el Dockerfile:

1. El frontend debe estar disponible dentro de `nginx/` antes del build
2. Esto requiere copiar el frontend a `nginx/` antes de hacer push a GitHub

**Pero esto no es recomendable** porque duplicaría código.

---

## ✅ Solución Recomendada Final

**La mejor solución es usar Root Directory = `.`**

El Dockerfile actual ya está configurado para esto:
- Copia desde `frontend/` (porque el contexto es la raíz)
- Copia desde `nginx/nginx.conf` (porque el contexto es la raíz)

Solo necesitas asegurarte de que en Render esté configurado así.

---

## 📝 Resumen de Pasos

1. ✅ Ve a Render Dashboard → Tu servicio Nginx → Settings
2. ✅ Cambia **Root Directory** de `nginx` a `.` (punto)
3. ✅ Verifica que **Dockerfile Path** sea `nginx/Dockerfile`
4. ✅ Guarda y espera el nuevo deploy
5. ✅ El build debería funcionar ahora

---

## 🐛 Si el Error Persiste

Si después de cambiar a Root Directory = `.` sigue fallando:

1. Verifica que el archivo `nginx/nginx.conf` exista en tu repositorio
2. Verifica que el archivo `nginx/Dockerfile` tenga la línea correcta:
   ```dockerfile
   COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
   ```
3. Revisa los logs completos del build en Render para ver el error exacto

