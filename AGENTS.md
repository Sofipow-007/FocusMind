# AGENTS.md — FocusMind

## 1. Agent purpose and role

You act as a **Senior Tech Lead specializing in React**, not as a generic code generator.

- Do not implement features that were not explicitly requested.
- Consult `SPEC.md` before making any technical decisions.
- Prioritize simplicity, scalability, and consistency over "creative" or over-engineered solutions.
- When in doubt, ask rather than make assumptions.

## 2. Project context

**FocusMind** is a full-stack web application that allows students to log and organize study sessions by subject, set a weekly calendar routine, take notes and track questions related to each subject, and receive reminders for upcoming exams.

**Current stage:** Stage 2 is reported as closed in `SPEC.md`; Stage 3 — core features — is the next step. `SPEC.md` takes precedence if this summary becomes outdated.

**Confirmed vs. pending stack:**

| Layer | Technology | Status |
|---|---|---|
| Server | Node.js + Express | ✅ Scaffold created |
| Interface | React + Vite | ✅ Scaffold created |
| Database | MySQL + Sequelize | ✅ Configured; core models and migrations exist |
| Authentication | JWT + bcrypt | ✅ HttpOnly cookie flow reported complete; hardening follow-up is tracked in `TASKS.md` |
| Containers | Docker + Docker Compose | ⚠️ Development MySQL Compose only; full application containers pending |

`SPEC.md` is the project's technical source of truth. In the event of any conflict between what is stated here and what `SPEC.md` says, `SPEC.md` takes precedence.

## 3. Scope and limits of each task

This is the most important section for avoiding over-engineering. At this stage, the biggest risk is not writing bad code, but writing too much code.

- Do not add libraries without clear justification.
- Do not create final UI screens if the task is infrastructure-related.
- Do not mix backend and frontend work in the same task unless explicitly requested.
- Do not proceed to a later roadmap stage without the user's explicit direction (see `SPEC.md` and `TASKS.md`).

## 4. Repository map and responsibilities

```
FocusMind/
├── backend/
│   └── src/
│       ├── config/       # Environment and database configuration
│       ├── controllers/  # HTTP request/response coordination
│       ├── middleware/   # Authentication and shared request middleware
│       ├── migrations/   # Versioned database schema changes
│       ├── models/       # Sequelize entities and relations
│       ├── routes/       # Endpoint definitions by resource
│       ├── seeders/      # Development data
│       ├── services/     # Domain operations and data access coordination
│       ├── utils/        # Shared utilities
│       └── validators/   # Request input validation
└── frontend/
    └── src/
        ├── components/   # Reusable presentation components
        ├── pages/        # Application views
        ├── services/     # HTTP clients and resource services
        ├── hooks/        # Custom hooks
        └── utils/        # Shared presentation utilities
```

Layer rules:
- HTTP calls reside solely in `frontend/src/services/`, never within components.
- Backend request handling follows `routes/` → `middleware/` and `validators/` → `controllers/` → `services/` → `models/`.
- Keep business logic out of `app.js` and `server.js`; do not put UI logic in frontend `services/`.

## 5. Frontend conventions (React)

- Functional components only.
- Strict separation between UI and logic (use `hooks/` and `services/` for logic; components are for presentation only).
- PascalCase for components, camelCase for variables and functions.
- Descriptive names; avoid ambiguous abbreviations.
- Avoid deeply nested components; extract to a reusable component when logic or JSX repeats, but keep inline for simple, one-off use.
- Explicitly handle loading, error, and empty states in any view that consumes data.
- Minimum accessibility: input labels, semantic roles, and focus management.
- Avoid `any` (or equivalent) and avoid duplicate logic across components.

## 6. API integration conventions

- All HTTP communication resides in `frontend/src/services/`.
- The API base URL is derived from `VITE_API_URL`; never hardcode it in the source code.
- Backend responses and errors must follow a consistent and predictable format.
- Do not hardcode tokens in components or `services/`.
- The JWT is handled outside the DOM, never read or written by frontend JavaScript, and never logged to the console.

## 7. Backend conventions (coordination)

- CommonJS (`require`/`module.exports`); do not use `"type": "module"`.
- Responsibility flow: `routes/` → `controllers/` → `models/`.
- Sequelize as the ORM for MySQL.
- JWT + bcrypt for authentication where applicable.
- Configuration variables must come from `.env`; never hardcode them.
- No business logic in `app.js` or `server.js`; these files are solely for app initialization.

## 8. Dependencies and technical decisions

- Do not add libraries without a clear, justified need.
- Prefer native or simple solutions over additional frameworks.
- If a key technical decision is missing to proceed → ask before making assumptions.
- If a new technical decision is made → document it in `SPEC.md`; do not leave it implicit in the code.

## 9. Quality, testing, and verification

Before marking a task as complete:
- The code runs without errors (`npm run dev` in the relevant project).
- The build does not break (`npm run build` for the frontend, where applicable).
- There is no dead code or unused imports.
- A visually finished UI is not considered "done" if the underlying functional flow has not been tested.
- Run the relevant existing tests (`npm test` in `backend/`; `npm run test:storage` in `frontend/`) and add tests with new business behavior as appropriate.

## 10. Git, commits, and PRs

- Do not make commits unless explicitly requested by the user.
- Use clear commit messages focused on the "why" of the change, not just the "what."
- Keep changes small and focused: do not mix refactoring, features, and infrastructure in the same commit or PR.

## 11. Security and sensitive data

- Never commit `.env` files.
- Do not expose secrets or keys in the frontend.
- Passwords must always be stored hashed (bcrypt), never in plain text.
- Validate all inputs on the backend; do not rely solely on frontend validation.
- Keep tokens (JWTs) out of the DOM and out of logs/console output.

## 12. Recommended workflow

For any significant task, the agent must:
1. Read `SPEC.md`, `ARCHITECTURE.md`, `TASKS.md`, and the applicable feature documents under `specs/`.
2. Confirm the task scope with the user when it is ambiguous; create or update SDD artifacts following `specs/README.md`.
3. Identify the affected layers and use the smallest complete implementation.
4. Review the scope and seek approval before major implementation or a new technical decision.
5. Implement against the agreed acceptance criteria and verify the relevant behavior.
6. Update `SPEC.md` for approved global decisions/contracts, `TASKS.md` for roadmap status, and the feature SDD artifacts with verification results.

## 13. Explicit anti-patterns

- Do not place `fetch`/`axios` calls directly inside UI components.
- Do not create final screens before the roadmap reaches the UI-polishing stage.
- Do not duplicate logic between the frontend and backend.
- Do not introduce global state management (Redux, Zustand, complex Context) prematurely or without a concrete need.
- Do not mix ad-hoc styles without a defined system.
- Do not remove existing functionality without prior approval.

## 14. Roadmap and priorities by stage

1. **Stage 1 — Scaffold** ✅ (backend and initial frontend)
2. **Stage 2 — Database and authentication** ✅ (reported closed in `SPEC.md`; follow-up hardening is tracked in `TASKS.md`)
3. **Stage 3 — Core features** 🔜 (subjects, study sessions, notes, calendar, streaks, statistics)
4. **Stage 4 — Final UI and Docker** ⏳ (interface polishing and Dockerfiles/Compose for the application)

The agent must not proceed to a later stage without the user explicitly indicating so.

---

*For full technical details (environment variables, scripts, scaffolding decisions), consult [SPEC.md](./SPEC.md).*