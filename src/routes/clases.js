// este archivo define las rutas de la API REST para clases
// tiene una función que recibe el repo y devuelve un Router
// cada endpoint hace tres cosas: chequea el permiso, usa el modelo (que valida y aplica las reglas) y persiste con el repo

const { Router } = require('express');
const v = require('../utils/validaciones');
const paginar = require('../utils/paginar');
const { ErrorProhibido } = require('../utils/errores');
const { exigirPermiso } = require('../middlewares/permisos');

// Solo estos campos entran: el resto se ignora (y instructorId lo pone el servidor)
const CAMPOS = ['titulo', 'descripcion', 'fechaHora', 'duracionMin', 'cupo'];
const filtrar = (body = {}) => Object.fromEntries(CAMPOS.filter((c) => c in body).map((c) => [c, body[c]]));

module.exports = function rutasClases({ repoClases }) {
  const router = Router();

  // GET /api/clases?instructor=2&page=1&limit=10
  router.get('/', async (req, res) => {
    let clases = await repoClases.listar();
    if (req.query.instructor !== undefined) {
      const id = v.numero(req.query.instructor, 'instructor', { min: 1, entero: true });
      clases = clases.filter((c) => c.instructorId === id);
    }
    res.json(paginar(clases, req.query));
  });

  // GET /api/clases/:id
  router.get('/:id', async (req, res) => {
    res.json(await repoClases.obtenerPorId(req.params.id));
  });

  // POST /api/clases  (instructor)
  router.post('/', exigirPermiso('publicarClase'), async (req, res) => {
    const clase = req.usuario.publicarClase(filtrar(req.body)); // valida con el modelo
    await repoClases.agregar(clase);                              // asigna el id
    res.status(201).location(`/api/clases/${clase.id}`).json(clase);
  });

  // DELETE /api/clases/:id  (instructor dueño)
  router.delete('/:id', exigirPermiso('publicarClase'), async (req, res) => {
    const clase = await repoClases.obtenerPorId(req.params.id);
    if (clase.instructorId !== req.usuario.id) throw new ErrorProhibido('La clase es de otro instructor');
    await repoClases.eliminar(clase.id);
    res.status(204).end();
  });

  // POST /api/clases/:id/inscribir  (miembro)
  router.post('/:id/inscribir', exigirPermiso('inscribirseAClase'), async (req, res) => {
    const clase = await repoClases.obtenerPorId(req.params.id);
    req.usuario.inscribirseAClase(clase);   // las reglas (cupo, duplicado) viven en Clase
    await repoClases.actualizar(clase);     // persiste el cambio
    res.json(clase);
  });

  // POST /api/clases/:id/desinscribir  (miembro)
  router.post('/:id/desinscribir', exigirPermiso('inscribirseAClase'), async (req, res) => {
    const clase = await repoClases.obtenerPorId(req.params.id);
    clase.desinscribir(req.usuario.id);
    await repoClases.actualizar(clase);
    res.json(clase);
  });

  return router;
};
