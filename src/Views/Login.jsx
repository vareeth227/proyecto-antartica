// src/Views/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../config/api';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [_redirect, _setRedirect] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Correo inválido');
      return;
    }
    if (!formData.password) {
      setError('Contraseña requerida');
      return;
    }

    (async () => {
      let lastErr = 'Login failed';
      try {
        const r = await fetch(API.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        if (!r.ok) {
          const err = await r.json().catch(async () => {
            const txt = await r.text().catch(() => '');
            return { error: txt };
          });
          throw new Error(err.error || `Error ${r.status} en ${API.login}`);
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
