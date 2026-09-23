# FocusMind — Especificación técnica

> Estado actual: Etapa 2 avanzada. Backend con MySQL, modelos, autenticación JWT por cookie HttpOnly y CRUD inicial; frontend funcional y endurecimiento pendiente.

## 1. Descripción general

**FocusMind** es una aplicación web full-stack cuyo objetivo será gestionar el enfoque y la productividad personal.

**Objetivo:** Aplicación web que permite a estudiantes registrar y organizar sus sesiones de estudio por materia, visualizar su constancia, fijar una rutina semanal en un calendario, tomar notas y consultas asociadas a cada materia, y recibir recordatorios de exámenes próximos.

**Usuario:** Estudiantes secundarios o universitarios que cursan varias materias simultáneamente y necesitan una herramienta simple para organizar su tiempo de estudio y centralizar sus apuntes.

**Funcionalidades**:

- Registro e inicio de sesión de usuario (email y contraseña).

- Crear, editar y eliminar materias.

- Registrar sesiones de estudio (materia, fecha, duración, tema).

- Marcar exámenes próximos con fecha y recibir recordatorios.

- Ver racha de días consecutivos estudiando.

- Ver estadísticas de tiempo estudiado por materia/semana/mes.

- Marcar materias como favoritas o prioritarias.

- Fijar materias en un calendario semanal (día y horario recurrente de estudio).

- Crear, editar y eliminar notas por materia (definiciones, consultas, apuntes).

- Filtrar notas por tipo o por materia.




**Modelo de datos**:

- **Usuario**: `id`, `nombre`, `email`, `passwordHash`, `createdAt`, `updatedAt`. Tiene muchas Materias, Sesiones, Notas y Exámenes.

- **Materia**: `id`, `usuarioId`, `nombre`, `favorita`, `prioritaria`, `diaEstudio`, `horaInicio`, `horaFin`, `createdAt`, `updatedAt`. Tiene muchas Sesiones y Notas. El horario es opcional y representa un único bloque semanal recurrente y determinado.

- **Sesión de estudio**: `id`, `usuarioId`, `materiaId`, `fecha`, `duracion`, `descripcion`, `estado`, `createdAt`, `updatedAt`. Los estados permitidos serán `planificada`, `completada` o `cancelada`.

- **Nota**: `id`, `usuarioId`, `materiaId`, `tipo`, `contenido`, `origen`, `estado`, `createdAt`, `updatedAt`. `tipo` admite `definicion`, `consulta` o `apunte`; `origen` admite `usuario` o `IA`; `estado` admite `pendiente` o `respondida` y solo aplica a notas de tipo `consulta`.

- **Examen**: `id`, `usuarioId`, `materiaId`, `titulo`, `fecha`, `descripcion`, `createdAt`, `updatedAt`. Permite registrar exámenes y mostrar recordatorios dentro de la aplicación; no implica notificaciones push.

Todas las entidades usan identificadores numéricos y referencias a su propietario. Las relaciones `materiaId` deben pertenecer al mismo `usuarioId` de la entidad que las utiliza.


**Restricciones**:


- Cada usuario solo puede ver y modificar sus propios datos (aislamiento por usuario_id).

- Las contraseñas deben almacenarse hasheadas, nunca en texto plano.

- No se contempla en esta versión recuperación de contraseña ni notificaciones push, sincronización de calendarios externos (Google Calendar, etc.).

- La aplicación debe funcionar correctamente en el navegador de escritorio.

- Las notas deben registrar su origen (usuario o IA) para permitir trazabilidad si se integra la generación automática de contenido.

- La aplicación debe poder levantarse completamente con Docker, sin requerir instalación local de Node o MySQL, cuando se implemente la contenerización.

- Durante la Etapa 1, cualquier prototipo de persistencia del frontend podrá usar `localStorage`.

- Desde la Etapa 2, MySQL será la fuente oficial de persistencia para los datos de la aplicación. No se mantendrán dos fuentes de verdad para los mismos datos.

- La eliminación de una Materia eliminará sus Sesiones, Notas y Exámenes asociados (sin cascada inversa) mediante una política de cascada definida en la capa de datos. La eliminación de un Usuario aplica cascada total: se eliminan todas sus Materias, Sesiones, Notas y Exámenes asociados. No se conserva histórico de estos datos tras la eliminación del Usuario.

Este documento registra las decisiones técnicas tomadas en la etapa de scaffolding.



## 2. Stack tecnológico


| Capa          | Tecnología                  | Estado actual |
| ------------- | --------------------------- | ----------------- |
| Backend       | Node.js + Express           | ✅ API y CRUD inicial |
| Frontend      | React + Vite                | ⚠️ Solo health check |
| Base de datos | MySQL + Sequelize.js        | ✅ Conexion y modelos iniciales |
| Autenticación | JWT + bcrypt                | ⚠️ Cookie HttpOnly implementada; pruebas y endurecimiento pendientes |
| Contenedores  | Docker + Docker Compose     | ⚠️ MySQL en Compose; app pendiente |




## 3. Estructura del repositorio

```
FocusMind/
├── backend/                 # API REST (Node.js + Express)
│   ├── src/
│   │   ├── config/          # Configuración (DB, JWT, etc.)
│   │   ├── controllers/     # Controladores HTTP
│   │   ├── middleware/      # Middleware (auth, validación, etc.)
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Definición de rutas
│   │   ├── utils/           # Utilidades compartidas
│   │   ├── app.js           # Instancia de Express
│   │   └── server.js        # Punto de entrada
│   ├── .env.example
│   └── package.json
├── frontend/                # SPA (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Vistas/páginas
│   │   ├── services/        # Clientes HTTP / persistencia de prototipo
│   │   │   ├── api.js
│   │   │   └── storage.js
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useLocalStorage.js
│   │   ├── utils/           # Utilidades
│   │   │   ├── storageKeys.js
│   │   │   └── storageSchema.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── scripts/
│   │   └── storage.test.js
│   ├── .env.example
│   └── package.json
├── SPEC.md                  # Este documento
├── AGENTS.md
└── README.md
```



## 4. Decisiones técnicas



### 4.1 Monorepo simple (sin herramienta de workspaces)

**Decisión:** Backend y frontend viven en carpetas separadas en la raíz, sin Lerna/Turborepo/npm workspaces.

**Motivo:** En etapa 1 no hay dependencias compartidas entre capas. Mantiene la configuración mínima y facilita la contenerización independiente en Docker (etapa posterior).

### 4.2 Backend: CommonJS

**Decisión:** El backend usa `require`/`module.exports` (sin `"type": "module"`).

**Motivo:** Mayor compatibilidad con el ecosistema de Sequelize y ejemplos de Express. El frontend usa ESM vía Vite; la separación por proyecto evita conflictos.

### 4.3 Frontend: Vite + React

**Decisión:** Se eligió Vite en lugar de Create React App.

**Motivo:** CRA está deprecado. Vite ofrece arranque más rápido, HMR eficiente y es el estándar actual para proyectos React nuevos.

### 4.4 Express 5

**Decisión:** Se usa Express 5.x (última versión estable al momento del scaffold).

**Motivo:** Soporte nativo de promesas en middleware y mejoras de rendimiento. La API básica (`app.use`, `app.listen`) es compatible con Express 4.

### 4.5 Puerto del backend: 3001

**Decisión:** El API escucha en el puerto `3001` por defecto.

**Motivo:** Evita conflicto con Vite (puerto `5173` por defecto) y con otros servicios locales comunes en `3000`.

### 4.6 CORS

**Estado actual:** Se usa el origen de `FRONTEND_URL` y `credentials: true` para soportar cookies HttpOnly. En producción debe configurarse explícitamente `FRONTEND_URL`.

**Motivo:** Permite que el frontend en desarrollo se comunique con el API. En producción se restringirá al origen del frontend (etapa posterior).

### 4.7 Dependencias configuradas

Las siguientes librerías se utilizan actualmente en el backend:


| Paquete        | Uso previsto                         |
| -------------- | ------------------------------------ |
| `sequelize`    | ORM y sincronización inicial con MySQL |
| `mysql2`       | Driver de MySQL para Sequelize       |
| `jsonwebtoken` | Emisión y verificación de tokens JWT Bearer |
| `bcrypt`       | Hash y verificación de contraseñas   |
| `dotenv`       | Variables de entorno                 |




### 4.8 Sin librerías adicionales en frontend

**Decisión:** Solo `react` y `react-dom` como dependencias de producción.

**Motivo:** No se agregó React Router, axios ni librerías de UI hasta definir las pantallas y flujos en etapas posteriores.

### 4.9 Persistencia local de prototipo

**Decisión:** El frontend podrá utilizar `localStorage` únicamente como soporte temporal para prototipos y datos de demostración (datos no sensibles).

**Alcance:** La persistencia local podrá almacenar preferencias de interfaz y datos no sensibles necesarios para probar flujos del frontend antes de disponer de la API completa.

**Límites:** No se almacenarán contraseñas, hashes de contraseñas, tokens JWT ni otros secretos en `localStorage`. La autenticación real será responsabilidad conjunta del backend y frontend, con validación de credenciales en el backend.

**Migración:** Desde la Etapa 2, MySQL será la fuente oficial de datos. El acceso a la persistencia local deberá realizarse mediante una capa de servicios para facilitar su reemplazo por servicios HTTP, sin acoplar `localStorage` a los componentes de interfaz.

### 4.10 Docker — desarrollo parcial

**Estado actual:** `docker-compose.dev.yml` levanta MySQL para desarrollo. Aún no existen Dockerfiles ni servicios containerizados para backend y frontend.

**Pendiente:** completar la orquestación de toda la aplicación en la Etapa 4.

### 4.11 Contrato de datos
- `camelCase` en JS y en nombres equivalentes en la base de datos.
- Fechas: Usar formato **ISO 8601** (`2026-08-27T14:00:00Z`) para todo lo que viaje por la API.
- `duracion`: Unidad en **minutos**.
- IDs numéricos autoincrementales.
- Campos obligatorios/longitudes: Definirlo por entidad en la Etapa 2 de Base de datos y autenticación.
- Valores por defecto: `favorita: false`, `prioritaria: false`, estado de sesión por defecto `planificada`.

## 5. Variables de entorno


### Backend (`backend/.env.example`)


| Variable         | Descripción                | Valor por defecto |
| ---------------- | -------------------------- | ----------------- |
| `PORT`           | Puerto del servidor        | `3001`            |
| `NODE_ENV`       | Entorno de ejecución       | `development`     |
| `DB_HOST`        | Host de MySQL              | `localhost`       |
| `DB_PORT`        | Puerto de MySQL            | `3306`            |
| `DB_NAME`        | Nombre de la base de datos | `focusmind`       |
| `DB_USER`        | Usuario de MySQL           | `focusmind`       |
| `DB_PASSWORD`    | Contraseña de MySQL        | —                 |
| `JWT_SECRET`     | Secreto para firmar tokens | —                 |
| `JWT_EXPIRES_IN` | Expiración del token       | `7d`              |
| `FRONTEND_URL`   | Origen permitido por CORS  | `http://localhost:5173` |




### Frontend (`frontend/.env.example`)


| Variable       | Descripción              | Valor por defecto       |
| -------------- | ------------------------ | ----------------------- |
| `VITE_API_URL` | URL base del API backend | `http://localhost:3001` |

**Fallback:** Si `VITE_API_URL` no está definida en el entorno, `frontend/src/services/api.js` usa `http://localhost:3001` como valor por defecto en tiempo de ejecución. Este comportamiento ya está implementado en el scaffold actual.




## 6. Scripts disponibles



### Backend

```bash
cd backend
npm run dev      # Desarrollo con nodemon
npm start        # Producción
```



### Frontend

```bash
cd frontend
npm run dev      # Servidor de desarrollo Vite
npm run build    # Build de producción
npm run preview  # Preview del build
```

### Tests

```bash
cd backend
npm test

cd ../frontend
npm run test:storage
npm run lint
```



## 7. Estado y próximas etapas

### Etapa 1 — Scaffold y verificación (completada)

1. Completar la estructura base del backend y frontend.
2. Verificar el arranque de ambos proyectos.
3. Verificar el endpoint `GET /api/health`.
4. Mantener esta etapa sin base de datos, autenticación ni lógica de negocio.

### Etapa 2 — Base de datos y autenticación (en progreso)

1. ✅ Configurar Sequelize y la conexión a MySQL.
2. ⚠️ Crear modelos y relaciones; faltan migraciones y seeders formales.
3. ⚠️ Implementar JWT con cookie HttpOnly, registro, login, `me`, logout y middleware; faltan pruebas completas y endurecimiento del secreto.
4. ⚠️ Validar propiedad mediante `usuarioId`; validaciones de entrada iniciales implementadas, faltan pruebas de aislamiento y cascadas.
5. ⏳ Probar formalmente el contrato de API de autenticación descrito en la sección 7.1.

### Etapa 3 — Funcionalidades principales (backend parcial)

1. ✅ Implementar CRUD de Materias.
2. ✅ Implementar registro y consulta de Sesiones.
3. ⚠️ Implementar Exámenes; falta la interfaz de recordatorios.
4. ✅ Implementar Notas y filtros básicos.
5. ⚠️ Favoritos y prioridades tienen campos; faltan calendario, racha y estadísticas por semana/mes.
6. ⏳ Crear las pantallas y componentes de estos flujos.

### Etapa 4 — Interfaz final y despliegue local (pendiente)

1. Pulir la interfaz para escritorio y sus estados de carga, error y vacío.
2. Incorporar Dockerfiles y Docker Compose para frontend, backend y MySQL.
3. Configurar el proxy de desarrollo de Vite hacia el API si resulta necesario.
4. Validar el levantamiento completo del sistema mediante Docker.

### 7.1 Contrato mínimo de autenticación para Etapa 2

**Modelo de autenticación:** JWT emitido por el backend y enviado al cliente mediante una cookie HttpOnly. El frontend nunca lee ni escribe el token directamente; el navegador lo adjunta automáticamente en cada request al backend.

- Usuario mínimo:
  - `id`
  - `nombre`
  - `email`
  - `passwordHash`
  - `createdAt`
  - `updatedAt`

- Endpoints de autenticación:
  - `POST /api/auth/register` — registra un usuario nuevo y setea la cookie de sesión.
  - `POST /api/auth/login` — valida credenciales y setea la cookie de sesión.
  - `GET /api/auth/me` — devuelve datos del usuario autenticado validando la cookie (ruta protegida).
  - `POST /api/auth/logout` — invalida la cookie de sesión en el backend.

- Payloads de request mínimos:
  - Registro: `{ "nombre": string, "email": string, "password": string }`
  - Login: `{ "email": string, "password": string }`
  - Logout: sin body.

- Respuesta de éxito mínima (register/login/me):
  - `{ "user": { "id": number, "nombre": string, "email": string } }`
  - El token no se incluye en el body de la respuesta; viaja únicamente en la cookie `HttpOnly`.

- Configuración de la cookie:
  - `HttpOnly: true` (JS no puede leerla).
  - `SameSite: Strict` o `Lax` según necesidad de navegación cruzada.
  - `Secure: true` en producción (solo se envía sobre HTTPS).
  - Expiración alineada con `JWT_EXPIRES_IN`.

- Errores consistentes:
  - Validación de campos faltantes o inválidos → `400 Bad Request`
  - Email ya registrado → `409 Conflict`
  - Credenciales inválidas → `401 Unauthorized`
  - Cookie faltante o token inválido/expirado → `401 Unauthorized`
  - Error interno no controlado → `500 Internal Server Error`, respetando el mismo formato de respuesta de error que el resto de los códigos (nunca se expone el stack trace ni detalles internos en el body; el detalle completo queda solo en el log del servidor).

- Convenciones de frontend:
  - Todas las llamadas HTTP deben vivir en `frontend/src/services/`.
  - La base URL del backend se toma de `VITE_API_URL`.
  - Todo fetch al backend debe incluir `credentials: 'include'` para que la cookie viaje correctamente.
  - El token JWT nunca se lee, escribe ni loguea desde el frontend.
  - El flujo UI debe manejar explícitamente estados de carga, éxito y error.
  - Datos no sensibles del usuario (`nombre`, `email`) pueden guardarse en `localStorage` o estado de React para uso de UI, según lo definido en la sección 4.9.

- Convenciones de backend:
  - CORS debe configurarse con origen específico del frontend (no wildcard) y `credentials: true`, ya que las cookies cross-origin lo requieren.

- Validación mínima del flujo:
  - Registro de usuario nuevo → cookie seteada correctamente.
  - Login con credenciales válidas → cookie seteada correctamente.
  - Acceso a `/api/auth/me` con cookie válida → devuelve datos del usuario.
  - Acceso a ruta protegida sin cookie o con cookie inválida/expirada → `401`
  - Logout → cookie invalidada, siguiente acceso a `/api/auth/me` devuelve `401`.



## 8. Requisitos del entorno

- **Node.js:** v18+ (probado con v24.16.0)
- **npm:** v9+ (probado con v11.13.0)
- **MySQL:** 8.x (requerido a partir de etapa 2)