const { Router } = require('express');
const { conNext } = require('../utils/http');

module.exports = function rutasCatalogoPublico({
  servicioClases,
  servicioHorarios,
  servicioMembresias,
  servicioUsuarios
}) {
  const router = Router();

  router.get(
    '/contacto',
    conNext(async (req, res) => {
      const contacto = await servicioUsuarios.obtenerContactoAdministrador();

      if (!contacto) {
        return res.status(404).json({
          error: 'No hay datos de contacto disponibles.',
        });
      }

      res.json({ data: contacto });
    }),
  );

  router.get(
    '/actividades',
    conNext(async (req, res) => {
      const { page, limit } = req.query;
      const resultado = await servicioClases.listarDestacadas({ page, limit });
      res.json({
        ...resultado,
        data: resultado.data.map(
          ({ id, titulo, descripcion, fechaHora, duracionMin, destacada }) => ({
            id,
            titulo,
            descripcion,
            fechaHora,
            duracionMin,
            destacada,
          }),
        ),
      });
    }),
  );

  router.get(
    '/horarios',
    conNext(async (req, res) => {
      const { page, limit } = req.query;
      res.json(await servicioHorarios.listar({ page, limit }));
    }),
  );

  router.get(
    '/membresias',
    conNext(async (req, res) => {
      const resultado = await servicioMembresias.listar({ page: 1, limit: 50 });
      const data = resultado.data
        .filter(({ activo }) => activo)
        .map(({ id, nombre, precioMensual, descripcion }) => ({
          id,
          nombre,
          precioMensual,
          descripcion,
        }));
      res.json({ data, page: 1, limit: 50, total: data.length });
    }),
  );

  return router;
};
