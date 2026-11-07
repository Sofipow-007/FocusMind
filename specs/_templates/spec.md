# Especificación: <nombre de la funcionalidad>

- **ID:** <id>
- **Estado:** propuesta | aprobada | en implementación | completada
- **Etapa:** <etapa del roadmap>
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Problema y objetivo

### Contexto del producto

FocusMind ayuda a estudiantes secundarios y universitarios a organizar el estudio por materia, registrar sesiones, centralizar notas y consultas, planificar una rutina semanal y consultar próximos exámenes y estadísticas de constancia.

### Necesidad

<Qué problema concreto de este producto se resuelve, quién lo experimenta y por qué es importante. Evitar describir aquí la solución técnica.>

### Resultado esperado

<Qué podrá hacer o comprender el usuario cuando este cambio esté implementado.>

## Alcance

### Incluye

- <comportamientos y escenarios que forman parte de este cambio>

### No incluye

- <comportamientos relacionados que quedan fuera; indicar si se difieren a otra etapa>

## Historias de usuario y requisitos

- **HU-1:** Como <tipo de usuario>, quiero <acción o capacidad>, para <beneficio>.
- **R-1:** <Requisito funcional expresado de forma concreta y comprobable>.

Eliminar los ejemplos que no apliquen y numerar las historias/requisitos usados para enlazarlos con sus criterios de aceptación.

## Criterios de aceptación

- [ ] **CA-1** (cubre HU-1/R-1): Dado <contexto>, cuando <acción>, entonces <resultado observable>.
- [ ] **CA-2**: Dado <estado o error relevante>, cuando <acción>, entonces <respuesta esperada>.

Los criterios deben describir resultados verificables, incluyendo los estados de carga, error y vacío cuando la funcionalidad presente datos al usuario.

## Reglas y restricciones

- Cada usuario solo puede consultar o modificar sus propios datos.
- Toda relación con una materia debe pertenecer al mismo usuario que realiza la operación.
- MySQL es la fuente oficial de persistencia desde la Etapa 2; no crear una segunda fuente de verdad en `localStorage`.
- Las contraseñas y tokens no se exponen ni se persisten en el frontend. La autenticación existente usa JWT en cookie `HttpOnly`.
- <reglas específicas de la funcionalidad: estados, fechas, límites, propiedad, cascadas o contrato de API>.

Aplicar solo las reglas que correspondan. Los contratos, convenciones de datos, decisiones técnicas y exclusiones globales se rigen por `SPEC.md`; no redefinirlos aquí.

## Consideraciones de arquitectura

- **Capa(s) afectada(s):** backend | frontend | persistencia | despliegue | documentación.
- **Puntos de extensión previstos:** <rutas/validators/controllers/services/models o pages/components/hooks/services, según aplique>.
- **Flujo esperado:** <resumen de cómo interactúan las capas, sin sustituir el plan técnico>.
- **Decisiones existentes que condicionan el cambio:** <referencias a secciones de SPEC.md o ARCHITECTURE.md>.

Esta sección expresa el contexto y los límites; el detalle de archivos, diseño técnico y verificación se define en `plan.md`.

## Casos límite y errores

- <entrada inválida o incompleta y resultado observable>
- <usuario no autenticado, recurso ajeno o relación de otra persona>
- <recurso inexistente, lista vacía, duplicados o conflicto>
- <fallo de persistencia o de comunicación con la API>

Quitar los casos irrelevantes y agregar los propios de esta funcionalidad.

## Fuera de alcance global

Respetar las exclusiones vigentes de `SPEC.md`, incluyendo recuperación de contraseña, notificaciones push y sincronización con calendarios externos, salvo que un cambio aprobado modifique explícitamente ese alcance.

## Preguntas abiertas

- <decisión pendiente, opciones y quién debe resolverla>

Si no hay preguntas pendientes, escribir “Ninguna”.
