# Registro de Decisiones de Arquitectura (ADR)

## Elección de la base de datos

El alcance del proyecto (un sistema de gestión para un gimnasio) requiere persistencia de datos, pero el equipo no contaba con experiencia previa en la configuración y administración de motores de bases de datos relacionales (como PostgreSQL o MySQL) o NoSQL.
Decisión: Utilizar archivos JSON como mecanismo de persistencia, gestionados a través de un patrón Repositorio.

## Elección de API a utilizar

Se necesitaba una API para generar planes de entrenamiento y nutrición personalizados. En primera instancia, se evaluaron APIs dedicadas exclusivamente al dominio del fitness y la nutrición.
Pero dada a la complejidad de uso y de la poca disponibilidad del servicio gratuito, se optó por una opcion más accesible, la API Gemini. También se consideró que sería una buena oportunidad para tener una primera experiencia con el uso de servicios de una IA.
