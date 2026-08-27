# FocusMind API — Backend

API REST desarrollada con Node.js + Express para la aplicación FocusMind.

## Requisitos previos

- Node.js v18+
- npm v9+
- MySQL 8.x (requerido en Etapa 2)

## Instalación

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Configura el archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. En desarrollo, las variables de entorno ya vienen preconfiguradas en `.env`.

## Desarrollo

Levanta el servidor en modo desarrollo con auto-reload:

```bash
npm run dev
```

El API estará disponible en `http://localhost:3001`.

## Producción

Levanta el servidor en modo producción:

```bash
npm start
```

## Estructura del proyecto

```
src/
├── config/          # Configuración global (BD, JWT, etc.)
├── controllers/     # Lógica de negocio (HTTP)
├── middleware/      # Middleware personalizado (auth, validación, etc.)
├── models/          # Modelos de Sequelize
├── routes/          # Definición de rutas
├── utils/           # Utilidades compartidas
├── app.js           # Instancia de Express
└── server.js        # Punto de entrada
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_NAME` | Nombre BD | `focusmind` |
| `DB_USER` | Usuario BD | `focusmind` |
| `DB_PASSWORD` | Contraseña BD | — |
| `JWT_SECRET` | Secreto para JWT | — |
| `JWT_EXPIRES_IN` | Expiración JWT | `7d` |

## Siguientes pasos

- Etapa 2: Configurar Sequelize, modelos y autenticación (JWT + bcrypt)
- Etapa 3: Implementar funcionalidades de negocio
- Etapa 4: Dockerizar la aplicación
