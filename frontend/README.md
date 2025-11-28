# Frontend CRUD Usuarios

Frontend en React con Vite para gestionar usuarios, conectado a la API en Render.

## Características

- ✅ Tabla para mostrar usuarios
- ✅ Formulario para agregar usuario
- ✅ Botón para editar usuario
- ✅ Botón para eliminar usuario
- ✅ Conexión con fetch
- ✅ Estilos con TailwindCSS

## Instalación

### Requisitos previos

**IMPORTANTE**: Necesitas tener Node.js instalado en tu sistema. Si no lo tienes:

1. Descarga Node.js desde: https://nodejs.org/ (versión LTS recomendada)
2. Instala el paquete y asegúrate de marcar "Add to PATH"
3. Reinicia PowerShell después de la instalación
4. Verifica la instalación ejecutando:
   ```powershell
   node --version
   npm --version
   ```

Para más detalles, consulta el archivo `INSTALACION.md`.

### Instalar dependencias del proyecto

Una vez que Node.js esté instalado:

```bash
cd frontend
npm install
```

## Desarrollo

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Construcción

Para crear una versión de producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist`.

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── UserTable.jsx    # Componente de tabla
│   │   └── UserForm.jsx     # Componente de formulario
│   ├── services/
│   │   └── api.js           # Servicio API con fetch
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos con Tailwind
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API

La aplicación se conecta a:
`https://proyecto-crud-contenedores.onrender.com/api/users`

Endpoints utilizados:
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear un usuario
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

