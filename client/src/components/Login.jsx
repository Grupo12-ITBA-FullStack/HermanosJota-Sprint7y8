import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    

    const handleChange = (ev) => {
        setForm((s) => ({ ...s, [ev.target.name]: ev.target.value }));
        setErrors((prev) => ({ ...prev, [ev.target.name]: null }));
        setServerError("");
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch(`${API}/api/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form), // enviar el estado `form` ({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            setServerError(data.message || 'Error en el login');
            throw new Error(data.message || 'Error en el login');
        }

        // Éxito: recibimos el token desde el backend
        console.log('Login exitoso');
        login(data.token);
        
        // Verificar si hay carrito pendiente
        const cart = localStorage.getItem("cart");
        const cartItems = cart ? JSON.parse(cart) : [];
        
        // Si hay items en el carrito, redirigir a checkout; si no, redirigir a inicio
        if (cartItems.length > 0) {
            navigate('/checkout');
        } else {
            navigate('/');
        }
    } catch (error) {
        alert(`Error en el login: ${error.message}`);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="auth-container" style={{ maxWidth: 480, margin: "2rem auto" }}>
            <h2>Iniciar sesión</h2>
            {serverError && (
                <div style={{ color: "crimson", marginBottom: 12 }}>{serverError}</div>
            )}
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="username"
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                    />
                    {errors.email && (
                        <div style={{ color: "crimson", fontSize: 13 }}>{errors.email}</div>
                    )}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                    />
                    {errors.password && (
                        <div style={{ color: "crimson", fontSize: 13 }}>{errors.password}</div>
                    )}
                </div>

                <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
        </div>
    );
}