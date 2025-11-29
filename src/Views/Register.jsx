// src/pages/Register.jsx
import React, { useState } from 'react';

/**
 * Componente Register
 * Formulario de registro de usuario con validación de email, contraseña, teléfono y RUT chileno.
 */
function Register() {
  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    region: '',
    comuna: '',
    rut: '',
  });

  // Estado para almacenar los errores de validación por campo
  const [errors, setErrors] = useState({});

  /**
   * handleChange
   * Actualiza el estado formData cuando el usuario escribe en un input
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * validate
   * Valida los campos del formulario y actualiza el estado errors
   */
  const validate = () => {
    const newErrors = {};

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    // Validar contraseña y confirmación
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
    }

    // Validar teléfono chileno
    const phoneRegex = /^\+569\d{8}$/;
    if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido. Debe iniciar con +569 y tener 9 dígitos';
    }

    // Validar RUT chileno
    const validateRut = (rut) => {
      const cleanRut = rut.replace(/[^\dkK]/g, '').toUpperCase();
      if (cleanRut.length < 8 || cleanRut.length > 9) return false;

      const body = cleanRut.slice(0, -1);
      const verifier = cleanRut.slice(-1);

      let sum = 0;
      let multiplier = 2;
      for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      }

      const mod = 11 - (sum % 11);
      const expectedVerifier = mod === 11 ? '0' : mod === 10 ? 'K' : mod.toString();

      return verifier === expectedVerifier;
    };

    if (!validateRut(formData.rut)) {
      newErrors.rut = 'RUT inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * handleSubmit
   * Se ejecuta al enviar el formulario, valida y muestra alerta si es correcto
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Registrar via API
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        region: formData.region,
        comuna: formData.comuna,
        rut: formData.rut,
      })
    })
    .then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error || 'Registro fallido');
      }
      return r.json();
    })
    .then(() => {
      alert('Registro exitoso. Ya puedes iniciar sesión.');
      setFormData({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '', telefono: '', region: '', comuna: '', rut: '' });
      window.location.href = '/login';
    })
    .catch((err) => {
      alert(err.message);
    });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Registro de Usuario</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          {["nombre", "apellido", "email", "password", "confirmPassword", "telefono", "region", "comuna", "rut"].map((field) => (
            <div key={field} style={inputContainerStyle}>
              <input
                type={field === 'password' || field === 'confirmPassword' ? 'password' : 'text'}
                name={field}
                placeholder={
                  field === 'password'
                    ? 'Contraseña'
                    : field === 'confirmPassword'
                    ? 'Confirmar Contraseña'
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={formData[field]}
                onChange={handleChange}
                style={inputStyle}
                required
              />
              {errors[field] && <span style={errorStyle}>{errors[field]}</span>}
            </div>
          ))}
          <button type="submit" style={buttonStyle}>Registrar</button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   Estilos adaptados de Ayuda.jsx
   ========================= */

// Contenedor centrado
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'var(--color-bg-light)',
  fontFamily: 'Arial, sans-serif',
  color: 'var(--color-text-light)',
};

// Tarjeta de formulario con borde y sombra
const cardStyle = {
  background: '#B4E2ED',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: '450px',
  border: '1px solid #646cff',
  color: 'grey',
};

// Título centrado
const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontWeight: '600',
  fontSize: '1.8rem',
  color: '#194C57',
};

// Formulario vertical con espacio
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

// Contenedor de cada input
const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

// Inputs con borde morado y fondo blanco
const inputStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: '1px solid #646cff',
  background: '#fff',
  color: 'grey',
  outline: 'none',
};

// Mensajes de error en rojo
const errorStyle = {
  color: '#f87171',
  fontSize: '0.85rem',
  marginTop: '0.25rem',
};

// Botón azul principal
const buttonStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#194C57',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.2s',
};

export default Register;
