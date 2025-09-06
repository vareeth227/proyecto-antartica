// Importación de React
import React from "react";
// Importa los estilos CSS que definen la flip card y sus elementos internos
import "./BookCard.css"; 

/**
 * Componente BookCard
 * 
 * Muestra un libro con efecto flip (frontal y trasera) y permite agregarlo al carrito.
 * 
 * Props:
 * - book: objeto con información del libro
 *   { title, author, price, image, description }
 * - addToCart: función que se llama al presionar el botón "Agregar al carrito"
 */
function BookCard({ book, addToCart }) {

  return (
    <div className="flip-card">
      {/* Contenedor interno que realiza la rotación */}
      <div className="flip-card-inner">

        {/* ==============================
            Parte frontal de la tarjeta
            ============================== */}
        <div className="flip-card-front">
          {/* Imagen del libro */}
          <img 
            src={book.image}            // URL de la imagen
            alt={book.title}            // Texto alternativo para accesibilidad
            className="book-image"      // Clase CSS que controla tamaño y estilo de la imagen
          />
          {/* Título del libro */}
          <h3 className="title">{book.title}</h3>
        </div>

        {/* ==============================
            Parte trasera de la tarjeta
            ============================== */}
        <div className="flip-card-back">
          {/* Repite el título para consistencia */}
          <h3 className="title">{book.title}</h3>
          {/* Autor */}
          <p><strong>Autor:</strong> {book.author}</p>
          {/* Precio */}
          <p><strong>Precio:</strong> ${book.price}</p>
          {/* Descripción */}
          <p>{book.description}</p>
          {/* Botón para agregar al carrito */}
          <button 
            className="add-button"                 // Clase CSS para estilo y hover
            onClick={() => addToCart(book)}        // Llama a la función addToCart con el objeto book
          >
            Agregar al carrito
          </button>
        </div>

      </div>
    </div>
  );
}

// Exportación del componente para usarlo en otros módulos
export default BookCard;
