const HorarioGimnasio = require('../models/HorarioGimnasio')
const RepositorioJSON = require('./RepositorioJSON')

class RepositorioHorarios extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: HorarioGimnasio, rutaArchivo })
  }
}

module.exports = RepositorioHorarios
