Project
Name

FocusMind

Description: FocusMind is a web application that allows students to log and organize their study sessions by subject, track their consistency, set a weekly calendar routine, take notes and make inquiries related to each subject, and receive reminders for upcoming exams.

Tech Stack
React / Vite / localStorage / Node.js / Express / MySQL + Sequelize / JWT + bcrypt / Docker + Docker Compose

Code Style
Use PascalCase for React components
Use camelCase for variables and functions
Use descriptive names
Avoid duplicate logic
do not use the any type

Architecture
Functional components.
Separation of UI and logic (hooks/services).
File and folder naming.
Local vs. global state (when to use each).
Handling loading, error, and empty states.
Minimum accessibility (labels, roles, focus).
When to create a reusable component vs. keeping it inline.
Avoid deeply nested components.

Agent Behavior

Befor implementing any significant change:

Analyze the existing code.
Explain your implementation plan.
Wait for approval before making large modifications.

Restrictions
DO NOT
Add libraries without a clear need.
Install unnecesary dependencies.
Introduce complex patterns that are not required.
Never commit .env files
Do not expose secrets on the frontend
Remove existing features without approval.
Make commits without approval.
Do not create end screens if the task is infrastructure-related.
Do not mix backend and frontend in the same task unless requested.
Do not implement auth, databases, or Docker until the specific stage calls for it.

DO
If a key decision is missing → ask first
If there is a new decision → document it in SPEC.md
Prefer native/simple solutions over additional frameworks
Always hash passwords
Validate inputs on the backend
Keep tokens out of the DOM and logs
Consult [SPEC.md](./SPEC.md) for further technical specifications.