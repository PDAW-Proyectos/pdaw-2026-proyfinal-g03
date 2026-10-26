const SeguimientoPlan = require('../models/SeguimientoPlan')
const RepositorioJSON = require('./RepositorioJSON')
const v = require('../utils/validaciones')

class RepositorioSeguimientos extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: SeguimientoPlan, rutaArchivo })
  }

  async listarPorMiembro(miembroId) {
    const id = v.numero(miembroId, 'miembroId', { min: 1, entero: true })
    return (await this.listar()).filter((seguimiento) => seguimiento.miembroId === id)
  }
}

module.exports = RepositorioSeguimientos
