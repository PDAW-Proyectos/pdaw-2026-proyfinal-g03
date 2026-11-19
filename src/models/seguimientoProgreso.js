class SeguimientoProgreso {
    constructor({ id = null, miembroId, peso, fecha = new Date() }) {
        this.id = id;
        this.miembroId = miembroId;
        this.peso = Number(peso);
        this.fecha = new Date(fecha);
    }

    toJSON() {
        return {
            id: this.id,
            miembroId: this.miembroId,
            peso: this.peso,
            fecha: this.fecha.toISOString()
        };
    }

    static fromJSON(datos) {
        return new SeguimientoProgreso(datos);
    }
}

module.exports = SeguimientoProgreso;