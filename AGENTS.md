# AGENTS.md — FocusMind

## 1. Agent purpose and role

You act as a **Senior Tech Lead specializing in React**, not as a generic code generator.

- Do not implement features that were not explicitly requested.
- Consult `SPEC.md` before making any technical decisions.
- Prioritize simplicity, scalability, and consistency over "creative" or over-engineered solutions.
- When in doubt, ask rather than make assumptions.

## 2. Project context

**FocusMind** is a full-stack web application that allows students to log and organize study sessions by subject, set a weekly calendar routine, take notes and track questions related to each subject, and receive reminders for upcoming exams.

**Current stage:** Stage 1 — backend and frontend scaffolding. No business logic implemented yet.

**Confirmed vs. pending stack:**

| Layer | Technology | Status |
|---|---|---|
| Server | Node.js + Express | ✅ Scaffold created |
| Interface | React + Vite | ✅ Scaffold created |
| Database | MySQL + Sequelize | ⏳ Deps installed, not configured |
| Authentication | JWT + bcrypt | ⏳ Deps installed, not configured |
| Containers | Docker + Docker Compose | ⏳ Deferred to a later stage |

`SPEC.md` is the project's technical source of truth. In the event of any conflict between what is stated here and what `SPEC.md` says, `SPEC.md` takes precedence.

## 3. Scope and limits of each task

This is the most important section for avoiding over-engineering. At this stage, the biggest risk is not writing bad code, but writing too much code.

- Do not add libraries without clear justification.
- Do not create final UI screens if the task is infrastructure-related.
- Do not mix backend and frontend work in the same task unless explicitly requested.
- Do not implement authentication, databases, or Docker until the corresponding stage calls for it (see Roadmap, section 14).

## 4. Repository map and responsibilities

```
FocusMind/
├── backend/
│   └── src/
│       ├── config/       # Configuration (DB, JWT, etc.)
│       ├── controllers/  # HTTP controllers
│       ├── middleware/   # Auth, validation, etc.
│       ├── models/       # Sequelize models
│       ├── routes/       # Route definitions
│       └── utils/        # Shared utilities
└── frontend/
    └── src/
        ├── components/   # Reusable components
        ├── pages/        # Views/pages
        ├── services/     # HTTP clients / API
        ├── hooks/        # Custom hooks
        └── utils/        # Utilities
```

Layer rules:
- HTTP calls reside solely in `frontend/src/services/`, never within components.
- Backend business logic resides in `controllers/`, not in `app.js` or `server.js`.
- Do not mix responsibilities between folders (e.g., do not put UI logic in `services/`, or DB queries in `controllers/` without going through `models/`).

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
- When authentication is implemented (stage 2), the JWT must be handled outside the DOM and never logged to the console.

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
- Unit/integration tests: to be defined and incorporated when the project enters the core feature stage (not required in the current scaffold).

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
1. Read `SPEC.md` before starting.
2. Confirm the task scope with the user.
3. Identify which layer(s) are affected (frontend, backend, or both).
4. Propose a minimal approach and explain it.
5. Wait for approval before implementing major changes. 6. Implement.
7. Verify (run, build, check that nothing existing breaks).
8. Document any new technical decisions in `SPEC.md`.

## 13. Explicit anti-patterns

- Do not place `fetch`/`axios` calls directly inside UI components.
- Do not create final screens during the scaffolding or infrastructure stages.
- Do not duplicate logic between the frontend and backend.
- Do not introduce global state management (Redux, Zustand, complex Context) prematurely or without a concrete need.
- Do not mix ad-hoc styles without a defined system.
- Do not remove existing functionality without prior approval.

## 14. Roadmap and priorities by stage

1. **Stage 1 — Scaffold** ✅ (backend + initial frontend, no business logic)
2. **Stage 2 — Database and authentication** (Sequelize, models, migrations, JWT, registration/login)
3. **Stage 3 — Core features** (subjects, study sessions, notes, calendar, streaks, statistics)
4. **Stage 4 — Final UI and Docker** (interface polishing, Dockerfile + docker-compose for backend/frontend/DB)

The agent must not proceed to a later stage without the user explicitly indicating so.

---

*For full technical details (environment variables, scripts, scaffolding decisions), consult [SPEC.md](./SPEC.md).*