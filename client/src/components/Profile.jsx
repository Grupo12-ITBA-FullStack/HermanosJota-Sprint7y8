import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Profile() {
  const { token } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener datos del usuario desde el token (decodificado)
  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/usuarios/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron obtener los datos del usuario');
        }

        const data = await response.json();
        setUsuario(data);
        setFormData({ username: data.username, email: data.email });
        setError("");
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      obtenerDatosUsuario();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Actualizar el usuario usando el endpoint protegido
      const response = await fetch(`${API}/api/usuarios/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo actualizar el perfil');
      }

      const updatedUser = await response.json();
      setUsuario(updatedUser);
      setFormData({ username: updatedUser.username, email: updatedUser.email });
      setSuccessMessage('Perfil actualizado con éxito');
      setEditMode(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Cargando perfil...</p></div>;

  return (
    <div className="container" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Mi Perfil</h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
      {successMessage && <div style={{ color: "green", marginBottom: 12 }}>{successMessage}</div>}

      {!editMode ? (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
          <p><strong>Nombre de usuario:</strong> {formData.username}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <button
            onClick={() => setEditMode(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
