const ServicioTurnos = require('../../src/services/ServicioTurnos');
const { TurnoChequeoMedico } = require('../../src/models/Turno');
const { ErrorConflicto } = require('../../src/utils/errores');

describe('ServicioTurnos', () => {
  let servicioTurnos;
  let mockRepoTurnos;

  beforeEach(() => {
    mockRepoTurnos = {
      obtenerPorId: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
    };
    servicioTurnos = new ServicioTurnos({ repoTurnos: mockRepoTurnos });
  });

  test('Debe permitir reservar un turno disponible', async () => {
    const turnoDisponible = new TurnoChequeoMedico({ id: 1, fecha: '2026-12-01', hora: '10:00' });
    mockRepoTurnos.obtenerPorId.mockResolvedValue(turnoDisponible);

    // Simulamos que el repositorio guarda y devuelve el turno actualizado
    mockRepoTurnos.actualizar.mockImplementation((t) => Promise.resolve(t));

    const miembroFalso = { id: 5, solicitarTurno: (t) => t.reservar(5) };

    await servicioTurnos.reservar({ turnoId: 1, miembro: miembroFalso });

    expect(turnoDisponible.disponible).toBe(false);
    expect(turnoDisponible.miembroId).toBe(5);
    expect(mockRepoTurnos.actualizar).toHaveBeenCalled();
  });

  test('No debe permitir eliminar un turno que ya fue reservado', async () => {
    // Creamos un turno y lo reservamos antes de la prueba
    const turnoReservado = new TurnoChequeoMedico({ id: 2, fecha: '2026-12-01', hora: '11:00' });
    turnoReservado.reservar(10);

    mockRepoTurnos.obtenerPorId.mockResolvedValue(turnoReservado);

    await expect(servicioTurnos.eliminar(2)).rejects.toThrow(
      new ErrorConflicto('No se puede eliminar un turno reservado'),
    );
  });
});
