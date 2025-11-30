// Importación de React y hooks necesarios
import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Componente funcional Cart que recibe props: cartItems y removeFromCart
function Cart({ removeFromCart: _propRemove }) {
  // Estado local 'cartItems' que mantiene los productos en el carrito
  const [cartItems, setCartItems] = useState([]);

  // Traer carrito desde la API cuando el componente monta
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // no autenticado
    fetch(`${API_BASE}/cart`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) throw new Error('No se pudo cargar el carrito');
        const data = await r.json();
        setCartItems(data);
      })
      .catch(() => setCartItems([]));
  }, []); // Array vacío [] indica que solo se ejecuta al montar

  // Función para eliminar un producto del carrito
  const removeFromCart = (index) => {
    const item = cartItems[index];
    if (!item) return;
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch(`${API_BASE}/cart/${item.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || 'Error eliminando del carrito');
        }
  // refetch cart from server to ensure consistency and stock updates
  const res = await fetch(`${API_BASE}/cart`, { headers: { Authorization: `Bearer ${token}` } });
  const fresh = await res.json().catch(() => []);
  setCartItems(fresh);
  // notify other parts of the app (header) in same tab
            try { window.dispatchEvent(new Event('cartChanged')); } catch { /* ignore */ }
    if (_propRemove) _propRemove(index);
      })
      .catch((e) => alert(e.message));
  };

  // Función para procesar el pago (checkout)
  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/cart/checkout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      // refetch cart and notify
      const fres = await fetch(`${API_BASE}/cart`, { headers: { Authorization: `Bearer ${token}` } });
      const fresh = await fres.json().catch(() => []);
      setCartItems(fresh);
        try { window.dispatchEvent(new Event('cartChanged')); } catch { /* ignore */ }

      // Si la respuesta fue OK o el carrito quedó vacío, consideramos compra completada
      if (res.ok || (Array.isArray(fresh) && fresh.length === 0)) {
        alert('Compra Hecha!');
        return;
      }

      // Si llegamos aquí, hubo un problema y el backend no reportó ok
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error during checkout');
    } catch (e) {
      // Si por alguna razón el carrito quedó vacío pese al error, mostrar mensaje de éxito
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (Array.isArray(localCart) && localCart.length === 0) {
        alert('Compra Hecha!');
        return;
      }
      alert(e.message);
    }
  };

  // Calcula el total de precios de todos los productos en el carrito
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  // Renderizado del componente
  return (
    <div style={cartContainerStyle}>
      <h3>Carrito de Compras</h3>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p> // Mensaje si no hay productos
      ) : (
        <>
          {/* Lista de productos en el carrito */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index} style={itemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Imagen del producto */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '50px', height: '70px', objectFit: 'cover' }} 
                  />
                  {/* Título y precio del producto */}
                  <span>{item.title} - ${item.price}</span>
                </div>
                {/* Botón para eliminar el producto */}
                <button style={removeButtonStyle} onClick={() => removeFromCart(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          {/* Total del carrito */}
          <p><strong>Total: </strong>${total}</p>
          {/* Mostrar botón Pagar solo para usuarios role 'client' */}
          {(() => {
            try {
              const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
              if (u && u.role === 'client') {
                return (
                  <div style={{ marginTop: '1rem' }}>
                    <button style={checkoutButtonStyle} onClick={handleCheckout}>Pagar</button>
                  </div>
                );
              }
            } catch { /* ignore parse errors */ }
            return null;
          })()}
        </>
      )}
    </div>
  );
}

// Estilos del contenedor del carrito
const cartContainerStyle = { 
  padding: '2rem', 
  border: '1px solid #646cff', 
  borderRadius: '8px', 
  backgroundColor: '#B4E2ED', 
  color: 'white', 
  margin: '2rem auto', 
  maxWidth: '800px' 
};

// Estilos para cada item del carrito
const itemStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '1rem' 
};

// Estilos del botón de eliminar
const removeButtonStyle = { 
  backgroundColor: '#ff4d4d', 
  border: 'none', 
  borderRadius: '4px', 
  padding: '0.3rem 0.6rem', 
  color: 'white', 
  cursor: 'pointer' 
};

const checkoutButtonStyle = {
  backgroundColor: '#28a745',
  border: 'none',
  borderRadius: '6px',
  padding: '0.6rem 1.2rem',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
};

// Exportación del componente para poder usarlo en otros archivos
export default Cart;
