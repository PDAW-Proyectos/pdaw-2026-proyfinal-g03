const Miembro = require('../../src/models/Miembro');

describe('Modelo Miembro - Validación de datos físicos', () => {
  const datosBase = {
    dni: '12345678',
    nombre: 'Test',
    email: 'test@test.com',
    passwordHash: 'hash',
    altura: 175,
    peso: 80,
    edad: 30,
    objetivo: 'mantener',
  };

  // valores limite para el peso (entre 20 y 400)
  test.each([
    ['por debajo del mínimo', 19, 'error'],
    ['límite inferior', 20, 'ok'],
    ['valor representativo', 80, 'ok'],
    ['límite superior', 400, 'ok'],
    ['por encima del máximo', 401, 'error'],
  ])('Peso: %s (%i kg)', (_, peso, esperado) => {
    const crear = () => new Miembro({ ...datosBase, peso });
    if (esperado === 'error') {
      expect(crear).toThrow(/peso/i);
    } else {
      expect(crear().peso).toBe(peso);
    }
  });

  // valores limite para la edad (entre 14 y 110)
  test.each([
    ['por debajo del mínimo', 13, 'error'],
    ['límite inferior', 14, 'ok'],
    ['valor representativo', 30, 'ok'],
    ['límite superior', 110, 'ok'],
    ['por encima del máximo', 111, 'error'],
  ])('Edad: %s (%i años)', (_, edad, esperado) => {
    const crear = () => new Miembro({ ...datosBase, edad });
    if (esperado === 'error') {
      expect(crear).toThrow(/edad/i);
    } else {
      expect(crear().edad).toBe(edad);
    }
  });
});
