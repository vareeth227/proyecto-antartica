// Importación de dependencias y componentes
import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';        // Componente que muestra un libro con flip card
import CommentForm from '../components/CommentForm';  // Formulario para agregar comentarios
import SidebarCategorias from '../components/SidebarCategorias'; // Menú lateral de categorías
import './Home.css';                                  // CSS del carousel horizontal y otros estilos

// ===========================================
// Lista inicial de libros disponibles (usada si no existe 'books' en localStorage)
// Añadimos campo stock por defecto
// ===========================================
const initialBooks = [
  { id: 1, title: "Cien Años de Soledad", author: "Gabriel García Márquez", price: 12000, image: "/assets/cienanos.png", description: "Una novela mágica y realista sobre la familia Buendía.", stock: 10 },
  { id: 2, title: "El Principito", author: "Antoine de Saint-Exupéry", price: 8000, image: "/assets/principito.png", description: "Un clásico cuento filosófico sobre la vida y la amistad.", stock: 10 },
  { id: 3, title: "1984", author: "George Orwell", price: 15000, image: "/assets/1984.png", description: "Una novela distópica sobre vigilancia y control totalitario.", stock: 10 },
  { id: 4, title: "Harry Potter y la Piedra Filosofal", author: "J.K. Rowling", price: 10000, image: "/assets/piedrafil.png", description: "El inicio de la saga donde Harry descubre que es un mago.", stock: 10 },
  { id: 5, title: "Harry Potter y la Cámara Secreta", author: "J.K. Rowling", price: 10500, image: "/assets/camarasecreta.png", description: "Una nueva amenaza acecha a los estudiantes de Hogwarts.", stock: 10 },
  { id: 6, title: "Harry Potter y el Prisionero de Azkaban", author: "J.K. Rowling", price: 11000, image: "/assets/azkaban.png", description: "Harry enfrenta el peligroso misterio de Sirius Black.", stock: 10 },
  { id: 7, title: "Harry Potter y el Cáliz de Fuego", author: "J.K. Rowling", price: 12000, image: "/assets/calizdefuego.png", description: "Harry participa en el Torneo de los Tres Magos.", stock: 10 },
  { id: 8, title: "Harry Potter y la Orden del Fénix", author: "J.K. Rowling", price: 12500, image: "/assets/ordenfenix.png", description: "La resistencia contra Voldemort comienza a fortalecerse.", stock: 10 },
  { id: 9, title: "Harry Potter y el Misterio del Príncipe", author: "J.K. Rowling", price: 13000, image: "/assets/misprince.png", description: "Harry descubre secretos oscuros sobre Voldemort.", stock: 10 }
];

// ===========================================
// Componente Home
// ===========================================
function Home() {
  // Estado de libros (stock) persistido en localStorage
  const [books, setBooks] = useState(initialBooks);
  // Estado del carrito local (usado solo para UI local); Cart component gestionará su propio fetch
  const [cart, setCart] = useState([]);
  // Estado de comentarios agregados por los usuarios
  const [comments, setComments] = useState([]);

  // Cargar libros desde la API al montar
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/books`)
      .then((r) => r.json())
      .then((data) => {
        // aceptar formato paginado { items, total } o array legacy
        if (Array.isArray(data)) setBooks(data);
        else setBooks(data.items || []);
      })
      .catch(() => setBooks(initialBooks));
  }, []);

  // Función para agregar un libro al carrito (reduce stock)
  const addToCart = (book) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ book_id: book.id, quantity: 1 })
  }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error || 'Error añadiendo al carrito');
      }
      // actualizar stock localmente
      setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, stock: b.stock - 1 } : b));
      // opcional: actualizar cart local para mostrar el panel
      setCart((c) => [...c, book]);
      // notificar a header y otros listeners que el carrito cambió
  try { window.dispatchEvent(new Event('cartChanged')); } catch { /* ignore dispatch errors */ }
    }).catch((err) => alert(err.message));
  };
  // Función para eliminar un libro del carrito por índice (y devolver stock)
  const _removeFromCart = (index) => {
    // Esta función local mantiene la UI; la eliminación real se hace en Cart component vía API
    const item = cart[index];
    if (item) {
      setBooks((prev) => prev.map((b) => b.id === item.id ? { ...b, stock: b.stock + 1 } : b));
    }
    setCart((c) => c.filter((_, i) => i !== index));
  };
  // Función para agregar un nuevo comentario
  const handleNewComment = (commentData) => setComments([...comments, commentData]);

  return (
    <div style={{ ...containerStyle, position: 'relative' }}>
      {/* ===========================================
          Carousel horizontal con título "Recién llegados"
          =========================================== */}
  <div className="carousel-container" style={{ margin: '7rem 0' }}>
  <h2 className="carousel-title" style={{ color: '#194C57' }}>Recién llegados</h2>
        <div className="horizontal-carousel">
          <div className="carousel-track" style={{ width: `${initialBooks.length * 6 * 160}px` }}>
            {[...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks].map((book, idx) => (
              <div key={idx} className="carousel-item">
                <img src={book.image} alt={book.title} />
                <h3 style={{ color: '#194C57', textAlign: 'center', fontSize: '1.1rem', marginTop: '0.5rem' }}>{book.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ===========================================
          Sección de Libros Disponibles
          =========================================== */}
    <h2 style={{ ...titleStyle, color: '#194C57' }}>Libros Disponibles</h2>
      <div style={booksGridStyle}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>


    {/* ===========================================
      Carousel horizontal con título "Ofertas!"
    =========================================== */}
  <div className="carousel-container" style={{ margin: '7rem 0 5rem 0' }}>
        <h2 className="carousel-title" style={{ color: '#194C57' }}>Ofertas!</h2>
        <div className="horizontal-carousel">
          <div className="carousel-track" style={{ width: `${initialBooks.length * 6 * 160}px` }}>
            {[...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks].map((book, idx) => (
              <div key={"oferta-"+idx} className="carousel-item">
                <img src={book.image} alt={book.title} />
                <h3 style={{ color: '#194C57', textAlign: 'center', fontSize: '1.1rem', marginTop: '0.5rem' }}>{book.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

    {/* ===========================================
      Carousel horizontal con título "Más Vendidos!"
    =========================================== */}
  <div className="carousel-container" style={{ marginBottom: '5rem' }}>
        <h2 className="carousel-title" style={{ color: '#194C57' }}>Más Vendidos!</h2>
        <div className="horizontal-carousel">
          <div className="carousel-track" style={{ width: `${initialBooks.length * 6 * 160}px` }}>
            {[...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks].map((book, idx) => (
              <div key={"vendido-"+idx} className="carousel-item">
                <img src={book.image} alt={book.title} />
                <h3 style={{ color: '#194C57', textAlign: 'center', fontSize: '1.1rem', marginTop: '0.5rem' }}>{book.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

  {/* ...existing code... */}
      {localStorage.getItem('token') && (
        <div style={cartSectionStyle}>
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
  color: 'inherit',
  backgroundColor: 'inherit',
  minHeight: '100vh',
};

// Si el body tiene la clase dark-mode, se usan las variables de modo oscuro por CSS
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
