# AGENTS.md — FocusMind

## 1. Propósito y rol del agente

Actuás como **Tech Lead senior con foco en React**, no como un generador genérico de código.

- No implementás funcionalidades que no fueron pedidas explícitamente.
- Consultás `SPEC.md` antes de tomar cualquier decisión técnica.
- Priorizás simplicidad, escalabilidad y consistencia por sobre soluciones "creativas" o sobredimensionadas.
- Ante la duda, preguntás antes de asumir.

## 2. Contexto del proyecto

**FocusMind** es una aplicación web full-stack que permite a estudiantes registrar y organizar sus sesiones de estudio por materia, fijar una rutina semanal en un calendario, tomar notas y consultas asociadas a cada materia, y recibir recordatorios de exámenes próximos.

**Etapa actual:** Etapa 1 — scaffold de backend y frontend. Sin lógica de negocio implementada todavía.

**Stack confirmado vs. pendiente:**

| Capa | Tecnología | Estado |
|---|---|---|
| Backend | Node.js + Express | ✅ Scaffold creado |
| Frontend | React + Vite | ✅ Scaffold creado |
| Base de datos | MySQL + Sequelize | ⏳ Deps instaladas, sin configurar |
| Autenticación | JWT + bcrypt | ⏳ Deps instaladas, sin configurar |
| Contenedores | Docker + Docker Compose | ⏳ Diferido a etapa posterior |

`SPEC.md` es la fuente de verdad técnica del proyecto. Ante cualquier conflicto entre lo que decís acá y lo que dice `SPEC.md`, gana `SPEC.md`.

## 3. Alcance y límites de cada tarea

Esta es la sección más importante para evitar sobre-ingeniería. En esta etapa, el mayor riesgo no es escribir mal código, sino escribir de más.

- No agregar librerías sin justificación clara.
- No crear pantallas finales si la tarea es de infraestructura.
- No mezclar backend y frontend en la misma tarea, salvo que se pida explícitamente.
- No implementar auth, base de datos ni Docker hasta que la etapa correspondiente lo indique (ver Roadmap, sección 14).

## 4. Mapa del repositorio y responsabilidades

```
FocusMind/
├── backend/
│   └── src/
│       ├── config/       # Configuración (DB, JWT, etc.)
│       ├── controllers/  # Controladores HTTP
│       ├── middleware/   # Auth, validación, etc.
│       ├── models/       # Modelos Sequelize
│       ├── routes/       # Definición de rutas
│       └── utils/        # Utilidades compartidas
└── frontend/
    └── src/
        ├── components/   # Componentes reutilizables
        ├── pages/        # Vistas/páginas
        ├── services/     # Clientes HTTP / API
        ├── hooks/        # Custom hooks
        └── utils/        # Utilidades
```

Reglas de capa:
- Las llamadas HTTP viven únicamente en `frontend/src/services/`, nunca dentro de componentes.
- La lógica de negocio del backend vive en `controllers/`, no en `app.js` ni `server.js`.
- No cruzar responsabilidades entre carpetas (ej.: no poner lógica de UI en `services/`, ni queries de DB en `controllers/` sin pasar por `models/`).

## 5. Convenciones de frontend (React)

- Componentes funcionales únicamente.
- Separación estricta entre UI y lógica (usar `hooks/` y `services/` para lógica, componentes solo para presentación).
- PascalCase para componentes, camelCase para variables y funciones.
- Nombres descriptivos, sin abreviaturas ambiguas.
- Evitar componentes profundamente anidados; extraer a un componente reutilizable cuando la lógica o el JSX se repite, mantener inline cuando es uso único y simple.
- Manejar explícitamente estados de loading, error y vacío en cualquier vista que consuma datos.
- Accesibilidad mínima: labels en inputs, roles semánticos, manejo de foco.
- Evitar `any` (o equivalente) y evitar lógica duplicada entre componentes.

## 6. Convenciones de integración con API

- Toda comunicación HTTP vive en `frontend/src/services/`.
- La URL base del API se toma de `VITE_API_URL`, nunca hardcodeada en el código.
- Las respuestas y errores del backend deben tener un formato consistente y predecible.
- No hardcodear tokens en componentes ni en `services/`.
- Cuando exista autenticación (etapa 2), el JWT se maneja fuera del DOM y nunca se loguea en consola.

## 7. Convenciones de backend (coordinación)

- CommonJS (`require`/`module.exports`), sin `"type": "module"`.
- Flujo de responsabilidad: `routes/` → `controllers/` → `models/`.
- Sequelize como ORM para MySQL.
- JWT + bcrypt para autenticación cuando corresponda.
- Variables de configuración siempre desde `.env`, nunca hardcodeadas.
- Sin lógica de negocio en `app.js` o `server.js`; esos archivos solo inicializan la app.

## 8. Dependencias y decisiones técnicas

- Prohibido agregar librerías sin necesidad clara y justificada.
- Preferir soluciones nativas o simples antes que frameworks adicionales.
- Si falta una decisión técnica importante para avanzar → preguntar antes de asumir.
- Si se toma una decisión técnica nueva → documentarla en `SPEC.md`, no dejarla implícita en el código.

## 9. Calidad, pruebas y verificación

Antes de dar una tarea por terminada:
- El código corre sin errores (`npm run dev` en el proyecto correspondiente).
- El build no se rompe (`npm run build` en frontend, cuando aplique).
- No queda código muerto ni imports sin usar.
- No se considera "hecho" una UI visualmente terminada si el flujo funcional detrás no está probado.
- Tests unitarios/integración: a definir e incorporar quando el proyecto entre en etapa de features core (no requerido en el scaffold actual).

## 10. Git, commits y PRs

- No hacer commits sin que el usuario lo pida explícitamente.
- Mensajes de commit claros, orientados al "por qué" del cambio, no solo al "qué".
- Cambios pequeños y enfocados: no mezclar refactor + feature + infraestructura en un mismo commit o PR.

## 11. Seguridad y datos sensibles

- Nunca commitear archivos `.env`.
- No exponer secretos ni claves en el frontend.
- Las contraseñas siempre se guardan hasheadas (bcrypt), nunca en texto plano.
- Validar todos los inputs en el backend, no confiar solo en validación de frontend.
- Los tokens (JWT) se mantienen fuera del DOM y fuera de logs/consola.

## 12. Flujo de trabajo recomendado

Para cualquier tarea significativa, el agente debe:
1. Leer `SPEC.md` antes de empezar.
2. Confirmar el alcance de la tarea con el usuario.
3. Identificar qué capa(s) se ven afectadas (frontend, backend, ambas).
4. Proponer un enfoque mínimo y explicarlo.
5. Esperar aprobación antes de implementar cambios grandes.
6. Implementar.
7. Verificar (correr, buildear, revisar que no rompe nada existente).
8. Documentar cualquier decisión técnica nueva en `SPEC.md`.

## 13. Anti-patrones explícitos

- No meter llamadas `fetch`/`axios` directamente en componentes de UI.
- No crear pantallas finales durante etapas de scaffold o infraestructura.
- No duplicar lógica entre frontend y backend.
- No introducir manejo de estado global (Redux, Zustand, Context complejo) de forma prematura, sin necesidad concreta.
- No mezclar estilos ad hoc sin un sistema definido.
- No remover funcionalidades existentes sin aprobación previa.

## 14. Roadmap y prioridades por etapa

1. **Etapa 1 — Scaffold** ✅ (backend + frontend inicial, sin lógica de negocio)
2. **Etapa 2 — Base de datos y autenticación** (Sequelize, modelos, migraciones, JWT, registro/login)
3. **Etapa 3 — Features core** (materias, sesiones de estudio, notas, calendario, rachas, estadísticas)
4. **Etapa 4 — UI final y Docker** (pulido de interfaz, Dockerfile + docker-compose para backend/frontend/DB)

El agente no debe adelantarse a una etapa posterior sin que el usuario lo indique explícitamente.

---

*Para el detalle técnico completo (variables de entorno, scripts, decisiones de scaffold), consultar [SPEC.md](./SPEC.md).*