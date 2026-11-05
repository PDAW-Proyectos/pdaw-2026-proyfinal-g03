const SeguimientoPlan = require('../../src/models/SeguimientoPlan');

describe('Modelo SeguimientoPlan', () => {
  const datosBase = {
    miembroId: 1,
    planEntrenamientoId: 100,
    planNutricionalId: 200,
  };

  test('Debe requerir al menos un plan (entrenamiento o nutricional)', () => {
    expect(() => {
      new SeguimientoPlan({ miembroId: 1 }); // sin planes
    }).toThrow(/necesita al menos un plan/i);
  });

  test('Debe iniciar en estado activo', () => {
    const seg = new SeguimientoPlan(datosBase);
    expect(seg.estado).toBe('activo');
  });

  test('Debe calcular el porcentaje completado correctamente', () => {
    const seg = new SeguimientoPlan(datosBase);
    
    // se registran 2 progresos completados y 1 no completado
    seg.registrarProgreso({ completado: true });
    seg.registrarProgreso({ completado: true });
    seg.registrarProgreso({ completado: false });

    // si el plan espera 4 sesiones en total, y se hicieron 2:
    const porcentaje = seg.porcentajeCompletado(4);
    expect(porcentaje).toBe(50); // (2/4) * 100
  });

  test('Debe cambiar de estado correctamente (pausar y reanudar)', () => {
    const seg = new SeguimientoPlan(datosBase);

    seg.pausar();
    expect(seg.estado).toBe('pausado');

    seg.reanudar();
    expect(seg.estado).toBe('activo');
  });

  test('No debe permitir registrar progreso si está pausado', () => {
    const seg = new SeguimientoPlan(datosBase);
    seg.pausar();

    expect(() => {
      seg.registrarProgreso({ completado: true });
    }).toThrow(/No se puede registrar progreso en un seguimiento pausado/i);
  });

  test('No debe permitir reanudar un seguimiento finalizado', () => {
    const seg = new SeguimientoPlan(datosBase);
    seg.finalizar();

    expect(() => {
      seg.reanudar();
    }).toThrow(/No se puede pasar de finalizado a activo/i);
  });
});