# Tareas: Despliegue local con Docker

- **ID:** 007-stage4-docker-compose
- **Especificación:** [spec.md](./spec.md)
- **Plan:** [plan.md](./plan.md)

## Implementación

- [x] Definir y aprobar el enfoque Nginx con proxy de mismo origen.
- [x] Crear imágenes del backend y frontend con contexto de build acotado.
- [x] Integrar MySQL, backend y frontend con healthchecks y volumen persistente.
- [x] Documentar variables, arranque y apagado en README.
- [x] Registrar la decisión de proxy y el alcance en SPEC, TASKS y arquitectura.

## Verificación

- [x] Validar la configuración renderizada de Compose.
- [x] Construir imágenes y levantar el stack integrado.
- [x] Comprobar healthchecks, SPA y endpoint `/api/health` a través del proxy.
- [x] Comprobar registro, `/me`, logout y el comportamiento de cookie en navegador.
- [x] Reiniciar MySQL y confirmar login con una cuenta creada antes del reinicio.
- [x] Comprobar que faltan secretos produce error explícito.
- [x] Ejecutar `git diff --check`.

## Documentación y cierre

- [x] Actualizar documentación global para reflejar el inicio parcial de Etapa 4.
- [x] Registrar aquí los resultados reales de verificación.

### Resultados

- `docker compose --env-file .env.docker.example config --quiet` — aprobado; Compose sin variables obligatorias falla con mensaje explícito.
- `docker compose build` — backend y frontend construidos correctamente.
- Stack aislado de validación — MySQL, backend y frontend pasaron healthchecks; SPA y `/api/health` respondieron `200` por Nginx.
- Navegador en `http://localhost:5174` — registro `201`, `/me` `200`, logout `200`, `/me` posterior `401`.
- Persistencia — login `200` con usuario creado antes de reiniciar MySQL.
- El stack y volumen temporales de validación se eliminaron; no se creó un `.env` local.
- `npm run build` en frontend — aprobado; `git diff --check` — aprobado.
