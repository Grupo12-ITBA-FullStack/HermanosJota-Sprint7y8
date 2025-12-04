const express = require('express');
const OrdenesRouter = express.Router();
const ordenesController = require('../controller/ordenesController');
const authMiddleware = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

// Todas las rutas requieren autenticación
OrdenesRouter.use(authMiddleware);

// GET /api/ordenes/admin/todas - obtener TODAS las órdenes (solo admin)
OrdenesRouter.route('/admin/todas')
  .get(adminAuth, ordenesController.getAllOrders);

// GET /api/ordenes - obtener todas las órdenes del usuario logueado
OrdenesRouter.route('/')
  .get(ordenesController.getUserOrders)
  .post(ordenesController.createOrder);

// GET /api/ordenes/:orderId - obtener una orden específica
OrdenesRouter.route('/:orderId')
  .get(ordenesController.getOrderById)
  .put(ordenesController.updateOrder);

module.exports = OrdenesRouter;
