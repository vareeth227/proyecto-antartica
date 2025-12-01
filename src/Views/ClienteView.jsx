import React, { useEffect, useState } from 'react';
import API from '../config/api';

export default function ClienteView() {
  const token = localStorage.getItem('token');
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async (p = page, l = limit) => {
    try {
      const res = await fetch(`${API.users}?role=client&page=${p}&limit=${l}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Error cargando clientes');
      const data = await res.json();
  const list = Array.isArray(data) ? data : (data.items || []);
  // como respaldo, filtrar clientes en frontend por si el backend responde sin filtro
  const clientsOnly = list.filter(u => u.role === 'client');
  setClients(clientsOnly);
  setTotal(data.total || clientsOnly.length || 0);
      setPage(data.page || p);
      setLimit(data.limit || l);
    } catch (e) {
      console.error(e);
      setClients([]);
      setTotal(0);
    }
  };

  useEffect(() => { load(1, limit); }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#194C57' }}>Listado de Clientes</h2>
      <div style={{ marginBottom: '1rem' }}>Mostrando {total} clientes — página {page}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {clients.map(c => (
          <div key={c.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8, background: '#fff' }}>
            <h3 style={{ margin: 0 }}>{c.nombre || '-'} {c.apellido || ''}</h3>
            <div style={{ color: '#555', marginBottom: '0.5rem' }}>{c.email}</div>
            <div><strong>Teléfono:</strong> {c.telefono || '-'}</div>
            <div><strong>Región:</strong> {c.region || '-'}</div>
            <div><strong>Comuna:</strong> {c.comuna || '-'}</div>
            <div><strong>RUT:</strong> {c.rut || '-'}</div>
            <div style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.9rem' }}>ID: {c.id} — Creado: {c.created_at ? new Date(c.created_at).toLocaleString() : '-'}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        <button onClick={() => { if (page > 1) load(page - 1, limit); }} disabled={page <= 1}>Anterior</button>
        <button onClick={() => { if ((page * limit) < total) load(page + 1, limit); }} disabled={(page * limit) >= total}>Siguiente</button>
      </div>
    </div>
  );
}
