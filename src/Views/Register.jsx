// src/pages/Register.jsx
import React, { useState } from "react";

// Registro con validacion mas permisiva (telefono +569xxxxxxxx o 9xxxxxxxx, RUT con/ sin guion)
function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    region: "",
    comuna: "",
    rut: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    const emailVal = (formData.email || "").trim();
    const telefonoVal = (formData.telefono || "").trim();
    const rutVal = (formData.rut || "").trim();

    // Email basico
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      newErrors.email = "Correo invalido";
    }

    // Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = "Las contrasenas no coinciden";
    }

    // Telefono chileno: +569xxxxxxxx, 569xxxxxxxx o 9xxxxxxxx
    const phoneDigits = telefonoVal.replace(/[^\\d]/g, "");
    const phoneRegex = /^(?:\\+?56)?9\\d{8}$/;
    if (!phoneRegex.test(telefonoVal) && !phoneRegex.test("+" + phoneDigits)) {
      newErrors.telefono = "Telefono invalido. Usa +569 y 8 digitos (ej: +56912345678)";
    }

    // RUT chileno
    const validateRut = (rut) => {
      const cleanRut = rut.replace(/[^\\dkK]/g, "").toUpperCase();
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
      const expectedVerifier = mod === 11 ? "0" : mod === 10 ? "K" : mod.toString();
      return verifier === expectedVerifier;
    };

    if (!validateRut(rutVal)) {
      newErrors.rut = "RUT invalido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const API_BASE = import.meta.env.VITE_API_URL || "";
    fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email.trim(),
        password: formData.password,
        telefono: formData.telefono.trim(),
        region: formData.region,
        comuna: formData.comuna,
        rut: formData.rut.trim(),
      }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || "Registro fallido");
        }
        return r.json();
      })
      .then((data) => {
        // si el backend devuelve error, capturarlo
        if (data?.error) {
          throw new Error(data.error);
        }
        alert("Registro exitoso. Ya puedes iniciar sesion.");
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          confirmPassword: "",
          telefono: "",
          region: "",
          comuna: "",
          rut: "",
        });
        window.location.href = "/login";
      })
      .catch((err) => {
        alert(err.message || "Registro fallido");
      });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Registro de Usuario</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          {["nombre", "apellido", "email", "password", "confirmPassword", "telefono", "region", "comuna", "rut"].map(
            (field) => (
              <div key={field} style={inputContainerStyle}>
                <input
                  type={field === "password" || field === "confirmPassword" ? "password" : "text"}
                  name={field}
                  placeholder={
                    field === "password"
                      ? "Contrasena"
                      : field === "confirmPassword"
                      ? "Confirmar Contrasena"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
                {errors[field] && <span style={errorStyle}>{errors[field]}</span>}
              </div>
            )
          )}
          <button type="submit" style={buttonStyle}>
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "var(--color-bg-light)",
  fontFamily: "Arial, sans-serif",
  color: "var(--color-text-light)",
};

const cardStyle = {
  background: "#B4E2ED",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  width: "100%",
  maxWidth: "450px",
  border: "1px solid #646cff",
  color: "grey",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "1.5rem",
  fontWeight: "600",
  fontSize: "1.8rem",
  color: "#194C57",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "8px",
  border: "1px solid #646cff",
  background: "#fff",
  color: "grey",
  outline: "none",
};

const errorStyle = {
  color: "#f87171",
  fontSize: "0.85rem",
  marginTop: "0.25rem",
};

const buttonStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "8px",
  border: "none",
  background: "#194C57",
  color: "white",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background 0.3s, transform 0.2s",
};

export default Register;
