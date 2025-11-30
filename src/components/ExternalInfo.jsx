import React, { useEffect, useState } from 'react';
import './ExternalInfo.css';

// Muestra indicadores externos (ej: USD/CLP) consumiendo una API pública.
export default function ExternalInfo() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://api.exchangerate.host/latest?base=USD&symbols=CLP,EUR')
      .then(async (r) => {
        if (!r.ok) throw new Error('No se pudo obtener indicadores');
        return r.json();
      })
      .then((json) => setData(json))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section className="external-card">
      <header className="external-card__header">
        <h3>Indicadores externos</h3>
        <span className="external-card__badge">API exchangerate.host</span>
      </header>
      {error && <div className="external-card__error">{error}</div>}
      {!error && !data && <div className="external-card__loading">Cargando...</div>}
      {data && (
        <div className="external-card__body">
          <div className="external-card__item">
            <span>USD → CLP</span>
            <strong>{Number(data.rates?.CLP || 0).toFixed(2)}</strong>
          </div>
          <div className="external-card__item">
            <span>USD → EUR</span>
            <strong>{Number(data.rates?.EUR || 0).toFixed(4)}</strong>
          </div>
          <div className="external-card__footer">Actualizado: {data.date}</div>
        </div>
      )}
    </section>
  );
}
