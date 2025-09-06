// Importación de dependencias y componentes
import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';        // Componente que muestra un libro con flip card
import CommentForm from '../components/CommentForm';  // Formulario para agregar comentarios
import Cart from '../components/Cart';                // Carrito de compras
import './Home.css';                                  // CSS del carousel horizontal y otros estilos

// ===========================================
// Lista inicial de libros disponibles
// Cada libro tiene id, título, autor, precio, imagen y descripción
// ===========================================
const initialBooks = [
  { id: 1, title: "Cien Años de Soledad", author: "Gabriel García Márquez", price: 12000, image: "/assets/libro1.jpg", description: "Una novela mágica y realista sobre la familia Buendía." },
  { id: 2, title: "El Principito", author: "Antoine de Saint-Exupéry", price: 8000, image: "/assets/libro2.jpg", description: "Un clásico cuento filosófico sobre la vida y la amistad." },
  { id: 3, title: "1984", author: "George Orwell", price: 15000, image: "/assets/libro3.jpg", description: "Una novela distópica sobre vigilancia y control totalitario." },
  { id: 4, title: "Harry Potter y la Piedra Filosofal", author: "J.K. Rowling", price: 10000, image: "/assets/hp1.jpg", description: "El inicio de la saga donde Harry descubre que es un mago." },
  { id: 5, title: "Harry Potter y la Cámara Secreta", author: "J.K. Rowling", price: 10500, image: "/assets/hp2.jpg", description: "Una nueva amenaza acecha a los estudiantes de Hogwarts." },
  { id: 6, title: "Harry Potter y el Prisionero de Azkaban", author: "J.K. Rowling", price: 11000, image: "/assets/hp3.jpg", description: "Harry enfrenta el peligroso misterio de Sirius Black." },
  { id: 7, title: "Harry Potter y el Cáliz de Fuego", author: "J.K. Rowling", price: 12000, image: "/assets/hp4.jpg", description: "Harry participa en el Torneo de los Tres Magos." },
  { id: 8, title: "Harry Potter y la Orden del Fénix", author: "J.K. Rowling", price: 12500, image: "/assets/hp5.jpg", description: "La resistencia contra Voldemort comienza a fortalecerse." },
  { id: 9, title: "Harry Potter y el Misterio del Príncipe", author: "J.K. Rowling", price: 13000, image: "/assets/hp6.jpg", description: "Harry descubre secretos oscuros sobre Voldemort." }
];

// ===========================================
// Componente Home
// ===========================================
function Home() {
  // Estado del carrito, inicializado desde localStorage si existe
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  // Estado de comentarios agregados por los usuarios
  const [comments, setComments] = useState([]);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Función para agregar un libro al carrito
  const addToCart = (book) => setCart([...cart, book]);
  // Función para eliminar un libro del carrito por índice
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  // Función para agregar un nuevo comentario
  const handleNewComment = (commentData) => setComments([...comments, commentData]);

  return (
    <div style={containerStyle}>
      {/* ===========================================
          Carousel horizontal con título "Recién llegados"
          =========================================== */}
      <div className="carousel-container">
        <h2 className="carousel-title">Recién llegados</h2>
        <div className="horizontal-carousel">
          <div className="carousel-track">
            {/* Se duplican los libros para que el scroll infinito sea continuo */}
            {[...initialBooks, ...initialBooks].map((book, idx) => (
              <div key={idx} className="carousel-item">
                <img src={book.image} alt={book.title} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===========================================
          Sección de Libros Disponibles
          =========================================== */}
      <h2 style={titleStyle}>Libros Disponibles</h2>
      <div style={booksGridStyle}>
        {initialBooks.map((book) => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>

      {/* ===========================================
          Sección del carrito y formulario de comentarios
          Solo se muestra si hay items en el carrito
          =========================================== */}
      {cart.length > 0 && (
        <div style={cartSectionStyle}>
          <Cart cartItems={cart} removeFromCart={removeFromCart} />
          <CommentForm onSubmit={handleNewComment} />
        </div>
      )}

      {/* ===========================================
          Sección de comentarios de usuarios
          Solo se muestra si hay comentarios
          =========================================== */}
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

// ===========================================
// Estilos en línea
// ===========================================
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

// Exportación del componente Home
export default Home;
