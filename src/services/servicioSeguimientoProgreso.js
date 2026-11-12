
const RegistroProgreso = require('../models/RegistroProgreso');
const { ErrorNoEncontrado } = require('../utils/errores');

class ServicioSeguimientoProgreso {
    constructor({ repoRegistros, repoUsuarios }) {
        this.repoRegistros = repoRegistros;
        this.repoUsuarios = repoUsuarios;
    }

    async registrarPeso({ miembroId, peso }) {
        const miembro = await this.repoUsuarios.obtenerPorId(miembroId);

        if (!miembro || miembro.rol !== 'miembro') {
            throw new ErrorNoEncontrado('No se encontró el miembro');
        }

        const pesoValidado = Number(peso);

        numero(pesoValidado, 'peso', { min: 20, max: 400 });

        // Crear un nuevo registro de peso
        const registro = new RegistroPeso({
            miembroId: miembro.id,
            peso: pesoValidado,
            fecha: new Date()
        });

        // Guardar el registro
        return await this.repoRegistros.agregar(registro);
    }

    async listarPesajes(miembroId) {
        // Verificar que exista el miembro
        const miembro = await this.repoUsuarios.obtenerPorId(miembroId);

        if (!miembro || miembro.rol !== 'miembro') {
            throw new ErrorNoEncontrado('No se encontró el miembro');
        }

        // Obtener todos sus registros de peso
        return await this.repoRegistros.listarPorMiembro(miembro.id);
    }
}

module.exports = ServicioSeguimientoProgreso;
