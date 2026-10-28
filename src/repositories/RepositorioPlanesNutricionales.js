const PlanNutricional = require('../models/PlanNutricional')
const RepositorioJSON = require('./RepositorioJSON')

class RepositorioPlanesNutricionales extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: PlanNutricional, rutaArchivo })
  }
}

module.exports = RepositorioPlanesNutricionales