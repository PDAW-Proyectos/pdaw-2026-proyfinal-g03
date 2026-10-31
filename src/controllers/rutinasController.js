// Capa HTTP: extrae datos de req, llama al servicio y elige el código de estado
// no decide reglas de negocio

const { filtrar, conNextTodos } = require('../utils/http');

// instructorId lo pone el servidor (sale de la sesión), nunca del cuerpo
const CAMPOS = ['nombre', 'nivel', 'ejercicios'];

module.exports = function crearControladorRutinas(servicio) {
  return conNextTodos({
    // GET /api/rutinas?page=1&limit=10
    listar: async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicio.listar({ page, limit }));
    },

    // GET /api/rutinas/:id
    obtener: async (req, res) => {
      res.json(await servicio.obtener(req.params.id));
    },

    // POST /api/rutinas
    crear: async (req, res) => {
      const rutina = await servicio.crear({ instructor: req.usuario, datos: filtrar(req.body, CAMPOS) });
      res.status(201).location(`/api/rutinas/${rutina.id}`).json(rutina);
    },

    // PUT /api/rutinas/:id
    modificar: async (req, res) => {
      res.json(await servicio.modificar({
        rutinaId: req.params.id,
        instructor: req.usuario,
        datos: filtrar(req.body, CAMPOS),
      }));
    },

    // DELETE /api/rutinas/:id
    eliminar: async (req, res) => {
      await servicio.eliminar({ rutinaId: req.params.id, instructor: req.usuario });
      res.status(204).end();
    },
  });
};
