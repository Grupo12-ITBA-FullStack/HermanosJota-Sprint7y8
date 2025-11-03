const express = require('express');
const ProductosRouter = express.Router();
const productosController = require('../controller/productosController');
const validateProducto = require('../middlewares/validateProducto');
const authMiddleware = require('../middlewares/auth');



// GET para obtener todos los productos
ProductosRouter.route('/').get(productosController.getAllProducts)
  // Crear producto (requiere validación). No require auth para permitir creación desde frontend actual.
  .post(validateProducto, productosController.createProduct);

// Rutas que operan sobre un producto específico
ProductosRouter.route('/:id')
  .get(productosController.getProductById)
  .put(authMiddleware, validateProducto, productosController.updateProduct)
  .delete(productosController.deleteProduct);



module.exports = ProductosRouter;