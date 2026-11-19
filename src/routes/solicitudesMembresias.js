
const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorSolicitudesMembresia = require('../controllers/solicitudesMembresiaController');

module.exports = function rutasSolicitudesMembresia({ servicioSolicitudesMembresia }) {
    const controlador = crearControladorSolicitudesMembresia(servicioSolicitudesMembresia);
    const router = Router();

    // Solicitar cambio de plan o baja
    router.post('/', exigirPermiso('solicitarMembresia'), controlador.solicitar);
    // Listar solicitudes pendientes
    router.get('/', exigirPermiso('gestionarMembresias'), controlador.obtener);
    // Aprobar solicitud
    router.patch('/:id/aprobar', exigirPermiso('gestionarMembresias'), controlador.aprobar);
    // Rechazar solicitud
    router.patch('/:id/rechazar', exigirPermiso('gestionarMembresias'), controlador.rechazar);
    // Confirmar pago y renovar membresía
    router.patch('/miembros/:miembroId/renovar', exigirPermiso('gestionarMembresias'), controlador.renovar);
    //listar miembros con proximo vencimiento
    router.get('/miembros/por-vencer', exigirPermiso('gestionarMembresias'), controlador.listar);
    router.get('/mis-solicitudes', exigirPermiso('solicitarMembresia'), controlador.misSolicitudes
    );

    return router;
};
