# Especificación: Recordatorios de exámenes

- **ID:** 003-exam-reminders
- **Estado:** completada
- **Etapa:** 3
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Problema y objetivo

### Necesidad

Los estudiantes necesitan localizar sus exámenes próximos sin confundirlos con fechas ya vencidas y conservar el acceso a todos sus registros.

### Resultado esperado

El dashboard y el calendario muestran próximos exámenes con la información necesaria para ubicarlos; los exámenes vencidos dejan de aparecer como recordatorios, pero se conservan en la gestión del calendario.

## Alcance

### Incluye

- Mostrar todos los exámenes futuros, sin un límite de días.
- Ordenar los recordatorios desde la fecha más próxima.
- Presentar título, materia y fecha/hora en el dashboard y el calendario.
- Retirar exámenes vencidos de las superficies de recordatorio y conservarlos en la lista de gestión del calendario.

### No incluye

- Notificaciones push, correo o recordatorios programados fuera de la aplicación.
- Eliminar automáticamente exámenes vencidos ni añadir una sección de historial.
- Cambios del esquema de base de datos o del contrato HTTP.

## Historias de usuario y requisitos

- **HU-1:** Como estudiante, quiero ver los próximos exámenes ordenados por fecha para organizar mi preparación.
- **HU-2:** Como estudiante, quiero conservar acceso a exámenes vencidos sin que se presenten como próximos.
- **R-1:** Todo examen cuya fecha/hora sea igual o posterior al momento actual se considera próximo; no hay horizonte máximo.
- **R-2:** Los próximos se ordenan por fecha/hora ascendente.
- **R-3:** Dashboard y calendario presentan título, materia y fecha/hora.
- **R-4:** Un examen vencido no aparece como recordatorio, pero sigue visible y administrable en la lista de gestión del calendario.

## Criterios de aceptación

- [x] **CA-1** (HU-1/R-1/R-2): El dashboard incluye todos los exámenes futuros, aun cuando estén a más de 30 días, ordenados del más próximo al más lejano.
- [x] **CA-2** (R-3): El dashboard y los eventos del calendario muestran título, materia y fecha/hora.
- [x] **CA-3** (HU-2/R-4): Un examen vencido no aparece en las superficies de recordatorio; permanece en la lista de gestión con acciones de edición y eliminación.
- [x] **CA-4:** Sin próximos exámenes, el dashboard muestra su estado vacío; los fallos al cargar conservan el mensaje de error existente.
- [x] **CA-5:** El calendario limita los eventos de examen a la semana visible actual y excluye fechas/hora vencidas.

## Reglas y restricciones

- Las fechas se reciben como ISO 8601; la comparación de un examen futuro usa el instante actual.
- Los recordatorios son visuales y solo existen dentro de la aplicación.
- La consulta continúa autenticada y limitada al usuario actual.

## Consideraciones de arquitectura

- **Capa(s) afectada(s):** frontend y documentación.
- **Puntos de extensión previstos:** servicios HTTP de exámenes, `DashboardPage` y `CalendarPage`.
- **Flujo esperado:** las vistas consumen los exámenes del usuario, separan eventos próximos de la lista completa de gestión y los presentan en orden cronológico.
- **Decisiones existentes que condicionan el cambio:** `SPEC.md`, secciones 1, 4.11 y 7.

## Casos límite y errores

- Lista vacía de próximos exámenes.
- Examen exactamente en el momento de consulta.
- Exámenes de distintas materias con fechas iguales.
- Examen vencido que debe seguir editable y eliminable.
- Error de API al cargar el dashboard o calendario.

## Fuera de alcance global

No se implementan notificaciones push ni sincronización con calendarios externos.

## Preguntas abiertas

Ninguna. Criterios acordados el 2026-11-07: todos los futuros, orden ascendente, dashboard y calendario, y vencidos fuera de recordatorios pero presentes en gestión.
