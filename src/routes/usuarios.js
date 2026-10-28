
const { Router } = require('express');

const ServicioUsuarios = require('../services/servicioUsuarios');
const { exigirPermiso } = require('../middlewares/permisos');

module.exports = function rutasUsuarios({ repoUsuarios }) {
    const router = Router();
    const servicioUsuarios = new ServicioUsuarios({ repoUsuarios });

    router.post('/miembros',exigirPermiso('crearUsuario'),
        async (req, res, next) => {
            try {
                const miembro = await servicioUsuarios.crearMiembro(req.body ?? {});
                res.status(201).json({ usuario: miembro });
            } catch (error) {
                next(error);
            }
        }
    );

    router.post('/instructores', exigirPermiso('crearUsuario'),
        async (req, res, next) => {
            try {
                const instructor = await servicioUsuarios.crearInstructor(req.body ?? {});
                res.status(201).json({ usuario: instructor });
            } catch (error) {
                next(error);
            }
        }
    );

  return router;
};
