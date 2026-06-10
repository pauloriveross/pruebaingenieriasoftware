import { useState, useEffect } from 'react';
import { sagService } from '../services/sagService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiCheckCircle, FiXCircle, FiEye, FiChevronRight } from 'react-icons/fi';

const tipoLabels = {
  MASCOTA: 'Mascota',
  PROD_ANIMAL: 'Prod. Animal',
  PROD_VEGETAL: 'Prod. Vegetal',
  ALIMENTOS: 'Alimentos',
  OTROS: 'Otros',
};

const columns = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'pasajero', label: 'Pasajero' },
  { key: 'rutPasajero', label: 'RUT/DNI' },
  {
    key: 'items',
    label: 'Items',
    render: (row) => <span>{row.items?.length || 1} item(s)</span>,
  },
  {
    key: 'aprobado',
    label: 'Estado',
    render: (row) => {
      if (row.aprobado === true) return <span className="badge badge--success">Aprobado</span>;
      if (row.aprobado === false) return <span className="badge badge--danger">Rechazado</span>;
      return <span className="badge badge--warning">Pendiente</span>;
    },
  },
  {
    key: 'acciones',
    label: 'Acciones',
    render: (row) => {
      if (row.aprobado === true) {
        return <span className="badge badge--success"><FiCheckCircle size={14} /> Aprobado</span>;
      }
      if (row.aprobado === false) {
        return <span className="badge badge--danger"><FiXCircle size={14} /> Rechazado</span>;
      }
      return (
        <div className="action-btns">
          <button
            className="btn btn--sm btn--success"
            onClick={(e) => { e.stopPropagation(); window.handleAprobarSag?.(row.id, true); }}
          >
            <FiCheckCircle /> Aprobar
          </button>
          <button
            className="btn btn--sm btn--danger"
            onClick={(e) => { e.stopPropagation(); window.handleAprobarSag?.(row.id, false); }}
          >
            <FiXCircle /> Rechazar
          </button>
        </div>
      );
    },
  },
];

export default function PanelSag() {
  const [declaraciones, setDeclaraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filtro, setFiltro] = useState('PENDIENTE');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [detalle, setDetalle] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await sagService.listar();
    setDeclaraciones(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  window.handleAprobarSag = async (id, aprobado) => {
    try {
      await sagService.aprobar(id, aprobado);
      setAlert({
        type: aprobado ? 'success' : 'warning',
        message: aprobado ? 'Declaracion aprobada' : 'Declaracion rechazada',
      });
      load();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const filtrados = declaraciones.filter((d) => {
    if (filtro === 'PENDIENTE' && d.aprobado !== null) return false;
    if (filtro === 'APROBADOS' && d.aprobado !== true) return false;
    if (filtro === 'RECHAZADOS' && d.aprobado !== false) return false;
    if (filtroTipo !== 'TODOS') {
      const hasTipo = d.items?.some((it) => it.tipo === filtroTipo);
      if (!hasTipo) return false;
    }
    return true;
  });

  const pendientes = declaraciones.filter((d) => d.aprobado === null).length;
  const aprobados = declaraciones.filter((d) => d.aprobado === true).length;
  const rechazados = declaraciones.filter((d) => d.aprobado === false).length;

  const abrirDetalle = async (row) => {
    const decl = await sagService.obtenerPorId(row.id);
    setDetalle(decl || row);
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h2>Panel SAG - Revision de Declaraciones</h2>
        <p>Control sanitario de mascotas, productos de origen animal y vegetal</p>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <div className="card">
        <div className="card__header">
          <h3>Filtros</h3>
        </div>
        <div className="card__body">
          <div className="form-row" style={{ marginBottom: 0 }}>
            <div className="filtro-group">
              <button
                className={`btn btn--sm ${filtro === 'PENDIENTE' ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setFiltro('PENDIENTE')}
              >
                Pendientes ({pendientes})
              </button>
              <button
                className={`btn btn--sm ${filtro === 'APROBADOS' ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setFiltro('APROBADOS')}
              >
                Aprobados ({aprobados})
              </button>
              <button
                className={`btn btn--sm ${filtro === 'RECHAZADOS' ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setFiltro('RECHAZADOS')}
              >
                Rechazados ({rechazados})
              </button>
            </div>
            <div className="form-group" style={{ maxWidth: 200 }}>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="TODOS">Todos los tipos</option>
                <option value="MASCOTA">Mascotas</option>
                <option value="PROD_ANIMAL">Prod. Animal</option>
                <option value="PROD_VEGETAL">Prod. Vegetal</option>
                <option value="ALIMENTOS">Alimentos</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {filtrados.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-light)' }}>
            No se encontraron declaraciones con los filtros seleccionados.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtrados}
            onRowClick={(row) => abrirDetalle(row)}
          />
        )}
      </div>

      <Modal isOpen={!!detalle} onClose={() => setDetalle(null)} title="Detalle de Declaracion" size="lg">
        {detalle && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Pasajero</strong>
                <span>{detalle.pasajero}</span>
              </div>
              <div>
                <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>RUT/DNI</strong>
                <span>{detalle.rutPasajero || '-'}</span>
              </div>
              <div>
                <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Nacionalidad</strong>
                <span>{detalle.nacionalidad || '-'}</span>
              </div>
              <div>
                <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Fecha</strong>
                <span>{detalle.fecha}</span>
              </div>
              <div>
                <strong style={{ fontSize: 12, color: 'var(--color-text-light)', display: 'block' }}>Estado</strong>
                {detalle.aprobado === true ? (
                  <span className="badge badge--success">Aprobado</span>
                ) : detalle.aprobado === false ? (
                  <span className="badge badge--danger">Rechazado</span>
                ) : (
                  <span className="badge badge--warning">Pendiente</span>
                )}
              </div>
            </div>

            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
              Items declarados ({detalle.items?.length || 0})
            </h4>

            {detalle.items && detalle.items.length > 0 ? (
              <table className="data-table" style={{ marginBottom: 12 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tipo</th>
                    <th>Descripcion</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ width: 40, textAlign: 'center' }}>{idx + 1}</td>
                      <td>{tipoLabels[item.tipo] || item.tipo}</td>
                      <td>{item.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', marginBottom: 12 }}>
                {detalle.descripcion || 'Sin descripcion'}
              </p>
            )}

            {detalle.comentario && (
              <div style={{ marginTop: 12, padding: 12, background: 'rgba(217, 119, 6, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(217, 119, 6, 0.15)' }}>
                <strong style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Comentario:</strong>
                <p style={{ marginTop: 4 }}>{detalle.comentario}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
