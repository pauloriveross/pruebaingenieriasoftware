import { mockVehiculos } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 500));

function calcularAdmision() {
  const hoy = new Date();
  const fin = new Date(hoy);
  fin.setDate(fin.getDate() + 180);
  return {
    fechaIngreso: hoy.toISOString().split('T')[0],
    admisionHasta: fin.toISOString().split('T')[0],
  };
}

export const vehiculoService = {
  async listar() {
    await delay();
    return [...mockVehiculos];
  },

  async procesarAdmision(data) {
    await delay(800);
    const fechas = calcularAdmision();
    const nuevo = {
      id: Date.now(),
      patente: data.patente.toUpperCase(),
      marca: '---',
      modelo: '---',
      anio: new Date().getFullYear(),
      propietario: data.nombre,
      rutPropietario: data.rutPropietario,
      nacionalidad: data.nacionalidad,
      ...fechas,
      estado: 'ACTIVA',
    };
    mockVehiculos.unshift(nuevo);
    return { ...nuevo, documentoGenerado: 'SYAT-' + Date.now() };
  },
};
