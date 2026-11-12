const Clase = require('../models/Clase');
const RepositorioJSON = require('./RepositorioJSON');
const v = require('../utils/validaciones');

class RepositorioSeguimientoProgreso extends RepositorioJSON {
    constructor({ rutaArchivo } = {}) {
        super({ Entidad: SeguimientoProgreso, rutaArchivo });
    }

    async listarPorMiembro(miembroId) {
        const registros = await this.listar();

        return registros
            .filter(registro => registro.miembroId === miembroId)
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }

}

module.exports = RepositorioSeguimientoProgreso;
