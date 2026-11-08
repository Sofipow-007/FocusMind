# Tareas de FocusMind

Este archivo resume el roadmap a partir de [SPEC.md](./SPEC.md) y el estado observado del repositorio. Un check indica que la implementación base está presente y que hay evidencia en código o pruebas; no significa que la funcionalidad esté validada de punta a punta. Las tareas nuevas deben detallarse como artefactos SDD en [`specs/`](./specs/README.md).

## Estados

- [x] Implementación base reportada en `SPEC.md` o verificada en código/pruebas.
- [ ] Pendiente o por iniciar.
- **Por definir:** falta acordar el comportamiento o los criterios de aceptación.

## Etapa 1 — Scaffold y verificación

- [x] Crear la estructura base independiente de backend y frontend.
- [x] Configurar API Express y SPA React/Vite.
- [x] Verificar arranque de proyectos y endpoint `GET /api/health` (estado documentado en `SPEC.md`).
- [x] Definir estructura, convenciones y decisiones iniciales en `SPEC.md`.

## Etapa 2 — Base de datos y autenticación (completada; rate limiting diferido)

- [x] Configurar Sequelize y conexión MySQL.
- [x] Preparar migraciones y estructura de configuración de Sequelize.
- [x] Crear modelos, relaciones y migraciones iniciales.
- [x] Implementar autenticación JWT con cookie `HttpOnly`, registro, login, `me`, logout y middleware.
- [x] Validar propiedad por usuario y pruebas de aislamiento/cascada.
- [x] Probar el contrato de API de autenticación descrito en `SPEC.md`.

### Seguimiento de estado de Etapa 2

La implementación base y el contrato mínimo están verificados. Se implementaron los controles aprobados para secreto/expiración JWT, cookie-only, política de contraseña, validación de Origin y conflictos concurrentes:

- [x] Exigir secreto JWT de producción de al menos 32 caracteres y validar formatos/duración de expiración.
- [x] Aceptar solo cookie HttpOnly y validar `Origin` para solicitudes autenticadas mutantes.
- [x] Aplicar mínimo de 12 caracteres y máximo de 72 bytes UTF-8 a nuevas contraseñas; login mantiene compatibilidad con cuentas anteriores.
- [x] Convertir conflictos únicos concurrentes de email a `409`.
- [x] Documentar y probar que logout limpia cookie pero no revoca un JWT previamente copiado.
- [x] Ejecutar pruebas de autenticación y controles aprobados en `focusmind_test`.
- [ ] Diferido: acordar rate limiting con almacenamiento compartido antes de desplegar varias instancias; detalle en [`specs/006-auth-hardening-followup/`](./specs/006-auth-hardening-followup/).

## Etapa 3 — Funcionalidades principales (completada)

### 3.1 API, persistencia y validaciones

- [x] CRUD autenticado de materias, sesiones de estudio, notas y exámenes; existen rutas, controladores, servicios y servicios HTTP del frontend.
- [x] Aislamiento por usuario en consultas y operaciones de dominio revisadas para estos recursos.
- [x] Validaciones base para payloads de materias, sesiones, notas y exámenes, con pruebas unitarias de validadores.
- [x] Revisar casos límite: IDs, filtros, actualizaciones parciales, estados/fechas, horarios y relaciones entre usuarios.
- [x] Agregar pruebas HTTP de integración CRUD y propiedad por usuario sobre `focusmind_test`.

### 3.2 Estadísticas y constancia

- [x] Calcular minutos y sesiones completadas totales y agruparlas por materia; hay prueba unitaria de agregación y estado vacío.
- [x] Agregar estadísticas de semana (lunes-domingo UTC) y mes calendario UTC con agregación por materia y límites inclusivos.
- [x] Implementar racha de días UTC distintos con sesiones completadas; solo se mantiene activa si hubo actividad hoy o ayer; fechas futuras no la extienden.
- [x] Mostrar estadísticas semanales/mensuales, desglose por materia y racha en el dashboard.

### 3.3 Exámenes y recordatorios

- [x] Crear, listar, editar y eliminar exámenes asociados a una materia del usuario.
- [x] Filtrar exámenes futuros y mostrar próximos exámenes en el dashboard; el calendario también los presenta.
- [x] Definir en SDD el comportamiento esperado de “recordatorio”: todos los futuros, orden ascendente, presentación en dashboard/calendario y vencidos fuera de recordatorios pero conservados en gestión; no incluye push.
- [x] Verificar el filtro API de próximos exámenes y los eventos de la semana en frontend.

### 3.4 Calendario semanal

- [x] Guardar en materias un único bloque semanal opcional (día/hora de inicio/fin) y mostrarlo en la grilla semanal.
- [x] Mostrar exámenes en el día correspondiente del calendario.
- [x] Definir en SDD que las sesiones `planificada` de la semana actual aparecen como eventos puntuales además del bloque recurrente.
- [x] Mostrar fechas locales de lunes a domingo y probar filtros por semana, estado y orden.

### 3.5 Frontend conectado a la API

- [x] Autenticación: registro, login, consulta de sesión y logout conectados a los servicios de autenticación.
- [x] Materias: crear, listar, editar, eliminar y configurar favoritos/prioridad/horario.
- [x] Sesiones: crear, listar, editar, eliminar y filtrar por materia.
- [x] Notas: crear, listar, editar, eliminar y filtrar por materia/tipo.
- [x] Dashboard: resumen de estudio actual, próximos exámenes y materias destacadas.
- [x] Calendario: mostrar rutina recurrente, sesiones planificadas y exámenes de la semana; permitir gestión de todos los exámenes.
- [x] Completar y revisar estados de éxito/error en mutaciones, recuperación de sesión y errores de red en los flujos conectados.
- [x] Validar recorridos de usuario en frontend/API, incluidos estados de carga, error y vacío, sobre base de pruebas aislada.

### Orden sugerido para continuar

1. No iniciar la Etapa 4 hasta autorización explícita.

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

## Evidencia de esta revisión

- Backend: `npm test` pasó 26/26, incluyendo configuración JWT, contrato HTTP de autenticación, cookie-only, validación de Origin, registro concurrente y CRUD autenticado.
- El runner de backend crea/usa solo `focusmind_test`, fuerza `NODE_ENV=test`, limita la concurrencia de archivos y no borra tablas. Se confirmó que las pruebas dejan cero usuarios de fixture.
- Estadísticas: pruebas unitarias cubren períodos UTC, límites inclusivos, racha anclada hoy/ayer, duplicados, huecos, sesiones no completadas y fechas futuras; la integración verifica el endpoint autenticado.
- Frontend: `npm run build` pasó; `npm run test:calendar` pasó 4/4 y `npm run test:storage` pasó 4/4. `npm run lint` terminó con una advertencia preexistente en `StudySessionsPage.jsx`.
- Calendario: pruebas deterministas cubren semana local de lunes a domingo, límites de semana, cambio de año, estados y orden de sesiones, y filtro/orden de exámenes no vencidos.
- Recorrido integrado manual en navegador: registro, CRUD de materia/sesión/nota/examen, sesión planificada en calendario, error simulado al borrar, recuperación de sesión tras error de red y logout/reintento. Tras endurecer Origin, se volvió a verificar registro/creación de materia desde navegador. Las cuentas temporales se eliminaron al finalizar.
- Estas verificaciones de navegador se hicieron manualmente; no se incorporó un framework automatizado de pruebas E2E.
