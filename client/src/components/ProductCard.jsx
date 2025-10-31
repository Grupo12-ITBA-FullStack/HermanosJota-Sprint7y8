import React from 'react';
import { Link } from 'react-router-dom'; 

export default function ProductCard({ product }) {
  return (
    <Link to={`/productos/${product.id}`} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <img
        className="product-img"
        src={product.imagen || `/img/hero.jpg`}
        alt={product.nombre}
      />
      <div className="product-info">
        <h3>{product.nombre}</h3>
        <p className="product-price">${product.precio?.toLocaleString('es-AR')}</p>
      </div>
    </Link>
  );
}