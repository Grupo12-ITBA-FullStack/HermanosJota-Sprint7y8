import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Main() {
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/api/productos`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setDestacados(data.filter(p => p.destacado));
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="hero-banner">
        <div className="heroDiv">
          <h1 className="titulo-hero">Hermanos Jota</h1>
          <p className="subtitulo-hero">
            Nuestra comunicación refleja la esencia artesanal y la calidez humana que
            define cada pieza que creamos
          </p>
          <Link className="boton-hero" to="/productos">Comprar Ahora</Link>
        </div>
      </section>

      {/* SOBRE HJ */}
      <section className="sobre-hj">
        <div className="container-sobre">
          <div className="item-sobre">
            <h3>01</h3>
            <h4>+30 Años de Experiencia</h4>
            <p>Somos un taller familiar con más de tres décadas en el diseño y la fabricación de muebles de madera de autor.</p>
          </div>
          <div className="item-sobre">
            <h3>02</h3>
            <h4>Calidad Artesanal</h4>
            <p>Cada pieza combina la robustez de lo artesanal con líneas modernas, honrando la tradición y abrazando la innovación.</p>
          </div>
          <div className="item-sobre">
            <h3>03</h3>
            <h4>Diseño Sustentable</h4>
            <p>Trabajamos con maderas certificadas y procesos responsables que cuidan al medio ambiente.</p>
          </div>
          <div className="item-sobre">
            <h3>04</h3>
            <h4>Conexión Humana</h4>
            <p>Nuestra comunicación refleja la calidez y cercanía que define cada pieza que creamos.</p>
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section>
        <div className="section-producDes">
          <div className="container-sub">
            <h1 className="tit">Nuestros Productos</h1>
            <div className="container-productDes">
              <h2>Descubrí nuestra colección única</h2>
              <Link className="boton-hero" to="/productos">Explorar catalogo</Link>
            </div>
          </div>

          {loading && <p style={{ paddingTop: 20 }}>Cargando destacados…</p>}
          {err && <p style={{ paddingTop: 20, color: "#b91c1c" }}>Error: {err}</p>}

          {!loading && !err && (
            <div id="destacados" className="product-grid">
              {destacados.map(p => (
                <Link
                  key={p._id}
                  to={`/productos/${p._id}`}
                  className="product-card"
                  title={p.nombre}
                >
                  <img
                    className="product-img"
                    src={p.imagen || `/img/hero.jpg`}
                    alt={p.nombre}
                  />
                  <div className="product-info">
                    <h3>{p.nombre}</h3>
                    <p className="product-price">${p.precio?.toLocaleString("es-AR")}</p>
                  </div>
                </Link>
              ))}
              {destacados.length === 0 && (
                <div className="empty">No hay productos destacados por ahora.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
