const express = require('express');
const router = express.Router();
const Product = require('../models/product');


// Ruta para obtener todos los productos
// URL: /productos
router.get('/productos', async (req, res, next) => {
  try {
    // Usar el método .find() del Modelo para obtener todos los documentos
    const productos = await Product.find({}); 

    // Enviar la lista de productos como respuesta JSON
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    next(error); // Pasa el error al middleware de errores
  }
});

// Ruta para obtener un producto por su ID
// URL: /productos/:id
router.get('/productos/:id', async (req, res, next) => {
  try {

    // Obtener el ID del producto de los parámetros de la URL (req.params)
    const productoId = req.params.id;
    console.log('Buscando producto con ID:', productoId);
 
    // Buscar por _id
    const producto = await Product.findById(productoId);

    // Verificar si el producto fue encontrado
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }

    // Enviar el producto encontrado como respuesta JSON
    res.status(200).json(producto);

  } catch (error) {
    console.error('Error al buscar producto por ID:', error.message);
    error.status = 400; 
    next(error);
  }
});

// Ruta para crear un nuevo producto
// URL: /productos
router.post('/productos', async (req, res, next) => {
  try {

    // Obtener los datos del neuvo producto
    const datosNuevoProducto = req.body;
    console.log('Datos recibidos para crear producto:', datosNuevoProducto);

    // Crear una nueva instancia del Modelo Producto con los datos recibidos
    const nuevoProducto = new Product(datosNuevoProducto);

    // Guardar el nuevo producto en la base de datos.
    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({
      mensaje: 'Producto creado con éxito',
      producto: productoGuardado 
    });

  } catch (error) {
    
    console.error('Error al crear producto:', error.message);
    error.status = 400; 
  }
});

// Ruta para actualizar un producto por su ID
// URL: /productos/:id
router.put('/productos/:id', async (req, res, next) => {
  try {
    const productoId = req.params.id;
    const datosActualizados = req.body;
    console.log(`Actualizando producto con ID ${productoId} con datos:`, datosActualizados);

    // Usar findByIdAndUpdate para encontrar el documento por ID y actualizarlo
    const productoActualizado = await Product.findByIdAndUpdate(
      productoId,
      datosActualizados,
      { new: true, runValidators: true } 
    );

    // Verificar si el producto fue encontrado y actualizado
    if (!productoActualizado) {
      const error = new Error('Producto no encontrado para actualizar');
      error.status = 404;
      return next(error);
    }

    // Enviar el producto actualizado como respuesta
    res.status(200).json({
      mensaje: 'Producto actualizado con éxito',
      producto: productoActualizado
    });
 
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    error.status = 400;
    next(error);
  }
});

// Ruta para eliminar un producto por su ID
// URL: /productos/:id
router.delete('/productos/:id', async (req, res, next) => {
  try {
    const productoId = req.params.id;
    console.log('Eliminando producto con ID:', productoId);
 
    // Usar findByIdAndDelete para encontrar y eliminar el documento
    const productoEliminado = await Product.findByIdAndDelete(productoId);

    // Verificar si el producto fue encontrado y eliminado
    if (!productoEliminado) {
      const error = new Error('Producto no encontrado para eliminar');
      error.status = 404;
      return next(error);
    }
 
    // Enviar una respuesta de éxito
    res.status(200).json({
      mensaje: 'Producto eliminado con éxito',
      producto: productoEliminado 
    });
    
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    error.status = 400; 
    next(error);
  }
});