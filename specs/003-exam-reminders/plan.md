# Plan: Recordatorios de exámenes

- **ID:** 003-exam-reminders
- **Especificación:** [spec.md](./spec.md)
- **Estado:** completada

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** Etapa 3.
- **Estado de la etapa:** en progreso.
- **Tareas del roadmap relacionadas:** 3.3 Exámenes y recordatorios en [TASKS.md](../../TASKS.md) y el ítem 5 de la sección 7 de [SPEC.md](../../SPEC.md).

## Capas y archivos afectados

| Capa | Archivos o módulos | Cambio |
|---|---|---|
| Frontend | `frontend/src/pages/DashboardPage.jsx`, `frontend/src/pages/CalendarPage.jsx` | Presentar próximos exámenes sin vencidos; conservar la lista de gestión completa. |
| Documentación | `SPEC.md`, `TASKS.md`, este directorio | Registrar criterios, implementación y verificaciones. |

## Diseño

Reutilizar `getExams({ upcoming: true })` en el dashboard, cuyo servicio backend ya ordena por fecha ascendente. En calendario, derivar eventos de exámenes dentro de la semana actual sin fecha vencida y mantener la lista de gestión alimentada por `getExams()` sin filtro. No cambiar endpoints ni persistencia.

## Decisiones técnicas

- Mantener todos los exámenes futuros sin tope temporal, según el comportamiento actual del endpoint.
- Aplicar el orden cronológico ascendente ya definido por el servicio backend.
- No borrar ni ocultar exámenes vencidos de la gestión.
- Las fechas del calendario se interpretan con las utilidades locales existentes; el backend conserva fechas ISO 8601.

## Seguridad, privacidad y compatibilidad

- Se conservan autenticación, aislamiento por usuario y `VITE_API_URL`.
- No se exponen credenciales ni se agrega persistencia local.
- El contrato de API existente permanece compatible.

## Estrategia de verificación

- Agregar pruebas de integración API para orden ascendente y exclusión de fechas vencidas del filtro `upcoming=true`.
- Agregar pruebas deterministas para filtrar y ordenar eventos de exámenes de la semana local actual.
- Ejecutar pruebas backend, pruebas frontend específicas, lint, build y `git diff --check`.

## Riesgos y mitigaciones

- **Riesgo:** confundir la lista de administración con los recordatorios. **Mitigación:** mantener explícitamente la lista completa en el calendario y filtrar solo los eventos destacados.
