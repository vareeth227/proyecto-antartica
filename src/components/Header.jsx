// Importación de dependencias
import React, { useState } from "react";       // React y hook useState para manejar estado local
import { Link } from "react-router-dom";       // Componente Link para navegación sin recargar la página
import "./Header.css";                         // Importación del CSS que contiene estilos para el header, input y buscador

// Componente funcional Header
function Header() {
  // Estados internos del Header
  const [menuOpen, setMenuOpen] = useState(false); // Controla si el menú hamburguesa está abierto o cerrado
  const [cartItems, setCartItems] = useState(0);   // Número de items en el carrito
  const [searchText, setSearchText] = useState(""); // Texto ingresado en el buscador

  // Función para manejar búsqueda
  const handleSearch = () => {
    console.log("Buscar:", searchText); // Muestra en consola el texto buscado
    // Aquí se puede agregar lógica para filtrar resultados o redirigir a otra página
  };

  return (
    <header style={headerStyle}>
      {/* Bloque de navegación principal */}
      <nav style={navStyle}>
        <Link style={linkStyle} to="/">Home</Link> {/* Link a la página principal */}
      </nav>

      {/* Buscador centrado */}
      <div style={searchContainerStyle}>
        <div className="group">
          {/* Ícono de búsqueda SVG */}
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.71 20.29l-3.388-3.388A7.935 7.935 0 0016 10a8 8 0 10-8 8 7.935 7.935 0 006.902-3.098l3.388 3.388a1 1 0 001.414-1.414zM10 16a6 6 0 110-12 6 6 0 010 12z"/>
          </svg>

          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar..."
            className="input"
            value={searchText}                       // Valor controlado por el estado
            onChange={(e) => setSearchText(e.target.value)} // Actualiza estado al escribir
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Ejecuta búsqueda al presionar Enter
          />
        </div>
      </div>

      {/* Bloque derecho: carrito y menú hamburguesa */}
      <div style={rightBlockStyle}>
        {/* Ícono de carrito */}
        <Link to="/cart" style={cartIconContainer}>
          🛒
          {/* Contador de items en carrito */}
          {cartItems > 0 && <span style={cartCountStyle}>{cartItems}</span>}
        </Link>

        {/* Menú hamburguesa */}
        <div
          style={hamburgerStyle}
          onClick={() => setMenuOpen(!menuOpen)} // Alterna estado del menú
        >
          ☰
        </div>
      </div>

      {/* Menú desplegable (solo visible si menuOpen = true) */}
      {menuOpen && (
        <div style={menuStyle}>
          <Link style={linkStyle} to="/login">Login</Link>
          <Link style={linkStyle} to="/register">Registro</Link>
        </div>
      )}
    </header>
  );
}

/* ===========================================
   Estilos en línea
   =========================================== */

const headerStyle = {
  padding: "1rem",
  backgroundColor: "#0077b6",
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const navStyle = {
  display: "flex",
  gap: "1rem", // Separación entre links
};

const rightBlockStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem", // Separación entre carrito y hamburguesa
};

const hamburgerStyle = {
  fontSize: "28px",
  cursor: "pointer",
  color: "white",
};

const menuStyle = {
  display: "flex",
  flexDirection: "column", // Apila los links verticalmente
  position: "absolute",
  top: "60px",
  right: "10px",
  background: "#023e8a",
  padding: "1rem",
  borderRadius: "8px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "1rem",
};

const cartIconContainer = {
  position: "relative",
  fontSize: "24px",
  color: "white",
  textDecoration: "none",
};

const cartCountStyle = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  background: "red",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "white",
};

// Centrar buscador horizontalmente
const searchContainerStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1, // Asegura que quede por encima de otros elementos
};

export default Header;
