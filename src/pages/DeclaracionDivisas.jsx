import { useState } from 'react';
import { Link } from 'react-router-dom';
import { divisaService } from '../services/divisaService';
import AlertMessage from '../components/AlertMessage';
import { FiArrowLeft, FiLock, FiCheckCircle, FiDollarSign } from 'react-icons/fi';

export default function DeclaracionDivisas() {
  const [alert, setAlert] = useState(null);
  const [exito, setExito] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [form, setForm] = useState({
    pasajero: '',
    rutPasajero: '',
    nacionalidad: '',
    monto: '',
    moneda: 'USD',
    origen: '',
  });

  const monedas = [
    { value: 'USD', label: 'Dolares (USD)', simbolo: '$' },
    { value: 'EUR', label: 'Euros (EUR)', simbolo: '€' },
    { value: 'ARS', label: 'Pesos Argentinos (ARS)', simbolo: '$' },
    { value: 'CLP', label: 'Pesos Chilenos (CLP)', simbolo: '$' },
    { value: 'BRL', label: 'Reales (BRL)', simbolo: 'R$' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExito(false);
    setResultado(null);
    const montoNum = parseFloat(form.monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setAlert({ type: 'error', message: 'Ingrese un monto valido.' });
      return;
    }
    try {
      const res = await divisaService.declarar({ ...form, monto: montoNum });
      setAlert({ type: 'success', message: res.mensaje });
      setExito(true);
      setResultado(res);
      setForm({ pasajero: '', rutPasajero: '', nacionalidad: '', monto: '', moneda: 'USD', origen: '' });
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
          <h1>Declaracion de Divisas - PDI</h1>
          <p>Declaracion de divisas y valores por montos iguales o superiores a USD 10,000 o su equivalente en otras monedas</p>
        </div>

        <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

        {exito && resultado && (
          <div className="card" style={{ textAlign: 'center', padding: '32px', marginBottom: 20 }}>
            <FiCheckCircle size={48} style={{ color: 'var(--color-success)', marginBottom: 12 }} />
            <h3>Declaracion registrada</h3>
            <p style={{ color: 'var(--color-text-light)', marginTop: 4 }}>
              {resultado.mensaje}
            </p>
            <div className="resultado-grid" style={{ marginTop: 16, textAlign: 'left', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
              <div><strong>Pasajero:</strong> {resultado.pasajero}</div>
              <div><strong>RUT/DNI:</strong> {resultado.rutPasajero}</div>
              <div><strong>Nacionalidad:</strong> {resultado.nacionalidad}</div>
              <div><strong>Monto:</strong> {resultado.moneda === 'USD' ? '$' : ''}{resultado.monto.toLocaleString()} {resultado.moneda}</div>
              <div><strong>Origen:</strong> {resultado.origen}</div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card__header">
            <h3><FiDollarSign size={18} /> Nueva Declaracion de Divisas</h3>
          </div>
          <form onSubmit={handleSubmit} className="vehiculo-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del pasajero</label>
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
            <div className="form-row">
              <div className="form-group">
                <label>Monto</label>
                <input
                  type="number"
                  step="0.01"
                  min="10000"
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  required
                  placeholder="10000"
                />
              </div>
              <div className="form-group">
                <label>Moneda</label>
                <select value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value })}>
                  {monedas.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Origen de los fondos</label>
              <textarea
                value={form.origen}
                onChange={(e) => setForm({ ...form, origen: e.target.value })}
                rows={2}
                required
                placeholder="Ej: Venta de bienes, prestamo bancario, ahorros, etc."
              />
            </div>
            <div className="card" style={{ background: 'rgba(217, 119, 6, 0.05)', borderLeft: '4px solid var(--color-warning)', padding: '12px 16px', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--color-warning)' }}>
                <strong>Importante:</strong> La declaracion de divisas es obligatoria para montos iguales o superiores a USD 10,000 (o su equivalente en otras monedas) al ingresar o salir del pais, segun la legislacion vigente.
              </p>
            </div>
            <button type="submit" className="btn btn--primary">
              Enviar Declaracion
            </button>
          </form>
        </div>

        <div className="card" style={{ background: 'rgba(0, 51, 102, 0.03)', textAlign: 'center', padding: '20px' }}>
          <p style={{ color: 'var(--color-text-light)', fontSize: 13 }}>
            Para revisar y gestionar declaraciones de divisas, debe iniciar sesion como funcionario PDI.
          </p>
          <Link to="/login" className="btn btn--outline" style={{ marginTop: 8 }}>
            <FiLock size={14} /> Acceso funcionarios
          </Link>
        </div>
      </div>
    </div>
  );
}
