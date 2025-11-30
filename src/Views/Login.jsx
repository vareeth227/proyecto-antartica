// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Login
 * Permite al usuario iniciar sesión ingresando correo y contraseña.
 * Valida formato de correo y que la contraseña no esté vacía.
 */
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  // Agregar estado para redirección (prefijado con _ para evitar warning si no se usa aún)
  const [_redirect, _setRedirect] = useState('');

  /**
   * handleChange
   * Actualiza el estado del formulario cuando el usuario escribe en un input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit
   * Valida y procesa el formulario al enviar.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Correo inválido');
      return;
    }

    // Validar que la contraseña no esté vacía
    if (!formData.password) {
      setError('Contraseña requerida');
      return;
    }

    // Determinar base de la API (soporta VITE_API_URL o fallback a localhost:4000)
    const API_BASE = import.meta.env.VITE_API_URL || '';
    // Autenticar contra la API
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    })
    .then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error || 'Login failed');
      }
      return r.json();
    })
    .then((data) => {
      // Guardar token y currentUser
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setError('');
      if (data.user.role === 'admin') {
        window.location.href = '/adminview';
      } else {
        window.location.href = '/';
      }
    })
    .catch((err) => {
      setError(err.message);
    });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Título de la tarjeta */}
        <h2 style={titleStyle}>Iniciar Sesión</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Mensaje de error */}
          {error && <span style={errorStyle}>{error}</span>}

          {/* Botón de envío */}
          <button type="submit" style={buttonStyle}>Entrar</button>

          {/* Enlace a registro debajo del botón */}
          <p style={registerTextStyle}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={registerLinkStyle}>Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

/* =========================
   Estilos inline adaptados de Ayuda.jsx
   ========================= */

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'var(--color-bg-light)', // mismo fondo que Ayuda.jsx
  fontFamily: 'Arial, sans-serif',
  color: 'var(--color-text-light)',
};

const cardStyle = {
  background: '#B4E2ED', // fondo azul claro
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  color: 'grey',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #646cff', // borde morado
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '1.6rem',
  letterSpacing: '0.5px',
  color: '#194C57', // color azul oscuro como en Ayuda.jsx
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: '1px solid #646cff',
  background: 'white',
  color: '#333',
  fontSize: '1rem',
};

const errorStyle = {
  color: '#f87171', // rojo para error
  fontSize: '0.85rem',
  textAlign: 'center',
};

const buttonStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#194C57', // azul oscuro como en Ayuda.jsx
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.2s',
};

const registerTextStyle = {
  textAlign: 'center',
  marginTop: '0.8rem',
  fontSize: '0.95rem',
  color: '#194C57',
};

const registerLinkStyle = {
  color: '#646cff',
  textDecoration: 'none',
  fontWeight: '600',
};

export default Login;
