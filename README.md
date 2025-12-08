# E-Commerce Mueblería Hermanos Jota - Backend/Client (Sprint 7 y 8)

### Enlace al Frontend desplegado en Vercel: https://hermanos-jota-sprint7y8-6pfqhe7dl-franciscos-projects-2672fe22.vercel.app
### Enlace al Backend desplegado en Render: https://hermanosjota-5yc8.onrender.com

Proyecto con frontend en React (create-react-app) y backend en Node.js y Express.

## Integrantes
- Aaron Tournoud
- Agustin Barbero
- Francisco Azim
- Matias Navone
- Ramiro Martinez
  
Estructura:

- `/backend` — API REST con Express conectada a MongoDB Atlas.
- `/client` — Aplicación React (SPA) que consume la API para mostrar catálogo, detalle, contacto y administración.

### Requisitos

- Node.js 18 o superior
- npm
- MongoDB Atlas (cuenta gratuita)

### Configuracion e Instalación (Windows / PowerShell)

1. En la carpeta `/backend`, crear un archivo .env
con las siguientes variables de entorno:

```
PORT=4000
MONGODB_URI=mongodb+srv://itbauser:itbapass@cluster0.qqjqlxp.mongodb.net/?appName=Cluster0
```

2. Instalar dependencias del backend

```powershell
cd .\backend
npm install
```

3. Instalar dependencias del frontend

```powershell
cd ..\client
npm install
```

### Ejecutar en desarrollo

Primero arrancar el backend (por defecto en el puerto 4000):

```powershell
cd .\backend
npm start
```

Luego en otra terminal arrancar el cliente React:

```powershell
cd .\client
npm run dev
```

El cliente espera que la API esté disponible en `http://localhost:4000`. El backend incluye un CORS simple para desarrollo.

### Endpoints

- `GET /api/productos` — devuelve el array de productos.
- `GET /api/productos/:id` — devuelve un producto por id o 404 si no existe.
- `POST /api/productos` — stub protegido por middleware `auth` y validación.
- `PUT /api/productos/:id` — stub protegido por middleware `auth` y validación.
- `DELETE /api/productos/:id` — elimina un producto por id.

