import { mockDeclaracionesSag } from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 400));

export const sagService = {
  async listar() {
    await delay();
    return [...mockDeclaracionesSag];
  },

  async crear(data) {
    await delay();
    const nueva = {
      id: Date.now(),
      pasajero: data.pasajero,
      rutPasajero: data.rutPasajero,
      nacionalidad: data.nacionalidad,
      items: data.items || [{ tipo: data.tipo || 'MASCOTA', descripcion: data.descripcion || '' }],
      aprobado: null,
      fecha: new Date().toISOString().split('T')[0],
    };
    mockDeclaracionesSag.unshift(nueva);
    return nueva;
  },

  async aprobar(id, aprobado, comentario) {
    await delay();
    const decl = mockDeclaracionesSag.find((d) => d.id === id);
    if (decl) {
      decl.aprobado = aprobado;
      if (comentario) decl.comentario = comentario;
    }
    return { id, aprobado };
  },

  async obtenerPorId(id) {
    await delay();
    return mockDeclaracionesSag.find((d) => d.id === id) || null;
  },
};
