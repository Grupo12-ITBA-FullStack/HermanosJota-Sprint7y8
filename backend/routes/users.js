const express = require('express');
const UsuariosRouter = express.Router();
const usuariosController = require('../controller/usuariosController');
const authMiddleware = require('../middlewares/auth');


UsuariosRouter.route('/').get(usuariosController.getAllUsers);
// GET para obtener todos los productos
UsuariosRouter.route('/register')
  // Crear producto (requiere validación). No require auth para permitir creación desde frontend actual.
  .post(usuariosController.createUser);

UsuariosRouter.route('/login')
    .post(usuariosController.loginUser);

// Rutas que operan sobre un producto específico
UsuariosRouter.route('/:id')
  .get(usuariosController.getUserById)
  .put(authMiddleware,usuariosController.updateUser)
  .delete(usuariosController.deleteUser);



module.exports = UsuariosRouter;