import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import AppRouter from './routes/AppRouter';
import AccesibilidadPanel from './components/AccesibilidadPanel';

export default function App() {
  const [accOpen, setAccOpen] = useState(false);

  return (
    <>
      <button className="acc-btn" onClick={() => setAccOpen(true)} title="Opciones de accesibilidad">
        <FiEye size={24} />
      </button>
      <AccesibilidadPanel isOpen={accOpen} onClose={() => setAccOpen(false)} />
      <AppRouter />
    </>
  );
}
