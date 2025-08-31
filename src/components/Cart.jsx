import React, { useState, useEffect } from 'react';

function Cart({ cartItems: propCart, removeFromCart: propRemove }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const removeFromCart = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    if (propRemove) propRemove(index);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={cartContainerStyle}>
      <h3>Carrito de Compras</h3>
      {cartItems.length === 0 ? <p>No hay productos en el carrito.</p> : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index} style={itemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.image} alt={item.title} style={{ width: '50px', height: '70px', objectFit: 'cover' }} />
                  <span>{item.title} - ${item.price}</span>
                </div>
                <button style={removeButtonStyle} onClick={() => removeFromCart(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <p><strong>Total: </strong>${total}</p>
        </>
      )}
    </div>
  );
}

const cartContainerStyle = { padding: '2rem', border: '1px solid #646cff', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white', margin: '2rem auto', maxWidth: '800px' };
const itemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' };
const removeButtonStyle = { backgroundColor: '#ff4d4d', border: 'none', borderRadius: '4px', padding: '0.3rem 0.6rem', color: 'white', cursor: 'pointer' };

export default Cart;
