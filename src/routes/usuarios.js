const { Router } = require('express');

const { exigirPermiso } = require('../middlewares/permisos');

module.exports = function rutasUsuarios({ servicioUsuarios  }) {
    const router = Router();

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
