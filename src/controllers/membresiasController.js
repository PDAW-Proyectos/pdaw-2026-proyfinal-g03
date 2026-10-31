// Capa HTTP: extrae datos de req, llama al servicio y elige el codigo de estado
// no decide reglas de negocio

const { filtrar, conNextTodos } = require('../utils/http');

const CAMPOS = ['nombre', 'precioMensual', 'descripcion', 'activo'];

module.exports = function crearControladorMembresias(servicio) {
  return conNextTodos({
    // GET /api/membresias?page=1&limit=10
    listar: async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicio.listar({ page, limit }));
    },

    // GET /api/membresias/:id
    obtener: async (req, res) => {
      res.json(await servicio.obtener(req.params.id));
    },

    // POST /api/membresias
    crear: async (req, res) => {
      const plan = await servicio.crear({ administrador: req.usuario, datos: filtrar(req.body, CAMPOS) });
      res.status(201).location(`/api/membresias/${plan.id}`).json(plan);
    },

    // PUT /api/membresias/:id
    modificar: async (req, res) => {
      res.json(await servicio.modificar({ membresiaId: req.params.id, datos: filtrar(req.body, CAMPOS) }));
    },

    // DELETE /api/membresias/:id
    eliminar: async (req, res) => {
      await servicio.eliminar(req.params.id);
      res.status(204).end();
    },
  });
};
