# Página de cuidado personal para usuarios de gimnasio

> El eje central es que el miembro del gimnasio pueda llevar progreso de su entrenamiento según el plan elegido. Tambien se ofrece un servicio de gestión básico para los dueños y/o personal del gimnasio.

Proyecto del equipo **03** para _7513 · Proyecto de Desarrollo de Aplicaciones Web_
(Tecnicatura Universitaria en Programación Web y Móvil — DCIC — UNS).

## Ficha del proyecto

| Aspecto                | Descripción                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| Problema               | Progreso y planes de entrenamiento                                       |
| Usuarios               | Miembros, instructores y administrador (dueños/empleados)                |
| Funcionalidades núcleo | 1. Eleccion de plan 2. Seguimiento de plan 3. Solicitar turnos medicos   |
| Reglas de negocio      | 1. Se ofrecen planes preestablecidos para elegir                         |
|                        | 2. Se evalúa a final de cada día si se cumplieron las metas diarias      |
|                        | 3. Se postean turnos con su disponibilidad para que el usuario elija     |
| API externa            | Gemini API, https://ai.google.dev/gemini-api/docs , creación dinámica de |
|                        | planes genéricos                                                         |

## Equipo y roles del sprint actual

| Integrante      | Usuario de GitHub | Rol en el sprint      |
| --------------- | ----------------- | --------------------- |
| Avigail Miler   | Avi-Miler         | Referente de producto |
| Flores Romina   | RominaFernanda    | Facilitación          |
| Simon Hornus    | Dopseto           | Repositorio           |
| Camila Corbatta | CamilaCorbatta    | Calidad               |

## Cómo ejecutar el proyecto

### Requisitos previos

- Node.js 22 (o superior)
- npm

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/PDAW-Proyectos/pdaw-2026-proyfinal-g03.git
cd pdaw-2026-proyfinal-g03
```

2. Instalar las dependencias:

```bash
npm install
```

3. Copiar el archivo de variables de entorno y completarlo:

```bash
cp .env.example .env
```

Usar env.example como referencia para el archivo .env
Respecto a la `GEMINI_API_KEY` : La clave es gratuita y se genera en Google AI Studio con la cuenta de Google de cada persona.

4. Iniciar el servidor:

```bash
npm start
```

El servidor va a estar escuchando en http://localhost:3000.

## Cómo ejecutar las pruebas

El proyecto usa Jest para las pruebas unitarias.

- Para correr todas las pruebas:

```bash
npm test
```

- Para correr las pruebas con reporte de cobertura:

```bash
npm test -- --coverage
```

- Para correr un solo archivo de prueba (ejemplo):

```bash
npx jest tests/models/Turno.test.js
```

## Calidad de código (Lint y Formato)

- Para analizar el código con ESLint:

```bash
npm run lint
```

- Para formatear el código con Prettier:

```bash
npm run format
```

Nota: Si usás VS Code, el proyecto ya incluye .vscode/settings.json para que el código se formatee automáticamente al guardar. Solo tenés que instalar la extensión de Prettier (esbenp.prettier-vscode).

## Integración Continua (CI)

Cada vez que se abre un Pull Request hacia main, GitHub Actions ejecuta automáticamente:

1. npm ci (instala dependencias exactas).

2. npm run lint (verifica el estilo).

3. npm test (corre las pruebas).

El PR no se puede mergear si alguno de estos pasos falla. Asegurate de correr npm run lint y npm test localmente antes de hacer push.

## Documentación

- Diagramas y wireframes: [`docs/`](docs/)
- Acuerdos de trabajo y convenciones: [`CONTRIBUTING.md`](docs/Contributing.md)
- Riesgos: [`docs/riesgos.md`](docs/riesgos.md)
- Mapa de la API y uso de aplicación Bruno: [`docs/README_API.md`](docs/README_API.md)

## Uso de herramientas de IA

| Fecha         | Herramienta        | Tarea         | Qué se adoptó y por qué                         |
| ------------- | ------------------ | ------------- | ----------------------------------------------- |
| Semana 1      | Lovable y DeepSeek | Maquetado     | Primer estructura para maquetado y estilización |
| Semanas 2 y 3 | DeepSeek           | Armado de     | Se usó asistencia para redactar y asegurar que  |
|               |                    | documentación | esté toda la información correspondiente        |
