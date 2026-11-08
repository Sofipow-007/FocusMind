# Especificación: Estadísticas por período y racha de estudio

- **ID:** 002-study-stats-streak
- **Estado:** completada
- **Etapa:** 3
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Problema y objetivo

FocusMind actualmente resume minutos y sesiones completadas de todo el historial por materia. Los estudiantes también necesitan ver su actividad de la semana y del mes actuales y una racha de días consecutivos para entender su constancia.

## Alcance

### Incluye

- Ampliar `GET /api/stats/study-time` manteniendo sus campos existentes.
- Entregar estadísticas para la semana calendario UTC actual (lunes a domingo) y el mes calendario UTC actual.
- Agrupar los minutos y sesiones completadas por materia para los totales históricos, semanales y mensuales.
- Calcular la racha de días UTC distintos con al menos una sesión completada.
- Mostrar período semanal, mensual y racha en el dashboard.
- Probar agregaciones, cambios de semana/mes, días duplicados y racha vencida.

### No incluye

- Selector de fechas o períodos personalizados.
- Estadísticas diarias, gráficas o exportación.
- Notificaciones o gamificación adicional.
- Cambios del esquema de base de datos.

## Historias de usuario y requisitos

- **HU-1:** Como estudiante, quiero comparar mi tiempo de estudio total, de esta semana y de este mes para seguir mi progreso.
- **HU-2:** Como estudiante, quiero ver cuántos días consecutivos estudié para seguir mi constancia.
- **R-1:** Solo sesiones `completada` cuentan en estadísticas y racha.
- **R-2:** Los períodos se determinan en UTC: semana de lunes a domingo y mes calendario actual.
- **R-3:** Varias sesiones completadas el mismo día cuentan como un día para la racha.
- **R-4:** La racha actual es cero si la última fecha de estudio es anterior a ayer; si hubo estudio hoy o ayer, se cuentan días consecutivos hacia atrás desde esa fecha más reciente.
- **R-5:** Días futuros no extienden la racha.

## Criterios de aceptación

- [x] **CA-1** (HU-1/R-1/R-2): El endpoint mantiene los totales históricos existentes y agrega totales de semana/mes con agrupación por materia.
- [x] **CA-2** (R-2): La semana comienza el lunes UTC, termina el domingo UTC y ambos límites se incluyen.
- [x] **CA-3** (R-2): El mes usa desde el día 1 hasta el último día UTC del mes actual, inclusive.
- [x] **CA-4** (HU-2/R-3/R-4): Sesiones del mismo día cuentan una sola vez; una racha continúa si el último estudio fue hoy o ayer.
- [x] **CA-5** (R-1/R-5): Sesiones planificadas, canceladas o futuras no incrementan la racha.
- [x] **CA-6:** Sin sesiones completadas, totales son cero, agrupaciones vacías, racha cero y última fecha nula.
- [x] **CA-7:** El dashboard presenta valores semanales, mensuales y racha, incluyendo estado sin actividad.
- [x] **CA-8:** Los cálculos tienen pruebas unitarias deterministas con reloj controlado.

## Reglas y restricciones

- Mantener `GET /api/stats/study-time` autenticado y aislado por usuario.
- Mantener retrocompatibilidad de `totalMinutos`, `totalSesiones` y `porMateria`.
- Las fechas de período se representan como fechas ISO 8601 `YYYY-MM-DD`; `inicio` y `fin` son límites inclusivos.
- Los montos agregados se expresan en minutos; las sesiones son conteos de sesiones completadas.
- Las fechas de actividad se normalizan a día UTC.

## Casos límite y errores

- Ninguna sesión completada.
- Sesiones en lunes/domingo y en el primer/último día de mes.
- Más de una sesión el mismo día.
- Hueco de uno o más días en la secuencia de estudio.
- Último día de estudio hoy, ayer o antes de ayer.
- Una sesión futura no debe crear una racha futura.
- Usuario sin autenticar recibe `401`.

## Consideraciones de arquitectura

- **Capa(s) afectada(s):** backend, frontend y documentación.
- **Puntos de extensión previstos:** `statsService`, `buildStudyTimeStats`, `statsController`, endpoint/servicio del dashboard y `DashboardPage`.
- **Flujo esperado:** endpoint autenticado → consulta de sesiones completadas del usuario → agregación pura UTC → respuesta consumida por servicio frontend → dashboard.
- **Decisiones existentes que condicionan el cambio:** `SPEC.md` secciones 1, 4.11 y 7; criterios UTC y racha acordados por el usuario el 2026-11-07.

## Fuera de alcance global

No se implementan notificaciones push ni calendarios externos.

## Preguntas abiertas

Ninguna; el criterio es semana/mes calendario UTC, solo sesiones completadas y racha vigente con actividad hoy o ayer.
