# 🔍 Diagnóstico del Error 502

## Pasos para Diagnosticar

### 1. Verificar que el Servicio API esté funcionando

Abre directamente la URL del API en tu navegador:
```
https://proyecto-crud-contenedores-1.onrender.com/api/users
```

**Si funciona**: Deberías ver `[]` (array vacío) o una lista de usuarios en JSON.

**Si NO funciona**: El problema está en el servicio API, no en Nginx.

### 2. Verificar la URL correcta del API

En Render Dashboard:
1. Ve a tu servicio API
2. Copia la URL exacta (debería ser algo como `https://api-service-xxxx.onrender.com`)
3. Verifica que sea la URL correcta en `nginx.conf`

### 3. Verificar Logs en Render

**Logs de Nginx:**
1. Ve a tu servicio Nginx en Render
2. Ve a la pestaña "Logs"
3. Intenta crear un usuario
4. Revisa los errores que aparecen

**Logs del API:**
1. Ve a tu servicio API en Render
2. Ve a la pestaña "Logs"
3. Verifica que el servicio esté corriendo y respondiendo

### 4. Probar el API directamente

Abre la consola del navegador (F12) y ejecuta:
```javascript
// Probar GET
fetch('https://proyecto-crud-contenedores-1.onrender.com/api/users')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Probar POST
fetch('https://proyecto-crud-contenedores-1.onrender.com/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Test', correo: 'test@test.com' })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Si estos funcionan directamente pero no a través de Nginx, el problema está en la configuración del proxy.

