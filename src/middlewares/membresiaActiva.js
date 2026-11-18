
const Miembro = require('../models/Miembro');
const { ErrorProhibido } = require('../utils/errores');

function exigirMembresiaActiva(req, res, next) {
    const usuario = req.usuario;
    if (!(usuario instanceof Miembro)) {
        return next();
    }

    if (!usuario.planMembresiaId || !usuario.fechaVencimiento) {
        throw new ErrorProhibido('No tenés una membresía activa');
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vencimiento = new Date(usuario.fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);

    if (hoy > vencimiento) {
        throw new ErrorProhibido('Tu membresía está vencida. Contactá al administrador para renovarla');
    }
    next();
}

module.exports = exigirMembresiaActiva;
