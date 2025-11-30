// src/Views/Register.jsx
import React, { useState } from 'react';
import './Auth.css';

/**
 * Formulario de registro con validación de email, contraseña, teléfono y RUT chileno.
 */
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
    rut: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Correo inválido';

    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
    }

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
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      }
      const mod = 11 - (sum % 11);
      const expectedVerifier = mod === 11 ? '0' : mod === 10 ? 'K' : mod.toString();
      return verifier === expectedVerifier;
    };
    if (!validateRut(formData.rut)) newErrors.rut = 'RUT inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const endpoints = [`${API_BASE}/auth/register`, `${API_BASE}/api/register`];

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      region: formData.region,
      comuna: formData.comuna,
      rut: formData.rut,
    };

    let lastError = 'Registro fallido';
    for (const url of endpoints) {
      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!r.ok) {
          const err = await r.json().catch(async () => {
            const txt = await r.text().catch(() => '');
            return { error: txt };
          });
          throw new Error(err.error || `Error ${r.status} en ${url}`);
        }
        await r.json().catch(() => ({}));
        alert('Registro exitoso. Ya puedes iniciar sesión.');
        setFormData({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '', telefono: '', region: '', comuna: '', rut: '' });
        window.location.href = '/login';
        return;
      } catch (err) {
        lastError = err.message;
      }
    }
    alert(lastError);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Registro de Usuario</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {['nombre', 'apellido', 'email', 'password', 'confirmPassword', 'telefono', 'region', 'comuna', 'rut'].map((field) => (
            <div key={field} className="auth-input-group">
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
                className="auth-input"
                required
              />
              {errors[field] && <span className="auth-error">{errors[field]}</span>}
            </div>
          ))}
          <button type="submit" className="auth-button">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
