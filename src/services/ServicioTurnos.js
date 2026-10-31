// Reglas de negocio de los turnos (chequeo médico, nutricionista)
// las reglas de reservar/cancelar viven en el modelo Turno, acá solo se orquesta

const paginar = require('../utils/paginar');
const { ErrorProhibido, ErrorConflicto } = require('../utils/errores');

class ServicioTurnos {
  constructor({ repoTurnos }) {
    this.repoTurnos = repoTurnos;
  }

  // solo los turnos libres, filtrados opcionalmente por tipo
  async listar({ tipo, page, limit } = {}) {
    return paginar(await this.repoTurnos.listarDisponibles(tipo), { page, limit });
  }

  async listarMios({ miembro, page, limit }) {
    return paginar(await this.repoTurnos.listarPorMiembro(miembro.id), { page, limit });
  }

  // un turno reservado solo lo ve quien lo reservó o quien administra los turnos
  async obtener({ turnoId, usuario }) {
    const turno = await this.repoTurnos.obtenerPorId(turnoId);
    const administra = usuario.puede('publicarTurno');
    if (!turno.disponible && !administra && turno.miembroId !== usuario.id) {
      throw new ErrorProhibido('El turno pertenece a otro miembro');
    }
    return turno;
  }

  async publicar({ administrador, datos }) {
    const turno = administrador.publicarTurno(datos); // el modelo valida y elige la subclase según tipo
    return this.repoTurnos.agregar(turno);            // asigna el id
  }

  async reservar({ turnoId, miembro }) {
    const turno = await this.repoTurnos.obtenerPorId(turnoId);
    miembro.solicitarTurno(turno); // las reglas (ya reservado) viven en Turno
    return this.repoTurnos.actualizar(turno);
  }

  async cancelar({ turnoId, miembro }) {
    const turno = await this.repoTurnos.obtenerPorId(turnoId);
    turno.cancelar(miembro.id); // solo quien reservó puede cancelar
    return this.repoTurnos.actualizar(turno);
  }

  async eliminar(turnoId) {
    const turno = await this.repoTurnos.obtenerPorId(turnoId);
    if (!turno.disponible) throw new ErrorConflicto('No se puede eliminar un turno reservado');
    await this.repoTurnos.eliminar(turno.id);
  }
}

module.exports = ServicioTurnos;
