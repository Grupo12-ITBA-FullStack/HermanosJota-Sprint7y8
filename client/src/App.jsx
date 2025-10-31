import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";

import "./styles.css";
import "./responsive.css";

// Componente placeholder para la ruta de admin
const CreateProductForm = () => (
  <div className="container">
    <h2>Crear Nuevo Producto</h2>
    <p>Aquí irá el formulario para crear productos.</p>
  </div>
);

export default function App() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); 

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, cant: (p.cant || 1) + (item.cant || 1) } : p);
      }
      return [...prev, { ...item }];
    });
    navigate('/productos');
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  return (
    <>
      <Navbar 
        cartItems={cart} 
        onRemoveFromCart={removeFromCart} 
      />

      <Routes>
        <Route 
          path="/" 
          element={<Main />} 
        />
        <Route 
          path="/productos" 
          element={<ProductList />} 
        />
        <Route 
          element={<ProductDetail onAddToCart={addToCart} />} 
        />
        <Route 
          path="/contacto" 
          element={<ContactForm />} 
        />
        <Route 
          element={<CreateProductForm />} 
        />
        <Route 
          path="*" 
          element={<div className="container"><h2>Página no encontrada (404)</h2></div>} 
        />
      </Routes>

      <Footer />
    </>
  );
}