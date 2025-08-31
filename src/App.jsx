import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'register'

  const navigate = (page) => setCurrentPage(page);
  const handleLogin = () => setUserLoggedIn(true);
  const handleLogout = () => {
    setUserLoggedIn(false);
    setCurrentPage('home');
  };

  // Cambiar el título según la página
  useEffect(() => {
    let title = 'Antártica - Tienda de Libros';
    if (currentPage === 'home') title = 'Antártica-Home';
    if (currentPage === 'login') title = 'Antártica-Login';
    if (currentPage === 'register') title = 'Antártica-Registro';
    document.title = title;
  }, [currentPage]);

  return (
    <>
      <Header
        userLoggedIn={userLoggedIn}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && <Home />}
      {currentPage === 'login' && <Login />}
      {currentPage === 'register' && <Register />}
    </>
  );
}

export default App;
