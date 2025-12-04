const express = require('express');
const ProductosRouter = express.Router();
const productosController = require('../controller/productosController');
const validateProducto = require('../middlewares/validateProducto');
const adminAuth = require('../middlewares/adminAuth');



// GET para obtener todos los productos
ProductosRouter.route('/').get(productosController.getAllProducts)
  // Crear producto (requiere ser admin)
  .post(adminAuth, validateProducto, productosController.createProduct);

// Rutas que operan sobre un producto específico
ProductosRouter.route('/:id')
  .get(productosController.getProductById)
  .put(adminAuth, validateProducto, productosController.updateProduct)
  .delete(adminAuth, productosController.deleteProduct);



module.exports = ProductosRouter;