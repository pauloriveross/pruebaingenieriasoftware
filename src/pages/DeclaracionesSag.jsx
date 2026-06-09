import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sagService } from '../services/sagService';
import AlertMessage from '../components/AlertMessage';
import { FiArrowLeft, FiLock, FiCheckCircle } from 'react-icons/fi';

const tipoOptions = [
  { value: 'MASCOTA', label: 'Mascota' },
  { value: 'PROD_ANIMAL', label: 'Producto de origen animal' },
  { value: 'PROD_VEGETAL', label: 'Producto de origen vegetal' },
];

export default function DeclaracionesSag() {
  const [alert, setAlert] = useState(null);
  const [exito, setExito] = useState(false);
  const [form, setForm] = useState({ pasajero: '', rutPasajero: '', nacionalidad: '', tipo: 'MASCOTA', descripcion: '' });
  const [quiereDeclarar, setQuiereDeclarar] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setExito(false);
    try {
      await sagService.crear(form);
      setAlert({ type: 'success', message: 'Declaracion creada correctamente. Queda pendiente de revision por SAG.' });
      setExito(true);
      setForm({ pasajero: '', rutPasajero: '', nacionalidad: '', tipo: 'MASCOTA', descripcion: '' });
      setQuiereDeclarar(null);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="public-page">
      <div className="public-container">
        <div className="public-header">
          <div className="public-header__top">
            <Link to="/" className="public-back">
              <FiArrowLeft size={16} /> Volver al inicio
            </Link>
            <Link to="/login" className="public-back">
              <FiLock size={14} /> Acceso funcionarios
            </Link>
          </div>
          <div className="public-logo">SIGF</div>
          <h1>Declaraciones SAG</h1>
          <p>Declaracion jurada para mascotas, productos de origen animal y vegetal</p>
        </div>

        <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

        {exito && (
          <div className="card" style={{ textAlign: 'center', padding: '32px', marginBottom: 20 }}>
            <FiCheckCircle size={48} style={{ color: 'var(--color-success)', marginBottom: 12 }} />
            <h3>Declaracion enviada</h3>
            <p style={{ color: 'var(--color-text-light)', marginTop: 4 }}>
              Su declaracion ha sido registrada. Quedara pendiente de revision por el Servicio Agricola y Ganadero (SAG) en el paso fronterizo.
            </p>
          </div>
        )}

        <div className="card">
          <div className="card__header">
            <h3>Nueva Declaracion</h3>
          </div>
          <form onSubmit={handleCreate} className="vehiculo-form">
            <div className="form-row">
              <div className="form-group">
                <label>Pasajero</label>
                <input value={form.pasajero} onChange={(e) => setForm({ ...form, pasajero: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>RUT/DNI</label>
                <input value={form.rutPasajero} onChange={(e) => setForm({ ...form, rutPasajero: e.target.value })} required placeholder="12.345.678-9" />
              </div>
            </div>
            <div className="form-group">
              <label>Nacionalidad</label>
              <input value={form.nacionalidad} onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })} required placeholder="Ej: Chilena, Argentina, etc." />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                {tipoOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginTop: 8 }}>
              <label>¿Va a declarar algo?</label>
              <div className="btn-group" style={{ marginTop: 4 }}>
                <button type="button" className={`btn btn--sm ${quiereDeclarar === true ? 'btn--primary' : 'btn--secondary'}`} onClick={() => { setQuiereDeclarar(true); setForm({ ...form, descripcion: form.descripcion }); }}>
                  Si
                </button>
                <button type="button" className={`btn btn--sm ${quiereDeclarar === false ? 'btn--primary' : 'btn--secondary'}`} onClick={() => { setQuiereDeclarar(false); setForm({ ...form, descripcion: '' }); }}>
                  No
                </button>
              </div>
            </div>
            {quiereDeclarar === true && (
              <div className="form-group">
                <label>Descripcion</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  required
                />
              </div>
            )}
            <button type="submit" className="btn btn--primary" style={{ marginTop: 16 }}>
              Enviar Declaracion
            </button>
          </form>
        </div>

        <div className="card" style={{ background: 'rgba(0, 51, 102, 0.03)', textAlign: 'center', padding: '20px' }}>
          <p style={{ color: 'var(--color-text-light)', fontSize: 13 }}>
            Para revisar y gestionar declaraciones, debe iniciar sesion como funcionario SAG.
          </p>
          <Link to="/login" className="btn btn--outline" style={{ marginTop: 8 }}>
            <FiLock size={14} /> Acceso funcionarios
          </Link>
        </div>
      </div>
    </div>
  );
}
