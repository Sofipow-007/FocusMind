# Tareas: Validaciones y aislamiento de la API de recursos

- **ID:** 001-stage3-api-validation
- **Especificación:** [spec.md](./spec.md)
- **Plan:** [plan.md](./plan.md)

## Implementación

- [x] Asegurar la base de datos y el runner de pruebas aislados.
- [x] Endurecer validación compartida de IDs, fechas, filtros y horario parcial.
- [x] Cubrir el CRUD y aislamiento de las cuatro entidades con pruebas HTTP.

## Verificación

- [x] Ejecutar suite backend usando exclusivamente `focusmind_test`.
- [x] Confirmar que desarrollo no se usa ni se modifica.
- [x] Ejecutar `git diff --check`.

## Documentación y cierre

- [x] Actualizar `SPEC.md` si cambian contratos o reglas globales.
- [x] Actualizar `TASKS.md` si cambia el estado del roadmap.
- [x] Registrar aquí los comandos ejecutados y resultados.

### Resultados

- Base local `focusmind_test` creada con `CREATE DATABASE IF NOT EXISTS`, sin modificar otra base.
- `npm test`: 24/24 pruebas aprobadas; incluye integración HTTP de CRUD/ownership.
- `git diff --check`: aprobado.
