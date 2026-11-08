# Plan: Despliegue local con Docker

- **ID:** 007-stage4-docker-compose
- **Especificación:** [spec.md](./spec.md)
- **Estado:** completado

## Alineación con el roadmap (`SPEC.md`, sección 7)

- **Etapa afectada:** Etapa 4.
- **Estado de la etapa:** iniciada en el alcance autorizado de contenedores; el pulido visual queda pendiente.
- **Tareas relacionadas:** Dockerfiles, Compose, decisión sobre proxy y validación integrada en [TASKS.md](../../TASKS.md).

## Capas y archivos afectados

| Capa | Archivos o módulos | Cambio |
|---|---|---|
| Backend | `backend/Dockerfile`, `backend/.dockerignore` | Imagen Node con dependencias de producción y usuario no root. |
| Frontend | `frontend/Dockerfile`, `frontend/.dockerignore`, `frontend/nginx.conf` | Build Vite, serving estático y proxy `/api`. |
| Despliegue | `docker-compose.yml`, `.env.docker.example` | Orquestación de MySQL, API, SPA, healthchecks y volumen persistente. |
| Documentación | `README.md`, `SPEC.md`, `TASKS.md`, `ARCHITECTURE.md` | Comandos, decisión de proxy y estado de Etapa 4. |

## Diseño

Compose levanta MySQL en red privada, la API solo expuesta dentro de esa red y Nginx en el puerto configurable del host (5173 por defecto). Vite compila el cliente con una URL de API relativa; Nginx reenvía `/api` al servicio `backend`. El volumen de esta composición tiene nombre propio para no compartir datos accidentalmente con `docker-compose.dev.yml`.

## Decisiones técnicas

- Se aprobó servir el build de producción de Vite con Nginx y usar un proxy de mismo origen para `/api`.
- No se añade proxy al servidor de desarrollo Vite: el flujo local existente usa `VITE_API_URL` y CORS; el proxy se requiere para el stack integrado.
- Compose requiere secretos locales para MySQL y JWT mediante un `.env` no versionado.
- MySQL debe estar saludable antes de iniciar el backend; Nginx espera a que la API esté saludable.
- Se conserva la inicialización de base de datos que ya realiza la aplicación; no se introduce una estrategia de migración distinta como parte del despliegue.

## Seguridad, privacidad y compatibilidad

- No copiar `.env` a las imágenes.
- Exigir el secreto JWT de producción mediante Compose.
- Ejecutar Node como usuario no root y no publicar el puerto de API al host.
- No modificar dependencias de la aplicación ni el contrato HTTP.

## Estrategia de verificación

- `docker compose --env-file .env.docker.example config --quiet`.
- `docker compose build`.
- Arranque integrado y healthchecks; verificar la SPA, autenticación y `GET /api/health` a través de Nginx.
- Reiniciar MySQL y confirmar que las credenciales creadas previamente siguen válidas.
- `git diff --check`.

## Riesgos y mitigaciones

- **Riesgo:** confundir el volumen de desarrollo con los datos del stack integrado. **Mitigación:** usar un volumen nombrado separado.
- **Riesgo:** cookies rechazadas si se usa una URL distinta del origen configurado. **Mitigación:** documentar `http://localhost:<FRONTEND_PORT>` como origen del navegador y derivar `FRONTEND_URL` del mismo puerto.
