// src/Views/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

/**
 * Componente Login
 * Permite al usuario iniciar sesión ingresando correo y contraseña.
 */
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [_redirect, _setRedirect] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

<<<<<<< HEAD
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
=======
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const endpoints = [`${API_BASE}/auth/login`, `${API_BASE}/api/login`];

    (async () => {
      let lastErr = 'Login failed';
      for (const url of endpoints) {
        try {
          const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, password: formData.password })
          });
          if (!r.ok) {
            const err = await r.json().catch(async () => {
              const txt = await r.text().catch(() => '');
              return { error: txt };
            });
            throw new Error(err.error || `Error ${r.status} en ${url}`);
          }
          const data = await r.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          setError('');
          if (data.user.role === 'admin') {
            window.location.href = '/adminview';
          } else {
            window.location.href = '/';
          }
          return;
        } catch (e) {
          lastErr = e.message;
        }
>>>>>>> 5f444a4 (testeo back y front 1)
      }
      setError(lastErr);
    })();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />
          {error && <span className="auth-error">{error}</span>}
          <button type="submit" className="auth-button">Entrar</button>
          <p className="auth-register-text">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="auth-register-link">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
