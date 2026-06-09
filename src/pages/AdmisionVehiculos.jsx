import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vehiculoService } from '../services/vehiculoService';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiPrinter, FiArrowLeft, FiLock } from 'react-icons/fi';

export default function AdmisionVehiculos() {
  const [nombre, setNombre] = useState('');
  const [rutPropietario, setRutPropietario] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [patente, setPatente] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleProcesar = async (e) => {
    e.preventDefault();
    if (!patente.trim()) { setAlert({ type: 'error', message: 'Ingrese una patente' }); return; }
    if (!rutPropietario.trim()) { setAlert({ type: 'error', message: 'Ingrese su RUT/DNI' }); return; }
    if (!nombre.trim()) { setAlert({ type: 'error', message: 'Ingrese su nombre y apellido' }); return; }
    if (!nacionalidad.trim()) { setAlert({ type: 'error', message: 'Ingrese su nacionalidad' }); return; }
    setAlert(null);
    setResultado(null);
    setProcesando(true);
    try {
      const res = await vehiculoService.procesarAdmision({ patente, rutPropietario, nombre, nacionalidad });
      setResultado(res);
      setAlert({ type: 'success', message: 'Admision temporal procesada exitosamente' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setProcesando(false);
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
          <h1>Admision Temporal de Vehiculos</h1>
          <p>Procesamiento de salida y admision temporal (plazo legal: 180 dias)</p>
        </div>

        <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

        <div className="card">
          <div className="card__header">
            <h3>Procesar Nueva Admision</h3>
          </div>
          <form onSubmit={handleProcesar} className="vehiculo-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre y apellido</label>
                <input type="text" placeholder="Ej: Juan Perez" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>RUT/DNI</label>
                <input type="text" placeholder="Ej: 12.345.678-9" value={rutPropietario} onChange={(e) => setRutPropietario(e.target.value)} required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Nacionalidad</label>
              <input type="text" placeholder="Ej: Chilena, Argentina, etc." value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} required />
            </div>
            <div className="patente-input-group">
              <input
                type="text"
                placeholder="Ingrese patente (ej: ABCD-12)"
                value={patente}
                onChange={(e) => setPatente(e.target.value.toUpperCase())}
                className="patente-input"
                maxLength={8}
              />
              <button type="submit" className="btn btn--primary btn--lg" disabled={procesando}>
                {procesando ? <LoadingSpinner small /> : <><FiSearch /> Procesar Admision</>}
              </button>
            </div>
          </form>

          {resultado && (
            <div className="resultado-admision">
              <div className="resultado-grid">
                <div><strong>Patente:</strong> {resultado.patente}</div>
                <div><strong>Documento:</strong> {resultado.documentoGenerado}</div>
                <div><strong>Fecha Ingreso:</strong> {resultado.fechaIngreso}</div>
                <div><strong>Admision Hasta:</strong> <span className="text-highlight">{resultado.admisionHasta}</span></div>
                <div><strong>Plazo:</strong> <span className="text-highlight">180 dias</span></div>
              </div>
              <button className="btn btn--outline">
                <FiPrinter /> Imprimir Documento
              </button>
            </div>
          )}
        </div>

        <div className="card" style={{ background: 'rgba(0, 51, 102, 0.03)', textAlign: 'center', padding: '20px' }}>
          <p style={{ color: 'var(--color-text-light)', fontSize: 13 }}>
            Para consultar vehiculos registrados, debe iniciar sesion como funcionario de Aduana.
          </p>
          <Link to="/login" className="btn btn--outline" style={{ marginTop: 8 }}>
            <FiLock size={14} /> Acceso funcionarios
          </Link>
        </div>
      </div>
    </div>
  );
}
