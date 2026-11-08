# Especificación: Sesiones planificadas en el calendario semanal

- **ID:** 004-calendar-planned-sessions
- **Estado:** completada
- **Etapa:** 3
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Problema y objetivo

### Necesidad

Una rutina de materia representa un bloque que se repite cada semana, mientras que una sesión planificada tiene fecha y hora únicas. El calendario debe mostrar ambas sin confundir sus significados.

### Resultado esperado

El estudiante consulta en la grilla de la semana actual la rutina recurrente, los exámenes próximos de esa semana y cada sesión planificada que ocurra durante esa semana.

## Alcance

### Incluye

- Mostrar las fechas de lunes a domingo de la semana actual en la grilla.
- Mostrar sesiones con estado `planificada` cuya fecha/hora esté dentro de la semana actual.
- Diferenciar visualmente sesiones puntuales de los bloques recurrentes de materia.
- Mostrar materia, hora y duración de cada sesión planificada.
- Conservar bloques semanales recurrentes y exámenes de la semana en sus superficies actuales.

### No incluye

- Navegación a semanas anteriores o futuras ni edición de sesiones desde la grilla.
- Mostrar sesiones `completada` o `cancelada` como eventos.
- Cambios del esquema de base de datos o calendarios externos.

## Historias de usuario y requisitos

- **HU-1:** Como estudiante, quiero ver mis sesiones planificadas de esta semana junto a mi rutina para organizar mis días.
- **R-1:** La semana visible es la semana calendario actual, de lunes a domingo, según la zona horaria local del navegador.
- **R-2:** Solo sesiones `planificada` con fecha/hora dentro de la semana actual aparecen como eventos puntuales.
- **R-3:** Cada evento puntual se diferencia visualmente de la rutina semanal recurrente y muestra materia, hora y duración.
- **R-4:** La rutina recurrente sigue apareciendo según el día y horario configurados en la materia.
- **R-5:** La grilla puede mostrar conjuntamente sesiones puntuales, rutina recurrente y exámenes próximos.

## Criterios de aceptación

- [x] **CA-1** (R-1): Los encabezados de la grilla muestran los siete días de lunes a domingo con sus fechas locales.
- [x] **CA-2** (HU-1/R-2): Una sesión planificada dentro de la semana aparece una sola vez en la columna de su fecha.
- [x] **CA-3** (R-2): Sesiones anteriores o posteriores a la semana, completadas o canceladas no aparecen como eventos de sesión.
- [x] **CA-4** (R-3/R-4): La sesión puntual tiene una presentación distinta del bloque recurrente e incluye materia, hora y duración.
- [x] **CA-5** (R-5): Los eventos pueden coexistir en un mismo día sin perder su tipo ni sus datos.
- [x] **CA-6:** Sin rutina, sesiones ni exámenes en la semana, el calendario muestra el estado vacío; los errores de carga se informan.

## Reglas y restricciones

- Los eventos provienen de la API autenticada; MySQL sigue siendo la fuente de persistencia.
- La semana se calcula en tiempo local del navegador, coherente con la presentación local de fecha/hora existente.
- Los eventos de sesión no modifican las estadísticas: solo las sesiones completadas cuentan en ellas según la sección 7.2 de `SPEC.md`.
- Los exámenes vencidos no son recordatorios ni eventos destacados, pero continúan en la lista de gestión del calendario.

## Consideraciones de arquitectura

- **Capa(s) afectada(s):** frontend y documentación.
- **Puntos de extensión previstos:** `CalendarPage`, `studySessionService`, utilidades de calendario y estilos en `index.css`.
- **Flujo esperado:** `CalendarPage` carga materias, sesiones y exámenes por servicios; filtra eventos en la semana local actual; la grilla los separa por día y tipo.
- **Decisiones existentes que condicionan el cambio:** `SPEC.md`, secciones 1, 4.11 y 7.

## Casos límite y errores

- Semana que cruza fin de mes o año.
- Eventos en lunes/domingo y sesiones fuera de los límites semanales.
- Varias sesiones el mismo día y a la misma hora.
- Semana sin eventos o con solo rutina recurrente.
- Fallo en la consulta de cualquiera de los recursos necesarios para el calendario.

## Fuera de alcance global

No se implementan notificaciones push ni sincronización con calendarios externos.

## Preguntas abiertas

Ninguna. Criterio acordado el 2026-11-07: incluir únicamente sesiones planificadas de la semana actual, como eventos puntuales diferenciados de la rutina.
