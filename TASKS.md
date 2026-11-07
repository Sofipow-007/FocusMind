# Tareas de FocusMind

Este archivo resume el roadmap a partir de [SPEC.md](./SPEC.md). El estado marcado como completado refleja lo que `SPEC.md` declara; no equivale a una nueva ejecución de pruebas en esta documentación. Las tareas nuevas deben detallarse como artefactos SDD en [`specs/`](./specs/README.md).

## Estados

- [x] Completada según la especificación vigente.
- [ ] Pendiente o por iniciar.
- **Por confirmar:** la especificación menciona el trabajo, pero no define criterios verificables suficientes para marcarlo completado.

## Etapa 1 — Scaffold y verificación

- [x] Crear la estructura base independiente de backend y frontend.
- [x] Configurar API Express y SPA React/Vite.
- [x] Verificar arranque de proyectos y endpoint `GET /api/health` (estado documentado en `SPEC.md`).
- [x] Definir estructura, convenciones y decisiones iniciales en `SPEC.md`.

## Etapa 2 — Base de datos y autenticación (cerrada en `SPEC.md`)

- [x] Configurar Sequelize y conexión MySQL.
- [x] Preparar migraciones y estructura de configuración de Sequelize.
- [x] Crear modelos, relaciones y migraciones iniciales.
- [x] Implementar autenticación JWT con cookie `HttpOnly`, registro, login, `me`, logout y middleware.
- [x] Validar propiedad por usuario y pruebas de aislamiento/cascada.
- [x] Probar el contrato de API de autenticación descrito en `SPEC.md`.

### Seguimiento de estado de Etapa 2

El encabezado de `SPEC.md` también menciona que el endurecimiento y las pruebas de autenticación están pendientes, aunque su checklist declara cerrada la etapa. Antes de considerar terminado ese seguimiento:

- [ ] Aclarar y registrar en `SPEC.md` qué endurecimiento de autenticación queda pendiente y sus criterios de aceptación.
- [ ] Ejecutar o repetir las verificaciones de autenticación correspondientes y registrar el resultado.

## Etapa 3 — Funcionalidades principales (siguiente etapa)

- [x] Consolidar los servicios/API para materias, sesiones, notas y exámenes.
- [ ] Completar y revisar la validación para los flujos de negocio restantes.
- [ ] Revisar y cerrar estadísticas avanzadas por semana y mes.
- [ ] Implementar la lógica de racha de estudio.
- [ ] Implementar recordatorios de exámenes dentro de la aplicación (sin notificaciones push).
- [ ] Definir el flujo del calendario semanal y los eventos recurrentes.
- [ ] Completar los flujos funcionales del frontend para autenticación, dashboard, materias, sesiones, notas y calendario.
- [ ] Validar los flujos integrados frontend/API, incluyendo estados de carga, error y vacío.

## Etapa 4 — Interfaz final y despliegue local

- [ ] Pulir la interfaz de escritorio y sus estados de carga, error y vacío.
- [ ] Crear Dockerfiles para backend y frontend.
- [ ] Completar Docker Compose para frontend, backend y MySQL.
- [ ] Decidir si se necesita proxy de desarrollo de Vite hacia la API y documentar la decisión.
- [ ] Verificar el arranque integrado de toda la aplicación mediante Docker.

## SDD — Flujo de trabajo y documentación

- [x] Documentar la arquitectura observada en [`ARCHITECTURE.md`](./ARCHITECTURE.md).
- [x] Definir una guía de artefactos SDD en [`specs/README.md`](./specs/README.md).
- [x] Añadir plantillas de especificación, plan y tareas bajo `specs/_templates/`.
- [x] Enlazar la documentación desde el README y las instrucciones del repositorio.
- [ ] Crear una carpeta SDD para cada nueva funcionalidad o cambio con alcance de producto.
- [ ] Mantener este backlog y `SPEC.md` sincronizados cuando se aprueben cambios de alcance o decisiones técnicas.

## Criterio para cerrar una tarea

Una tarea se marca completa cuando su alcance y criterios se cumplen, se han ejecutado las verificaciones pertinentes y cualquier cambio de contrato o decisión técnica ya está reflejado en `SPEC.md`. Para funcionalidades nuevas, los criterios y pruebas deben quedar definidos en los artefactos SDD antes de implementar.
