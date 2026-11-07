# Plan: <nombre de la funcionalidad>

- **ID:** <mismo id que spec.md>
- **Especificación:** [spec.md](./spec.md)
- **Estado:** propuesta | aprobada | en implementación | completada

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** <Etapa 1, 2, 3 o 4>
- **Estado de la etapa:** <completada, cerrada, siguiente o pendiente>
- **Tareas del roadmap relacionadas:** <ítems concretos de SPEC.md y TASKS.md>

Contexto vigente del roadmap:

- **Etapa 1 — Scaffold y verificación (completada):** estructura de backend/frontend, arranque de ambos proyectos y `GET /api/health`.
- **Etapa 2 — Base de datos y autenticación (cerrada):** Sequelize/MySQL, migraciones y modelos, autenticación, aislamiento por usuario y pruebas del contrato. Criterio de cierre: pruebas automatizadas y migraciones funcionales sobre MySQL.
- **Etapa 3 — Funcionalidades principales (siguiente):** servicios/API y validación de materias, sesiones, notas y exámenes; estadísticas semanales/mensuales; racha y recordatorios; calendario recurrente; integración funcional del frontend.
- **Etapa 4 — Interfaz final y despliegue (pendiente):** pulido de interfaz y estados, Dockerfiles y Compose de la aplicación, decisión sobre proxy Vite y validación del arranque completo en Docker.

No avanzar a una etapa posterior sin la autorización indicada por las instrucciones del proyecto. Si esta tarea contribuye al cierre de una etapa, enumerar en la especificación y en la estrategia de verificación cómo se demuestra cada criterio.

## Capas y archivos afectados

| Capa | Archivos o módulos | Cambio |
|---|---|---|
| Backend | <rutas, validadores, controladores, servicios, modelos> | <responsabilidad> |
| Frontend | <páginas, componentes, hooks, servicios> | <responsabilidad> |
| Datos / despliegue | <migración, configuración, contenedor> | <responsabilidad> |
| Documentación | <documentos> | <responsabilidad> |

Quitar las filas que no apliquen y no mezclar capas sin justificarlo.

## Diseño

<Flujo de datos, endpoints y cambios de modelo/UI necesarios. Referenciar patrones existentes.>

### Contrato de autenticación (completar si aplica; fuente normativa: `SPEC.md`, sección 7.1)

- [ ] Endpoints afectados: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.
- [ ] Payloads y respuesta `{ "user": { "id", "nombre", "email" } }` compatibles con el contrato; el JWT no aparece en el body.
- [ ] Cookie JWT `HttpOnly`, con `SameSite` según el flujo, `Secure` en producción y expiración alineada con `JWT_EXPIRES_IN`.
- [ ] Errores respetan el contrato: `400` validación, `409` email duplicado, `401` credenciales/cookie no válidas y `500` sin detalles internos expuestos.
- [ ] Frontend usa `VITE_API_URL`, llamadas en `frontend/src/services/` y `credentials: 'include'`; nunca lee, escribe ni registra el JWT.
- [ ] CORS usa origen frontend específico y `credentials: true`.
- [ ] Verificación cubre registro, login, `/me` con y sin cookie válida, y logout seguido de `/me` con respuesta `401`.

## Decisiones técnicas

- <decisión propuesta y motivo; indicar si requiere aprobación y actualización de SPEC.md>

## Seguridad, privacidad y compatibilidad

- <validación, autorización, secretos, datos existentes y compatibilidad>

## Estrategia de verificación

- <comandos de pruebas/build/lint y escenarios de aceptación que cubren>

## Riesgos y mitigaciones

- <riesgo y mitigación>
