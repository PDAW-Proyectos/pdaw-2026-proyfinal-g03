// Reglas de negocio de los horarios del gimnasio
// no conoce req, res ni Express: recibe datos simples

const HorarioGimnasio = require('../models/HorarioGimnasio');
const paginar = require('../utils/paginar');

class ServicioHorarios {
  constructor({ repoHorarios }) {
    this.repoHorarios = repoHorarios;
  }

  async listar({ page, limit } = {}) {
    return paginar(await this.repoHorarios.listar(), { page, limit });
  }

  obtener(horarioId) {
    return this.repoHorarios.obtenerPorId(horarioId);
  }

  async crear({ administrador, datos }) {
    const horario = administrador.definirHorarios(datos); // el modelo valida
    return this.repoHorarios.agregar(horario);            // asigna el id
  }

  // PUT: reemplaza el horario completo, se conserva el id
  async modificar({ horarioId, datos }) {
    const actual = await this.repoHorarios.obtenerPorId(horarioId);
    return this.repoHorarios.actualizar(new HorarioGimnasio({ ...datos, id: actual.id }));
  }

  async eliminar(horarioId) {
    await this.repoHorarios.eliminar(horarioId);
  }
}

module.exports = ServicioHorarios;