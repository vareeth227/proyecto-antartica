import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('currentUser');
  if (!raw) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No hay usuario autenticado.</p>
      </div>
    );
  }

  const current = JSON.parse(raw);
  const [full, setFull] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // fallback a localStorage users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const f = users.find((u) => u.email === current.email) || current;
        setFull(f);
        return;
      }
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_BASE}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const fallbackUsers = JSON.parse(localStorage.getItem('users') || '[]');
          setFull(fallbackUsers.find((u) => u.email === current.email) || current);
          return;
        }
        const data = await res.json();
        setFull(data.user || current);
      } catch (e) {
        console.error(e);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        setFull(users.find((u) => u.email === current.email) || current);
      }
    };
    load();
  }, []);

  if (!full) {
    return (<div style={{ padding: '2rem' }}>Cargando datos...</div>);
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Datos de {full.nombre || full.email}</h2>
      <div style={{ border: '1px solid #646cff', padding: '1rem', borderRadius: '8px', background: '#f7fbfc' }}>
        <p><strong>Nombre:</strong> {full.nombre || '-'}</p>
        <p><strong>Apellido:</strong> {full.apellido || '-'}</p>
        <p><strong>Email:</strong> {full.email}</p>
        {full.telefono && <p><strong>Teléfono:</strong> {full.telefono}</p>}
        {full.region && <p><strong>Región:</strong> {full.region}</p>}
        {full.comuna && <p><strong>Comuna:</strong> {full.comuna}</p>}
        {full.rut && <p><strong>RUT:</strong> {full.rut}</p>}
        {/* No mostrar role para clientes */}
        {full.role === 'admin' && <p><strong>Rol:</strong> {full.role}</p>}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        {full.role === 'admin' && (
          <button onClick={() => navigate('/adminview')} style={btnStyle}>Ir al Panel Admin</button>
        )}
        <button onClick={() => { localStorage.removeItem('currentUser'); navigate('/'); }} style={btnStyleSecondary}>Logout</button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#194C57',
  color: 'white',
  cursor: 'pointer'
};

const btnStyleSecondary = {
  ...btnStyle,
  background: '#646cff'
};

export default Profile;
