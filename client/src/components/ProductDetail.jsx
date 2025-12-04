import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function ProductDetail() { 
  const { token, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const r = await fetch(`${API}/api/productos/${id}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setProduct(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]); 

  

  // Manejar estados de carga y error
  if (loading) return <div className="loading-message">Cargando producto…</div>;
  if (err) return <p className="container" style={{ color: '#b91c1c' }}>Error: {err}</p>;
  if (!product) return <p className="container">Producto no encontrado.</p>;

  return (
    <section className="product-detail">
      <button onClick={() => navigate('/productos')} className="back-button">← Volver al catálogo</button>
      <div className="detail-grid">
        <img className="detail-img" src={product.imagen } alt={product.nombre} />
        <div className="detail-info">
          <h2>{product.nombre}</h2>
          <p className="product-price">${product.precio?.toLocaleString('es-AR')}</p>
          <p>{product.descripcion}</p>
          <p><strong>Materiales:</strong> {product.materiales}</p>
          <p><strong>Medidas:</strong> {product.medidas?.ancho} x {product.medidas?.altura} x {product.medidas?.profundidad} cm</p>

          <div className="add-to-cart">
            <label>
              Cantidad:
              <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} />
            </label>
            <button onClick={() => addToCart({ ...product, cant: qty })} className="btn-primary">Añadir al carrito</button>
          </div>

          
        </div>
      </div>
    </section>
  );
}