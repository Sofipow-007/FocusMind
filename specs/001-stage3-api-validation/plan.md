# Plan: Validaciones y aislamiento de la API de recursos

- **ID:** 001-stage3-api-validation
- **Especificación:** [spec.md](./spec.md)
- **Estado:** completada

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** Etapa 3.
- **Estado de la etapa:** siguiente.
- **Tareas del roadmap relacionadas:** TASKS.md 3.1, ampliar validaciones de casos límite y agregar pruebas de integración CRUD y propiedad por usuario sobre base aislada.

## Capas y archivos afectados

| Capa | Archivos o módulos | Cambio |
|---|---|---|
| Backend | `src/utils/validation.js`, `src/validators/`, `src/controllers/` | Reglas de entrada/IDs y respuestas 400 consistentes |
| Backend | `src/services/` | Validar asociaciones bajo el propietario autenticado |
| Datos / despliegue | `src/models/User.test.js`, pruebas de API, script de pruebas | Usar exclusivamente `focusmind_test`; fixtures repetibles |
| Documentación | `SPEC.md`, `TASKS.md`, `ARCHITECTURE.md` | Registrar contrato, avance y ejecución |

## Diseño

- Reutilizar utilidades compartidas para validar IDs y fechas.
- Validar filtros en controllers antes de invocar servicios.
- En actualizaciones parciales de materias, obtener el recurso propio, combinar valores existentes con los campos recibidos y validar el horario resultante.
- Hacer pruebas HTTP contra el `app` Express real con JWT de prueba y datos MySQL en `focusmind_test`.
- Mantener fixtures únicos y borrarlos por cascada al finalizar; no truncar ni borrar tablas.
- Configurar el runner para fijar `NODE_ENV=test` y `DB_NAME=focusmind_test`, sin aceptar como alternativa la base de desarrollo.

## Decisiones técnicas

- La base de pruebas dedicada usa el nombre fijo `focusmind_test`.
- No se introduce una dependencia de pruebas HTTP: se usa `fetch` nativo de Node y un servidor local efímero.
- No se usa `sequelize.sync({ force: true })`.

## Seguridad, privacidad y compatibilidad

- Nunca ejecutar pruebas destructivas sobre `focusmind` ni usar la base de producción.
- No imprimir credenciales en logs.
- Mantener el aislamiento en todas las consultas y asociaciones de dominio.

## Estrategia de verificación

- `npm test` en `backend/` sobre la base aislada.
- Confirmar que incluye las pruebas unitarias actuales y la integración HTTP de CRUD/ownership.
- `git diff --check`.

## Riesgos y mitigaciones

- Si MySQL está detenido o la cuenta no puede acceder a `focusmind_test`, fallar explícitamente; no intentar conectarse a otra base.
