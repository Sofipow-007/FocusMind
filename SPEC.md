# FocusMind — Especificación técnica

> Etapa 1: base inicial del proyecto. Sin funcionalidades ni lógica de negocio implementadas.

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

- Usuario (id, nombre, email, contraseña hasheada, fecha de registro) - Tiene muchas Materias.

- Materia (id, usuario_id, nombre, favorita, día/horario fijo de estudio) - Tiene muchas Sesiones y Notas.

- Sesión de estudio (id, usuario_id, materia_id, fecha, duración, descripción, estado).

- Nota (id, usuario_id, materia_id, tipo [definición/consulta/apunte], contenido, origen [usuario/IA], estado [solo consultas: pendiente/respondida], fecha de creación).

**Restricciones**:


- Cada usuario solo puede ver y modificar sus propios datos.

- Las contraseñas deben almacenarse hasheadas, nunca en texto plano.

- No se contempla en esta versión recuperación de contraseña ni notificaciones push, sincronización de calendarios externos (Google Calendar, etc.).

- La aplicación debe funcionar correctamente en el navegador de escritorio.

- Las notas deben registrar su origen (usuario o IA) para permitir trazabilidad si se integra la generación automática de contenido.

- La aplicación debe poder levantarse completamente con Docker, sin requerir instalación local de Node o PostgreSQL.

- La información debe ser persistente en localStorage.

Este documento registra las decisiones técnicas tomadas en la etapa de scaffolding.



## 2. Stack tecnológico


| Capa          | Tecnología                  | Estado en etapa 1 |
| ------------- | --------------------------- | ----------------- |
| Backend       | Node.js + Express           | ✅ Scaffold creado |
| Frontend      | React + Vite + localStorage | ✅ Scaffold creado |
| Base de datos | MySQL + Sequelize.js        | ⏳ Deps instaladas |
| Autenticación | JWT + bcrypt                | ⏳ Deps instaladas |
| Contenedores  | Docker + Docker Compose     | ⏳ Etapa posterior |




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
│   │   ├── services/        # Clientes HTTP / API
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilidades
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── SPEC.md                  # Este documento
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

### 4.6 CORS habilitado globalmente

**Decisión:** Se aplica `cors()` sin restricciones en etapa 1.

**Motivo:** Permite que el frontend en desarrollo se comunique con el API. En producción se restringirá al origen del frontend (etapa posterior).

### 4.7 Dependencias instaladas pero no configuradas

Las siguientes librerías están en `backend/package.json` listas para la etapa 2, sin código de configuración aún:


| Paquete        | Uso previsto                         |
| -------------- | ------------------------------------ |
| `sequelize`    | ORM para MySQL                       |
| `mysql2`       | Driver de MySQL para Sequelize       |
| `jsonwebtoken` | Emisión y verificación de tokens JWT |
| `bcrypt`       | Hash de contraseñas                  |
| `dotenv`       | Variables de entorno                 |




### 4.8 Sin librerías adicionales en frontend

**Decisión:** Solo `react` y `react-dom` como dependencias de producción.

**Motivo:** No se agregó React Router, axios ni librerías de UI hasta definir las pantallas y flujos en etapas posteriores.

### 4.9 Docker — diferido a etapa 2

**Decisión:** No se incluyen `Dockerfile` ni `docker-compose.yml` en esta etapa.

**Motivo:** El usuario indicó que el objetivo de la etapa 1 es el scaffold de backend/frontend. Docker se documentará e implementará cuando exista configuración de DB y servicios que orquestar.

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




### Frontend (`frontend/.env.example`)


| Variable       | Descripción              | Valor por defecto       |
| -------------- | ------------------------ | ----------------------- |
| `VITE_API_URL` | URL base del API backend | `http://localhost:3001` |




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



## 7. Próximas etapas (fuera de alcance actual)

1. Configuración de Sequelize y conexión a MySQL
2. Modelos, migraciones y seeders
3. Autenticación JWT (registro, login, middleware) con contrato de API definido
4. Rutas y controladores de negocio
5. Pantallas y componentes de UI
6. Docker Compose (backend + frontend + MySQL)
7. Proxy de desarrollo en Vite hacia el API

### 7.1 Contrato mínimo de autenticación para Etapa 2

- Usuario mínimo:
  - `id`
  - `nombre`
  - `email`
  - `passwordHash`
  - `createdAt`
  - `updatedAt`

- Endpoints de autenticación:
  - `POST /api/auth/register` — registra un usuario nuevo.
  - `POST /api/auth/login` — inicia sesión y devuelve un token JWT.
  - `GET /api/auth/me` — devuelve datos del usuario autenticado (ruta protegida).

- Payloads de request mínimos:
  - Registro: `{ "nombre": string, "email": string, "password": string }`
  - Login: `{ "email": string, "password": string }`

- Respuesta de éxito mínima:
  - `{ "user": { "id": number, "nombre": string, "email": string }, "token": string }`

- Errores consistentes:
  - Validación de campos faltantes o inválidos → `400 Bad Request`
  - Email ya registrado → `409 Conflict`
  - Credenciales inválidas → `401 Unauthorized`
  - Token faltante o inválido → `401 Unauthorized`

- Convenciones de frontend:
  - Todas las llamadas HTTP deben vivir en `frontend/src/services/`.
  - La base URL del backend se toma de `VITE_API_URL`.
  - El token JWT no se debe hardcodear ni loguear en consola.
  - El flujo UI debe manejar explícitamente estados de carga, éxito y error.

- Validación mínima del flujo:
  - Registro de usuario nuevo.
  - Login con credenciales válidas.
  - Acceso a ruta protegida con token válido.
  - Rechazo de acceso sin token o con token inválido.



## 8. Requisitos del entorno

- **Node.js:** v18+ (probado con v24.16.0)
- **npm:** v9+ (probado con v11.13.0)
- **MySQL:** 8.x (requerido a partir de etapa 2)
