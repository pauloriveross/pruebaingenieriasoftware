import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sagService } from '../services/sagService';
import AlertMessage from '../components/AlertMessage';
import { FiArrowLeft, FiLock, FiCheckCircle, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';

const tipoOptions = [
  { value: 'MASCOTA', label: 'Mascota', desc: 'Perros, gatos, hurones, etc.' },
  { value: 'PROD_ANIMAL', label: 'Producto de origen animal', desc: 'Carnes, quesos, miel, lana, etc.' },
  { value: 'PROD_VEGETAL', label: 'Producto de origen vegetal', desc: 'Frutas, verduras, semillas, flores, etc.' },
  { value: 'ALIMENTOS', label: 'Alimentos procesados', desc: 'Alimentos envasados, conservas, etc.' },
  { value: 'OTROS', label: 'Otros', desc: 'Otros productos de interes agropecuario' },
];

const initialItem = { tipo: 'MASCOTA', descripcion: '' };

export default function DeclaracionesSag() {
  const [alert, setAlert] = useState(null);
  const [exito, setExito] = useState(false);
  const [pasajero, setPasajero] = useState('');
  const [rutPasajero, setRutPasajero] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [items, setItems] = useState([{ ...initialItem }]);

  const handleAddItem = () => {
    setItems([...items, { ...initialItem }]);
  };

  const handleRemoveItem = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setItems(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setExito(false);
    const validItems = items.filter((it) => it.descripcion.trim());
    if (validItems.length === 0) {
      setAlert({ type: 'error', message: 'Debe agregar al menos un item con descripcion' });
      return;
    }
    try {
      await sagService.crear({ pasajero, rutPasajero, nacionalidad, items: validItems });
      setAlert({ type: 'success', message: 'Declaracion creada correctamente. Queda pendiente de revision por SAG.' });
      setExito(true);
      setPasajero('');
      setRutPasajero('');
      setNacionalidad('');
      setItems([{ ...initialItem }]);
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
          <p>Declaracion jurada de mascotas, productos de origen animal, vegetal y otros</p>
        </div>

        <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

        {exito && (
          <div className="card" style={{ textAlign: 'center', padding: '32px', marginBottom: 20 }}>
            <FiCheckCircle size={48} style={{ color: 'var(--color-success)', marginBottom: 12 }} />
            <h3>Declaracion enviada</h3>
            <p style={{ color: 'var(--color-text-light)', marginTop: 4 }}>
              Su declaracion ha sido registrada con {items.length} item(s). Quedara pendiente de revision por el Servicio Agricola y Ganadero (SAG) en el paso fronterizo.
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
                <input value={pasajero} onChange={(e) => setPasajero(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>RUT/DNI</label>
                <input value={rutPasajero} onChange={(e) => setRutPasajero(e.target.value)} required placeholder="12.345.678-9" />
              </div>
            </div>
            <div className="form-group">
              <label>Nacionalidad</label>
              <input value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} required placeholder="Ej: Chilena, Argentina, etc." />
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 style={{ fontSize: 15, fontWeight: 600 }}>Items a declarar</h4>
              <button type="button" className="btn btn--sm btn--outline" onClick={handleAddItem}>
                <FiPlus size={14} /> Agregar item
              </button>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  marginBottom: 12,
                  background: '#FAFBFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <strong style={{ fontSize: 13 }}>Item #{idx + 1}</strong>
                  {items.length > 1 && (
                    <button type="button" className="btn btn--sm btn--danger" onClick={() => handleRemoveItem(idx)} style={{ padding: '3px 8px' }}>
                      <FiTrash2 size={13} /> Quitar
                    </button>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo</label>
                    <select value={item.tipo} onChange={(e) => handleItemChange(idx, 'tipo', e.target.value)}>
                      {tipoOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <span style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>
                      {tipoOptions.find((o) => o.value === item.tipo)?.desc}
                    </span>
                  </div>
                  <div className="form-group">
                    <label>Descripcion</label>
                    <textarea
                      value={item.descripcion}
                      onChange={(e) => handleItemChange(idx, 'descripcion', e.target.value)}
                      rows={2}
                      placeholder="Describa el producto, especie, cantidad, etc."
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 10, background: 'rgba(2, 132, 199, 0.05)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 12, color: 'var(--color-text-light)' }}>
              <FiAlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Puede declarar multiples items en una sola declaracion. Cada item debe incluir el tipo de producto y una descripcion detallada.</span>
            </div>

            <button type="submit" className="btn btn--primary">
              Enviar Declaracion ({items.length} item{items.length !== 1 ? 's' : ''})
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
