const v = require('../utils/validaciones');
const RegistroProgreso = require('./RegistroProgreso');
const { ErrorValidacion, ErrorConflicto } = require('../utils/errores');
const { ESTADOS_SEGUIMIENTO } = require('../utils/constantes');

class SeguimientoPlan {
  #registros;

  constructor({
    id = null, miembroId, planEntrenamientoId = null, planNutricionalId = null,
    fechaInicio = new Date(), estado = 'activo', registros = [],
  }) {
    this.id = id;
    this.miembroId = v.numero(miembroId, 'miembroId', { min: 1, entero: true });
    this.planEntrenamientoId = v.idOpcional(planEntrenamientoId, 'planEntrenamientoId');
    this.planNutricionalId = v.idOpcional(planNutricionalId, 'planNutricionalId');
    if (this.planEntrenamientoId === null && this.planNutricionalId === null) {
      throw new ErrorValidacion('El seguimiento necesita al menos un plan');
    }
    this.fechaInicio = v.fechaHora(fechaInicio, 'fechaInicio');
    this.estado = v.opcion(estado, 'estado', ESTADOS_SEGUIMIENTO);
    // Composicion: los registros no existen sin el seguimiento
    this.#registros = registros.map((r) => (r instanceof RegistroProgreso ? r : new RegistroProgreso(r)));
  }

  get registros() {
    return [...this.#registros];
  }

  registrarProgreso(datos) {
    if (this.estado !== 'activo') throw new ErrorConflicto(`No se puede registrar progreso en un seguimiento ${this.estado}`);
    const registro = datos instanceof RegistroProgreso ? datos : new RegistroProgreso(datos);
    this.#registros.push(registro);
    return registro;
  }

  // El total esperado (semanas x sesiones por semana) lo calcula quien conoce el plan
  porcentajeCompletado(totalEsperado) {
    const total = v.numero(totalEsperado, 'totalEsperado', { min: 1, entero: true });
    const hechos = this.#registros.filter((r) => r.completado).length;
    return Math.min(100, Math.round((hechos / total) * 100));
  }

  pausar() {
    this.#cambiarEstado('pausado', ['activo']);
  }

  reanudar() {
    this.#cambiarEstado('activo', ['pausado']);
  }

  finalizar() {
    this.#cambiarEstado('finalizado', ['activo', 'pausado']);
  }

  #cambiarEstado(nuevo, desde) {
    if (!desde.includes(this.estado)) {
      throw new ErrorConflicto(`No se puede pasar de ${this.estado} a ${nuevo}`);
    }
    this.estado = nuevo;
  }

  toJSON() {
    return {
      id: this.id,
      miembroId: this.miembroId,
      planEntrenamientoId: this.planEntrenamientoId,
      planNutricionalId: this.planNutricionalId,
      fechaInicio: this.fechaInicio.toISOString(),
      estado: this.estado,
      registros: this.#registros.map((r) => r.toJSON()),
    };
  }

  static fromJSON(obj) {
    return new SeguimientoPlan(obj);
  }
}

module.exports = SeguimientoPlan;
