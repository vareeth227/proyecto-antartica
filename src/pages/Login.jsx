import React, { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

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

    setError('');
    console.log('Usuario logueado:', formData);
    alert('Login exitoso');
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Iniciar Sesión</h2>
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
          {error && <span style={errorStyle}>{error}</span>}
          <button type="submit" style={buttonStyle}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

// Contenedor centrado con fondo claro como Home
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#fff', // mismo fondo que Home
  fontFamily: 'Arial, sans-serif',
  color: 'grey',
};

// Tarjeta con borde azul claro y fondo suave
const cardStyle = {
  background: '#B4E2ED', // mismo azul claro de comentarios
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  color: 'grey',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #646cff', // borde similar al de comentarios
};

// Título centrado
const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '1.6rem',
  letterSpacing: '0.5px',
};

// Formulario vertical
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

// Inputs sobrios con borde azul
const inputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: '1px solid #646cff',
  outline: 'none',
  fontSize: '1rem',
  background: '#fff',
  color: 'grey',
};

// Mensaje de error
const errorStyle = {
  color: '#f87171', // rojo para error, sigue siendo visible
  fontSize: '0.85rem',
  textAlign: 'center',
};

// Botón con azul principal
const buttonStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#646cff', // azul similar al borde de comentarios
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.2s',
};

export default Login;
