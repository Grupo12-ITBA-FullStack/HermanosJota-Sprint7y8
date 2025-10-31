import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({
  cartItems = [],
  onRemoveFromCart = () => {},
  onCloseCart = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false); 
  const [cartOpen, setCartOpen] = useState(false);
  const navRef = useRef(null);
  
  const cartCount = cartItems.reduce((acc, it) => acc + (it.cant ?? 1), 0);
  const cartTotal = cartItems.reduce((acc, it) => acc + (it.precio ?? 0) * (it.cant ?? 1), 0);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) {
        setCartOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className={""}>
      <div>
        <nav ref={navRef}>
          <Link to="/" className="logo">
            <img src="/img/logo.svg" alt="Logo Hermanos Jota" />
            <span className="logo-tit">Hermanos Jota</span>
          </Link>

          <div
            className="nav-menu"
            id="nav-menu"
            style={{ display: menuOpen ? "block" : undefined }} 
          >
            <ul className="nav-links" onClick={() => setMenuOpen(false)}>
              <li><Link to="/" className="nav-btn">Inicio</Link></li>
              <li><Link to="/productos" className="nav-btn">Catálogo</Link></li>
              <li><Link to="/contacto" className="nav-btn">Contacto</Link></li>
            </ul>

            {/* Carrito */}
            <div className="nav-actions">
              <div
                id="cart-icon-container"
                onClick={(e) => {
                  e.stopPropagation();
                  setCartOpen((v) => !v);
                }}
                role="button"
                aria-label="Abrir carrito"
              >
                <span id="cart-icon">🛒</span>
                <span
                  id="cart-count"
                  style={{ display: cartCount > 0 ? "block" : "none" }}
                >
                  {cartCount}
                </span>
              </div>

              <div
                id="cart-dropdown"
                style={{ display: cartOpen ? "block" : "none" }} 
              >
                <h3>Carrito</h3>
                <div id="cart-items">
                  {cartItems.length === 0 && <p>Sin productos.</p>}
                  {cartItems.map((it) => (
                    <div key={it.id}>
                      <div>
                        <strong>{it.nombre}</strong>{" "}
                        <span>× {it.cant ?? 1}</span>
                      </div>
                      <div>
                        ${(it.precio * (it.cant ?? 1)).toLocaleString("es-AR")}
                        <button
                          className="cart-remove"
                          onClick={() => onRemoveFromCart(it.id)}
                          title="Quitar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div id="cart-total">
                  Total: ${cartTotal.toLocaleString("es-AR")}
                </div>
                <button
                  id="cart-close"
                  onClick={() => {
                    setCartOpen(false);
                    onCloseCart();
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </nav>
      </div>
    </header>
  );
}