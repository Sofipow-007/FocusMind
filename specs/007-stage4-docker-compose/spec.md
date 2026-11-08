# Especificación: Despliegue local con Docker

- **ID:** 007-stage4-docker-compose
- **Estado:** completada
- **Etapa:** Etapa 4
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Problema y objetivo

### Necesidad

Hoy la API y la interfaz requieren arranque separado, y el Compose existente solo levanta MySQL. Se necesita un entorno local reproducible para iniciar la aplicación completa.

### Resultado esperado

Una persona desarrolladora puede levantar FocusMind con Docker Compose, acceder desde el navegador y conservar la base local entre reinicios.

## Alcance

### Incluye

- Contenerizar el backend y compilar/servir el frontend.
- Integrar frontend, backend y MySQL en Docker Compose.
- Usar Nginx para servir el build de la SPA y reenviar `/api` al backend en el mismo origen.
- Persistir los datos de MySQL y configurar secretos mediante el `.env` local ignorado por Git.
- Documentar el arranque, la verificación y el apagado.

### No incluye

- Pulido visual de la interfaz.
- Despliegue en nube, HTTPS público, orquestación multi-instancia o entorno productivo administrado.
- Cambiar la estrategia existente de inicialización del esquema de Sequelize.
- Reemplazar el Compose de desarrollo exclusivo de MySQL.

## Requisitos

- **R-1:** El Compose inicia MySQL, API y frontend, esperando la disponibilidad de sus dependencias.
- **R-2:** El navegador usa el frontend en un solo origen; las solicitudes `/api` llegan a la API mediante proxy.
- **R-3:** Las credenciales y `JWT_SECRET` se configuran localmente y no se versionan.
- **R-4:** Los datos de MySQL sobreviven a la recreación de contenedores mientras no se elimine el volumen.
- **R-5:** El backend no requiere publicar su puerto al host para que la aplicación funcione.

## Criterios de aceptación

- [x] **CA-1**: `docker compose up --build` construye e inicia los tres servicios y sus healthchecks pasan.
- [x] **CA-2**: `http://localhost:<FRONTEND_PORT>` sirve la SPA y `GET /api/health` responde correctamente a través del proxy.
- [x] **CA-3**: Las credenciales requeridas faltantes impiden iniciar Compose con un error claro; los secretos no se incluyen en imágenes ni archivos versionados.
- [x] **CA-4**: La API puede conectarse a MySQL con las credenciales de aplicación y la persistencia está asociada a un volumen nombrado.
- [x] **CA-5**: La documentación explica inicio, verificación, apagado y persistencia de datos.

## Reglas y restricciones

- `SPEC.md` es la fuente normativa de configuración, autenticación y seguridad.
- El modo `production` exige un `JWT_SECRET` de al menos 32 caracteres.
- El frontend no lee ni expone el JWT; la cookie HttpOnly se usa a través del mismo origen.
- Los servicios de aplicación se comunican por la red privada de Compose.

## Consideraciones de arquitectura

- **Capa(s) afectada(s):** despliegue y documentación.
- **Flujo esperado:** navegador → Nginx (SPA y proxy `/api`) → backend Express → MySQL.
- **Decisiones existentes:** Node/Express, React/Vite, MySQL/Sequelize y el contrato de autenticación de `SPEC.md`.

## Casos límite y errores

- La falta de `DB_PASSWORD`, `MYSQL_ROOT_PASSWORD` o `JWT_SECRET` debe producir un error de configuración explícito.
- La interfaz no debe declararse lista antes de que backend y MySQL estén saludables.
- La recreación de los contenedores no debe eliminar el volumen de datos.

## Preguntas abiertas

Ninguna. El enfoque Nginx + proxy `/api` fue aprobado antes de implementar.
