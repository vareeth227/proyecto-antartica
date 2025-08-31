import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link style={linkStyle} to="/">Home</Link>
        <Link style={linkStyle} to="/cart">Carrito</Link>
        <Link style={linkStyle} to="/login">Login</Link>
        <Link style={linkStyle} to="/register">Registro</Link>
      </nav>
    </header>
  );
}

const headerStyle = {
  padding: '1rem',
  backgroundColor: '#0077b6',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '2rem',
  flexWrap: 'wrap',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '1rem',
};

export default Header;
