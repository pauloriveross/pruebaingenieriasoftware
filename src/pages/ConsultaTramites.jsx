import { useState } from 'react';
import { tramiteService } from '../services/tramiteService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const badgeClass = (estado) => {
  const map = {
    'Aprobado': 'badge badge--success',
    'Pendiente PDI': 'badge badge--warning',
    'Revision': 'badge badge--info',
    'Rechazado': 'badge badge--danger',
    'En Proceso': 'badge badge--info',
    'Pendiente': 'badge badge--warning',
  };
  return map[estado] || 'badge';
};

const columns = [
  { key: 'rut', label: 'RUT/DNI' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo', label: 'Tipo Tramite' },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => <span className={badgeClass(row.estado)}>{row.estado}</span>,
  },
  { key: 'fecha', label: 'Fecha' },
];

export default function ConsultaTramites() {
  const [rut, setRut] = useState('');
  const [tramites, setTramites] = useState([]);
  const [consultado, setConsultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detalle, setDetalle] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rut.trim()) { setError('Ingrese un RUT o DNI para consultar'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await tramiteService.consultarPorRut(rut.trim());
      setTramites(data);
      setConsultado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page">
      <div className="public-container">
        <div className="public-header">
          <Link to="/" className="public-back">
            <FiArrowLeft size={16} /> Volver al inicio
          </Link>
          <div className="public-logo">SIGF</div>
          <h1>Consulta de Tramites</h1>
          <p>Ingrese su RUT o DNI para consultar el estado de sus tramites</p>
        </div>

        <form onSubmit={handleSearch} className="public-search">
          <AlertMessage type="error" message={error} onClose={() => setError('')} />
          <div className="search-box">
            <input
              type="text"
              placeholder="Ej: 12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn--primary search-btn" disabled={loading}>
              {loading ? <LoadingSpinner small /> : <><FiSearch size={18} /> Consultar</>}
            </button>
          </div>
        </form>

        {consultado && (
          <div className="animate-in">
            {tramites.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No se encontraron tramites para el RUT ingresado.</p>
              </div>
            ) : (
              <div className="card">
                <div className="card__header">
                  <h3>Resultados para {rut}</h3>
                  <span className="badge badge--info">{tramites.length} tramite(s)</span>
                </div>
                <DataTable
                  columns={columns}
                  data={tramites}
                  onRowClick={(row) => setDetalle(row)}
                />
              </div>
            )}
          </div>
        )}

        <Modal isOpen={!!detalle} onClose={() => setDetalle(null)} title="Detalle del Tramite" size="lg">
          {detalle && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Nombre</strong>
                  <span>{detalle.nombre}</span>
                </div>
                <div>
                  <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>RUT/DNI</strong>
                  <span>{detalle.rut}</span>
                </div>
                <div>
                  <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Tipo de Tramite</strong>
                  <span>{detalle.tipo}</span>
                </div>
                <div>
                  <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Fecha</strong>
                  <span>{detalle.fecha}</span>
                </div>
                <div>
                  <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Estado</strong>
                  <span className={badgeClass(detalle.estado)}>{detalle.estado}</span>
                </div>
                <div>
                  <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>ID Tramite</strong>
                  <span>#{detalle.id}</span>
                </div>
              </div>
              {detalle.detalle && (
                <div style={{ padding: 16, background: 'var(--color-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block', marginBottom: 4 }}>Detalles adicionales</strong>
                  <p>{detalle.detalle}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        <div className="public-footer">
          <p>Aduanas de Chile - Sistema Integrado de Gestion Fronteriza &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
