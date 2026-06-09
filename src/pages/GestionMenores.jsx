import { useState } from 'react';
import { Link } from 'react-router-dom';
import { menorService } from '../services/menorService';
import AlertMessage from '../components/AlertMessage';
import { FiArrowLeft, FiLock, FiCheckCircle } from 'react-icons/fi';

export default function GestionMenores() {
  const [alert, setAlert] = useState(null);
  const [exito, setExito] = useState(false);
  const [form, setForm] = useState({ nombreMenor: '', rutMenor: '', tutor: '', rutTutor: '', nacionalidad: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setExito(false);
    try {
      await menorService.registrar(form);
      setAlert({ type: 'success', message: 'Menor registrado correctamente. Queda pendiente de validacion por PDI.' });
      setExito(true);
      setForm({ nombreMenor: '', rutMenor: '', tutor: '', rutTutor: '', nacionalidad: '' });
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
          <h1>Gestion de Menores</h1>
          <p>Registro de menores para entrada y salida por pasos fronterizos</p>
        </div>

        <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

        {exito && (
          <div className="card" style={{ textAlign: 'center', padding: '32px', marginBottom: 20 }}>
            <FiCheckCircle size={48} style={{ color: 'var(--color-success)', marginBottom: 12 }} />
            <h3>Registro completado</h3>
            <p style={{ color: 'var(--color-text-light)', marginTop: 4 }}>
              El menor ha sido registrado. El permiso quedara pendiente de validacion por personal PDI en el paso fronterizo.
            </p>
          </div>
        )}

        <div className="card">
          <div className="card__header">
            <h3>Registrar Menor</h3>
          </div>
          <form onSubmit={handleRegister} className="vehiculo-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del menor</label>
                <input value={form.nombreMenor} onChange={(e) => setForm({ ...form, nombreMenor: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>RUT del menor</label>
                <input value={form.rutMenor} onChange={(e) => setForm({ ...form, rutMenor: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del tutor</label>
                <input value={form.tutor} onChange={(e) => setForm({ ...form, tutor: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>RUT/DNI del tutor</label>
                <input value={form.rutTutor} onChange={(e) => setForm({ ...form, rutTutor: e.target.value })} required placeholder="12.345.678-9" />
              </div>
            </div>
            <div className="form-group">
              <label>Nacionalidad</label>
              <input value={form.nacionalidad} onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })} required placeholder="Ej: Chilena, Argentina, etc." />
            </div>
            <div className="form-group">
              <label>Documento Permiso Notarial (PDF)</label>
              <input type="file" accept=".pdf" />
            </div>
            <button type="submit" className="btn btn--primary">
              Registrar Menor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
