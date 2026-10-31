// Reglas de negocio de los planes de membresía

const PlanMembresia = require('../models/PlanMembresia');
const paginar = require('../utils/paginar');

class ServicioMembresias {
  constructor({ repoMembresias }) {
    this.repoMembresias = repoMembresias;
  }

  async listar({ page, limit } = {}) {
    return paginar(await this.repoMembresias.listar(), { page, limit });
  }

  obtener(membresiaId) {
    return this.repoMembresias.obtenerPorId(membresiaId);
  }

  async crear({ administrador, datos }) {
    const plan = administrador.gestionarPlanMembresia(datos); // el modelo valida
    return this.repoMembresias.agregar(plan);                 // asigna el id
  }

  // PUT: reemplaza el plan completo, se conserva el id
  async modificar({ membresiaId, datos }) {
    const actual = await this.repoMembresias.obtenerPorId(membresiaId);
    return this.repoMembresias.actualizar(new PlanMembresia({ ...datos, id: actual.id }));
  }

  async eliminar(membresiaId) {
    await this.repoMembresias.eliminar(membresiaId);
  }
}

module.exports = ServicioMembresias;