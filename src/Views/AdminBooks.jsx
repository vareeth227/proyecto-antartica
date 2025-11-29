import React, { useEffect, useState } from 'react';

export default function AdminBooks() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ title: '', author: '', price: '', image: '', description: '', stock: 1 });
  const [editingId, setEditingId] = useState(null);
  const [editingStock, setEditingStock] = useState('');
  const [error, setError] = useState(null);

  const load = async (p = page, l = limit) => {
    try {
      const res = await fetch(`${API_BASE}/books?page=${p}&limit=${l}`);
      if (!res.ok) throw new Error('Error cargando libros');
      const data = await res.json();
      setBooks(data.items || data);
      setTotal(data.total || (data.items && data.items.length) || 0);
      setPage(data.page || p);
      setLimit(data.limit || l);
    } catch (e) {
      console.error(e);
      setBooks([]);
      setTotal(0);
    }
  };

  useEffect(() => { load(1, limit); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addBook = async (e) => {
    e.preventDefault();
    if (!token) return window.location.href = '/login';
    try {
      const res = await fetch(`${API_BASE}/books`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title: form.title, author: form.author, price: Number(form.price) || 0, image: form.image || '/assets/placeholder.png', description: form.description, stock: Number(form.stock) || 0 }) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error creando libro');
      }
      setForm({ title: '', author: '', price: '', image: '', description: '', stock: 1 });
      load(1, limit);
    } catch (err) { alert(err.message); }
  };

  const removeBook = async (id) => {
    if (!token) return window.location.href = '/login';
    if (!window.confirm('¿Eliminar este libro? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error eliminando libro');
      }
      load(page, limit);
    } catch (e) { alert(e.message); }
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setEditingStock(String(book.stock || 0));
    setError(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditingStock(''); setError(null); };

  const saveEdit = async (id) => {
    if (!token) return window.location.href = '/login';
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ stock: Number(editingStock) }) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error actualizando libro');
      }
      cancelEdit();
      load(page, limit);
    } catch (e) { setError(e.message); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#194C57' }}>Administrar Libros</h2>
      <form onSubmit={addBook} style={{ marginBottom: '1rem' }}>
        <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Autor" value={form.author} onChange={handleChange} required />
        <input name="price" placeholder="Precio" value={form.price} onChange={handleChange} />
        <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
  <input name="image" placeholder="URL imagen" value={form.image} onChange={handleChange} />
  <button type="submit" style={{ backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 0.7rem', cursor: 'pointer' }}>Agregar Libro</button>
      </form>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Mostrando página {page} — {total} libros</div>
          <div>
            <button onClick={() => { if (page > 1) { load(page - 1, limit); } }} style={{ marginRight: 8, backgroundColor: 'var(--btn-secondary)', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 0.7rem', cursor: page <= 1 ? 'not-allowed' : 'pointer' }} disabled={page <= 1}>Anterior</button>
            <button onClick={() => { if ((page * limit) < total) load(page + 1, limit); }} style={{ backgroundColor: 'var(--btn-secondary)', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 0.7rem', cursor: ((page * limit) >= total) ? 'not-allowed' : 'pointer' }} disabled={(page * limit) >= total}>Siguiente</button>
          </div>
        </div>
        <ul>
          {books.map(b => (
            <li key={b.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{b.title}</strong> — {b.author} — ${b.price} — stock: {b.stock}
              {editingId === b.id ? (
                <span style={{ marginLeft: 12 }}>
                  <input type="number" value={editingStock} onChange={(e)=>setEditingStock(e.target.value)} style={{ width: 80 }} />
                  <button onClick={() => saveEdit(b.id)} style={{ marginLeft: 8, backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.6rem' }}>Guardar</button>
                  <button onClick={cancelEdit} style={{ marginLeft: 8, backgroundColor: 'var(--btn-disabled)', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.6rem' }}>Cancelar</button>
                </span>
              ) : (
                <span>
                  <button onClick={() => startEdit(b)} style={{ marginLeft: '0.5rem', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.6rem', cursor: 'pointer' }}>Editar stock</button>
                  <button onClick={() => removeBook(b.id)} style={{ marginLeft: '0.5rem', backgroundColor: 'var(--btn-danger)', border: 'none', borderRadius: 6, padding: '0.3rem 0.6rem', color: 'white', cursor: 'pointer' }}>Eliminar</button>
                </span>
              )}
            </li>
          ))}
        </ul>
        {error && <div style={{ color: '#b91c1c', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}
