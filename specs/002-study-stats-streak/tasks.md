# Tareas: Estadísticas por período y racha de estudio

- **ID:** 002-study-stats-streak
- **Especificación:** [spec.md](./spec.md)
- **Plan:** [plan.md](./plan.md)

## Implementación

- [x] Agregar estadísticas semanales/mensuales UTC y racha al agregador.
- [x] Integrar la respuesta en servicio/controlador de estadísticas.
- [x] Actualizar el dashboard para mostrar nuevos valores.
- [x] Documentar el contrato aprobado en `SPEC.md`.

## Verificación

- [x] Cubrir límites semanales/mensuales, sesión completada, duplicados, racha activa/vencida y fechas futuras.
- [x] Probar endpoint con usuario autenticado y usuario sin sesiones.
- [x] Ejecutar las suites backend/frontend aplicables.

## Documentación y cierre

- [x] Actualizar `TASKS.md` al completar criterios.
- [x] Actualizar `ARCHITECTURE.md` si cambia el flujo documentado.
- [x] Registrar aquí los comandos ejecutados y resultados.

### Resultados

- `backend`: `npm test` — 24/24 aprobadas.
- `frontend`: `npm run lint` — tres advertencias no relacionadas; `npm run build` — aprobado; `npm run test:storage` — 4/4 aprobadas.
- `git diff --check` — aprobado.
