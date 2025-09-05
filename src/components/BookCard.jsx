import React from 'react';

// Componente para mostrar un libro
function BookCard({ book, addToCart }) {
  // book: objeto con { title, author, price, image, description }
  // addToCart: función que se llama al presionar "Agregar al carrito"
  
  return (
    <div style={cardStyle}>
      <img src={book.image} alt={book.title} style={imageStyle} />
      <h3>{book.title}</h3>
      <p><strong>Autor:</strong> {book.author}</p>
      <p><strong>Precio:</strong> ${book.price}</p>
      <p>{book.description}</p>
      <button onClick={() => addToCart(book)}>Agregar al carrito</button>
    </div>
  );
}

// Estilos simples en línea
const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  margin: '1rem',
  width: '200px',
  textAlign: 'center',
  backgroundColor: '#B4E2ED',
  color: 'white',
};

const imageStyle = {
  width: '100%',
  height: 'auto',
  marginBottom: '0.5rem',
  borderRadius: '4px',
};

export default BookCard;
