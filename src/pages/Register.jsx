import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    region: '',
    comuna: '',
  });

  const [errors, setErrors] = useState({});

  // Función para actualizar el estado del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función de validación
  const validate = () => {
    const newErrors = {};

    // Validación correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    // Validación contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
    }

    // Validación teléfono chileno (+56 y 9 dígitos)
    const phoneRegex = /^\+569\d{8}$/;
    if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido. Debe iniciar con +569 y tener 9 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Usuario registrado:', formData);
      alert('Registro exitoso');
      // Aquí se podría enviar a un backend o guardar en localStorage
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        region: '',
        comuna: '',
      });
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
        <input name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
        {errors.email && <span style={errorStyle}>{errors.email}</span>}

        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} required />
        {errors.password && <span style={errorStyle}>{errors.password}</span>}

        <input name="telefono" placeholder="Teléfono (+569XXXXXXXX)" value={formData.telefono} onChange={handleChange} required />
        {errors.telefono && <span style={errorStyle}>{errors.telefono}</span>}

        <input name="region" placeholder="Región" value={formData.region} onChange={handleChange} required />
        <input name="comuna" placeholder="Comuna" value={formData.comuna} onChange={handleChange} required />

        <button type="submit">Registrar</button>
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

export default Register;
