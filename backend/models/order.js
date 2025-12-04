const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true,
        },
        nombre: {
          type: String,
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
        precio: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'],
      default: 'pendiente',
    },
    fechaEntrega: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
