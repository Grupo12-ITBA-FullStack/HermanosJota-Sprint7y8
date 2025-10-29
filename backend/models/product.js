const mongoose = require('mongoose');

//Esquema de productos
const productSchema = new mongoose.Schema({

    nombre:{
        type: String,
        required: true
    },

    descripcion: {
        type: String
    },

    precio: {
        type: Number,
        required: true
    },

    stock: {
        type: Number
    },

    imagenUrl:{
        type: String
    },

});

//Modelo de productos
const Product = mongoose.model('Producto', productSchema);

module.exports = Product;