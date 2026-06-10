export const mockUsers = [
  {
    id: 1,
    email: 'admin@aduana.cl',
    password: 'admin123',
    nombre: 'Carlos Munoz',
    rol: 'ADMIN',
  },
  {
    id: 2,
    email: 'aduana@aduana.cl',
    password: 'aduana123',
    nombre: 'Maria Gonzalez',
    rol: 'ADUANA',
  },
  {
    id: 3,
    email: 'pdi@pdi.cl',
    password: 'pdi123',
    nombre: 'Juan Perez',
    rol: 'PDI',
  },
  {
    id: 4,
    email: 'sag@sag.cl',
    password: 'sag123',
    nombre: 'Ana Soto',
    rol: 'SAG',
  },
];

export const mockTramites = [
  { id: 1, rut: '12.345.678-9', nombre: 'Pedro Silva', tipo: 'Vehiculo', estado: 'Aprobado', fecha: '2026-06-01', detalle: 'Admision temporal de vehiculo particular. Patente ABCD-12. Vigencia: 180 dias.' },
  { id: 2, rut: '23.456.789-0', nombre: 'Lucia Fernandez', tipo: 'Menor', estado: 'Pendiente PDI', fecha: '2026-06-02', detalle: 'Registro de ingreso de menor. Tutor: Pedro Silva. Pendiente validacion de documentacion por PDI.' },
  { id: 3, rut: '34.567.890-1', nombre: 'Roberto Castro', tipo: 'SAG', estado: 'Revision', fecha: '2026-06-02', detalle: 'Declaracion SAG con 2 items: mascota (perro labrador) y prod. vegetal (manzanas 5kg). En revision.' },
  { id: 4, rut: '45.678.901-2', nombre: 'Carmen Diaz', tipo: 'Vehiculo', estado: 'Aprobado', fecha: '2026-06-03', detalle: 'Admision temporal de vehiculo particular. Patente EFGH-34. Vigencia: 180 dias.' },
  { id: 5, rut: '56.789.012-3', nombre: 'Miguel Angel', tipo: 'Menor', estado: 'Aprobado', fecha: '2026-06-03', detalle: 'Ingreso de menor validado. Documentacion en regla. Autorizado por PDI.' },
  { id: 6, rut: '67.890.123-4', nombre: 'Sofia Torres', tipo: 'Vehiculo+SAG', estado: 'En Proceso', fecha: '2026-06-04', detalle: 'Tramite combinado: admision vehicular + declaracion SAG (quesos 2kg, dulce membrillo 1kg). Pendiente revision SAG.' },
  { id: 7, rut: '78.901.234-5', nombre: 'Diego Ramirez', tipo: 'Vehiculo', estado: 'Rechazado', fecha: '2026-06-04', detalle: 'Admision vehicular rechazada. Documentacion del vehiculo incompleta. Se requiere certificado de origin y permiso de circulacion vigente.' },
];

export const mockMenores = [
  { id: 1, nombreMenor: 'Mateo Lopez', rutMenor: '10.111.222-3', tutor: 'Pedro Silva', permisoUrl: '#', fechaValidacion: '2026-06-01', estado: 'VALIDADO' },
  { id: 2, nombreMenor: 'Valentina Mora', rutMenor: '11.222.333-4', tutor: 'Lucia Fernandez', permisoUrl: '#', fechaValidacion: null, estado: 'PENDIENTE' },
  { id: 3, nombreMenor: 'Benjamin Ruiz', rutMenor: '12.333.444-5', tutor: 'Miguel Angel', permisoUrl: '#', fechaValidacion: '2026-06-03', estado: 'VALIDADO' },
];

export const mockVehiculos = [
  { id: 1, patente: 'ABCD-12', marca: 'Toyota', modelo: 'Corolla', anio: 2022, propietario: 'Pedro Silva', fechaIngreso: '2026-06-01', admisionHasta: '2026-11-28', estado: 'ACTIVA' },
  { id: 2, patente: 'EFGH-34', marca: 'Hyundai', modelo: 'Tucson', anio: 2023, propietario: 'Carmen Diaz', fechaIngreso: '2026-06-03', admisionHasta: '2026-11-30', estado: 'ACTIVA' },
  { id: 3, patente: 'IJKL-56', marca: 'Mazda', modelo: 'CX-5', anio: 2021, propietario: 'Diego Ramirez', fechaIngreso: '2026-06-04', admisionHasta: '2026-11-01', estado: 'VENCIDA' },
];

export const mockDeclaracionesSag = [
  {
    id: 1,
    pasajero: 'Roberto Castro',
    rutPasajero: '12.345.678-9',
    nacionalidad: 'Chilena',
    items: [{ tipo: 'MASCOTA', descripcion: 'Perro labrador - Vacunado, con chip' }],
    aprobado: true,
    fecha: '2026-06-02',
  },
  {
    id: 2,
    pasajero: 'Sofia Torres',
    rutPasajero: '23.456.789-0',
    nacionalidad: 'Argentina',
    items: [
      { tipo: 'PROD_ANIMAL', descripcion: 'Quesos artesanales - 2kg' },
      { tipo: 'PROD_VEGETAL', descripcion: 'Dulce de membrillo - 1kg' },
    ],
    aprobado: null,
    fecha: '2026-06-04',
  },
  {
    id: 3,
    pasajero: 'Roberto Castro',
    rutPasajero: '12.345.678-9',
    nacionalidad: 'Chilena',
    items: [{ tipo: 'PROD_VEGETAL', descripcion: 'Manzanas - 5kg' }],
    aprobado: true,
    fecha: '2026-06-02',
  },
  {
    id: 4,
    pasajero: 'Lucia Fernandez',
    rutPasajero: '34.567.890-1',
    nacionalidad: 'Argentina',
    items: [{ tipo: 'MASCOTA', descripcion: 'Gato persa - Chip identificatorio' }],
    aprobado: false,
    fecha: '2026-06-02',
  },
];

export const mockFlowRecords = [
  { fecha: '2026-05-28', ingresos: 120, salidas: 95 },
  { fecha: '2026-05-29', ingresos: 145, salidas: 110 },
  { fecha: '2026-05-30', ingresos: 98, salidas: 87 },
  { fecha: '2026-05-31', ingresos: 180, salidas: 150 },
  { fecha: '2026-06-01', ingresos: 210, salidas: 175 },
  { fecha: '2026-06-02', ingresos: 165, salidas: 140 },
  { fecha: '2026-06-03', ingresos: 200, salidas: 160 },
  { fecha: '2026-06-04', ingresos: 85, salidas: 72 },
];

export const mockUsuarios = [
  { id: 1, email: 'admin@aduana.cl', nombre: 'Carlos Munoz', rol: 'ADMIN', habilitado: true },
  { id: 2, email: 'aduana@aduana.cl', nombre: 'Maria Gonzalez', rol: 'ADUANA', habilitado: true },
  { id: 3, email: 'pdi@pdi.cl', nombre: 'Juan Perez', rol: 'PDI', habilitado: true },
  { id: 4, email: 'sag@sag.cl', nombre: 'Ana Soto', rol: 'SAG', habilitado: true },
  { id: 5, email: 'jrojas@aduana.cl', nombre: 'Jorge Rojas', rol: 'ADUANA', habilitado: false },
];

export const mockDashboardStats = {
  personasHoy: 85,
  personasAyer: 200,
  vehiculosHoy: 42,
  vehiculosAyer: 98,
  menoresPendientes: 3,
  sagPendientes: 1,
};
