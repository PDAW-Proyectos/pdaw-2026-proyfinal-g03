import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['node_modules/', 'coverage/', 'data/'] },
  js.configs.recommended,
  // reglas del equipo (clase 16 pags 5 y 6)
  // para backend y scripts (con CommonJS + Node):
  {
    files: ['src/**/*.js', 'scripts/**/*.js'], // aplica solo a estos archivos (por conflictos con CommonJS y ESM)
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      eqeqeq: ['error', 'always'], // exige ===
      'prefer-const': 'error', // exige const si no se reasigna
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // variables sin usar (con warning)
      complexity: ['warn', 10], // complejidad ciclomática máxima 10
      'max-depth': ['warn', 3], // profundidad máxima de anidamiento 3
      'max-params': ['warn', 4], // maximo 4 parámetros por funcion
    },
  },

  // reglas para el frontend (con ES Modules + avegador)
  {
    files: ['public/js/**/*.js'],
    languageOptions: {
      sourceType: 'module', // para permitir import/export
      globals: {
        ...globals.browser,
        bootstrap: 'readonly', // se agrega la configuracion en ESLint para que no marque error al usar bootstrap en el frontend
      },
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // reglas para los tests con Jest (con CommonJS + Node + Jest)
  // usan las funciones globales de Jest
  {
    files: ['**/*.test.js', '**/__tests__/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]);
