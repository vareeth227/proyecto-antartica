// Importación de dependencias
import React, { useState, useEffect } from "react";       // React y hooks
import { Link, useNavigate } from "react-router-dom";       // Componente Link para navegación sin recargar la página
import SidebarCategorias from "./SidebarCategorias";
import "./SearchInline.css";
import "./Header.css";                         // Importación del CSS que contiene estilos para el header, input y buscador

// Componente funcional Header
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = React.useRef();
  const [cartItems, setCartItems] = useState(0);
  const [_darkMode, _setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // API base URL (consistente)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Función para actualizar el contador del carrito (suma quantities cuando existan)
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

  // Handler expuesto para eventos personalizados
  const cartHandler = () => updateCartCount();

  useEffect(() => {
    // inicializar contador y usuario
    updateCartCount();
    const u = localStorage.getItem('currentUser');
    if (u) setCurrentUser(JSON.parse(u));
  }, []);

  // Escuchar cambios simples de almacenamiento (otras pestañas) y custom events
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
    // custom event to update cart count within same tab
    window.addEventListener('cartChanged', cartHandler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('cartChanged', cartHandler);
    };
  }, []);
  const logoUrl = '/assets/logo.png';
  return (
      <header style={headerStyle}>
    <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%' }}>
            <Link to="/">
              <img src={logoUrl} alt="Logo" style={{ height: '50px' }} />
            </Link>
            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
              <SidebarCategorias horizontal={true} />
            </div>
            <div className="content-inline" style={{ flex: 1 }}>
              <div className="search-inline">
                <input name="txtSearch" className="search-inline--input" placeholder="Buscar" />
              </div>
            </div>
            <Link to="/cart" style={cartIconContainer}>
              🛒
              {cartItems > 0 && <span style={cartCountStyle}>{cartItems}</span>}
            </Link>
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => {
                clearTimeout(closeTimeout.current);
                setMenuOpen(true);
              }}
              onMouseLeave={() => {
                closeTimeout.current = setTimeout(() => setMenuOpen(false), 250);
              }}
            >
              <div
                style={hamburgerStyle}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </div>
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#fff',
                    color: '#213547',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '1px solid #194C57',
                    minWidth: '180px',
                    maxHeight: '350px',
                    overflowY: 'auto',
                    zIndex: 99999,
                    margin: 0,
                    padding: '0.5rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                  }}
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
                      <Link style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left' }} to="/profile">
                        {/* Mostrar saludo con nombre si existe; para client mostrar nombre (Hola Nombre) */}
                        {currentUser.role === 'client'
                          ? `Hola ${currentUser.nombre || currentUser.email}`
                          : `Hola ${currentUser.nombre || currentUser.email}`}
                      </Link>
                      {currentUser.role === 'admin' && (
                        <Link style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left' }} to="/adminview">Admin</Link>
                      )}
                      <div
                        style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left', cursor: 'pointer' }}
                        onClick={() => {
                          localStorage.removeItem('currentUser');
                          setCurrentUser(null);
                          navigate('/');
                        }}
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <Link style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left' }} to="/login">Inicia Sesión</Link>
                      <Link style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left' }} to="/register">Registrate</Link>
                    </>
                  )}
                  <Link style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left' }} to="/sobrenosotros">Sobre Nosotros</Link>
                  <Link style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left' }} to="/ayuda">Ayuda</Link>
                  <Link style={{ ...linkStyle, color: '#213547', padding: '0.5rem 1rem', textAlign: 'left' }} to="/contact">Contacto</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
}

/* ===========================================
   Estilos en línea
   =========================================== */

const headerStyle = {
  padding: "1rem",
  backgroundColor: "#194C57",
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const _navStyle = {
  display: "flex",
  gap: "1rem", // Separación entre links
};

const _rightBlockStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem", // Separación entre carrito y hamburguesa
};

    const hamburgerStyle = {
      fontSize: "28px",
      cursor: "pointer",
      color: "white",
      letterSpacing: '0.2em', // Alarga las líneas
    };

const _menuStyle = {
  display: "flex",
  flexDirection: "column", // Apila los links verticalmente
  position: "absolute",
  top: "60px",
  right: "10px",
  background: "#194C57",
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
const _searchContainerStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1, // Asegura que quede por encima de otros elementos
};

export default Header;
