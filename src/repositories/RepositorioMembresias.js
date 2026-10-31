const PlanMembresia = require('../models/PlanMembresia')
const RepositorioJSON = require('./RepositorioJSON')

class RepositorioMembresias extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: PlanMembresia, rutaArchivo })
  }
}

module.exports = RepositorioMembresias
