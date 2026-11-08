# Especificación: Validaciones y aislamiento de la API de recursos

- **ID:** 001-stage3-api-validation
- **Estado:** completada
- **Etapa:** 3
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Problema y objetivo

La API ya ofrece operaciones CRUD autenticadas para materias, sesiones de estudio, notas y exámenes, pero necesita verificaciones repetibles de payloads, filtros, IDs y propiedad por usuario. El objetivo es que entradas inválidas se rechacen de forma consistente y que los recorridos CRUD y el aislamiento entre usuarios queden cubiertos por pruebas sobre una base de datos exclusivamente de pruebas.

## Alcance

### Incluye

- Validar IDs de rutas, filtros y relaciones antes de consultar o modificar datos.
- Validar fechas API como timestamps ISO 8601 válidos.
- Validar datos parciales de actualización contra el estado final resultante, incluyendo el bloque semanal de una materia.
- Validar filtros de lista para materias, notas y exámenes.
- Añadir pruebas de integración HTTP para CRUD y propiedad por usuario de materias, sesiones, notas y exámenes.
- Ejecutar la suite contra `focusmind_test`, separada de la base de desarrollo.

### No incluye

- Añadir recursos o endpoints de negocio nuevos.
- Cambiar los roles o el contrato de autenticación existente.
- Cambiar el esquema de base de datos.
- Modificar la interfaz visual.

## Historias de usuario y requisitos

- **HU-1:** Como usuario autenticado, quiero que la API rechace datos e identificadores inválidos para recibir errores claros en lugar de errores internos.
- **HU-2:** Como usuario, quiero que una materia, sesión, nota o examen de otra cuenta nunca se muestre ni modifique mediante la API.
- **R-1:** Las rutas y filtros que esperan IDs aceptan únicamente enteros positivos seguros.
- **R-2:** Las fechas de recursos aceptan timestamps ISO 8601 válidos con zona horaria.
- **R-3:** Las actualizaciones parciales validan el estado combinado final del recurso.
- **R-4:** La suite de pruebas no debe sincronizar ni insertar datos en la base de desarrollo.

## Criterios de aceptación

- [x] **CA-1** (HU-1/R-1): ID inválido en ruta, filtro o relación responde `400`, sin consulta de recurso con ese ID.
- [x] **CA-2** (HU-1/R-2): Fecha inválida o no ISO 8601 responde `400`.
- [x] **CA-3** (HU-1/R-3): Actualizar un solo extremo horario de una materia no puede dejar un horario final incompleto o invertido.
- [x] **CA-4** (HU-1): Filtros de tipo/estado/opciones desconocidos responden `400`.
- [x] **CA-5** (HU-2): Un usuario recibe `404` al consultar, actualizar o borrar recursos de otro usuario, y no puede asociar sus recursos a materias ajenas.
- [x] **CA-6** (R-4): El comando de pruebas usa la base fija `focusmind_test`; nunca sincroniza con `force: true` ni selecciona `focusmind`.
- [x] **CA-7:** La integración cubre creación, lectura, actualización, eliminación, entradas inválidas y aislamiento de las cuatro entidades de dominio.

## Reglas y restricciones

- MySQL sigue siendo la persistencia oficial de FocusMind.
- El aislamiento se aplica en el backend por `usuarioId`, no solo en el frontend.
- Los errores de validación usan `400`; los recursos inexistentes o ajenos usan `404`.
- El bloque de horario semanal de una materia se considera completo: día, inicio y fin, o ninguno.
- La base de pruebas se llama `focusmind_test` y no se comparte con desarrollo.

## Casos límite y errores

- ID cero, negativo, decimal, no numérico, repetido como arreglo o fuera del rango seguro.
- Fecha parseable por JavaScript pero no conforme al timestamp ISO acordado.
- Filtro vacío o con valor no permitido.
- Actualización parcial que deja un horario incoherente.
- Recurso ajeno o materia perteneciente a otra cuenta.
- Base de pruebas no disponible o sin permisos: la prueba falla explícitamente sin recurrir a otra base.

## Consideraciones de arquitectura

- **Capa(s) afectada(s):** backend, persistencia de pruebas y documentación.
- **Puntos de extensión previstos:** `validators/`, `controllers/`, `services/`, `utils/` y rutas existentes.
- **Flujo esperado:** HTTP → middleware de autenticación → validación de parámetros y payload → controller/service → modelo Sequelize.
- **Decisiones existentes que condicionan el cambio:** `SPEC.md` secciones 1, 4.11 y 7; `ARCHITECTURE.md` secciones 3–5.

## Fuera de alcance global

Se mantienen las exclusiones vigentes de `SPEC.md`: recuperación de contraseña, notificaciones push y sincronización con calendarios externos.

## Preguntas abiertas

Ninguna.
