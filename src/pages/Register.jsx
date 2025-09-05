import React, { useState } from 'react';

// Componente Register: formulario de registro de usuario
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
  });

  // Estado para almacenar los errores de validación por campo
  const [errors, setErrors] = useState({});

  // Función que se ejecuta al cambiar un input
  // Actualiza el valor correspondiente en formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función de validación del formulario
  const validate = () => {
    const newErrors = {};

    // Expresión regular para validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    // Verifica que la contraseña y la confirmación coincidan
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
    }

    // Expresión regular para validar teléfono chileno +569xxxxxxxx
    const phoneRegex = /^\+569\d{8}$/;
    if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido. Debe iniciar con +569 y tener 9 dígitos';
    }

    // Actualiza el estado de errores
    setErrors(newErrors);

    // Devuelve true si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    if (validate()) {
      // Si la validación es correcta, imprime los datos en consola
      console.log('Usuario registrado:', formData);

      // Muestra una alerta de éxito
      alert('Registro exitoso');

      // Reinicia el formulario
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

  // Renderizado del formulario
  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Recorre los campos del formulario para generar inputs */}
        {["nombre","apellido","email","password","confirmPassword","telefono","region","comuna"].map((field) => (
          <div key={field} style={inputContainerStyle}>
            <input
              type={field.includes("password") ? "password" : "text"} // Si es password, oculta los caracteres
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)} // Primera letra mayúscula en placeholder
              value={formData[field]} // Valor del input
              onChange={handleChange} // Maneja cambios
              style={inputStyle}
              required // Campo obligatorio
            />
            {/* Muestra mensaje de error si existe */}
            {errors[field] && <span style={errorStyle}>{errors[field]}</span>}
          </div>
        ))}
        <button type="submit" style={buttonStyle}>Registrar</button>
      </form>
    </div>
  );
}

// Estilos del contenedor principal
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: 'white', // Fondo de la página ahora blanco
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: 'grey',
};

// Estilos del título
const titleStyle = {
  marginBottom: '1.5rem',
  fontSize: '2rem',
  letterSpacing: '1px',
};

// Estilos del formulario
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  background: '#B4E2ED', // Ahora el cuadro del formulario tiene el color que estaba en el fondo
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(99, 15, 15, 0.15)',
  width: '100%',
  maxWidth: '400px',
};

// Contenedor de cada input
const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

// Estilos de los inputs
const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #646cff',
  background: 'white',
  color: 'grey',
  outline: 'none',
};

// Estilos de los mensajes de error
const errorStyle = {
  color: '#e74c3c',
  fontSize: '0.8rem',
  marginTop: '0.25rem',
};

// Estilos del botón de registro
const buttonStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#646cff',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default Register; // Exporta el componente
