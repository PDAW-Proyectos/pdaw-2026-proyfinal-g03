// Capa HTTP: extrae datos de req, llama al servicio y elige el código de estado
// no decide reglas de negocio

const { filtrar, conNextTodos } = require('../utils/http');

const CAMPOS = ['dia', 'apertura', 'cierre'];

module.exports = function crearControladorHorarios(servicio) {
  return conNextTodos({
    // GET /api/horarios?page=1&limit=10
    listar: async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicio.listar({ page, limit }));
    },

    // GET /api/horarios/:id
    obtener: async (req, res) => {
      res.json(await servicio.obtener(req.params.id));
    },

    // POST /api/horarios
    crear: async (req, res) => {
      const horario = await servicio.crear({ administrador: req.usuario, datos: filtrar(req.body, CAMPOS) });
      res.status(201).location(`/api/horarios/${horario.id}`).json(horario);
    },

    // PUT /api/horarios/:id
    modificar: async (req, res) => {
      res.json(await servicio.modificar({ horarioId: req.params.id, datos: filtrar(req.body, CAMPOS) }));
    },

    // DELETE /api/horarios/:id
    eliminar: async (req, res) => {
      await servicio.eliminar(req.params.id);
      res.status(204).end();
    },
  });
};
