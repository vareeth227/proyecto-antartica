import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import CommentForm from '../components/CommentForm';
import Cart from '../components/Cart';

const initialBooks = [
  { id: 1, title: "Cien Años de Soledad", author: "Gabriel García Márquez", price: 12000, image: "/assets/libro1.jpg", description: "Una novela mágica y realista sobre la familia Buendía." },
  { id: 2, title: "El Principito", author: "Antoine de Saint-Exupéry", price: 8000, image: "/assets/libro2.jpg", description: "Un clásico cuento filosófico sobre la vida y la amistad." },
  { id: 3, title: "1984", author: "George Orwell", price: 15000, image: "/assets/libro3.jpg", description: "Una novela distópica sobre vigilancia y control totalitario." }
];

function Home() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book) => setCart([...cart, book]);
  const removeFromCart = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
  };
  const handleNewComment = (commentData) => setComments([...comments, commentData]);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Libros Disponibles</h2>
      <div style={booksGridStyle}>
        {initialBooks.map((book) => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>

      {cart.length > 0 && (
        <div style={cartSectionStyle}>
          <Cart cartItems={cart} removeFromCart={removeFromCart} />
          <CommentForm onSubmit={handleNewComment} />
        </div>
      )}

      {comments.length > 0 && (
        <div style={commentsContainerStyle}>
          <h3>Comentarios de los usuarios</h3>
          {comments.map((c, idx) => (
            <div key={idx} style={commentStyle}>
              <p style={commentTextStyle}>{c.comment}</p>
              <p style={ratingStyle}><strong>Calificación:</strong> {c.rating} ⭐</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: '#333',
  backgroundColor: '#f9f9f9',
  minHeight: '100vh'
};

const titleStyle = {
  textAlign: 'center',
  color: '#646cff',
  marginBottom: '2rem',
  fontSize: '2rem'
};

const booksGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  justifyContent: 'center'
};

const cartSectionStyle = {
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem'
};

const commentsContainerStyle = {
  marginTop: '2rem',
  padding: '1.5rem',
  border: '2px solid #646cff',
  borderRadius: '12px',
  backgroundColor: '#e3f6f5'
};

const commentStyle = {
  borderBottom: '1px solid #646cff',
  padding: '0.75rem 0'
};

const commentTextStyle = {
  marginBottom: '0.5rem',
  fontSize: '1rem',
  lineHeight: '1.4'
};

const ratingStyle = {
  fontWeight: 'bold',
  color: '#333'
};

export default Home;
