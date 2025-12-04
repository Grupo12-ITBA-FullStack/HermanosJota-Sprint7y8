const Order = require('../models/order');
const mongoose = require('mongoose');

// Obtener todas las órdenes del usuario autenticado
const getUserOrders = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      const error = new Error('ID de usuario inválido');
      error.status = 400;
      return next(error);
    }

    const ordenes = await Order.find({ usuario: usuarioId })
      .populate('items.productoId', 'nombre precio imagenUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(ordenes);
  } catch (error) {
    console.error('Error al obtener órdenes del usuario:', error.message);
    error.status = 500;
    next(error);
  }
};

// Obtener una orden específica por ID
const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const usuarioId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      const error = new Error('ID de orden inválido');
      error.status = 400;
      return next(error);
    }

    const orden = await Order.findById(orderId)
      .populate('items.productoId', 'nombre precio imagenUrl')
      .populate('usuario', 'username email');

    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      return next(error);
    }

    // Verificar que la orden pertenece al usuario logueado
    if (orden.usuario._id.toString() !== usuarioId) {
      const error = new Error('No tienes permiso para ver esta orden');
      error.status = 403;
      return next(error);
    }

    res.status(200).json(orden);
  } catch (error) {
    console.error('Error al obtener orden por ID:', error.message);
    error.status = 500;
    next(error);
  }
};

// Crear una nueva orden
const createOrder = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const { items, total } = req.body;

    // Validar que items esté presente y sea un array no vacío
    if (!items || !Array.isArray(items) || items.length === 0) {
      const error = new Error('La orden debe contener al menos un producto');
      error.status = 400;
      return next(error);
    }

    // Validar que total sea un número válido
    if (typeof total !== 'number' || total <= 0) {
      const error = new Error('El total debe ser un número mayor a 0');
      error.status = 400;
      return next(error);
    }

    // Validar estructura de items
    for (let item of items) {
      if (!item.productoId || !item.nombre || typeof item.cantidad !== 'number' || typeof item.precio !== 'number') {
        const error = new Error('Cada item debe tener productoId, nombre, cantidad y precio válidos');
        error.status = 400;
        return next(error);
      }
    }

    const nuevaOrden = new Order({
      usuario: usuarioId,
      items,
      total,
      estado: 'pendiente',
    });

    const ordenGuardada = await nuevaOrden.save();
    const ordenPopulada = await Order.findById(ordenGuardada._id)
      .populate('items.productoId', 'nombre precio imagenUrl')
      .populate('usuario', 'username email');

    res.status(201).json({
      mensaje: 'Orden creada con éxito',
      orden: ordenPopulada,
    });
  } catch (error) {
    console.error('Error al crear orden:', error.message);
    error.status = 500;
    next(error);
  }
};

// Actualizar una orden (estado, fechaEntrega)
const updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const usuarioId = req.user.id;
    const { estado, fechaEntrega } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      const error = new Error('ID de orden inválido');
      error.status = 400;
      return next(error);
    }

    const orden = await Order.findById(orderId);

    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      return next(error);
    }

    // Verificar que la orden pertenece al usuario logueado
    if (orden.usuario.toString() !== usuarioId) {
      const error = new Error('No tienes permiso para modificar esta orden');
      error.status = 403;
      return next(error);
    }

    // Actualizar campos permitidos
    if (estado && ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'].includes(estado)) {
      orden.estado = estado;
    }

    if (fechaEntrega) {
      orden.fechaEntrega = new Date(fechaEntrega);
    }

    const ordenActualizada = await orden.save();
    const ordenPopulada = await Order.findById(ordenActualizada._id)
      .populate('items.productoId', 'nombre precio imagenUrl')
      .populate('usuario', 'username email');

    res.status(200).json({
      mensaje: 'Orden actualizada con éxito',
      orden: ordenPopulada,
    });
  } catch (error) {
    console.error('Error al actualizar orden:', error.message);
    error.status = 500;
    next(error);
  }
};

// Obtener todas las órdenes (solo admin, sin validación por ahora)
const getAllOrders = async (req, res, next) => {
  try {
    const ordenes = await Order.find()
      .populate('usuario', 'username email')
      .populate('items.productoId', 'nombre precio imagenUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(ordenes);
  } catch (error) {
    console.error('Error al obtener todas las órdenes:', error.message);
    error.status = 500;
    next(error);
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  getAllOrders,
};
