// Reglas de negocio del seguimiento de planes de un miembro

const paginar = require('../utils/paginar');
const { ErrorProhibido } = require('../utils/errores');

class ServicioSeguimientos {
  constructor({ repoSeguimientos, repoPlanesEntrenamiento, repoPlanesNutricionales }) {
    this.repoSeguimientos = repoSeguimientos;
    this.repoPlanesEntrenamiento = repoPlanesEntrenamiento;
    this.repoPlanesNutricionales = repoPlanesNutricionales;
  }

  async listar({ miembro, page, limit }) {
    return paginar(await this.repoSeguimientos.listarPorMiembro(miembro.id), { page, limit });
  }

  obtener({ seguimientoId, miembro }) {
    return this.#seguimientoDelMiembro(seguimientoId, miembro);
  }

  async iniciar({ miembro, datos }) {
    const seguimiento = miembro.iniciarSeguimiento(datos); // el modelo valida al menos un plan
    await this.#verificarPlan(this.repoPlanesEntrenamiento, seguimiento.planEntrenamientoId, miembro);
    await this.#verificarPlan(this.repoPlanesNutricionales, seguimiento.planNutricionalId, miembro);
    return this.repoSeguimientos.agregar(seguimiento);
  }

  async registrarProgreso({ seguimientoId, miembro, datos }) {
    const seguimiento = await this.#seguimientoDelMiembro(seguimientoId, miembro);
    seguimiento.registrarProgreso(datos); // el modelo valida y rechaza si no esta activo
    return this.repoSeguimientos.actualizar(seguimiento);
  }

  pausar(args) { return this.#cambiarEstado(args, (s) => s.pausar()); }
  reanudar(args) { return this.#cambiarEstado(args, (s) => s.reanudar()); }
  finalizar(args) { return this.#cambiarEstado(args, (s) => s.finalizar()); }

  async #cambiarEstado({ seguimientoId, miembro }, transicion) {
    const seguimiento = await this.#seguimientoDelMiembro(seguimientoId, miembro);
    transicion(seguimiento); // las transiciones validas viven en SeguimientoPlan
    return this.repoSeguimientos.actualizar(seguimiento);
  }

  // regla de propiedad: un seguimiento solo lo maneja su dueño
  async #seguimientoDelMiembro(seguimientoId, miembro) {
    const seguimiento = await this.repoSeguimientos.obtenerPorId(seguimientoId);
    if (seguimiento.miembroId !== miembro.id) throw new ErrorProhibido('El seguimiento pertenece a otro miembro');
    return seguimiento;
  }

  // el plan tiene que existir y ser del miembro. Los planes del gimnasio, sin dueño, son publicos
  async #verificarPlan(repo, planId, miembro) {
    if (planId === null) return;
    const plan = await repo.obtenerPorId(planId);
    if (plan.miembroId !== null && plan.miembroId !== miembro.id) {
      throw new ErrorProhibido('El plan pertenece a otro miembro');
    }
  }
}

module.exports = ServicioSeguimientos;
