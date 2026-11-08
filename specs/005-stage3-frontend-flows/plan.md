# Plan: Verificación integral de flujos frontend/API

- **ID:** 005-stage3-frontend-flows
- **Especificación:** [spec.md](./spec.md)
- **Estado:** completado

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** Etapa 3.
- **Estado de la etapa:** completada.
- **Tareas del roadmap relacionadas:** Etapa 3.5 y el ítem 8 de la sección 7 de [SPEC.md](../../SPEC.md).

## Capas y archivos afectados

| Capa | Archivos o módulos | Cambio |
|---|---|---|
| Frontend | `App.jsx`, `AppLayout.jsx`, `AuthPage.jsx`, `SubjectsPage.jsx`, `StudySessionsPage.jsx`, `NotesPage.jsx`, `CalendarPage.jsx` | Recuperación de sesión, logout y mensajes de estado de mutaciones. |
| Pruebas API | `backend/src/controllers/auth.integration.test.js` o pruebas de integración existentes | Validar registro/login/me/logout y contratos de recursos sobre la base aislada. |
| Pruebas UI | Navegador integrado y utilidades de frontend existentes | Recorrer autenticación y operaciones, verificando éxito/error/empty states. |
| Documentación | `SPEC.md`, `TASKS.md`, este directorio | Registrar el cierre de Etapa 3 y su evidencia. |

## Diseño

Conservar la arquitectura actual: componentes consumen servicios, el cliente HTTP propaga `status`, y los mensajes se presentan con `InlineMessage`. El estado inicial distingue anónimo (`401`), carga y error recuperable. Las mutaciones capturan errores y publican éxito después de confirmar el refresco visible; las acciones de borrado también manejan errores y bloqueo del botón.

## Decisiones técnicas

- Sin nuevas dependencias ni cambios en el contrato de recursos.
- Las pantallas mantienen sus datos/estado actual y reportan errores en la vista correspondiente.
- Las pruebas API crean fixtures únicos en `focusmind_test` y los eliminan explícitamente.
- La verificación de navegador utiliza una cuenta temporal única en la base de pruebas y elimina únicamente esa cuenta al concluir.

## Seguridad, privacidad y compatibilidad

- Mantener cookies HttpOnly, `credentials: 'include'` y no acceder a tokens desde JavaScript.
- No tocar configuración, esquema o base de datos de desarrollo.
- No registrar contraseñas, cookies o tokens en logs.

## Estrategia de verificación

- Suite backend, con integración de autenticación y recursos.
- Pruebas frontend de utilidades y almacenamiento.
- Recorrido manual/automatizado en navegador sobre servidores configurados exclusivamente con `focusmind_test`.
- `npm run lint`, `npm run build` y `git diff --check`.
- Confirmar limpieza de la cuenta temporal de navegador.

## Riesgos y mitigaciones

- **Riesgo:** confundir un fallo al refrescar con fallo de la mutación ya confirmada. **Mitigación:** mantener separado el mensaje de operación y reportar explícitamente si la vista no pudo actualizarse.
