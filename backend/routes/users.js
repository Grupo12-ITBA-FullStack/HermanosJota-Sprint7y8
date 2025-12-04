const express = require('express');
const UsuariosRouter = express.Router();
const usuariosController = require('../controller/usuariosController');
const authMiddleware = require('../middlewares/auth');

// GET para obtener el usuario logueado
UsuariosRouter.route('/me')
  .get(authMiddleware, usuariosController.getCurrentUser)
  .put(authMiddleware, usuariosController.updateCurrentUser);

UsuariosRouter.route('/register')
  // Crear usuario (requiere validación). No require auth para permitir creación desde frontend.
  .post(usuariosController.createUser);

UsuariosRouter.route('/login')
    .post(usuariosController.loginUser);

// Rutas que operan sobre un usuario específico (protegidas con auth)
UsuariosRouter.route('/:id')
  .put(authMiddleware, usuariosController.updateUser)
  .delete(authMiddleware, usuariosController.deleteUser);

module.exports = UsuariosRouter;