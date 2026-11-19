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

Modo de prueba con IA simulada:
Si querés probar la aplicación sin consumir la cuota de Gemini o sin conexión a internet, podés iniciar el servidor con el cliente falso:

En Linux/Mac:

```bash
USE_GEMINI_MOCK=true npm start
```

En Windows (PowerShell):

```bash
$env:USE_GEMINI_MOCK="true"; npm start
```

Esto permite generar planes de entrenamiento y nutrición con respuestas predefinidas.

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

Toda la documentación detallada del proyecto se encuentra en la carpeta docs/:

- Arquitectura del proyecto: Diagramas y wireframes. [`docs/ARQUITECTURA.MD`](docs/ARQUITECTURA.MD)
- Acuerdos de trabajo y convenciones: [`docs/CONTRIBUTING.md`](docs/Contributing.md)
- Mapa de la API y uso de aplicación Bruno: [`docs/README_API.md`](docs/README_API.md)
- Documentación de la API Externa (Google Gemini): [`docs/IAGEMINI_DOC.md`](docs/IAGEMINI_DOC.md)
- Guía de uso, instrucciones paso a paso para usuarios finales: [`docs/GUIA_DE_USO.md`](docs/GUIA_DE_USO.md)
- Decisiones de Arquitectura (ADR): Registro de decisiones significativas del proyecto [`docs/ADR.md`](docs/ADR.md)
- Retrospectiva: Lecciones aprendidas y acciones de mejora. [`docs/RETROSPECTIVA.md`](docs/RETROSPECTIVA.md)

## Uso de herramientas de IA

Todas las herramientas utilizadas, los prompts y cómo se verificaron las respuestas están documentados en el archivo [`docs/DECLARACION_IA.md`](docs/DECLARACION_IA.md).
