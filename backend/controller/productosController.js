const productos = require('../model/productos');

// Devuelve todos los productos (array en memoria)
const getAllProducts = (req, res) => {
    res.status(200).json(productos);
};

// Devuelve un producto por id (id numérico en el array en memoria)
const getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.status(200).json(producto);
};

// Crea un nuevo producto en el array en memoria
const createProduct = (req, res) => {
    try {
        const datos = req.body;
        // Generar id incremental
        const maxId = productos.reduce((max, p) => (p.id > max ? p.id : max), 0);
        const nuevo = { id: maxId + 1, ...datos };
        productos.push(nuevo);
        return res.status(201).json({ message: 'Producto creado con éxito', producto: nuevo });
    } catch (err) {
        console.error('Error al crear producto:', err);
        return res.status(500).json({ error: 'Error interno al crear producto' });
    }
};

// Actualiza un producto por id
const updateProduct = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = productos.findIndex((p) => p.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
        const datos = req.body;
        // Reemplazar/mezclar propiedades
        productos[index] = { ...productos[index], ...datos };
        return res.status(200).json({ message: 'Producto actualizado con éxito', producto: productos[index] });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        return res.status(500).json({ error: 'Error interno al actualizar producto' });
    }
};

// Elimina un producto por id
const deleteProduct = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = productos.findIndex((p) => p.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }
        const [eliminado] = productos.splice(index, 1);
        return res.status(200).json({ message: 'Producto eliminado con éxito', producto: eliminado });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        return res.status(500).json({ error: 'Error interno al eliminar producto' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
