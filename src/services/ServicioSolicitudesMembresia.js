const SolicitudMembresia = require('../models/SolicitudMembresia');
const Miembro = require('../models/Miembro');
const { ErrorValidacion } = require('../utils/errores');

class ServicioSolicitudesMembresia {
    constructor({ repoSolicitudesMembresia, repoUsuarios, repoMembresias, }) {
        this.repoSolicitudesMembresia = repoSolicitudesMembresia;
        this.repoUsuarios = repoUsuarios;
        this.repoMembresias = repoMembresias;
    }

    async solicitar({ miembroId, tipo, planSolicitadoId = null }) {
        const miembro = await this.repoUsuarios.obtenerPorId(miembroId);

        this._validarMiembro(miembro);

        if (tipo === 'cambio_plan') {
            await this._validarCambioPlan(miembro, planSolicitadoId);
        }

        if (tipo === 'baja') {
            this._validarBaja(miembro);
        }

        const solicitudes = await this.repoSolicitudesMembresia.listar();

        const pendiente = solicitudes.some(
            solicitud =>
                String(solicitud.miembroId) === String(miembro.id) &&
                solicitud.estado === 'pendiente'
        );

        if (pendiente) {
            throw new ErrorValidacion(
                'Ya tenés una solicitud de membresía pendiente'
            );
        }

        const solicitud = new SolicitudMembresia({
            miembroId: miembro.id,
            tipo,
            planSolicitadoId: tipo === 'cambio_plan' ? planSolicitadoId : null,
            estado: tipo === 'baja' ? 'aprobada' : 'pendiente',
        });

        if (tipo === 'baja') {
            miembro.bajaMembresiaPendiente = true;
            await this.repoUsuarios.actualizar(miembro);
        }

        return this.repoSolicitudesMembresia.agregar(solicitud);
    }

    _validarMiembro(miembro) {
        if (!(miembro instanceof Miembro)) {
            throw new ErrorValidacion('El usuario no es un miembro');
        }

        if (miembro.bajaMembresiaPendiente) {
            throw new ErrorValidacion(
                'No podés realizar cambios porque tenés una baja programada'
            );
        }
    }

    async _validarCambioPlan(miembro, planSolicitadoId) {
        if (!planSolicitadoId) {
            throw new ErrorValidacion('Debés seleccionar un plan');
        }

        const plan = await this.repoMembresias.obtenerPorId(planSolicitadoId);

        if (!plan || !plan.activo) {
            throw new ErrorValidacion('El plan seleccionado no está disponible');
        }

        if (String(planSolicitadoId) === String(miembro.planMembresiaId)) {
            throw new ErrorValidacion('Ya tenés contratado ese plan');
        }
    }

    _validarBaja(miembro) {
        if (!miembro.planMembresiaId) {
            throw new ErrorValidacion('No tenés una membresía activa');
        }

        const fechaVencimiento = new Date(miembro.fechaVencimiento);
        const hoy = new Date();

        hoy.setHours(0, 0, 0, 0);
        fechaVencimiento.setHours(0, 0, 0, 0);

        if (fechaVencimiento < hoy) {
            throw new ErrorValidacion(
                'No podés solicitar la baja de una membresía vencida'
            );
        }
    }

    async listarPendientes() {
        const solicitudes = await this.repoSolicitudesMembresia.listar();

        return solicitudes.filter(
            solicitud => solicitud.estado === 'pendiente'
        );
    }

    async resolver(id, estado) {
        if (!['aprobada', 'rechazada'].includes(estado)) {
            throw new ErrorValidacion('Estado de solicitud inválido');
        }

        const solicitud = await this.repoSolicitudesMembresia.obtenerPorId(id);

        if (solicitud.estado !== 'pendiente') {
            throw new ErrorValidacion('La solicitud ya fue resuelta');
        }

        if (estado === 'aprobada') {
            const miembro = await this.repoUsuarios.obtenerPorId(
                solicitud.miembroId
            );

            if (!(miembro instanceof Miembro)) {
                throw new ErrorValidacion('El usuario no es un miembro');
            }

            if (solicitud.tipo === 'cambio_plan') {
                miembro.planMembresiaPendienteId = solicitud.planSolicitadoId;
            }

            await this.repoUsuarios.actualizar(miembro);
        }

        solicitud.estado = estado;

        return this.repoSolicitudesMembresia.actualizar(solicitud);
    }

    async renovarMembresia(miembroId) {
        const miembro = await this.repoUsuarios.obtenerPorId(miembroId);

        if (!(miembro instanceof Miembro)) {
            throw new ErrorValidacion('El usuario no es un miembro');
        }

        if (!miembro.planMembresiaId) {
            throw new ErrorValidacion('El miembro no tiene una membresía');
        }

        if (miembro.bajaMembresiaPendiente) {
            throw new ErrorValidacion(
                'La membresía tiene una baja aprobada y no puede renovarse'
            );
        }

        const ahora = new Date();
        const vencimientoActual = miembro.fechaVencimiento
            ? new Date(miembro.fechaVencimiento)
            : ahora;

        const fechaBase = vencimientoActual > ahora
            ? vencimientoActual
            : ahora;

        // Aplicar el cambio de plan aprobado, si existe.
        if (miembro.planMembresiaPendienteId) {
            const nuevoPlan = await this.repoMembresias.obtenerPorId(
                miembro.planMembresiaPendienteId
            );

            if (!nuevoPlan.activo) {
                throw new ErrorValidacion(
                    'El plan solicitado ya no está disponible'
                );
            }

            miembro.planMembresiaId = miembro.planMembresiaPendienteId;
            miembro.planMembresiaPendienteId = null;
        }

        miembro.fechaUltimaRenovacion = ahora.toISOString();
        miembro.fechaVencimiento = new Date(
            fechaBase.getTime() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();

        return this.repoUsuarios.actualizar(miembro);
    }

    async listarMembresiasPorVencer() {
        const usuarios = await this.repoUsuarios.listar();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const limite = new Date(hoy);
        limite.setDate(limite.getDate() + 10);

        return usuarios.filter(usuario => {
            if (!(usuario instanceof Miembro)) return false;
            if (!usuario.planMembresiaId || !usuario.fechaVencimiento) {
                return false;
            }

            const vencimiento = new Date(usuario.fechaVencimiento);
            vencimiento.setHours(0, 0, 0, 0);

            return vencimiento <= limite;
        });
    }

    async listarSolicitudesPorMiembro(miembroId) {
        const solicitudes = await this.repoSolicitudesMembresia.listar();

        return solicitudes
            .filter(solicitud =>
                String(solicitud.miembroId) === String(miembroId) &&
                solicitud.tipo === 'cambio_plan'
            )
            .sort((a, b) =>
                new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud)
            );
    }
}

module.exports = ServicioSolicitudesMembresia;