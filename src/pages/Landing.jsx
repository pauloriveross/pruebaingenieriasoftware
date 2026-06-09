import { Link } from 'react-router-dom';
import { FiSearch, FiUsers, FiTruck, FiShield, FiLock, FiArrowRight, FiClock, FiCheckCircle, FiFileText, FiDollarSign } from 'react-icons/fi';

const services = [
  {
    icon: FiSearch,
    title: 'Consulta de Tramites',
    desc: 'Ingrese su RUT o DNI para consultar el estado de todos sus tramites registrados en el sistema, incluyendo vehiculos, menores y declaraciones SAG.',
    details: ['Consulta en tiempo real', 'Sin necesidad de clave', 'Disponible 24/7'],
    link: '/consulta-tramites',
    label: 'Consultar ahora',
    color: '#003366',
  },
  {
    icon: FiUsers,
    title: 'Gestion de Menores',
    desc: 'Registro y validacion de permisos notariales para la entrada y salida de menores de edad por los pasos fronterizos terrestres.',
    details: ['Carga de permiso notarial', 'Validacion con PDI', 'Control de salida/entrada'],
    link: '/menores',
    label: 'Ingresar tramite',
    color: '#005A9E',
  },
  {
    icon: FiTruck,
    title: 'Admision Temporal de Vehiculos',
    desc: 'Procesamiento de la documentacion para la salida y admision temporal de vehiculos motorizados entre Chile y Argentina.',
    details: ['Calculo automatico de 180 dias', 'Generacion de documento oficial', 'Dos copias obligatorias'],
    link: '/vehiculos',
    label: 'Procesar admision',
    color: '#D97706',
  },
  {
    icon: FiShield,
    title: 'Declaraciones SAG',
    desc: 'Declaracion jurada para el ingreso de mascotas, productos de origen animal y vegetal, en cumplimiento de las regulaciones sanitarias.',
    details: ['Mascotas con vacunas al dia', 'Productos animales y vegetales', 'Aprobacion en linea'],
    link: '/sag',
    label: 'Hacer declaracion',
    color: '#059669',
  },
  {
    icon: FiDollarSign,
    title: 'Declaracion de Divisas (PDI)',
    desc: 'Declaracion obligatoria de divisas y valores por montos iguales o superiores a USD 10,000 al ingresar o salir del pais, segun la legislacion vigente.',
    details: ['Minimo USD 10,000 o equivalente', 'Multiple monedas aceptadas', 'Verificacion PDI en linea'],
    link: '/divisas',
    label: 'Declarar divisas',
    color: '#7C3AED',
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-header__inner">
          <div className="landing-brand">
            <img src="/logo-aduanas.svg" alt="Aduanas de Chile" className="landing-logo-img" />
            <div>
              <span className="landing-brand__title">Aduanas de Chile</span>
              <span className="landing-brand__sub">Sistema Integrado de Gestion Fronteriza</span>
            </div>
          </div>
          <Link to="/login" className="btn btn--outline btn--light">
            <FiLock size={16} />
            Acceso funcionarios
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero__bg" />
          <div className="landing-hero__content">
            <h1>Modernizacion de los pasos fronterizos terrestres</h1>
            <p>
              El Sistema Integrado de Gestion Fronteriza automatiza la documentacion de
              menores, vehiculos y declaraciones juradas SAG/Aduana, reduciendo los tiempos de
              espera de 90-180 minutos a tramites digitales rapidos y seguros.
            </p>
            <div className="landing-hero__stats">
              <div className="hero-stat">
                <span className="hero-stat__value">-70%</span>
                <span className="hero-stat__label">Tiempo de espera</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat__value">24/7</span>
                <span className="hero-stat__label">Disponibilidad</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat__value">100%</span>
                <span className="hero-stat__label">Digital</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-services">
          <h2>Tramites disponibles para usted</h2>
          <p className="landing-services__sub">
            Realice sus tramites fronterizos de forma anticipada y reduzca su tiempo en ventanilla.
            Todos los tramites estan disponibles sin necesidad de iniciar sesion.
          </p>

          <div className="landing-grid">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="landing-card">
                  <div className="landing-card__icon" style={{ backgroundColor: s.color + '15', color: s.color }}>
                    <Icon size={32} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <ul className="landing-card__details">
                    {s.details.map((d, j) => (
                      <li key={j}>
                        <FiCheckCircle size={12} /> {d}
                      </li>
                    ))}
                  </ul>
                  <Link to={s.link} className="landing-card__link" style={{ backgroundColor: s.color }}>
                    {s.label} <FiArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="landing-info">
            <div className="landing-info__card">
              <FiFileText size={24} />
              <div>
                <h4>Interoperabilidad binacional</h4>
                <p>
                  El sistema permite el reconocimiento mutuo de documentos de "Salida y Admision
                  Temporal" con la Aduana Argentina, conforme al Acuerdo Chileno-Argentino.
                </p>
              </div>
            </div>
            <div className="landing-info__card">
              <FiClock size={24} />
              <div>
                <h4>Beneficios del sistema</h4>
                <p>
                  Reduccion de tiempos de espera, mejora en la trazabilidad de operaciones,
                  combate a la evasion y contrabando, y control integrado con PDI y SAG.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <p>Servicio Nacional de Aduanas de Chile (SNA) &copy; {new Date().getFullYear()}</p>
          <p>Complejo Fronterizo Los Libertadores | Paso Horcones</p>
          <p>
            <a href="https://www.aduana.cl" target="_blank" rel="noopener noreferrer">www.aduana.cl</a>
            {' | '}
            <a href="https://www.sag.cl" target="_blank" rel="noopener noreferrer">www.sag.cl</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
