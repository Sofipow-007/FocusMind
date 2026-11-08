# Tareas: Recordatorios de exámenes

- **ID:** 003-exam-reminders
- **Especificación:** [spec.md](./spec.md)
- **Plan:** [plan.md](./plan.md)

## Implementación

- [x] Mantener el contrato de consulta de exámenes futuros y ordenar la lista de gestión de forma útil.
- [x] Filtrar los eventos de recordatorio del dashboard y de la semana del calendario con los criterios aprobados.
- [x] Conservar los exámenes vencidos en la lista completa de gestión.

## Verificación

- [x] Verificar filtro, orden, vencidos y límite de semana con pruebas deterministas.
- [x] Verificar el endpoint autenticado de próximos exámenes con pruebas de integración.
- [x] Ejecutar las comprobaciones frontend aplicables.

## Documentación y cierre

- [x] Actualizar `SPEC.md` con los criterios acordados.
- [x] Actualizar `TASKS.md` al completar criterios.
- [x] Registrar aquí los comandos ejecutados y resultados.

### Resultados

- `backend`: `npm test` — 24/24 aprobadas, incluida integración de filtro futuro, orden y conservación de vencidos.
- `frontend`: `npm run test:calendar` — 4/4 aprobadas; `npm run build` — aprobado.
- `frontend`: `npm run lint` — dos advertencias preexistentes en `AppLayout.jsx` y `StudySessionsPage.jsx`.
- `git diff --check` — aprobado.
