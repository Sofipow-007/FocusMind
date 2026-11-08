# Plan: Sesiones planificadas en el calendario semanal

- **ID:** 004-calendar-planned-sessions
- **Especificación:** [spec.md](./spec.md)
- **Estado:** completada

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** Etapa 3.
- **Estado de la etapa:** en progreso.
- **Tareas del roadmap relacionadas:** 3.4 Calendario semanal y 3.5 Frontend conectado a la API en [TASKS.md](../../TASKS.md); ítem 6 de sección 7 en [SPEC.md](../../SPEC.md).

## Capas y archivos afectados

| Capa | Archivos o módulos | Cambio |
|---|---|---|
| Frontend | `frontend/src/pages/CalendarPage.jsx`, `frontend/src/services/studySessionService.js`, `frontend/src/utils/calendar.js`, `frontend/src/index.css` | Cargar sesiones, calcular semana local y renderizar eventos distinguidos por tipo. |
| Documentación | `SPEC.md`, `ARCHITECTURE.md`, `TASKS.md`, este directorio | Registrar contrato, estructura y evidencia. |

## Diseño

Reutilizar `getStudySessions()` para cargar las sesiones del usuario sin alterar el contrato API. Extraer funciones puras para obtener las fechas locales de lunes a domingo y filtrar/ordenar las sesiones planificadas y exámenes futuros de la semana. Renderizar encabezados con fechas y estilos separados para rutina recurrente, examen y sesión puntual. La lista completa de exámenes continúa alimentando la gestión.

## Decisiones técnicas

- Calcular límites de semana con constructores de fecha locales para evitar desplazamientos UTC en el calendario.
- Incluir las fechas de lunes 00:00 hasta el domingo 23:59:59.999 locales.
- Ordenar eventos puntuales de sesión por fecha/hora ascendente.
- Mantener la grilla responsiva existente y no añadir dependencias.

## Seguridad, privacidad y compatibilidad

- Las llamadas siguen en `frontend/src/services/` e incluyen credenciales mediante el cliente HTTP existente.
- No se exponen secretos, no se almacena información de sesiones en `localStorage` y no se cambia persistencia.
- El backend sigue limitando consultas al usuario autenticado.

## Estrategia de verificación

- Pruebas deterministas de semana local y filtro de sesiones por estado y rango.
- Integración HTTP existente verifica propiedad por usuario; extenderla si hace falta comprobar el flujo de recursos.
- Ejecutar las pruebas frontend específicas, `npm test` en backend, lint, build y `git diff --check`.

## Riesgos y mitigaciones

- **Riesgo:** conversiones UTC/local pueden mover una sesión de columna. **Mitigación:** límites locales y pruebas con instantes cercanos al inicio/fin de semana.
