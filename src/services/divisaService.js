const delay = () => new Promise((r) => setTimeout(r, 400));

export const divisaService = {
  async declarar(data) {
    await delay();
    if (data.monto < 10000) {
      throw new Error('El monto minimo de declaracion es USD 10,000 o su equivalente en otras monedas.');
    }
    return {
      id: Date.now(),
      ...data,
      estado: 'Pendiente',
      fecha: new Date().toISOString().split('T')[0],
      mensaje: 'Declaracion de divisas registrada correctamente. Queda pendiente de verificacion por PDI.',
    };
  },
};
