# Tareas: Endurecimiento de autenticación

- **ID:** 006-auth-hardening-followup
- **Especificación:** [spec.md](./spec.md)
- **Plan:** [plan.md](./plan.md)

## Seguimiento y decisión

- [x] Auditar implementación y contrato existentes sin modificar el mecanismo de autenticación.
- [x] Añadir evidencia de integración para registro, login, `/me`, cookie HttpOnly y logout.
- [x] Aprobar criterios de contraseña, rate limiting diferido, semántica de logout y uso exclusivo de cookie.
- [x] Actualizar la especificación con los criterios aprobados.

## Implementación (solo tras aprobación)

- [x] Endurecer configuración JWT y autenticación según el alcance aprobado.
- [x] Cubrir los casos acordados con pruebas aisladas.
- [x] Registrar compatibilidad, riesgos y resultado.

## Resultados actuales

- `backend`: `npm test` — 26/26 aprobadas, incluidas pruebas de autenticación en `focusmind_test`.
- `frontend`: `npm run build` — aprobado; `npm run lint` — una advertencia preexistente en `StudySessionsPage.jsx`.
- `git diff --check` — aprobado.
- Pruebas cubren configuración JWT, límite de contraseña, cookie-only, `Origin` permitido/rechazado, registro concurrente y expiración de cookie.
- Límite conocido: un JWT copiado antes de logout no se revoca server-side; rate limiting está diferido hasta definir almacenamiento compartido.
