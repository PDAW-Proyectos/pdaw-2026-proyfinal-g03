const Rutina = require('../models/Rutina')
const RepositorioJSON = require('./RepositorioJSON')

class RepositorioRutinas extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: Rutina, rutaArchivo })
  }
}

module.exports = RepositorioRutinas
