# Arquitectura de FocusMind

Este documento describe la arquitectura implementada y las decisiones técnicas registradas para FocusMind. [SPEC.md](./SPEC.md) es la fuente de verdad para requisitos y decisiones; este archivo explica cómo se organizan las capas y cómo se relacionan.

## 1. Estado y alcance

FocusMind es una aplicación web full-stack para organizar materias, sesiones de estudio, notas, exámenes y estadísticas. El repositorio está organizado como un monorepo simple: API y SPA son proyectos independientes dentro de `backend/` y `frontend/`, sin workspaces ni código compartido.

La Etapa 2 (persistencia MySQL y autenticación) figura como cerrada en `SPEC.md`. La Etapa 3 (funcionalidades principales) es el siguiente foco; la Etapa 4 (pulido final y contenerización completa) sigue pendiente. El alcance detallado y los criterios pendientes se mantienen en [TASKS.md](./TASKS.md).

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
├── AGENTS.md              # Convenciones para agentes y desarrollo
├── SPEC.md                # Fuente técnica de verdad del producto
├── TASKS.md               # Estado del roadmap y backlog
└── docker-compose.dev.yml # MySQL para desarrollo local
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

### Frontend

El frontend es una SPA de React 19 compilada y servida con Vite, usando módulos ES. `main.jsx` monta React y `App.jsx` compone la experiencia. Las pantallas están en `pages/`, los elementos reutilizables en `components/`, y la lógica de comunicación HTTP en `services/`. La navegación actual se resuelve en React sin una dependencia de router.

La API base se obtiene de `VITE_API_URL`. `api.js` centraliza la comunicación y los servicios por recurso evitan que las pantallas implementen llamadas HTTP directamente. `storage.js`, `useLocalStorage.js` y las utilidades relacionadas sirven al prototipo/almacenamiento no sensible; desde la Etapa 2 MySQL es la fuente oficial para los datos persistidos del producto.

Las pantallas presentes incluyen autenticación, dashboard, materias, sesiones, notas y calendario. La existencia de una pantalla no implica que todos sus flujos estén conectados a la API; el estado de implementación se lleva en [TASKS.md](./TASKS.md).

## 4. Persistencia y relaciones

MySQL 8 es la base de datos de la aplicación y Sequelize es el ORM. La configuración de conexión y entorno vive en `backend/src/config/`. Las entidades pertenecen a un usuario; las sesiones, notas y exámenes también se relacionan con una materia. Las claves de propietario deben validarse para que una entidad relacionada pertenezca al mismo usuario que realiza la operación.

Las relaciones y cascadas se definen en los modelos. El borrado de una materia elimina sus sesiones, notas y exámenes; el borrado de un usuario elimina los datos que le pertenecen, de acuerdo con la política de `SPEC.md`.

`docker-compose.dev.yml` levanta únicamente MySQL para desarrollo. No representa todavía el despliegue contenerizado de toda la aplicación. La configuración de desarrollo del contenedor no debe reutilizarse como configuración de producción.

## 5. Autenticación e integración frontend/API

La autenticación usa JWT emitido por el backend y entregado al navegador en una cookie `HttpOnly`; el cliente no debe leer, guardar ni registrar el token. CORS permite el origen configurado por `FRONTEND_URL` y habilita credenciales. Las solicitudes autenticadas del frontend deben incluir credenciales para que el navegador envíe la cookie.

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
| Docker Compose parcial | MySQL se puede levantar localmente; los contenedores de API e interfaz quedan para la Etapa 4. |

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

Las pruebas de integración que requieran MySQL necesitan la base de datos de desarrollo levantada y las variables de entorno configuradas. No se debe inferir que el build de la interfaz prueba el funcionamiento de los flujos conectados a la API.

## 8. Documentos relacionados

- [SPEC.md](./SPEC.md): requisitos, contratos y decisiones técnicas normativas.
- [TASKS.md](./TASKS.md): tareas completadas y pendientes.
- [AGENTS.md](./AGENTS.md): convenciones y flujo de trabajo del repositorio.
- [specs/README.md](./specs/README.md): flujo SDD y estructura de artefactos por cambio.
