import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
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

  const handleLogout = () => {
      logout();
      setMenuOpen(false);
      navigate("/");
  };
  
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
              {isAuthenticated ? (
                  <>
                    <li><Link to="/perfil" className="nav-btn">Perfil</Link></li>
                    <li><Link to="/mis-pedidos" className="nav-btn">Pedidos</Link></li>
                    <li><button onClick={handleLogout} className="nav-btn">Cerrar Sesión</button></li>    
                    {user?.role === 'admin' && (
                      <li><Link to="/admin/gestionar-productos" className="nav-btn">Gestionar Productos</Link></li>
                    )}
                    
                  </>
                  
              ) : (
                  <li><Link to="/login" className="nav-btn">Iniciar sesión</Link></li>
              )}
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
                    <div key={it._id}>
                      <div>
                        <strong>{it.nombre}</strong>{" "}
                        <span>× {it.cant ?? 1}</span>
                      </div>
                      <div>
                        ${(it.precio * (it.cant ?? 1)).toLocaleString("es-AR")}
                        <button
                          className="cart-remove"
                          onClick={() => removeFromCart(it._id)}
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
                {cartItems.length > 0 && (
                  <button
                    id="cart-checkout"
                    onClick={() => {
                      setCartOpen(false);
                      navigate("/checkout");
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Ir a Checkout
                  </button>
                )}
                <button
                  id="cart-close"
                  onClick={() => {
                    setCartOpen(false);
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