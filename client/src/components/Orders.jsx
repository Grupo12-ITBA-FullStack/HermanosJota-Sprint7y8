import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Orders() {
  const { token, user } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const obtenerOrdenes = async () => {
      try {
        setLoading(true);
        // Si es admin, obtener todas las órdenes; si no, obtener solo las suyas
        const endpoint = user?.role === 'admin' ? '/admin/todas' : '';
        const response = await fetch(`${API}/api/ordenes${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron obtener las órdenes');
        }

        const data = await response.json();
        setOrdenes(data);
        setError("");
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      obtenerOrdenes();
    }
  }, [token, user]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getEstadoBadgeColor = (estado) => {
    const colores = {
      pendiente: '#ffc107',
      confirmada: '#17a2b8',
      enviada: '#007bff',
      entregada: '#28a745',
      cancelada: '#dc3545',
    };
    return colores[estado] || '#6c757d';
  };

  if (loading) return <div className="container"><p>Cargando órdenes...</p></div>;

  return (
    <div className="container" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2>{user?.role === 'admin' ? 'Todos los Pedidos' : 'Mis Pedidos'}</h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      {ordenes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>{user?.role === 'admin' ? 'No hay órdenes en el sistema.' : 'No tienes órdenes aún.'}</p>
        </div>
      ) : (
        <div>
          {ordenes.map((orden) => (
            <div
              key={orden._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 16,
                overflow: "hidden",
              }}
            >
              {/* Header de la orden */}
              <div
                onClick={() => toggleExpandOrder(orden._id)}
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: 16,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    Orden #{orden._id.substring(0, 8)}
                  </p>
                  {user?.role === 'admin' && orden.usuario && (
                    <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 12 }}>
                      Cliente: {orden.usuario.username || orden.usuario.email}
                    </p>
                  )}
                  <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 12 }}>
                    {new Date(orden.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      ${orden.total.toFixed(2)}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: getEstadoBadgeColor(orden.estado),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {orden.estado}
                    </span>
                  </div>
                  <span style={{ color: "#666", fontSize: 18 }}>
                    {expandedOrderId === orden._id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {/* Detalles expandidos */}
              {expandedOrderId === orden._id && (
                <div style={{ backgroundColor: "#fff", padding: 16, borderTop: "1px solid #ddd" }}>
                  <h4>Productos:</h4>
                  <div style={{ marginBottom: 16 }}>
                    {orden.items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: "500" }}>
                            {item.nombre}
                          </p>
                          <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 12 }}>
                            Cantidad: {item.cantidad}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0 }}>
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </p>
                          <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 12 }}>
                            ${item.precio.toFixed(2)} c/u
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: "2px solid #ddd" }}>
                    <p style={{ margin: 0, textAlign: "right", fontWeight: "bold" }}>
                      Total: ${orden.total.toFixed(2)}
                    </p>
                  </div>

                  {orden.fechaEntrega && (
                    <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: 12 }}>
                      Fecha de entrega estimada: {new Date(orden.fechaEntrega).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
