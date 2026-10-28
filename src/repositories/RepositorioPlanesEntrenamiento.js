const PlanEntrenamiento = require('../models/PlanEntrenamiento')
const RepositorioJSON = require('./RepositorioJSON')

class RepositorioPlanesEntrenamiento extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: PlanEntrenamiento, rutaArchivo })
  }
}

module.exports = RepositorioPlanesEntrenamiento