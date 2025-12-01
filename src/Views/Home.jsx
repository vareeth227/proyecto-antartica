// Importación de dependencias y componentes
import React, { useState, useEffect } from 'react';
import API from '../config/api';
import BookCard from '../components/BookCard';        // Componente que muestra un libro con flip card
import CommentForm from '../components/CommentForm';  // Formulario para agregar comentarios
import SidebarCategorias from '../components/SidebarCategorias'; // Menú lateral de categorías
import './Home.css';                                  // CSS del carousel horizontal y otros estilos

// Lista inicial de libros disponibles (usada si no existe 'books' en localStorage)
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

function Home() {
  const [books, setBooks] = useState(initialBooks);
  const [cart, setCart] = useState([]);
  const [comments, setComments] = useState([]);

  // Cargar libros desde la API al montar
  useEffect(() => {
    const tryFetch = async () => {
      try {
        const r = await fetch(API.books);
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (Array.isArray(data)) { setBooks(data); return; }
        setBooks(data.items || []);
        return;
      } catch {
        /* fallback a catálogo local si la API falla */
      }
      setBooks(initialBooks);
    };
    tryFetch();
  }, []);

  // Agregar libro al carrito
  const addToCart = (book) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const payload = JSON.stringify({ book_id: book.id, quantity: 1 });
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    (async () => {
      let lastError = 'Error añadiendo al carrito';
      try {
        const r = await fetch(API.cart, { method: 'POST', headers, body: payload });
        if (!r.ok) {
          const err = await r.json().catch(async () => {
            const txt = await r.text().catch(() => '');
            return { error: txt };
          });
          throw new Error(err.error || `Error ${r.status} en ${API.cart}`);
        }
        setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, stock: b.stock - 1 } : b));
        setCart((c) => [...c, book]);
        try { window.dispatchEvent(new Event('cartChanged')); } catch { /* ignore */ }
        return;
      } catch (err) {
        lastError = err.message;
      }
      alert(lastError);
    })();
  };

  const _removeFromCart = (index) => {
    const item = cart[index];
    if (item) {
      setBooks((prev) => prev.map((b) => b.id === item.id ? { ...b, stock: b.stock + 1 } : b));
    }
    setCart((c) => c.filter((_, i) => i !== index));
  };

  const handleNewComment = (commentData) => setComments([...comments, commentData]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
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

      <h2 style={{ textAlign: 'center', color: '#194C57', marginBottom: '2rem', fontSize: '2rem' }}>Libros Disponibles</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>

      <div className="carousel-container" style={{ margin: '7rem 0 5rem 0' }}>
        <h2 className="carousel-title" style={{ color: '#194C57' }}>Ofertas!</h2>
        <div className="horizontal-carousel">
          <div className="carousel-track" style={{ width: `${initialBooks.length * 6 * 160}px` }}>
            {[...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks].map((book, idx) => (
              <div key={`oferta-${idx}`} className="carousel-item">
                <img src={book.image} alt={book.title} />
                <h3 style={{ color: '#194C57', textAlign: 'center', fontSize: '1.1rem', marginTop: '0.5rem' }}>{book.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="carousel-container" style={{ marginBottom: '5rem' }}>
        <h2 className="carousel-title" style={{ color: '#194C57' }}>Más Vendidos!</h2>
        <div className="horizontal-carousel">
          <div className="carousel-track" style={{ width: `${initialBooks.length * 6 * 160}px` }}>
            {[...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks, ...initialBooks].map((book, idx) => (
              <div key={`vendido-${idx}`} className="carousel-item">
                <img src={book.image} alt={book.title} />
                <h3 style={{ color: '#194C57', textAlign: 'center', fontSize: '1.1rem', marginTop: '0.5rem' }}>{book.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {localStorage.getItem('token') && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <CommentForm onSubmit={handleNewComment} />
        </div>
      )}

      {comments.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '2px solid #646cff', borderRadius: '12px', backgroundColor: '#e3f6f5' }}>
          <h3>Comentarios de los usuarios</h3>
          {comments.map((c, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid #646cff', padding: '0.75rem 0' }}>
              <p style={{ marginBottom: '0.5rem', fontSize: '1rem', lineHeight: '1.4' }}>{c.comment}</p>
              <p style={{ fontWeight: 'bold', color: '#333' }}><strong>Calificación:</strong> {c.rating} ⭐</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
