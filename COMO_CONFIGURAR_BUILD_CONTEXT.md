# 🔧 Cómo Configurar el Build Context en Render para Nginx

## El Problema

El Dockerfile de Nginx necesita acceder a la carpeta `frontend/` que está en la raíz del proyecto, pero si el Root Directory es `nginx`, el build context solo ve archivos dentro de `nginx/`.

## ✅ Solución 1: Cambiar Root Directory (RECOMENDADA)

### Pasos en Render:

1. Al crear el servicio Nginx, en la sección de configuración:
   - **Root Directory**: Cambia de `nginx` a `.` (punto)
   - **Dockerfile Path**: `nginx/Dockerfile`
2. Esto hace que:
   - El build context sea la **raíz del proyecto**
   - El Dockerfile pueda acceder a `frontend/` y `nginx/`
   - Todo funcione correctamente

### Visualización:

```
Root Directory: . (raíz)
├── frontend/          ← Accesible ✅
├── nginx/
│   ├── Dockerfile    ← Se usa este
│   └── nginx.conf
└── api-service/
```

---

## ✅ Solución 2: Si Render no acepta "." como Root Directory

Si Render no te permite usar `.` como Root Directory, usa esta alternativa:

### Opción A: Ajustar el Dockerfile para contexto nginx/

1. **Root Directory**: `nginx` (deja como está)
2. **Dockerfile Path**: `Dockerfile`

3. Modifica `nginx/Dockerfile` para que intente copiar desde `../frontend`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
# Intentar copiar desde el contexto padre
COPY ../frontend/package*.json ./ || true
COPY ../frontend/ ./ || true

# Si lo anterior falla, Render puede estar usando un contexto diferente
# En ese caso, necesitarás la Opción B
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
```

**Nota**: Esto puede no funcionar porque Docker no permite `../` fuera del contexto.

---

### Opción B: Build Command Personalizado (MEJOR ALTERNATIVA)

1. En Render, cuando crees el servicio Nginx:

   - **Root Directory**: `nginx`
   - **Dockerfile Path**: `Dockerfile`
   - **Build Command**: (déjalo vacío o usa el predeterminado)

2. **Modifica el Dockerfile** para que copie el frontend desde un script:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copiar script de preparación
COPY prepare-build.sh ./
RUN chmod +x prepare-build.sh
RUN ./prepare-build.sh

# Ahora el frontend debería estar en ./frontend-build
COPY frontend-build/package*.json ./
COPY frontend-build/ ./
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
```

3. Crea `nginx/prepare-build.sh`:

```bash
#!/bin/sh
# Este script se ejecuta durante el build
# Copia el frontend desde la raíz del proyecto

echo "Preparando frontend para build..."

# Si estamos en nginx/, subir un nivel y copiar frontend
if [ -d "../frontend" ]; then
    cp -r ../frontend ./frontend-build
    echo "Frontend copiado exitosamente"
else
    echo "ERROR: No se encontró ../frontend"
    exit 1
fi
```

**Problema**: Esto tampoco funcionará porque el build context de Docker no puede acceder fuera de `nginx/`.

---

### ✅ Opción C: La MEJOR Solución Real

**Duplicar el frontend en nginx/ antes de hacer push a GitHub:**

1. Crea un script que copie el frontend a nginx antes del build
2. O mejor aún, modifica el Dockerfile para que funcione con el frontend dentro de nginx/

**Pero la MEJOR solución es usar Root Directory = "."**

---

## 🎯 Solución Final Recomendada

### Si Render te permite usar "." como Root Directory:

1. **Root Directory**: `.` (punto)
2. **Dockerfile Path**: `nginx/Dockerfile`
3. ✅ **Funciona perfectamente**

### Si NO te permite:

1. **Root Directory**: `nginx`
2. **Dockerfile Path**: `Dockerfile`
3. **Modifica `nginx/Dockerfile`** para usar esta versión:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# En Render, el build context es nginx/, así que necesitamos
# que el frontend esté disponible de otra forma
# Opción: usar un volumen o copiar antes del build

# Por ahora, intentemos copiar desde el contexto
# Si el frontend está en la raíz del repo, Render debería
# permitir accederlo si configuramos bien

COPY ../frontend/package*.json ./
COPY ../frontend/ ./

RUN npm install
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
```

**Pero esto fallará** porque Docker no permite `../` fuera del contexto.

---

## 💡 La Solución Real que Funciona

**Opción más simple**: Cambiar la estructura temporalmente o usar un script de build.

**Pero la MEJOR opción es**:

- Usar **Root Directory = "."** si Render lo permite
- Si no, contactar a Render o usar un workaround

---

## 📝 Resumen de Pasos en Render

1. Ve a crear el servicio Nginx
2. En **Root Directory**, intenta poner: `.` (punto)
3. En **Dockerfile Path**, pon: `nginx/Dockerfile`
4. Si Render te da error, prueba dejando Root Directory vacío
5. Si aún falla, usa Root Directory = `nginx` y ajusta el Dockerfile

---

## 🆘 Si Nada Funciona

Si ninguna de estas opciones funciona, la solución más segura es:

1. **Crear un script de build** que Render ejecute antes del Docker build
2. **O mover el frontend** dentro de `nginx/` temporalmente
3. **O usar un servicio separado** para el frontend

Pero lo más probable es que **Root Directory = "."** funcione en Render.
