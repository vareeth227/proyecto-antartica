import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0); // cantidad de items en carrito

  return (
    <header style={headerStyle}>
      {/* Links normales */}
      <nav style={navStyle}>
        <Link style={linkStyle} to="/">Home</Link>
      </nav>

      {/* Carrito + hamburguesa */}
      <div style={rightBlockStyle}>
        <Link to="/cart" style={cartIconContainer}>
          🛒
          {cartItems > 0 && <span style={cartCountStyle}>{cartItems}</span>}
        </Link>

        {/* Icono Hamburguesa siempre visible */}
        <div
          style={hamburgerStyle}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </div>

      {/* Menú hamburguesa */}
      {menuOpen && (
        <div style={menuStyle}>
          <Link style={linkStyle} to="/login">Login</Link>
          <Link style={linkStyle} to="/register">Registro</Link>
        </div>
      )}
    </header>
  );
}

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
  gap: "1rem",
};

const rightBlockStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const hamburgerStyle = {
  fontSize: "28px",
  cursor: "pointer",
  color: "white",
};

const menuStyle = {
  display: "flex",
  flexDirection: "column",
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

export default Header;
