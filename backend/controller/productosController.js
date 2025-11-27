const Producto = require('../models/product');

// Devuelve todos los productos (array en memoria)
const getAllProducts = async (req, res) => {
    try {
        const productos = await Producto.find({});
    res.status(200).json(productos);
    }
    catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    next(error); // Pasa el error al middleware de errores
  }
    
};

// Devuelve un producto por id (id numérico en el array en memoria)
const getProductById = async (req, res, next) => {
    try {
    const id = req.params.id;
    const producto = await Producto.findById(id);
    if (!producto) {
      // Si no se encuentra, creamos y pasamos un error 404 (Not Found)
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error); // Importante: 'return' para no ejecutar lo siguiente
    }
    res.status(200).json(producto);
}
 catch (error) {
    // Si el formato del ID es inválido (ej. no es un ObjectId válido), Mongoose lanza un error
    console.error('Error al buscar producto por ID:', error.message);
    error.status = 400; // Generalmente, un ID malformado es un Bad Request (400)
    next(error);
  }
};

// Crea un nuevo producto en el array en memoria
const createProduct = async (req, res, next) => {
    try {
        const datosNuevosProducto = req.body;
        const nuevoProducto = new Usuario(datosNuevosProducto);
        const productoGuardado = await nuevoProducto.save();

        res.status(201).json({
      mensaje: 'Usuario creado con éxito',
      producto: productoGuardado // Enviamos el documento completo con el _id generado por MongoDB
    });
    } catch (err) {
       console.error('Error al crear producto:', error.message);
    error.status = 400; // Generalmente, un error de validación es un Bad Request (400)
    next(error);
    }
};

// Actualiza un producto por id
const updateProduct = async (req, res, next) => {
    try {
    const productoId = req.params.id;
    const datosActualizados = req.body;
    const productoActualizado = await Producto.findByIdAndUpdate(
      productoId,
      datosActualizados, // Mongoose automáticamente usa $set para los campos provistos
      { new: true, runValidators: true } // Opciones importantes
    );

    if (!productoActualizado) {
      const error = new Error('Producto no encontrado para actualizar');
      error.status = 404;
      return next(error);
    }

     res.status(200).json({
      mensaje: 'Producto actualizado con éxito',
      producto: productoActualizado
    });
    } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    // Si el ID es inválido o la validación falla
    error.status = 400;
    next(error);
  }
};

// Elimina un producto por id
const deleteProduct = async (req, res, next) => {
    try {
    const productoId = req.params.id;
    
 
    // 1. Usar findByIdAndDelete para encontrar y eliminar el documento
    const productoEliminado = await Producto.findByIdAndDelete(productoId);
 
    // 2. Verificar si el usuario fue encontrado y eliminado
    if (!productoEliminado) {
      const error = new Error('Producto no encontrado para eliminar');
      error.status = 404;
      return next(error);
    }
 
    // 3. Enviar una respuesta de éxito (204 No Content es común para DELETE sin cuerpo)
    // O 200 OK con un mensaje.
    res.status(200).json({
      mensaje: 'Producto eliminado con éxito',
      producto: productoEliminado // Opcional: devolver el usuario eliminado
    });
    } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    error.status = 400; // Puede ser por un ID malformado
    next(error);
  }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
