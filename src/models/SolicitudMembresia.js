const v = require('../utils/validaciones');

const TIPOS = ['cambio_plan', 'baja'];
const ESTADOS = ['pendiente', 'aprobada', 'rechazada'];

class SolicitudMembresia {
    constructor({ id = null, miembroId, tipo, planSolicitadoId = null, fechaSolicitud = new Date().toISOString(), estado = 'pendiente', }) {
        this.id = id;
        this.miembroId = v.dni(miembroId);
        this.tipo = v.opcion(tipo, 'tipo', TIPOS);
        this.planSolicitadoId = v.idOpcional(planSolicitadoId, 'planSolicitadoId');
        this.fechaSolicitud = fechaSolicitud;
        this.estado = v.opcion(estado, 'estado', ESTADOS);
    }

    toJSON() {
        return {
            id: this.id,
            miembroId: this.miembroId,
            tipo: this.tipo,
            planSolicitadoId: this.planSolicitadoId,
            fechaSolicitud: this.fechaSolicitud,
            estado: this.estado,
        };
    }

    static fromJSON(obj) {
        return new SolicitudMembresia(obj);
    }
}

module.exports = SolicitudMembresia;