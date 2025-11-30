import React, { useEffect, useState } from 'react';
import './AdminBooks.css';

export default function AdminBooks() {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const token = localStorage.getItem('token');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
    description: '',
    stock: 1,
    releaseDate: '',
    genre: '',
    format: '',
    featured: false,
    pageCount: '',
  });
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'El título es obligatorio';
    if (!form.author.trim()) return 'El autor es obligatorio';
    if (Number(form.price) <= 0) return 'El precio debe ser mayor a 0';
    if (Number(form.stock) < 0) return 'El stock no puede ser negativo';
    if (form.releaseDate) {
      const today = new Date().toISOString().split('T')[0];
      if (form.releaseDate > today) return 'La fecha de publicación no puede ser futura';
    }
    if (!form.genre) return 'Selecciona un género';
    if (!form.format) return 'Selecciona un formato';
    if (form.pageCount && Number(form.pageCount) <= 0) return 'Las páginas deben ser mayor a 0';
    return '';
  };

  const addBook = async (e) => {
    e.preventDefault();
    if (!token) return window.location.href = '/login';
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const descriptionWithMeta = `${form.description || ''} | Género: ${form.genre || 'N/A'} | Formato: ${form.format || 'N/A'} | Publicación: ${form.releaseDate || 'N/A'} | Destacado: ${form.featured ? 'Sí' : 'No'} | Páginas: ${form.pageCount || 'N/A'}`;
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          author: form.author,
          price: Number(form.price) || 0,
          image: form.image || '/assets/placeholder.png',
          description: descriptionWithMeta,
          stock: Number(form.stock) || 0,
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error creando libro');
      }
      setForm({
        title: '',
        author: '',
        price: '',
        image: '',
        description: '',
        stock: 1,
        releaseDate: '',
        genre: '',
        format: '',
        featured: false,
        pageCount: '',
      });
      setError(null);
      load(1, limit);
    } catch (err) { setError(err.message); }
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
    } catch (e) { setError(e.message); }
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
    <div className="admin-books">
      <h2 className="admin-books__title">Administrar Libros</h2>

      <form onSubmit={addBook} className="admin-books__form">
        <div className="form-grid">
          <label className="form-field">
            <span>Título *</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label className="form-field">
            <span>Autor *</span>
            <input name="author" value={form.author} onChange={handleChange} required />
          </label>
          <label className="form-field">
            <span>Precio *</span>
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="1" />
          </label>
          <label className="form-field">
            <span>Stock *</span>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" required />
          </label>
          <label className="form-field">
            <span>URL imagen</span>
            <input name="image" value={form.image} onChange={handleChange} />
          </label>
          <label className="form-field">
            <span>Fecha publicación</span>
            <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
          </label>
          <label className="form-field">
            <span>Páginas</span>
            <input type="number" name="pageCount" value={form.pageCount} onChange={handleChange} min="1" />
          </label>
          <label className="form-field">
            <span>Género *</span>
            <select name="genre" value={form.genre} onChange={handleChange} required>
              <option value="">Selecciona</option>
              <option value="Fantasia">Fantasía</option>
              <option value="Ficción">Ficción</option>
              <option value="Infantil">Infantil</option>
              <option value="Romance">Romance</option>
              <option value="Ciencia">Ciencia</option>
            </select>
          </label>
          <label className="form-field">
            <span>Formato *</span>
            <div className="inline-options">
              <label><input type="radio" name="format" value="Fisico" checked={form.format === 'Fisico'} onChange={handleChange} /> Físico</label>
              <label><input type="radio" name="format" value="Digital" checked={form.format === 'Digital'} onChange={handleChange} /> Digital</label>
              <label><input type="radio" name="format" value="Mixto" checked={form.format === 'Mixto'} onChange={handleChange} /> Mixto</label>
            </div>
          </label>
          <label className="form-field form-field--checkbox">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            <span>Destacar libro</span>
          </label>
        </div>
        <label className="form-field">
          <span>Descripción</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
        </label>
        <button type="submit" className="btn btn-primary">Agregar Libro</button>
      </form>

      <div className="admin-books__list">
        <div className="list-header">
          <div>Mostrando página {page} - {total} libros</div>
          <div className="list-actions">
            <button onClick={() => { if (page > 1) { load(page - 1, limit); } }} className="btn btn-secondary" disabled={page <= 1}>Anterior</button>
            <button onClick={() => { if ((page * limit) < total) load(page + 1, limit); }} className="btn btn-secondary" disabled={(page * limit) >= total}>Siguiente</button>
          </div>
        </div>
        <ul className="book-items">
          {books.map(b => (
            <li key={b.id} className="book-item">
              <div>
                <strong>{b.title}</strong> - {b.author} - ${b.price} - stock: {b.stock}
              </div>
              {editingId === b.id ? (
                <div className="edit-inline">
                  <input type="number" value={editingStock} onChange={(e)=>setEditingStock(e.target.value)} />
                  <button onClick={() => saveEdit(b.id)} className="btn btn-primary">Guardar</button>
                  <button onClick={cancelEdit} className="btn btn-muted">Cancelar</button>
                </div>
              ) : (
                <div className="edit-inline">
                  <button onClick={() => startEdit(b)} className="btn btn-primary">Editar stock</button>
                  <button onClick={() => removeBook(b.id)} className="btn btn-danger">Eliminar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
}
