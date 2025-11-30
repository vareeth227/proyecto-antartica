// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarCategorias from './SidebarCategorias';
import './SearchInline.css';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = useRef();
  const [cartItems, setCartItems] = useState(0);
  const [_darkMode, _setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
<<<<<<< HEAD

  // API base URL (consistente)
  const API_BASE = import.meta.env.VITE_API_URL || '';
=======
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
>>>>>>> 5f444a4 (testeo back y front 1)

  const updateCartCount = async () => {
    const t = localStorage.getItem('token');
    if (t) {
      try {
        const res = await fetch(`${API_BASE}/cart`, { headers: { Authorization: `Bearer ${t}` } });
        if (!res.ok) throw new Error('No auth');
        const data = await res.json();
        const sum = Array.isArray(data) ? data.reduce((s, it) => s + (it.quantity || 1), 0) : 0;
        setCartItems(sum);
      } catch {
        setCartItems(0);
      }
    } else {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      const sum = Array.isArray(c) ? c.reduce((s, it) => s + (it.quantity || 1), 0) : 0;
      setCartItems(sum);
    }
  };

  const cartHandler = () => updateCartCount();

  useEffect(() => {
    updateCartCount();
    const u = localStorage.getItem('currentUser');
    if (u) setCurrentUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    const handler = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API_BASE}/cart`, { headers: { Authorization: `Bearer ${token}` } })
          .then(async (r) => {
            if (!r.ok) throw new Error('No auth');
            const data = await r.json();
            const sum = Array.isArray(data) ? data.reduce((s, it) => s + (it.quantity || 1), 0) : 0;
            setCartItems(sum);
          })
          .catch(() => setCartItems(0));
      } else {
        const c = JSON.parse(localStorage.getItem('cart') || '[]');
        const sum = Array.isArray(c) ? c.reduce((s, it) => s + (it.quantity || 1), 0) : 0;
        setCartItems(sum);
      }
      const u = localStorage.getItem('currentUser');
      setCurrentUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('storage', handler);
    window.addEventListener('cartChanged', cartHandler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('cartChanged', cartHandler);
    };
  }, []);

  const logoUrl = '/assets/logo.png';
  const roleIcon = currentUser?.role === 'admin' ? '🛡️' : currentUser ? '👤' : '';

  return (
    <header className="main-header">
      <div className="header-row">
        <Link to="/" className="header-logo">
          <img src={logoUrl} alt="Logo" />
        </Link>

        <div className="header-categories">
          <SidebarCategorias horizontal />
        </div>

        <div className="content-inline header-search">
          <div className="search-inline">
            <input name="txtSearch" className="search-inline--input" placeholder="Buscar" />
          </div>
        </div>

        <Link to="/cart" className="header-cart">
          <span role="img" aria-label="carrito">🛒</span>
          {cartItems > 0 && <span className="header-cart-count">{cartItems}</span>}
        </Link>

        <div
          className="header-menu-wrapper"
          onMouseEnter={() => {
            clearTimeout(closeTimeout.current);
            setMenuOpen(true);
          }}
          onMouseLeave={() => {
            closeTimeout.current = setTimeout(() => setMenuOpen(false), 250);
          }}
        >
          <button
            className="header-menu-button"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Menú de usuario"
          >
            ☰
          </button>

          {menuOpen && (
            <div
              className="header-dropdown"
              onMouseEnter={() => {
                clearTimeout(closeTimeout.current);
                setMenuOpen(true);
              }}
              onMouseLeave={() => {
                closeTimeout.current = setTimeout(() => setMenuOpen(false), 250);
              }}
            >
              {currentUser ? (
                <>
                  <Link className="header-link" to="/profile">
                    {roleIcon && <span className="header-role-icon">{roleIcon}</span>}
                    Hola {currentUser.nombre || currentUser.email}
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link className="header-link" to="/adminview">Admin</Link>
                  )}
                  <button
                    type="button"
                    className="header-link header-logout"
                    onClick={() => {
                      localStorage.removeItem('currentUser');
                      setCurrentUser(null);
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="header-link" to="/login">Inicia Sesión</Link>
                  <Link className="header-link" to="/register">Regístrate</Link>
                </>
              )}
              <Link className="header-link" to="/sobrenosotros">Sobre Nosotros</Link>
              <Link className="header-link" to="/ayuda">Ayuda</Link>
              <Link className="header-link" to="/contact">Contacto</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
