# Tareas: Sesiones planificadas en el calendario semanal

- **ID:** 004-calendar-planned-sessions
- **Especificación:** [spec.md](./spec.md)
- **Plan:** [plan.md](./plan.md)

## Implementación

- [x] Crear utilidades locales puras para la semana visible y su filtrado de eventos.
- [x] Cargar sesiones planificadas en la página de calendario por el servicio HTTP existente.
- [x] Mostrar fechas y separar visualmente rutina, sesiones y exámenes.
- [x] Preservar carga, error y vacío en la pantalla.

## Verificación

- [x] Probar lunes-domingo, límites, cambios de mes/año, estados y orden de sesiones.
- [x] Verificar los eventos visibles en la grilla mediante build y revisión de comportamiento de la vista.
- [x] Ejecutar las comprobaciones backend/frontend aplicables.

## Documentación y cierre

- [x] Actualizar `SPEC.md` y `ARCHITECTURE.md` con el comportamiento aprobado.
- [x] Actualizar `TASKS.md` al completar criterios.
- [x] Registrar aquí los comandos ejecutados y resultados.

### Resultados

- `frontend`: `npm run test:calendar` — 4/4 aprobadas; cubre semana local, límites, cambio de año, estados y orden.
- `frontend`: `npm run build` — aprobado.
- `backend`: `npm test` — 24/24 aprobadas.
- `frontend`: `npm run lint` — dos advertencias preexistentes en `AppLayout.jsx` y `StudySessionsPage.jsx`.
- `git diff --check` — aprobado.
