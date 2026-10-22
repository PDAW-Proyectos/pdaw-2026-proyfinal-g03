# Página de cuidado personal para usuarios de gimnasio

> El eje central es que el miembro del gimnasio pueda llevar progreso de su entrenamiento según el plan elegido. Tambien se ofrece un servicio de gestión básico para los dueños y/o personal del gimnasio.

Proyecto del equipo **03** para *7513 · Proyecto de Desarrollo de Aplicaciones Web*
(Tecnicatura Universitaria en Programación Web y Móvil — DCIC — UNS).

## Ficha del proyecto

| Aspecto                     | Descripción                                                                |
| --------------------------- | ---------------------------------------------------------------------------|
| Problema                    | Progreso y planes de entrenamiento                                         |
| Usuarios                    | Miembros, instructores y administrador (dueños/empleados)                  |
| Funcionalidades núcleo      | 1. Eleccion de plan 2. Seguimiento de plan 3. Solicitar turnos medicos     |
| Reglas de negocio           | 1. Se ofrecen planes preestablecidos para elegir                           |
|                             | 2. Se evalúa a final de cada día si se cumplieron las metas diarias        |
|                             | 3. Se postean turnos con su disponibilidad para que el usuario elija       |
| API externa                 | Gemini API, https://ai.google.dev/gemini-api/docs , creación dinámica de   |
|                             | planes genéricos                                                           |

## Equipo y roles del sprint actual

| Integrante      | Usuario de GitHub | Rol en el sprint      |
| ----------      | ----------------- | --------------------  |
| Avigail Miler   | Avi-Miler         | Referente de producto |
| Flores Romina   | RominaFernanda    | Facilitación          |
| Simon Hornus    | Dopseto           | Repositorio           |
| Camila Corbatta | CamilaCorbatta    | Calidad               |

## Cómo ejecutar el proyecto

```bash
npm install
cp .env.example .env
npm run dev
```

## Cómo ejecutar las pruebas

```bash
npm test
```

## Documentación

- Diagramas y wireframes: [`docs/`](docs/)
- Acuerdos de trabajo y convenciones: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Riesgos: [`docs/riesgos.md`](docs/riesgos.md)

## Uso de herramientas de IA

Registrar aquí qué herramientas se usaron, para qué tareas y qué se adoptó de sus propuestas.

| Fecha    | Herramienta         | Tarea     | Qué se adoptó y por qué                         |
| -------- | ------------------- | --------- | ----------------------------------------------- |
| Semana 1 | Lovable y DeepSeek  | Maquetado | Primer estructura para maquetado y estilización |
