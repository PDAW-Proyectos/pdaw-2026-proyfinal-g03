// Capa HTTP: extrae datos de req, llama al servicio y elige el código de estado
// no decide reglas de negocio
// el miembro sale de la sesión (req.usuario), nunca del cuerpo

const { filtrar, conNextTodos } = require('../utils/http');

const CAMPOS_SEGUIMIENTO = ['planEntrenamientoId', 'planNutricionalId'];
const CAMPOS_REGISTRO = ['fecha', 'pesoActual', 'completado', 'notas'];

module.exports = function crearControladorSeguimientos(servicio) {
  return conNextTodos({
    // GET /api/seguimientos?page=1&limit=10  (los del miembro autenticado)
    listar: async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicio.listar({ miembro: req.usuario, page, limit }));
    },

    // GET /api/seguimientos/:id
    obtener: async (req, res) => {
      res.json(await servicio.obtener({ seguimientoId: req.params.id, miembro: req.usuario }));
    },

    // POST /api/seguimientos
    iniciar: async (req, res) => {
      const seguimiento = await servicio.iniciar({
        miembro: req.usuario,
        datos: filtrar(req.body, CAMPOS_SEGUIMIENTO),
      });
      res.status(201).location(`/api/seguimientos/${seguimiento.id}`).json(seguimiento);
    },

    // POST /api/seguimientos/:id/registros
    registrarProgreso: async (req, res) => {
      const seguimiento = await servicio.registrarProgreso({
        seguimientoId: req.params.id,
        miembro: req.usuario,
        datos: filtrar(req.body, CAMPOS_REGISTRO),
      });
      res.status(201).json(seguimiento);
    },

    // POST /api/seguimientos/:id/pausar
    pausar: async (req, res) => {
      res.json(await servicio.pausar({ seguimientoId: req.params.id, miembro: req.usuario }));
    },

    // POST /api/seguimientos/:id/reanudar
    reanudar: async (req, res) => {
      res.json(await servicio.reanudar({ seguimientoId: req.params.id, miembro: req.usuario }));
    },

    // POST /api/seguimientos/:id/finalizar
    finalizar: async (req, res) => {
      res.json(await servicio.finalizar({ seguimientoId: req.params.id, miembro: req.usuario }));
    },
  });
};
