const { conNextTodos } = require('../utils/http');

module.exports = function crearControladorSolicitudesMembresia(servicioSolicitudesMembresia) {
    return conNextTodos({
        solicitar: async (req, res) => {
            const solicitud = await servicioSolicitudesMembresia.solicitar({
                miembroId: req.usuario.id,
                tipo: req.body?.tipo,
                planSolicitadoId: req.body?.planSolicitadoId,
            });
            res.status(201).json({ solicitud });
        },

        obtener: async (req, res, next) => {
            try {
                const solicitudes = await servicioSolicitudesMembresia.listarPendientes();
                res.json({ solicitudes });
            } catch (error) {
                next(error);
            }
        },

        aprobar: async (req, res, next) => {
            try {
                const solicitud = await servicioSolicitudesMembresia.resolver(req.params.id, 'aprobada');
                res.json({ solicitud });
            } catch (error) {
                next(error);
            }
        },

        rechazar: async (req, res, next) => {
            try {
                const solicitud = await servicioSolicitudesMembresia.resolver(req.params.id, 'rechazada');
                res.json({ solicitud });
            } catch (error) {
                next(error);
            }
        },

        renovar: async (req, res, next) => {
            try {
                const miembro = await servicioSolicitudesMembresia.renovarMembresia(req.params.miembroId);
                res.json({ miembro });
            } catch (error) {
                next(error);
            }
        },

        listar: async (req, res, next) => {
            try {
                const miembros = await servicioSolicitudesMembresia.listarMembresiasPorVencer();
                res.json({ miembros });
            } catch (error) {
                next(error);
            }
        },

        misSolicitudes: async (req, res, next) => {
            try {
                const solicitudes = await servicioSolicitudesMembresia.listarSolicitudesPorMiembro(req.usuario.id);
                res.json({ solicitudes });
            } catch (error) {
                next(error);
            }
        },
    })
}