# Plan: Endurecimiento de autenticación

- **ID:** 006-auth-hardening-followup
- **Especificación:** [spec.md](./spec.md)
- **Estado:** completado según alcance aprobado

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** seguimiento de Etapa 2.
- **Estado de la etapa:** implementación base y endurecimiento acordado completados; rate limiting diferido.
- **Tareas relacionadas:** seguimiento de Etapa 2 en [TASKS.md](../../TASKS.md) y contrato mínimo de autenticación 7.1 en [SPEC.md](../../SPEC.md).

## Áreas potencialmente afectadas

| Capa | Archivos o módulos | Cambio posible tras aprobación |
|---|---|---|
| Backend | `config/env.js`, `middleware/auth.js`, `validators/authValidator.js`, `services/authService.js`, `controllers/authController.js` | Validar secretos/configuración, mecanismo de sesión, políticas de credenciales y errores de persistencia. |
| Persistencia | Migraciones/modelos solo si se aprueba revocación server-side | Persistir estado de sesión/versión de token únicamente si se acuerda ese requisito. |
| Pruebas | `src/controllers/auth.integration.test.js` y pruebas de configuración | Cubrir límites y errores acordados, sin usar la base de desarrollo. |
| Documentación | `SPEC.md`, `TASKS.md`, este directorio | Registrar la decisión, alcance final y resultados. |

## Diseño

Validar variables en `config/env.js`, limitar las rutas protegidas a cookie, comprobar `Origin` en solicitudes mutantes, reforzar validación de contraseña solo para nuevas cuentas y mapear la violación de unicidad al error de dominio existente. No agregar limitador local ni revocación persistente.

## Seguridad, privacidad y compatibilidad

- No imprimir secretos, contraseñas, cookies o JWT en logs.
- Ejecutar pruebas únicamente sobre `focusmind_test`.
- Mantener la compatibilidad con el contrato aprobado en `SPEC.md`, salvo modificación explícita.

## Estrategia de verificación

- Pruebas unitarias de validación de configuración y credenciales.
- Pruebas HTTP de cookie, `Origin`, cookie-only, conflictos concurrentes y expiración.
- Verificar inicio seguro en producción ante configuración insegura.
- Ejecutar suites backend/frontend y `git diff --check`.

## Riesgos y mitigaciones

- **Riesgo:** ampliar políticas sin requisitos acordados. **Mitigación:** implementar únicamente las decisiones aprobadas.
- **Riesgo:** afirmar que logout revoca un JWT cuando solo borra cookie. **Mitigación:** probar y documentar exactamente el comportamiento aprobado.
