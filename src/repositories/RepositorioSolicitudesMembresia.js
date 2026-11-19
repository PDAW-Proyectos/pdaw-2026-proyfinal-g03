const SolicitudMembresia = require('../models/SolicitudMembresia');
const RepositorioJSON = require('./RepositorioJSON');

class RepositorioSolicitudesMembresia extends RepositorioJSON {
    constructor({ rutaArchivo } = {}) {
        super({ Entidad: SolicitudMembresia, rutaArchivo });
    }
}

module.exports = RepositorioSolicitudesMembresia;
