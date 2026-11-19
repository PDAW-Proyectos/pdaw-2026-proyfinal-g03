// acá está la capa HTTP de los planes: extrae datos de req, llama al servicio y elige el código de estado
// el miembro sale de la sesión (req.usuario), nunca del cuerpo

// solo se aceptan solo estos dos campos (nivel y dias) del cuerpo, los datos físicos salen del perfil del miembro
const CAMPOS_ENTRENAMIENTO = ['nivel', 'dias'];
const CAMPOS_NUTRICION = ['objetivo'];

const filtrar = (body = {}, camposPermitidos) =>
  Object.fromEntries(camposPermitidos.filter((c) => c in body).map((c) => [c, body[c]]));

const CAMPOS_EDICION = ['dias'];

const filtrarEdicion = (body = {}) =>
  Object.fromEntries(
    CAMPOS_EDICION
      .filter(c => c in body)
      .map(c => [c, body[c]])
  );

const { conNextTodos } = require('../utils/http');

module.exports = function crearControladorPlanes(servicio) {
  return conNextTodos({
    // POST /api/planes-entrenamiento/generar
    generarEntrenamiento: async (req, res) => {
      const plan = await servicio.generarEntrenamiento({
        miembro: req.usuario,
        ...filtrar(req.body, CAMPOS_ENTRENAMIENTO),
      });
      res.status(201).location(`/api/planes-entrenamiento/${plan.id}`).json(plan);
    },

    // POST /api/planes-nutricionales/generar
    generarNutricional: async (req, res) => {
      const plan = await servicio.generarNutricional({
        miembro: req.usuario,
        ...filtrar(req.body, CAMPOS_NUTRICION),
      });
      res.status(201).location(`/api/planes-nutricionales/${plan.id}`).json(plan);
    },

    // GET /api/planes-entrenamiento/mios
    listarEntrenamientos: async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicio.listarEntrenamientos({ miembro: req.usuario, page, limit }));
    },

    // GET /api/planes-nutricionales/mios
    listarNutricionales: async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicio.listarNutricionales({ miembro: req.usuario, page, limit }));
    },

    // GET /api/planes-entrenamiento/:id
    obtenerEntrenamiento: async (req, res) => {
      res.json(
        await servicio.obtenerEntrenamiento({ planId: req.params.id, miembro: req.usuario }),
      );
    },

    // GET /api/planes-nutricionales/:id
    obtenerNutricional: async (req, res) => {
      res.json(await servicio.obtenerNutricional({ planId: req.params.id, miembro: req.usuario }));
    },

    // PUT /api/planes-entrenamiento/:id
    modificarEntrenamiento: async (req, res) => {
      const plan = await servicio.modificarEntrenamiento({
        planId: req.params.id,
        miembro: req.usuario,
        ...filtrarEdicion(req.body),
      });

      res.json(plan);
    },
  });
};
