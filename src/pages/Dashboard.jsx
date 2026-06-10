import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { tramiteService } from '../services/tramiteService';
import { mockFlowRecords } from '../services/mockData';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FiUsers, FiTruck, FiUserCheck, FiShield, FiChevronRight,
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const chartData = {
  labels: mockFlowRecords.map((r) => {
    const d = new Date(r.fecha);
    return d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' });
  }),
  datasets: [
    {
      label: 'Ingresos',
      data: mockFlowRecords.map((r) => r.ingresos),
      backgroundColor: '#003366',
      borderRadius: 4,
    },
    {
      label: 'Salidas',
      data: mockFlowRecords.map((r) => r.salidas),
      backgroundColor: '#DC2626',
      borderRadius: 4,
    },
  ],
};

const badgeClass = (estado) => {
  const map = {
    'Aprobado': 'badge badge--success',
    'Rechazado': 'badge badge--danger',
    'Pendiente PDI': 'badge badge--warning',
    'Revision': 'badge badge--info',
    'En Proceso': 'badge badge--info',
    'Pendiente': 'badge badge--warning',
  };
  return map[estado] || 'badge';
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tramites, setTramites] = useState([]);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      tramiteService.listarTodos(),
    ]).then(([s, t]) => {
      setStats(s);
      setTramites(t);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const calcTrend = (hoy, ayer) => {
    if (ayer === 0) return 0;
    return Math.round(((hoy - ayer) / ayer) * 100);
  };

  const tramitesRecientes = tramites.slice(0, 6);

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h2>Panel de Control</h2>
        <p>Resumen operativo del complejo fronterizo Los Libertadores</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Personas hoy"
          value={stats.personasHoy}
          subtitle="Flujo de pasajeros"
          icon={<FiUsers size={24} />}
          color="#003366"
          trend={calcTrend(stats.personasHoy, stats.personasAyer)}
        />
        <StatCard
          title="Vehiculos hoy"
          value={stats.vehiculosHoy}
          subtitle="Admisiones temporales"
          icon={<FiTruck size={24} />}
          color="#005A9E"
          trend={calcTrend(stats.vehiculosHoy, stats.vehiculosAyer)}
        />
        <StatCard
          title="Menores Pendientes"
          value={stats.menoresPendientes}
          subtitle="Validacion PDI requerida"
          icon={<FiUserCheck size={24} />}
          color="#D97706"
        />
        <StatCard
          title="SAG Pendientes"
          value={stats.sagPendientes}
          subtitle="Declaraciones por revisar"
          icon={<FiShield size={24} />}
          color="#DC2626"
        />
      </div>

      <div className="card chart-card">
        <div className="card__header">
          <h3>Flujo de personas - Ultimos 8 dias</h3>
        </div>
        <div className="card__body">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3>Tramites Recientes</h3>
          <span className="badge badge--info">{tramites.length} total</span>
        </div>
        {tramitesRecientes.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-light)' }}>
            No hay tramites registrados.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>RUT/DNI</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {tramitesRecientes.map((t) => (
                  <tr key={t.id} onClick={() => setDetalle(t)} style={{ cursor: 'pointer' }}>
                    <td>{t.fecha}</td>
                    <td>{t.nombre}</td>
                    <td>{t.rut}</td>
                    <td>{t.tipo}</td>
                    <td><span className={badgeClass(t.estado)}>{t.estado}</span></td>
                    <td><FiChevronRight size={16} style={{ color: 'var(--color-text-light)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
    </div>
  );
}
