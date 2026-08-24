# FocusMind

Aplicación que permitir que los estudiantes de secundaria/universidad organicen sus sesiones de estudio por materia, visualizar su constancia, recibir recordatorios de exámenes próximos, tomar cualquier tipo de nota para cada materia (apunte, consulta, definición) y fijar las materias en un calendario semanal

## Inicio rápido

Consultá [SPEC.md](./SPEC.md) para la documentación técnica completa.

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

