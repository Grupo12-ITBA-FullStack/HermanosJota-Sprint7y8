import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function ProductManagement() {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    materiales: "",
    medidas: {
      ancho: "",
      altura: "",
      profundidad: "",
    },
  });

  // Obtener todos los productos
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/productos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }

      const data = await response.json();
      setProductos(data);
      setError("");
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("medidas.")) {
      const medidasKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        medidas: {
          ...prev.medidas,
          [medidasKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.imagen ||
      !formData.materiales
    ) {
      setError("Todos los campos obligatorios deben ser completados");
      return;
    }

    try {
      setLoading(true);
      const url = editingId
        ? `${API}/api/productos/${editingId}`
        : `${API}/api/productos`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar producto");
      }

      const savedProduct = await response.json();

      if (editingId) {
        setProductos((prev) =>
          prev.map((p) => (p._id === editingId ? savedProduct.producto : p))
        );
        setSuccessMessage("Producto actualizado con éxito");
      } else {
        setProductos((prev) => [...prev, savedProduct.producto]);
        setSuccessMessage("Producto creado con éxito");
      }

      resetForm();
      setShowCreateForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto._id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      imagen: producto.imagen,
      materiales: producto.materiales,
      medidas: producto.medidas || {
        ancho: "",
        altura: "",
        profundidad: "",
      },
    });
    setShowCreateForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API}/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }

      setProductos((prev) => prev.filter((p) => p._id !== id));
      setSuccessMessage("Producto eliminado con éxito");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      materiales: "",
      medidas: {
        ancho: "",
        altura: "",
        profundidad: "",
      },
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    resetForm();
    setError("");
  };

  if (loading && !showCreateForm) {
    return <div className="container"><p>Cargando productos...</p></div>;
  }

  return (
    <div className="container" style={{ maxWidth: 1000, margin: "2rem auto" }}>
      <h2>Gestión de Productos</h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
      {successMessage && (
        <div style={{ color: "green", marginBottom: 12 }}>{successMessage}</div>
      )}

      {!showCreateForm ? (
        <>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            + Agregar Nuevo Producto
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {productos.map((producto) => (
              <div
                key={producto._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 4,
                    marginBottom: 12,
                  }}
                />
                <h3>{producto.nombre}</h3>
                <p style={{ color: "#666", fontSize: "0.9em" }}>
                  {producto.descripcion}
                </p>
                <p style={{ fontWeight: "bold", color: "#007bff" }}>
                  ${producto.precio?.toLocaleString("es-AR")}
                </p>
                <p style={{ fontSize: "0.85em" }}>
                  <strong>Materiales:</strong> {producto.materiales}
                </p>
                {producto.medidas && (
                  <p style={{ fontSize: "0.85em" }}>
                    <strong>Medidas:</strong> {producto.medidas.ancho} x{" "}
                    {producto.medidas.altura} x {producto.medidas.profundidad} cm
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <button
                    onClick={() => handleEdit(producto)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(producto._id)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {productos.length === 0 && (
            <p style={{ textAlign: "center", color: "#666" }}>
              No hay productos en el catálogo.
            </p>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 24, borderRadius: 8 }}>
          <h3>{editingId ? "Editar Producto" : "Crear Nuevo Producto"}</h3>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleFormChange}
              style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleFormChange}
              style={{
                width: "100%",
                padding: 8,
                boxSizing: "border-box",
                marginTop: 4,
                minHeight: 100,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="precio">Precio:</label>
            <input
              id="precio"
              name="precio"
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={handleFormChange}
              style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="imagen">URL de Imagen:</label>
            <input
              id="imagen"
              name="imagen"
              type="text"
              value={formData.imagen}
              onChange={handleFormChange}
              style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="materiales">Materiales:</label>
            <input
              id="materiales"
              name="materiales"
              type="text"
              value={formData.materiales}
              onChange={handleFormChange}
              style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
              required
            />
          </div>

          <fieldset style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 4 }}>
            <legend>Medidas (cm)</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div>
                <label htmlFor="medidas.ancho">Ancho:</label>
                <input
                  id="medidas.ancho"
                  name="medidas.ancho"
                  type="number"
                  value={formData.medidas.ancho}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
                />
              </div>
              <div>
                <label htmlFor="medidas.altura">Altura:</label>
                <input
                  id="medidas.altura"
                  name="medidas.altura"
                  type="number"
                  value={formData.medidas.altura}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
                />
              </div>
              <div>
                <label htmlFor="medidas.profundidad">Profundidad:</label>
                <input
                  id="medidas.profundidad"
                  name="medidas.profundidad"
                  type="number"
                  value={formData.medidas.profundidad}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: 8, boxSizing: "border-box", marginTop: 4 }}
                />
              </div>
            </div>
          </fieldset>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                flex: 1,
                padding: "10px 16px",
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
