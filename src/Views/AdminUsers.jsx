import React, { useEffect, useState } from 'react';

export default function AdminUsers() {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async (p = page, l = limit) => {
    try {
      const res = await fetch(`${API_BASE}/users?page=${p}&limit=${l}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Error cargando usuarios');
      const data = await res.json();
      // aceptar dos formatos: array (legacy) o { items, total, page, limit }
      let list = [];
      if (Array.isArray(data)) {
        list = data;
        setTotal(data.length || 0);
        setPage(p);
        setLimit(l);
      } else {
        list = data.items || [];
        setTotal(data.total || 0);
        setPage(data.page || p);
        setLimit(data.limit || l);
      }
      // asegurar que los admins siempre vayan arriba (respaldo en frontend)
      list.sort((a, b) => {
        if ((a.role === 'admin') && (b.role !== 'admin')) return -1;
        if ((b.role === 'admin') && (a.role !== 'admin')) return 1;
        return b.id - a.id;
      });
      setUsers(list);
    } catch (e) {
      console.error(e);
      setUsers([]);
      setTotal(0);
    }
  };

  useEffect(() => { load(1, limit); }, []);

  const removeUser = async (id, role) => {
    if (!token) return window.location.href = '/login';
    if (role === 'admin') return alert('No se puede eliminar un usuario con rol admin.');
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error eliminando usuario');
      }
      load(page, limit);
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#194C57' }}>Administrar Usuarios</h2>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>Mostrando página {page} — {total} usuarios</div>
            <div>
              <button onClick={() => { if (page > 1) { load(page - 1, limit); } }} style={{ marginRight: 8, backgroundColor: 'var(--btn-secondary)', color: 'white', border: 'none', borderRadius: 6, padding: '0.35rem 0.7rem', cursor: page <= 1 ? 'not-allowed' : 'pointer' }} disabled={page <= 1}>Anterior</button>
              <button onClick={() => { if ((page * limit) < total) load(page + 1, limit); }} style={{ backgroundColor: 'var(--btn-secondary)', color: 'white', border: 'none', borderRadius: 6, padding: '0.35rem 0.7rem', cursor: ((page * limit) >= total) ? 'not-allowed' : 'pointer' }} disabled={(page * limit) >= total}>Siguiente</button>
            </div>
          </div>
        <ul>
          {users.map(u => (
            <li key={u.id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <strong>{u.nombre || '-'}</strong> ({u.email}) — <em>role:</em> {u.role} — <span style={{ color: '#666' }}>ID: {u.id}</span>
              </div>
              {u.role === 'admin' ? (
                <button disabled title="No se puede eliminar usuarios admin" style={{ marginLeft: '0.5rem', backgroundColor: 'var(--admin-badge)', border: 'none', borderRadius: 6, padding: '0.35rem 0.65rem', color: 'white', cursor: 'not-allowed' }}>Admin</button>
              ) : (
                <button onClick={() => removeUser(u.id, u.role)} style={{ marginLeft: '0.5rem', backgroundColor: 'var(--btn-danger)', border: 'none', borderRadius: 6, padding: '0.35rem 0.65rem', color: 'white', cursor: 'pointer' }}>Eliminar</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
