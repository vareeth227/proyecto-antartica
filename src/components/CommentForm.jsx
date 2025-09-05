import React, { useState } from 'react';

function CommentForm({ onSubmit }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5); // Valor por defecto 5 estrellas

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }
    onSubmit({ comment, rating });
    setComment('');
    setRating(5);
    alert('¡Gracias por tu comentario!');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Deja tu comentario de satisfacción</h3>
      <textarea
        placeholder="Escribe tu comentario..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        style={textareaStyle}
      />
      <label>
        Calificación:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={selectStyle}>
          {[5,4,3,2,1].map((num) => (
            <option key={num} value={num}>{num} estrella{num > 1 ? 's' : ''}</option>
          ))}
        </select>
      </label>
      <button type="submit">Enviar comentario</button>
    </form>
  );
}

// Estilos simples en línea
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: '500px',
  marginTop: '2rem',
  padding: '1rem',
  border: '1px solid #646cff',
  borderRadius: '8px',
  backgroundColor: '#B4E2ED',
  color: 'white',
};

const textareaStyle = {
  minHeight: '80px',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  resize: 'vertical',
};

const selectStyle = {
  marginLeft: '0.5rem',
  padding: '0.3rem',
};

export default CommentForm;
