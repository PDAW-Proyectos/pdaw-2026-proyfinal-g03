
const { conNextTodos } = require('../utils/http');
const v = require('../utils/validaciones');

module.exports = function crearControladorSeguimientoProgreso(servicio) {
    return conNextTodos({
        // GET /api/seguimientoProgreso
        // Obtiene el historial del miembro autenticado.
        listar: async (req, res) => {
            const miembroId = req.usuario.id;
            const pesajes = await servicio.listarPesajes(miembroId);
            res.json({ pesajes });
        },

        // POST /api/seguimientoProgreso
        // Registra un nuevo pesaje.
        publicar: async (req, res) => {
            const registro = await servicio.registrarPeso({
                miembroId: req.usuario.id,
                peso: req.body?.peso
            });

            res.status(201)
                .location(`/api/seguimientoProgreso/${registro.id}`)
                .json(registro);
        }
    });
};
