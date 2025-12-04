import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Checkout() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Calcular total del carrito
  const total = getCartTotal();

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Preparar items de la orden
      const items = cartItems.map((item) => ({
        productoId: item._id || item.id,
        nombre: item.nombre,
        cantidad: item.cant,
        precio: item.precio,
      }));

      // Crear la orden
      const response = await fetch(`${API}/api/ordenes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          total: parseFloat(total.toFixed(2)),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la orden");
      }

      setSuccessMessage("¡Orden creada con éxito!");
      
      // Limpiar carrito
      clearCart();

      // Redirigir a mis pedidos después de 2 segundos
      setTimeout(() => {
        navigate("/mis-pedidos");
      }, 2000);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Checkout</h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
      {successMessage && (
        <div style={{ color: "green", marginBottom: 12 }}>{successMessage}</div>
      )}

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Tu carrito está vacío. Agrega productos antes de proceder.</p>
        </div>
      ) : (
        <div>
          <h3>Resumen de tu Compra</h3>
          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: index < cartItems.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: "500" }}>{item.nombre}</p>
                  <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 12 }}>
                    Cantidad: {item.cant}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0 }}>
                    ${(item.precio * item.cant).toFixed(2)}
                  </p>
                  <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 12 }}>
                    ${item.precio.toFixed(2)} c/u
                  </p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "2px solid #ddd" }}>
              <p style={{ margin: 0, textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
                Total: ${total.toFixed(2)}
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckout}>
            <button
              type="submit"
              disabled={loading || !isAuthenticated}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isAuthenticated ? "#28a745" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: "bold",
                cursor: isAuthenticated ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Procesando..." : "Confirmar Compra"}
            </button>
          </form>

          {!isAuthenticated && (
            <div style={{ color: "#666", textAlign: "center", marginTop: 12 }}>
              <p style={{ marginBottom: 12 }}>
                Debes iniciar sesión para realizar una compra.
              </p>
              <Link 
                to="/login" 
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                Ir a Iniciar Sesión
              </Link>
              <p style={{ marginTop: 12, fontSize: 12, color: "#999" }}>
                Tu carrito se mantendrá guardado mientras te registras o inicias sesión.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
