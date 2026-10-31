// acá está la capa HTTP de los planes: extrae datos de req, llama al servicio y elige el código de estado
// el miembro sale de la sesión (req.usuario), nunca del cuerpo

// solo se aceptan solo estos dos campos (nivel y dias) del cuerpo, los datos físicos salen del perfil del miembro
const CAMPOS = ['nivel', 'dias'];
const filtrar = (body = {}) =>
  Object.fromEntries(CAMPOS.filter((c) => c in body).map((c) => [c, body[c]]));

const { conNextTodos } = require('../utils/http');

module.exports = function crearControladorPlanes(servicio) {
  return conNextTodos({
    // POST /api/planes-entrenamiento/generar
    generarEntrenamiento: async (req, res) => {
      const plan = await servicio.generarEntrenamiento({ miembro: req.usuario, ...filtrar(req.body) });
      res.status(201).location(`/api/planes-entrenamiento/${plan.id}`).json(plan);
    },

    // POST /api/planes-nutricionales/generar
    generarNutricional: async (req, res) => {
      const plan = await servicio.generarNutricional({ miembro: req.usuario, ...filtrar(req.body) });
      res.status(201).location(`/api/planes-nutricionales/${plan.id}`).json(plan);
    },

    // GET /api/planes-entrenamiento/:id
    obtenerEntrenamiento: async (req, res) => {
      res.json(await servicio.obtenerEntrenamiento({ planId: req.params.id, miembro: req.usuario }));
    },

    // GET /api/planes-nutricionales/:id
    obtenerNutricional: async (req, res) => {
      res.json(await servicio.obtenerNutricional({ planId: req.params.id, miembro: req.usuario }));
    },
  });
};