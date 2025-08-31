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
      <h2>Libros Disponibles</h2>
      <div style={booksGridStyle}>
        {initialBooks.map((book) => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>

      <Cart cartItems={cart} removeFromCart={removeFromCart} />

      {cart.length > 0 && <CommentForm onSubmit={handleNewComment} />}

      {comments.length > 0 && (
        <div style={commentsContainerStyle}>
          <h3>Comentarios de los usuarios</h3>
          {comments.map((c, idx) => (
            <div key={idx} style={commentStyle}>
              <p>{c.comment}</p>
              <p><strong>Calificación:</strong> {c.rating} estrella{c.rating > 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle = { padding: '2rem', color: 'white', maxWidth: '1200px', margin: '0 auto' };
const booksGridStyle = { display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' };
const commentsContainerStyle = { marginTop: '2rem', padding: '1rem', border: '1px solid #646cff', borderRadius: '8px', backgroundColor: '#1a1a1a' };
const commentStyle = { borderBottom: '1px solid #646cff', padding: '0.5rem 0' };

export default Home;
