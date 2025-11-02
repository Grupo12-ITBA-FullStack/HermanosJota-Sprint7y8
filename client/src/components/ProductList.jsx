import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const r = await fetch(`${API}/api/productos`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setProducts(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="loading">Cargando catálogo…</p>;
  if (err) return <p className="error">Error: {err}</p>;
  if (!products || products.length === 0)
    return <div className="empty">No hay productos disponibles.</div>;

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
