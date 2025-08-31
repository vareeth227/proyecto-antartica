import React, { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  // Actualiza el estado al escribir en los campos
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validación y envío
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Correo inválido');
      return;
    }

    // Aquí se podría verificar la contraseña en un backend
    if (!formData.password) {
      setError('Contraseña requerida');
      return;
    }

    setError('');
    console.log('Usuario logueado:', formData);
    alert('Login exitoso');
    // Aquí se podría redirigir a la página Home o guardar sesión
  };

  return (
    <div style={containerStyle}>
      <h2>Login de Usuario</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <span style={errorStyle}>{error}</span>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

// Estilos simples en línea
const containerStyle = {
  padding: '2rem',
  color: 'white',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: '400px',
};

const errorStyle = {
  color: 'red',
  fontSize: '0.8rem',
};

export default Login;
