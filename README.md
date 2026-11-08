# FocusMind

Aplicación que permitir que los estudiantes de secundaria/universidad organicen sus sesiones de estudio por materia, visualizar su constancia, recibir recordatorios de exámenes próximos, tomar cualquier tipo de nota para cada materia (apunte, consulta, definición) y fijar las materias en un calendario semanal

## Inicio rápido

Consultá [SPEC.md](./SPEC.md) para la documentación técnica completa.

### Documentación del proyecto

- [Arquitectura](./ARCHITECTURE.md): estructura y responsabilidades de las capas.
- [Tareas y roadmap](./TASKS.md): estado de etapas y trabajo pendiente.
- [Flujo SDD](./specs/README.md): cómo especificar, planificar y verificar cambios.

### Backend

```bash
cd backend
cp .env.example .env   # Linux/macOS — en Windows: copy .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env   # Linux/macOS — en Windows: copy .env.example .env
npm run dev
```

### Verificaciones rápidas

Con el backend iniciado, `GET http://localhost:3001/api/health` debe responder con estado `200`.

Desde `frontend/`, ejecutá:

```bash
npm run build
npm run lint
npm run test:storage
```

### Aplicación completa con Docker Compose

Requiere Docker Engine y Docker Compose. Desde la raíz del repositorio, creá el archivo local de variables y reemplazá todos los valores de ejemplo por credenciales propias:

```powershell
Copy-Item .env.docker.example .env
```

Luego iniciá el stack:

```bash
docker compose up --build
```

Abrí `http://localhost:5173` (o el puerto configurado en `FRONTEND_PORT`). Nginx sirve el frontend y reenvía `/api` al backend; MySQL y la API no publican puertos al host. El endpoint `http://localhost:<FRONTEND_PORT>/api/health` verifica el proxy hacia la API.

Para detener los contenedores, ejecutá `docker compose down`. La base persiste en el volumen `focusmind_app_mysql_data`; eliminar ese volumen borra los datos. El Compose de desarrollo que levanta únicamente MySQL sigue disponible por separado en `docker-compose.dev.yml`.
