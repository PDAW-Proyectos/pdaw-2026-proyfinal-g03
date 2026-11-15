const SeguimientoProgreso = require('../models/seguimientoProgreso');
const RepositorioJSON = require('./RepositorioJSON');

class RepositorioSeguimientoProgreso extends RepositorioJSON {
    constructor({ rutaArchivo } = {}) {
        super({ Entidad: SeguimientoProgreso, rutaArchivo });
    }

    async listarPorMiembro(miembroId) {
        const registros = await this.listar();

        return registros
            .filter(registro => String(registro.miembroId) === String(miembroId))
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }

    // 🔥 Sobrescribimos el método 'agregar' para que actualice si ya hay peso hoy
    async agregar(nuevoRegistro) {
        // Traemos todos los registros actuales
        const registros = await this.listar();
        
        // Obtenemos la fecha de hoy en formato "YYYY-MM-DD"
        const hoyStr = new Date().toISOString().split('T')[0];

        // Buscamos si ya hay un registro de este miembro para la fecha de hoy
        const indiceExistente = registros.findIndex(r => {
            const fechaRegistroStr = new Date(r.fecha).toISOString().split('T')[0];
            return String(r.miembroId) === String(nuevoRegistro.miembroId) && fechaRegistroStr === hoyStr;
        });

        if (indiceExistente !== -1) {
            // SI YA EXISTE: Modificamos el registro existente
            const registroExistente = registros[indiceExistente];
            
            // Actualizamos los campos
            registroExistente.peso = nuevoRegistro.peso;
            registroExistente.fecha = nuevoRegistro.fecha;

            // Usamos el método 'actualizar' que provee RepositorioJSON
            return await this.actualizar(registroExistente);
        } else {
            // SI NO EXISTE: Dejamos que la clase padre haga el push normal y genere el ID
            return await super.agregar(nuevoRegistro);
        }
    }
}

module.exports = RepositorioSeguimientoProgreso;