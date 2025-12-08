const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const ProductosRouter = require('./routes/productos');
const UsuariosRouter = require('./routes/users');
const OrdenesRouter = require('./routes/ordenes');

// Middlewares
const authMiddleware = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

// Conexión a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI; 
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB Atlas:', error));

// Le dice a Express que si llega un cuerpo de petición en formato JSON, lo convierta en un objeto JavaScript.
app.use(express.json());

// CORS
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:3000',
    'hermanos-jota-sprint7y8.vercel.app',
    'https://hermanos-jota-sprint7y8-6pfqhe7dl-franciscos-projects-2672fe22.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Usamos el middleware de logging globalmente
//app.use(authMiddleware);

// --- RUTAS ---
app.use('/api/productos', ProductosRouter);
app.use('/api/usuarios', UsuariosRouter);
app.use('/api/ordenes', OrdenesRouter);

app.get('/', (req, res) => {
  res.send('¡Bienvenido al API de Mueblería Jota!');
});
 
// Middleware de errores al final
app.use((req,res,next) => res.status(404).json({ message: 'Ruta no encontrada' }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});