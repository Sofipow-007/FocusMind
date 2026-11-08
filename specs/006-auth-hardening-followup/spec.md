# Seguimiento: Endurecimiento de autenticación

- **ID:** 006-auth-hardening-followup
- **Estado:** completada dentro del alcance aprobado
- **Etapa:** seguimiento de Etapa 2
- **Documentos relacionados:** [SPEC.md](../../SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [TASKS.md](../../TASKS.md)

## Contexto y objetivo

La Etapa 2 implementó Sequelize/MySQL, bcrypt, JWT en cookie HttpOnly, registro, login, `/me`, logout y aislamiento por usuario. El contrato mínimo acaba de verificarse con pruebas HTTP y navegador. Esa evidencia confirma el flujo funcional, pero no define por sí sola el nivel de endurecimiento necesario antes de considerar cerrado todo el seguimiento de autenticación.

El objetivo es acordar criterios concretos, implementar únicamente los controles aprobados y mantener un registro verificable de la etapa ya realizada y del trabajo restante.

## Evidencia observada

- `backend/src/config/env.js` usa `focusmind-dev-secret` como valor alternativo de `JWT_SECRET`; `.env.example` lo deja vacío, pero el código no exige que producción aporte un secreto.
- `backend/src/middleware/auth.js` acepta cookie y cabecera `Authorization: Bearer`, aunque el contrato de `SPEC.md` describe la cookie HttpOnly como mecanismo de sesión y el frontend no necesita Bearer.
- `JWT_EXPIRES_IN` no se valida explícitamente al iniciar; el cálculo de `maxAge` de cookie reconoce solo formatos numéricos en días, horas o minutos.
- La validación de contraseña solo exige texto no vacío; no hay una política de longitud acordada en `SPEC.md`.
- Registro y login no tienen límite de intentos en la aplicación.
- La detección previa de email duplicado produce `409`, pero una carrera entre registros puede llegar a la restricción única de DB y terminar como `500`.
- Logout elimina la cookie del navegador. La prueba confirmó que una solicitud posterior sin cookie recibe `401`; por ser un JWT stateless, un token copiado antes de logout continúa siendo válido hasta su expiración.
- El contrato base de cookie incluye `HttpOnly`, `SameSite`, `Secure` en producción, CORS con origen específico y credenciales; se agregó prueba de integración para registro, duplicado, login, `/me` y logout.

## Alcance aprobado

- Exigir en producción un `JWT_SECRET` de al menos 32 caracteres y validar `JWT_EXPIRES_IN` como duración positiva en minutos, horas o días.
- Aceptar solo cookie HttpOnly y validar `Origin` exacto en métodos mutantes autenticados.
- Aplicar a nuevas cuentas un mínimo de 12 caracteres y máximo de 72 bytes UTF-8; permitir login histórico con contraseñas más cortas.
- Mapear conflictos únicos concurrentes de email a `409`.
- Mantener logout como limpieza de cookie, documentando que no revoca JWT copiados.
- Diferir rate limiting hasta elegir almacenamiento compartido; no usar un límite en memoria de una sola instancia.

## Criterios de aceptación

- [x] **CA-1:** Producción no inicia con secreto JWT vacío, predeterminado o por debajo de 32 caracteres.
- [x] **CA-2:** `JWT_EXPIRES_IN` inválido falla temprano; formatos positivos `m`, `h`, `d` mantienen expiración JWT/cookie coherente.
- [x] **CA-3:** Rutas protegidas aceptan solo cookie; `Origin` ausente o distinto en mutaciones devuelve `403`.
- [x] **CA-4:** Registro concurrente del mismo email responde `409`.
- [x] **CA-5:** Política de contraseña acordada se aplica en alta; login permite credenciales históricas más cortas y limita a 72 bytes.
- [x] **CA-6:** Logout limpia la cookie; se documenta que el JWT copiado no se revoca server-side.
- [x] **CA-7:** Suites de integración y UI/build se ejecutan sin regresiones.
- [x] **CA-8:** Rate limiting queda explícitamente diferido hasta acordar almacenamiento compartido.

## Decisiones aprobadas el 2026-11-07

- Secreto requerido en producción (mínimo 32 caracteres) y duración JWT positiva validada.
- Cookie HttpOnly como único mecanismo; sin Bearer.
- Contraseña nueva: mínimo 12 caracteres, máximo 72 bytes UTF-8.
- Rate limiting diferido hasta acordar almacenamiento compartido.
- Logout elimina cookie; no implementar revocación server-side en este alcance.
- Validar `Origin` exacto en métodos mutantes autenticados; mantener CORS/SameSite.
- Mapear conflicto de email concurrente a `409`.

## Fuera de alcance

No se implementa rate limiting hasta acordar estrategia de almacenamiento compartido. No se añade revocación server-side ni se cambian dependencias o esquema.
