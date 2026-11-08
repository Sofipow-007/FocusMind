# Especificación: Verificación integral de flujos frontend/API

- **ID:** 005-stage3-frontend-flows
- **Estado:** completada
- **Etapa:** 3
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Problema y objetivo

### Necesidad

Las pantallas principales consumen la API, pero varias mutaciones no comunican el resultado de forma consistente. Algunos errores de eliminación quedan sin capturar y un fallo de red al recuperar la sesión se interpreta como una sesión inexistente.

### Resultado esperado

La persona usuaria puede completar y entender los flujos conectados a la API, incluyendo errores de red, formularios, filtros, eliminaciones, recuperación de sesión y cierre de sesión.

## Alcance

### Incluye

- Distinguir `401` de otros errores en `GET /api/auth/me`; errores de red/servidor se presentan con opción para reintentar, no como sesión anónima.
- Confirmar éxito/error de registro e inicio de sesión.
- Confirmar éxito/error en crear, editar y eliminar materias, sesiones, notas y exámenes.
- Capturar errores de eliminación y evitar indicar éxito si falla la API o la recarga.
- Mantener estados de carga, error y vacío al abrir las pantallas y al filtrar.
- Si falla el cierre de sesión por un problema de comunicación, conservar el estado autenticado y permitir reintentar.
- Probar en entorno aislado los flujos API y verificar los principales recorridos de interfaz.

### No incluye

- Rediseño visual, cambios de navegación o expansión a la Etapa 4.
- Nuevos endpoints, cambios de esquema o cambios de reglas de dominio.
- Endurecimiento adicional de autenticación; se lleva por separado en seguimiento de Etapa 2.

## Historias de usuario y requisitos

- **HU-1:** Como usuario, quiero saber si una operación se guardó o falló para poder actuar sin perder el contexto.
- **HU-2:** Como usuario, quiero que una falla temporal al recuperar la sesión no se confunda con un cierre de sesión.
- **HU-3:** Como usuario, quiero poder reintentar una operación de cierre de sesión si la API no está disponible.
- **R-1:** Solo un `401` de `/auth/me` establece estado anónimo; otros errores conservan una pantalla de error y opción de reintento.
- **R-2:** Toda mutación muestra éxito solo cuando la operación y la actualización de datos visible terminan correctamente; los errores son visibles y no quedan como promesas rechazadas.
- **R-3:** Las operaciones en curso no se pueden duplicar accidentalmente desde el botón que las inició.
- **R-4:** Un fallo de logout no descarta el estado autenticado del cliente.
- **R-5:** Errores de filtros y carga mantienen una salida de recuperación o vuelven a exponer el error sin datos ficticios.

## Criterios de aceptación

- [x] **CA-1** (HU-2/R-1): `GET /auth/me` con `401` lleva al acceso; ante fallo de red/servidor muestra error y reintento sin presentar el formulario de login como si la sesión estuviera cerrada.
- [x] **CA-2** (HU-1/R-2/R-3): Crear, editar y eliminar cada recurso ofrece confirmación visible al éxito, mensaje visible al error y evita dobles envíos durante la operación.
- [x] **CA-3** (R-4): Un error de red en logout informa el problema, conserva la sesión visual y permite reintentar.
- [x] **CA-4** (R-5): Los estados vacíos, carga y errores de vistas/filtros son explícitos y no muestran datos de reemplazo.
- [x] **CA-5:** Los recorridos registro → sesión autenticada → gestión de recursos → logout y errores de autenticación se verifican contra `focusmind_test`.
- [x] **CA-6:** Se ejecutan build, lint y pruebas automatizadas aplicables; los resultados quedan registrados.

## Reglas y restricciones

- Se conservan el cliente HTTP común, `credentials: 'include'` y la base URL de `VITE_API_URL`.
- Las llamadas de red continúan en `frontend/src/services/`.
- No se persisten contraseñas ni tokens en el frontend.
- Las pruebas de integración usan exclusivamente `focusmind_test`; no deben ejecutar `force: true`.

## Consideraciones de arquitectura

- **Capa(s) afectada(s):** frontend, pruebas API y documentación.
- **Puntos de extensión previstos:** `App`, pantallas de autenticación y CRUD, `AppLayout`, cliente HTTP y pruebas de integración de backend.
- **Flujo esperado:** los servicios convierten respuestas HTTP en errores con estado; las páginas presentan los resultados y conservan datos/contexto cuando una operación falla.
- **Decisiones existentes que condicionan el cambio:** `SPEC.md`, secciones 4, 6, 7.1 y 7; responsabilidad de UI y servicios descrita en `ARCHITECTURE.md`.

## Casos límite y errores

- Cookie ausente o inválida (`401`) durante recuperación.
- API inaccesible o respuesta `5xx` durante recuperación o logout.
- Fallo HTTP durante altas, ediciones, eliminaciones y filtros.
- Mutación exitosa seguida de fallo al refrescar la lista.
- Dos intentos consecutivos mientras la primera mutación sigue activa.
- Listas vacías y pantallas sin materias asociadas.

## Fuera de alcance global

Se respetan las exclusiones vigentes de `SPEC.md`, incluidas recuperación de contraseña y notificaciones push.

## Preguntas abiertas

Ninguna; el objetivo es completar y hacer explícitos los flujos ya existentes sin cambiar sus contratos de negocio.
