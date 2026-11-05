const { TurnoChequeoMedico, TurnoNutricionista } = require('../../src/models/Turno');

describe('Modelo Turno', () => {
  test('Debe crear un turno de chequeo médico correctamente', () => {
    const turno = new TurnoChequeoMedico({ fecha: '2026-11-10', hora: '14:30' });
    
    expect(turno.tipo).toBe('chequeo_medico');
    expect(turno.duracionMin).toBe(30);
    expect(turno.disponible).toBe(true);
    expect(turno.miembroId).toBeNull();
  });

  test('Debe lanzar un error si la fecha es inválida', () => {
    expect(() => {
      new TurnoChequeoMedico({ fecha: '10-11-2026', hora: '14:30' }); // formato incorrecto
    }).toThrow(/formato AAAA-MM-DD/i);
  });

  test('Debe reservar el turno correctamente', () => {
    const turno = new TurnoNutricionista({ fecha: '2026-11-10', hora: '10:00' });
    turno.reservar(5); // el miembro con ID 5 lo reserva

    expect(turno.disponible).toBe(false);
    expect(turno.miembroId).toBe(5);
  });

  test('No debe permitir reservar un turno ya reservado', () => {
    const turno = new TurnoNutricionista({ fecha: '2026-11-10', hora: '10:00' });
    turno.reservar(5);

    expect(() => {
      turno.reservar(8); // otro miembro intenta reservar
    }).toThrow(/ya fue reservado/i);
  });

  test('Solo el dueño puede cancelar un turno', () => {
    const turno = new TurnoChequeoMedico({ fecha: '2026-11-10', hora: '09:00' });
    turno.reservar(2);

    // miembro 3 intenta cancelar (debe fallar)
    expect(() => {
      turno.cancelar(3);
    }).toThrow(/Solo quien reservó puede cancelar/i);

    // miembro 2 (el dueño) cancela (debe funcionar)
    turno.cancelar(2);
    expect(turno.disponible).toBe(true);
  });
});