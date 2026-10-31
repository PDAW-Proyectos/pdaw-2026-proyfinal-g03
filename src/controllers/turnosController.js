// Capa HTTP: extrae datos de req, llama al servicio y elige el código de estado
// no decide reglas de negocio

const { filtrar, conNextTodos } = require('../utils/http');

// miembroId no entra: el turno se publica libre y se reserva por su propia ruta
const CAMPOS = ['tipo', 'fecha', 'hora'];

module.exports = function crearControladorTurnos(servicio) {
  return conNextTodos({
    // GET /api/turnos?tipo=nutricionista&page=1&limit=10
    // solo turnos disponibles
    listar: async (req, res) => {
      const { tipo, page, limit } = req.query;
      res.json(await servicio.listar({ tipo, page, limit }));
    },

    // GET /api/turnos/mios
    listarMios: async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicio.listarMios({ miembro: req.usuario, page, limit }));
    },

    // GET /api/turnos/:id
    obtener: async (req, res) => {
      res.json(await servicio.obtener({ turnoId: req.params.id, usuario: req.usuario }));
    },

    // POST /api/turnos
    publicar: async (req, res) => {
      const turno = await servicio.publicar({ administrador: req.usuario, datos: filtrar(req.body, CAMPOS) });
      res.status(201).location(`/api/turnos/${turno.id}`).json(turno);
    },

    // POST /api/turnos/:id/reservar
    reservar: async (req, res) => {
      res.json(await servicio.reservar({ turnoId: req.params.id, miembro: req.usuario }));
    },

    // POST /api/turnos/:id/cancelar
    cancelar: async (req, res) => {
      res.json(await servicio.cancelar({ turnoId: req.params.id, miembro: req.usuario }));
    },

    // DELETE /api/turnos/:id
    eliminar: async (req, res) => {
      await servicio.eliminar(req.params.id);
      res.status(204).end();
    },
  });
};
