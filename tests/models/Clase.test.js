const Clase = require('../../src/models/Clase');

describe('Modelo Clase', () => {
  // se crea una fecha futura para que no falle por "clase ya comenzada"
  const fechaFutura = new Date();
  fechaFutura.setDate(fechaFutura.getDate() + 5);
  const fechaISO = fechaFutura.toISOString();

  test('Debe crear una clase con cupos disponibles', () => {
    const clase = new Clase({
      titulo: 'Yoga Avanzado',
      instructorId: 1,
      fechaHora: fechaISO,
      duracionMin: 60,
      cupo: 10,
    });

    expect(clase.titulo).toBe('Yoga Avanzado');
    expect(clase.cuposDisponibles).toBe(10);
    expect(clase.inscriptosIds).toEqual([]);
  });

  test('Debe inscribir a un miembro y restar cupo', () => {
    const clase = new Clase({
      titulo: 'Crossfit',
      instructorId: 1,
      fechaHora: fechaISO,
      duracionMin: 45,
      cupo: 2,
    });

    clase.inscribir(10);

    expect(clase.estaInscripto(10)).toBe(true);
    expect(clase.cuposDisponibles).toBe(1);
  });

  test('No debe permitir inscribir a un miembro dos veces', () => {
    const clase = new Clase({
      titulo: 'Crossfit',
      instructorId: 1,
      fechaHora: fechaISO,
      duracionMin: 45,
      cupo: 5,
    });

    clase.inscribir(10);

    expect(() => clase.inscribir(10)).toThrow(/ya está inscripto/i);
  });

  test('No debe permitir inscribir si no hay cupos', () => {
    const clase = new Clase({
      titulo: 'Zumba',
      instructorId: 1,
      fechaHora: fechaISO,
      duracionMin: 60,
      cupo: 1,
    });

    clase.inscribir(10); // llena el cupo (1)

    expect(() => clase.inscribir(11)).toThrow(/no tiene cupos disponibles/i);
  });

  test('No debe permitir inscribir en clases que ya pasaron', () => {
    const fechaPasada = new Date();
    fechaPasada.setDate(fechaPasada.getDate() - 1);

    const clase = new Clase({
      titulo: 'Spinning',
      instructorId: 1,
      fechaHora: fechaPasada.toISOString(),
      duracionMin: 45,
      cupo: 5,
    });

    expect(() => clase.inscribir(10)).toThrow(/La clase ya comenzó/i);
  });
});
