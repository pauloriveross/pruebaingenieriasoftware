import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import RecuperarPassword from '../pages/RecuperarPassword';
import ConsultaTramites from '../pages/ConsultaTramites';
import GestionMenores from '../pages/GestionMenores';
import AdmisionVehiculos from '../pages/AdmisionVehiculos';
import DeclaracionesSag from '../pages/DeclaracionesSag';
import DeclaracionDivisas from '../pages/DeclaracionDivisas';
import Dashboard from '../pages/Dashboard';
import PanelPdi from '../pages/PanelPdi';
import PanelSag from '../pages/PanelSag';
import Reportes from '../pages/Reportes';
import AdminUsuarios from '../pages/AdminUsuarios';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/consulta-tramites" element={<ConsultaTramites />} />
      <Route path="/menores" element={<GestionMenores />} />
      <Route path="/vehiculos" element={<AdmisionVehiculos />} />
      <Route path="/sag" element={<DeclaracionesSag />} />
      <Route path="/divisas" element={<DeclaracionDivisas />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/panel-pdi"
          element={
            <PrivateRoute roles={['ADMIN', 'PDI']}>
              <PanelPdi />
            </PrivateRoute>
          }
        />
        <Route
          path="/panel-sag"
          element={
            <PrivateRoute roles={['ADMIN', 'SAG']}>
              <PanelSag />
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute roles={['ADMIN', 'ADUANA']}>
              <Reportes />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminUsuarios />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
