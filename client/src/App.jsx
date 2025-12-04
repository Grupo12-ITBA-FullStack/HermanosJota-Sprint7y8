import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Orders from "./components/Orders";
import Checkout from "./components/Checkout";
import ProductManagement from "./components/ProductManagement";

import "./styles.css";
import "./responsive.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />

      <Routes>
        <Route 
          path="/" 
          element={<Main />} 
        />
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
        <Route 
          path="/productos" 
          element={<ProductList />} 
        />
        <Route
          path="/productos/:id" 
          element={<ProductDetail />} 
        />
        <Route 
          path="/contacto" 
          element={<ContactForm />} 
        />
        <Route 
          path="/checkout" 
          element={<Checkout />} 
        />
        <Route element={<AdminRoute />}>
           <Route path="/admin/gestionar-productos" element={<ProductManagement />} />
        </Route>
        <Route element={<ProtectedRoute />}>
           <Route path="/perfil" element={<Profile />} />
           <Route path="/mis-pedidos" element={<Orders />} />
        </Route>
        <Route 
          path="*" 
          element={<div className="container"><h2>Página no encontrada (404)</h2></div>} 
        />
      </Routes>

      <Footer />
      </CartProvider>
    </AuthProvider>
  );
}