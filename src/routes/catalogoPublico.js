const { Router } = require('express')
const { conNext } = require('../utils/http')

module.exports = function rutasCatalogoPublico({ servicioClases, servicioHorarios }) {
  const router = Router()

  router.get('/actividades', conNext(async (req, res) => {
    const { page, limit } = req.query
    const resultado = await servicioClases.listar({ page, limit })
    res.json({
      ...resultado,
      data: resultado.data.map(({ id, titulo, descripcion, fechaHora, duracionMin }) => ({
        id,
        titulo,
        descripcion,
        fechaHora,
        duracionMin,
      })),
    })
  }))

  router.get('/horarios', conNext(async (req, res) => {
    const { page, limit } = req.query
    res.json(await servicioHorarios.listar({ page, limit }))
  }))

  return router
}