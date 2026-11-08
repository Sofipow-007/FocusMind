# Plan: Estadísticas por período y racha de estudio

- **ID:** 002-study-stats-streak
- **Especificación:** [spec.md](./spec.md)
- **Estado:** completada

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** Etapa 3.
- **Estado de la etapa:** siguiente.
- **Tareas del roadmap relacionadas:** TASKS.md 3.2, estadísticas semanales/mensuales, racha de estudio y presentación en dashboard.

## Capas y archivos afectados

| Capa | Archivos o módulos | Cambio |
|---|---|---|
| Backend | `src/utils/buildStudyTimeStats.js` | Agregaciones UTC y racha deterministas |
| Backend | `src/services/statsService.js`, `src/controllers/statsController.js` | Exponer los resultados para el usuario autenticado |
| Backend | pruebas de utilidades y API | Verificar límites de período, racha y contrato |
| Frontend | `src/services/statsService.js`, `src/pages/DashboardPage.jsx` | Consumir y presentar nuevos datos |
| Documentación | `SPEC.md`, `ARCHITECTURE.md`, `TASKS.md` | Registrar contrato y avance |

## Diseño

- Obtener sesiones `completada` del usuario, con su materia.
- Extender el agregador puro para conservar campos históricos y devolver agregaciones para semana y mes UTC actuales.
- Aceptar `now` como parámetro del agregador para hacer deterministas los límites y la racha en pruebas.
- Calcular racha con fechas UTC únicas; iniciar hoy si hubo sesión hoy, de lo contrario ayer; detenerse en el primer día faltante.
- Mantener la respuesta en el endpoint existente, evitando un endpoint o consulta frontend adicional.
- Mostrar resumen histórico, semanal y mensual, además de la racha en el dashboard.

## Decisiones técnicas

- Semana calendario ISO de lunes a domingo UTC; mes calendario UTC.
- Únicamente sesiones `completada` cuentan.
- La racha sigue vigente si la última fecha con estudio fue hoy o ayer.
- Sin cambios de dependencias ni de base de datos.

## Seguridad, privacidad y compatibilidad

- La consulta continúa filtrando por `usuarioId`.
- No se exponen datos de otros usuarios ni se agrega información sensible.
- Mantener campos previos en la respuesta para evitar romper consumidores existentes.

## Estrategia de verificación

- Pruebas unitarias con fechas fijas para bordes de semana/mes, cero datos, días duplicados, huecos y fecha futura.
- Prueba autenticada del endpoint dentro del aislamiento de la suite backend.
- `npm test` en backend y `npm run build`/`npm run lint` en frontend.

## Riesgos y mitigaciones

- Fechas locales podrían agruparse distinto cerca de medianoche; normalizar todo a UTC y documentar esa regla.
- Consumidores existentes podrían depender del formato exacto; conservar las claves históricas.
