# Arquitectura de FocusMind

Este documento describe la arquitectura implementada y las decisiones técnicas registradas para FocusMind. [SPEC.md](./SPEC.md) es la fuente de verdad para requisitos y decisiones; este archivo explica cómo se organizan las capas y cómo se relacionan.

## 1. Estado y alcance

FocusMind es una aplicación web full-stack para organizar materias, sesiones de estudio, notas, exámenes y estadísticas. El repositorio está organizado como un monorepo simple: API y SPA son proyectos independientes dentro de `backend/` y `frontend/`, sin workspaces ni código compartido.

La Etapa 2 (persistencia MySQL y autenticación) está completada con el endurecimiento aprobado; el rate limiting queda diferido hasta definir almacenamiento compartido. La Etapa 3 está implementada y verificada: CRUD, validaciones, aislamiento, estadísticas, recordatorios, calendario y flujos frontend/API. Se autorizó iniciar la contenerización de Etapa 4; el pulido visual sigue pendiente. El alcance y estado detallados se mantienen en [TASKS.md](./TASKS.md) y [specs/007-stage4-docker-compose/](./specs/007-stage4-docker-compose/).

## 2. Mapa del repositorio

```text
FocusMind/
├── backend/
│   ├── src/
│   │   ├── config/        # Entorno y conexión Sequelize/MySQL
│   │   ├── controllers/   # Coordinación de solicitudes y respuestas HTTP
│   │   ├── middleware/    # Autenticación y middleware compartido
│   │   ├── migrations/    # Cambios versionados del esquema
│   │   ├── models/        # Entidades Sequelize y relaciones
│   │   ├── routes/        # Endpoints y composición del router
│   │   ├── seeders/       # Datos de desarrollo
│   │   ├── services/      # Operaciones de dominio y persistencia
│   │   ├── utils/         # Utilidades y lógica reutilizable
│   │   ├── validators/    # Validación de entradas por recurso
│   │   ├── app.js         # Configuración de Express y middleware
│   │   └── server.js      # Arranque del servidor
│   ├── .sequelizerc
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/        # Recursos estáticos
│   │   ├── components/    # Componentes de presentación reutilizables
│   │   ├── hooks/         # Hooks de interfaz y persistencia temporal
│   │   ├── pages/         # Pantallas de la aplicación
│   │   ├── services/      # Cliente API y servicios por recurso
│   │   ├── utils/         # Formato, fechas y almacenamiento
│   │   ├── App.jsx        # Composición y selección de vistas
│   │   └── main.jsx       # Punto de entrada React
│   ├── scripts/           # Pruebas auxiliares de almacenamiento
│   └── package.json
├── specs/                 # Artefactos SDD por cambio o funcionalidad
├── docker-compose.yml     # Frontend, API y MySQL para stack integrado
├── .env.docker.example    # Variables plantilla para Docker Compose
├── AGENTS.md              # Convenciones para agentes y desarrollo
├── SPEC.md                # Fuente técnica de verdad del producto
├── TASKS.md               # Estado del roadmap y backlog
└── docker-compose.dev.yml # MySQL exclusivo para desarrollo local
```

Los archivos de dependencias, compilación y entorno local no forman parte del mapa funcional. Los `.env` locales no deben versionarse; las plantillas públicas son `.env.example`.

## 3. Capas y flujo de solicitudes

### Backend

El backend usa Node.js, Express 5 y CommonJS. `server.js` inicia el servidor; `app.js` compone Express, CORS con credenciales, parseo JSON/cookies y el router bajo `/api`. Las rutas se agrupan por recurso: autenticación, materias, sesiones, notas, exámenes y estadísticas.

El flujo previsto es:

```text
HTTP → routes → middleware/validators → controllers → services → models → MySQL
```

- **Routes** declaran endpoints y conectan middleware con controladores.
- **Middleware** gestiona preocupaciones transversales, incluida la identidad autenticada.
- **Validators** validan los datos de entrada antes de las operaciones de dominio.
- **Controllers** traducen solicitudes y resultados a respuestas HTTP; la lógica de negocio no debe acumularse en `app.js` ni `server.js`.
- **Services** coordinan operaciones de dominio y acceso a datos.
- **Models** representan Usuario, Materia, Sesión de estudio, Nota y Examen, con Sequelize.
- **Migrations** y **seeders** versionan el esquema y los datos de desarrollo.

La API expone `GET /api/health`. Los recursos de dominio se montan en `/api/auth`, `/api/subjects`, `/api/study-sessions`, `/api/notes`, `/api/exams` y `/api/stats`.

`GET /api/stats/study-time` conserva los agregados históricos, y devuelve agregaciones UTC del lunes-domingo actual y del mes calendario actual, con agrupación por materia y racha de sesiones completadas. El contrato completo está en la sección 7.2 de `SPEC.md`.

### Frontend

El frontend es una SPA de React 19 compilada y servida con Vite, usando módulos ES. `main.jsx` monta React y `App.jsx` compone la experiencia. Las pantallas están en `pages/`, los elementos reutilizables en `components/`, y la lógica de comunicación HTTP en `services/`. La navegación actual se resuelve en React sin una dependencia de router.

La API base se obtiene de `VITE_API_URL`. `api.js` centraliza la comunicación y los servicios por recurso evitan que las pantallas implementen llamadas HTTP directamente. `storage.js`, `useLocalStorage.js` y las utilidades relacionadas sirven al prototipo/almacenamiento no sensible; desde la Etapa 2 MySQL es la fuente oficial para los datos persistidos del producto.

Las pantallas presentes incluyen autenticación, dashboard, materias, sesiones, notas y calendario. El dashboard presenta estadísticas y exámenes futuros; el calendario combina las rutinas recurrentes de materias, sesiones `planificada` de la semana actual y exámenes no vencidos de esa semana. Su grilla semanal usa fechas de la zona local del navegador, mientras que la gestión conserva todos los exámenes. Los servicios HTTP existentes cargan las entidades sin llamadas directas desde componentes. La recuperación de sesión distingue `401` de fallos de red y permite reintentar; las mutaciones muestran confirmación/error y no descartan la sesión local cuando falla logout. La etapa 3 está funcionalmente verificada; el seguimiento de endurecimiento JWT de Etapa 2 está documentado en [TASKS.md](./TASKS.md) y `specs/006-auth-hardening-followup/`.

## 4. Persistencia y relaciones

MySQL 8 es la base de datos de la aplicación y Sequelize es el ORM. La configuración de conexión y entorno vive en `backend/src/config/`. Las entidades pertenecen a un usuario; las sesiones, notas y exámenes también se relacionan con una materia. Las claves de propietario deben validarse para que una entidad relacionada pertenezca al mismo usuario que realiza la operación.

Las relaciones y cascadas se definen en los modelos. El borrado de una materia elimina sus sesiones, notas y exámenes; el borrado de un usuario elimina los datos que le pertenecen, de acuerdo con la política de `SPEC.md`.

`docker-compose.dev.yml` levanta únicamente MySQL para desarrollo y conserva su volumen. `docker-compose.yml` inicia la aplicación completa con un volumen independiente para MySQL, una API no publicada al host y una SPA servida por Nginx. Nginx reenvía `/api` al backend y mantiene frontend/API bajo el mismo origen. En desarrollo con Vite no se añade proxy: se conserva `VITE_API_URL` y CORS. El stack integrado es una configuración local; no sustituye un despliegue productivo administrado.

## 5. Autenticación e integración frontend/API

La autenticación usa JWT emitido por el backend y entregado al navegador en una cookie `HttpOnly`; el cliente no debe leer, guardar ni registrar el token. El middleware protegido acepta solo esa cookie y valida `Origin` para solicitudes mutantes. CORS permite el origen configurado por `FRONTEND_URL` y habilita credenciales. En producción `JWT_SECRET` debe configurarse con al menos 32 caracteres y `JWT_EXPIRES_IN` usa duraciones positivas en minutos, horas o días.

Los secretos y credenciales se configuran mediante variables de entorno documentadas en los `.env.example`. No se deben incluir valores secretos en el código ni en el frontend. Para las reglas completas del contrato de autenticación (respuestas, errores y cookie), consultar `SPEC.md`.

## 6. Decisiones de estructura y tecnología

Las decisiones y su justificación se mantienen en `SPEC.md`; esta lista resume su impacto arquitectónico:

| Decisión | Consecuencia |
|---|---|
| Monorepo simple, sin workspaces | Backend y frontend tienen dependencias y scripts separados. |
| Backend CommonJS y frontend ESM | Cada proyecto usa el formato nativo de su configuración, sin mezclar módulos entre capas. |
| React + Vite | La interfaz se desarrolla como SPA con servidor de desarrollo y build independientes. |
| Express 5 | La API sigue una composición convencional de middleware y routers. |
| Puerto API predeterminado `3001` | Evita el puerto predeterminado de Vite (`5173`). |
| MySQL + Sequelize | MySQL es la persistencia oficial desde la Etapa 2; Sequelize modela entidades y relaciones. |
| JWT en cookie `HttpOnly` | El token no está disponible para JavaScript del navegador. |
| Servicios HTTP por recurso en el frontend | Las vistas no acoplan presentación y transporte. |
| CSS Modules y variables CSS | Los estilos se mantienen locales a componentes, sin framework de UI/CSS adicional. |
| Docker Compose separado | `docker-compose.dev.yml` conserva MySQL para desarrollo; `docker-compose.yml` integra frontend Nginx, API y MySQL con almacenamiento persistente. |

Una decisión que cambie contratos, dependencias, límites de capa o despliegue debe revisarse contra `SPEC.md` y registrarse allí una vez aprobada.

## 7. Validación y comandos

Los scripts vigentes se definen en cada `package.json`:

```bash
cd backend
npm test

cd ../frontend
npm run build
npm run lint
npm run test:storage
```

`npm test` en el backend prepara y usa exclusivamente la base local `focusmind_test`; el runner fija `NODE_ENV=test`, crea esa base si no existe y nunca la reemplaza por `focusmind`. Las pruebas limpian sus fixtures y no usan `sequelize.sync({ force: true })`. El usuario configurado en `.env` debe poder crear la base de pruebas. No se debe inferir que el build de la interfaz prueba el funcionamiento de los flujos conectados a la API.

## 8. Documentos relacionados

- [SPEC.md](./SPEC.md): requisitos, contratos y decisiones técnicas normativas.
- [TASKS.md](./TASKS.md): tareas completadas y pendientes.
- [AGENTS.md](./AGENTS.md): convenciones y flujo de trabajo del repositorio.
- [specs/README.md](./specs/README.md): flujo SDD y estructura de artefactos por cambio.
