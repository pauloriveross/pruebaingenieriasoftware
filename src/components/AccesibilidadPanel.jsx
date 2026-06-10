import { useState, useEffect, useCallback, useRef } from 'react';
import { FiX, FiSun, FiEye, FiVolume2, FiType, FiZoomIn, FiAlignLeft, FiPause, FiImage, FiBookOpen, FiMousePointer, FiInfo, FiList, FiMaximize2, FiDroplet } from 'react-icons/fi';

const STORAGE_KEY = 'sigf-accesibilidad';

const NIVELES_TEXTO = ['Normal', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4'];
const NIVELES_SATURACION = ['Normal', 'Baja', 'Media', 'Alta'];
const NIVELES_ALTURA = ['Normal', 'Relajado', 'Amplio', 'Extra'];

const opcionesToggle = [
  { id: 'leerPagina', label: 'Leer pagina', icon: FiVolume2 },
  { id: 'contraste', label: 'Contraste', icon: FiSun },
  { id: 'contrasteInteligente', label: 'Contraste inteligente', icon: FiEye },
  { id: 'resaltarEnlaces', label: 'Resaltar enlaces', icon: FiType },
  { id: 'espaciadoTexto', label: 'Espaciado de texto', icon: FiAlignLeft },
  { id: 'detenerAnimaciones', label: 'Detener animaciones', icon: FiPause },
  { id: 'ocultarImagenes', label: 'Ocultar imagenes', icon: FiImage },
  { id: 'aptoDislexia', label: 'Apto para dislexia', icon: FiBookOpen },
  { id: 'cursorGrande', label: 'Cursor grande', icon: FiMousePointer },
];

const opcionesNivel = [
  { id: 'agrandarTexto', label: 'Agrandar texto', icon: FiZoomIn, niveles: NIVELES_TEXTO, max: 4 },
  { id: 'alturaPagina', label: 'Altura de pagina', icon: FiMaximize2, niveles: NIVELES_ALTURA, max: 3 },
  { id: 'saturacion', label: 'Saturacion', icon: FiDroplet, niveles: NIVELES_SATURACION, max: 3 },
];

const opcionesInfo = [
  { id: 'informacion', label: 'Informacion', icon: FiInfo },
  { id: 'estructuraPagina', label: 'Estructura de la pagina', icon: FiList },
];

function leerContenido() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const main = document.querySelector('main') || document.querySelector('.public-container') || document.body;
  const texto = main.textContent.replace(/\s+/g, ' ').trim().slice(0, 4000);
  if (!texto) return;
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-CL';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function detenerLectura() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export default function AccesibilidadPanel({ isOpen, onClose }) {
  const [estado, setEstado] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [infoData, setInfoData] = useState(null);
  const [estructuraData, setEstructuraData] = useState(null);
  const leyendoRef = useRef(false);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); } catch {}
  }, [estado]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove(
      'acc-contraste', 'acc-contraste-inteligente', 'acc-resaltar-enlaces',
      'acc-texto-1', 'acc-texto-2', 'acc-texto-3', 'acc-texto-4',
      'acc-espaciado-texto', 'acc-sin-animaciones', 'acc-ocultar-imagenes',
      'acc-apto-dislexia', 'acc-cursor-grande',
      'acc-saturacion-1', 'acc-saturacion-2', 'acc-saturacion-3',
      'acc-altura-1', 'acc-altura-2', 'acc-altura-3',
    );

    if (estado.contraste) root.classList.add('acc-contraste');
    if (estado.contrasteInteligente) root.classList.add('acc-contraste-inteligente');
    if (estado.resaltarEnlaces) root.classList.add('acc-resaltar-enlaces');
    if (estado.espaciadoTexto) root.classList.add('acc-espaciado-texto');
    if (estado.detenerAnimaciones) root.classList.add('acc-sin-animaciones');
    if (estado.ocultarImagenes) root.classList.add('acc-ocultar-imagenes');
    if (estado.aptoDislexia) root.classList.add('acc-apto-dislexia');
    if (estado.cursorGrande) root.classList.add('acc-cursor-grande');

    const nivelTexto = estado.agrandarTexto || 0;
    if (nivelTexto >= 1 && nivelTexto <= 4) root.classList.add(`acc-texto-${nivelTexto}`);

    const nivelSat = estado.saturacion || 0;
    if (nivelSat >= 1 && nivelSat <= 3) root.classList.add(`acc-saturacion-${nivelSat}`);

    const nivelAlt = estado.alturaPagina || 0;
    if (nivelAlt >= 1 && nivelAlt <= 3) root.classList.add(`acc-altura-${nivelAlt}`);

    if (estado.leerPagina && !leyendoRef.current) {
      leyendoRef.current = true;
      setTimeout(leerContenido, 300);
    } else if (!estado.leerPagina && leyendoRef.current) {
      leyendoRef.current = false;
      detenerLectura();
    }
  }, [estado]);

  useEffect(() => {
    return () => { if (leyendoRef.current) detenerLectura(); };
  }, []);

  const toggle = useCallback((id) => {
    if (id === 'leerPagina') {
      if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    }
    setEstado((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const ciclar = useCallback((id, max) => {
    setEstado((prev) => ({ ...prev, [id]: ((prev[id] || 0) % max) + 1 }));
  }, []);

  const restablecer = useCallback(() => {
    detenerLectura();
    leyendoRef.current = false;
    setEstado({});
  }, []);

  const generarInfo = useCallback(() => {
    const body = document.body;
    const text = body.textContent.replace(/\s+/g, ' ').trim();
    const palabras = text ? text.split(' ').length : 0;
    const caracteres = text.length;
    const minutos = Math.max(1, Math.round(palabras / 200));
    const imagenes = document.querySelectorAll('img').length;
    const enlaces = document.querySelectorAll('a').length;
    const encabezados = document.querySelectorAll('h1,h2,h3,h4,h5,h6').length;
    const botones = document.querySelectorAll('button').length;
    setInfoData({ palabras, caracteres, minutos, imagenes, enlaces, encabezados, botones, hora: new Date().toLocaleTimeString('es-CL') });
  }, []);

  const generarEstructura = useCallback(() => {
    const headings = [];
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
      headings.push({ nivel: parseInt(h.tagName[1]), texto: h.textContent.trim() });
    });
    const landmarks = [];
    const main = document.querySelector('main');
    if (main) landmarks.push('main');
    const nav = document.querySelector('nav');
    if (nav) landmarks.push('nav');
    const header = document.querySelector('header');
    if (header) landmarks.push('header');
    const footer = document.querySelector('footer');
    if (footer) landmarks.push('footer');
    const aside = document.querySelector('aside');
    if (aside) landmarks.push('aside');
    setEstructuraData({ headings, landmarks });
  }, []);

  const nivelLabel = (id) => {
    const opt = opcionesNivel.find((o) => o.id === id);
    if (!opt) return '';
    const val = estado[id] || 0;
    return opt.niveles[val] || opt.niveles[0];
  };

  return (
    <>
      {isOpen && <div className="acc-overlay" onClick={onClose} />}
      <aside className={`acc-panel ${isOpen ? 'acc-panel--open' : ''}`}>
        <div className="acc-panel__header">
          <h3>Accesibilidad</h3>
          <button className="acc-panel__close" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
        <p className="acc-panel__desc">Herramientas de accesibilidad visual y de lectura.</p>

        <div className="acc-panel__opciones">
          <button className="acc-opcion acc-opcion--reset" onClick={restablecer}>
            <FiX size={20} />
            <span>Restablecer todo</span>
          </button>
          <div className="acc-divider" />

          <div className="acc-seccion-label">Lectura</div>
          {opcionesToggle.filter((o) => o.id === 'leerPagina').map((opt) => {
            const Icon = opt.icon;
            const activo = estado[opt.id] || false;
            return (
              <button key={opt.id} className={`acc-opcion ${activo ? 'acc-opcion--activo' : ''}`} onClick={() => toggle(opt.id)}>
                <Icon size={20} />
                <span>{opt.label}</span>
                <span className="acc-opcion__toggle"><span className={`acc-toggle__dot ${activo ? 'acc-toggle__dot--on' : ''}`} /></span>
              </button>
            );
          })}

          <div className="acc-divider" />
          <div className="acc-seccion-label">Visual</div>
          {opcionesToggle.filter((o) => o.id !== 'leerPagina').map((opt) => {
            const Icon = opt.icon;
            const activo = estado[opt.id] || false;
            return (
              <button key={opt.id} className={`acc-opcion ${activo ? 'acc-opcion--activo' : ''}`} onClick={() => toggle(opt.id)}>
                <Icon size={20} />
                <span>{opt.label}</span>
                <span className="acc-opcion__toggle"><span className={`acc-toggle__dot ${activo ? 'acc-toggle__dot--on' : ''}`} /></span>
              </button>
            );
          })}

          <div className="acc-divider" />
          <div className="acc-seccion-label">Ajustes</div>
          {opcionesNivel.map((opt) => {
            const Icon = opt.icon;
            const val = estado[opt.id] || 0;
            return (
              <button key={opt.id} className={`acc-opcion ${val > 0 ? 'acc-opcion--activo' : ''}`} onClick={() => ciclar(opt.id, opt.max)} title={`${opt.label}: ${nivelLabel(opt.id)}`}>
                <Icon size={20} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span>{opt.label}</span>
                  <span className="acc-opcion__sub">{nivelLabel(opt.id)}</span>
                </div>
                <div className="acc-nivel-dots">
                  {Array.from({ length: opt.max }, (_, i) => (
                    <span key={i} className={`acc-nivel-dot ${val > i ? 'acc-nivel-dot--on' : ''}`} />
                  ))}
                </div>
              </button>
            );
          })}

          <div className="acc-divider" />
          <div className="acc-seccion-label">Herramientas</div>
          {opcionesInfo.map((opt) => {
            const Icon = opt.icon;
            return (
              <button key={opt.id} className="acc-opcion" onClick={() => {
                if (opt.id === 'informacion') { generarInfo(); }
                if (opt.id === 'estructuraPagina') { generarEstructura(); }
              }}>
                <Icon size={20} />
                <span>{opt.label}</span>
                <FiX size={16} style={{ transform: 'rotate(45deg)', color: 'var(--color-text-light)' }} />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Modal informacion */}
      {infoData && (
        <div className="acc-overlay" style={{ zIndex: 960 }} onClick={() => setInfoData(null)}>
          <div className="acc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acc-modal__header">
              <h4>Informacion de la pagina</h4>
              <button className="acc-panel__close" onClick={() => setInfoData(null)}><FiX size={18} /></button>
            </div>
            <div className="acc-modal__body">
              <div className="acc-info-grid">
                <div className="acc-info-item"><strong>{infoData.palabras}</strong><span>Palabras</span></div>
                <div className="acc-info-item"><strong>{infoData.caracteres}</strong><span>Caracteres</span></div>
                <div className="acc-info-item"><strong>{infoData.minutos} min</strong><span>Tiempo lectura</span></div>
                <div className="acc-info-item"><strong>{infoData.imagenes}</strong><span>Imagenes</span></div>
                <div className="acc-info-item"><strong>{infoData.enlaces}</strong><span>Enlaces</span></div>
                <div className="acc-info-item"><strong>{infoData.encabezados}</strong><span>Encabezados</span></div>
                <div className="acc-info-item"><strong>{infoData.botones}</strong><span>Botones</span></div>
                <div className="acc-info-item"><strong>{infoData.hora}</strong><span>Consultado</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal estructura */}
      {estructuraData && (
        <div className="acc-overlay" style={{ zIndex: 960 }} onClick={() => setEstructuraData(null)}>
          <div className="acc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acc-modal__header">
              <h4>Estructura de la pagina</h4>
              <button className="acc-panel__close" onClick={() => setEstructuraData(null)}><FiX size={18} /></button>
            </div>
            <div className="acc-modal__body">
              {estructuraData.headings.length > 0 ? (
                <>
                  <div className="acc-modal__sub">Encabezados ({estructuraData.headings.length})</div>
                  <ul className="acc-estructura-lista">
                    {estructuraData.headings.map((h, i) => (
                      <li key={i} style={{ paddingLeft: `${(h.nivel - 1) * 20}px` }}>
                        <span className={`acc-estructura-badge acc-estructura-badge--h${h.nivel}`}>H{h.nivel}</span>
                        <span>{h.texto}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ color: 'var(--color-text-light)', marginBottom: 12 }}>No se encontraron encabezados.</p>
              )}
              <div className="acc-modal__sub" style={{ marginTop: 12 }}>Puntos de referencia</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {estructuraData.landmarks.length > 0 ? estructuraData.landmarks.map((l) => (
                  <span key={l} className="badge badge--info">{l}</span>
                )) : <span style={{ color: 'var(--color-text-light)', fontSize: 13 }}>Ninguno detectado</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
