// Capa HTTP: extrae datos de req, llama al servicio y elige el codigo de estado
// no decide reglas de negocio

// Solo estos campos entran: el resto se ignora (y instructorId lo pone el servidor)
const CAMPOS = ['titulo', 'descripcion', 'fechaHora', 'duracionMin', 'cupo'];
const filtrar = (body = {}) =>
  Object.fromEntries(CAMPOS.filter((c) => c in body).map((c) => [c, body[c]]));

module.exports = function crearControladorClases(servicio) {
  return {
    // GET /api/clases?instructor=2&page=1&limit=10
    listar: async (req, res) => {
      const { instructor, page, limit } = req.query;
      res.json(await servicio.listar({ instructor, page, limit }));
    },

    // GET /api/clases/:id
    obtener: async (req, res) => {
      res.json(await servicio.obtener(req.params.id));
    },

    // POST /api/clases
    publicar: async (req, res) => {
      const clase = await servicio.publicar({ instructor: req.usuario, datos: filtrar(req.body) });
      res.status(201).location(`/api/clases/${clase.id}`).json(clase);
    },

    // PUT /api/clases/:id
    modificar: async (req, res) => {
      const clase = await servicio.modificar({
        claseId: req.params.id,
        instructor: req.usuario,
        datos: filtrar(req.body),
      });
      res.json(clase);
    },

    // DELETE /api/clases/:id
    eliminar: async (req, res) => {
      await servicio.eliminar({ claseId: req.params.id, instructor: req.usuario });
      res.status(204).end();
    },

    // POST /api/clases/:id/inscribir
    inscribir: async (req, res) => {
      res.json(await servicio.inscribir({ claseId: req.params.id, miembro: req.usuario }));
    },

    // POST /api/clases/:id/desinscribir
    desinscribir: async (req, res) => {
      res.json(await servicio.desinscribir({ claseId: req.params.id, miembro: req.usuario }));
    },
  };
};