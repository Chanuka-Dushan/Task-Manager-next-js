# Task Manager

A full-stack Task Manager built with a NestJS REST API (`/api`) and a Next.js App Router frontend (`/web`) styled with `shadcn/ui`. Tasks are stored in memory on the server and seeded on startup so the application works out of the box with no database setup.

## Folder Structure

```text
.
├── api/          # NestJS backend (TypeScript, class-validator, Jest)
├── web/          # Next.js App Router frontend (TypeScript, Tailwind, shadcn/ui)
├── .gitignore
├── .nvmrc        # Node.js 22
└── README.md
```

## Prerequisites

- **Node.js**: v22 (see `.nvmrc`)
- **npm**: v10+ (v11.17.0 used during development)
- **Database**: None required (in-memory storage)

## Backend Setup

Run the NestJS API first in your first terminal:

```bash
cd api
npm install
cp .env.example .env
npm run start:dev
```

The backend API will be running at `http://localhost:3001`.

## Frontend Setup

Make sure the backend is already running, then start the Next.js frontend in a **second** terminal:

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Environment Variables

| App | Name | Purpose | Default |
| --- | --- | --- | --- |
| `/api` | `PORT` | Port the NestJS server listens on | `3001` |
| `/api` | `CORS_ORIGIN` | Allowed frontend origin for CORS | `http://localhost:3000` |
| `/web` | `NEXT_PUBLIC_API_URL` | Base URL for backend API requests | `http://localhost:3001` |

## Running Backend Tests

```bash
cd api
npm test
```

## API Endpoints

Base URL: `http://localhost:3001`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/tasks` | List all tasks (newest first) |
| `GET` | `/tasks/:id` | Get a single task by ID (`404` if not found) |
| `POST` | `/tasks` | Create a new task (`201 Created`) |
| `PATCH` | `/tasks/:id` | Partially update a task (`404` if not found) |
| `DELETE` | `/tasks/:id` | Delete a task (`204 No Content`, `404` if not found) |

### Example `curl` Commands

List all tasks:

```bash
curl http://localhost:3001/tasks
```

Create a task:

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Review PR","description":"Check validation and tests","status":"TODO","dueDate":"2026-12-31"}'
```

Update a task (replace `<id>` with a real task UUID):

```bash
curl -X PATCH http://localhost:3001/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

Delete a task (replace `<id>` with a real task UUID):

```bash
curl -X DELETE http://localhost:3001/tasks/<id>
```

Trigger a `400 Bad Request` (empty title):

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":""}'
```

Trigger a `404 Not Found` (missing ID):

```bash
curl http://localhost:3001/tasks/does-not-exist
```

## Decisions

1. **In-memory storage vs. SQLite**: I used a private in-memory array in `TasksService` seeded with 3 sample tasks instead of SQLite. This removes ORM/migration setup and keeps the assignment focused on clean NestJS architecture and CRUD flow, at the cost of data resetting on server restart.
2. **Validation in DTOs with a global `ValidationPipe`**: Validation rules live in `CreateTaskDto` and `UpdateTaskDto` using `class-validator` and `PartialType`, enforced globally with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`. This keeps controllers clean and ensures unknown fields or invalid payloads are consistently rejected with `400`.
3. **How API errors reach the user**: `web/lib/api.ts` centralizes all `fetch` calls and checks `response.ok`. When NestJS returns an error JSON body, it normalizes `message` (whether a string or an array of validation strings joined with `", "`) and throws an `Error` that the UI displays inline in the form dialog and via Sonner error toasts.
4. **Simple `useState`/`useEffect` instead of a data-fetching library**: The frontend manages task state in `app/page.tsx` with standard React `useState` and `useEffect` rather than adding React Query or SWR. For a single-page CRUD table, built-in hooks keep the bundle small and make the data flow easy to read and explain.
5. **Due-date validation at both layers**: A custom `@IsTodayOrFuture()` class-validator decorator on the DTO rejects past dates on the backend with `400`. The frontend form also validates the date client-side before making a network call and sets `min={today}` on the date input so the browser's date picker hides past dates. Validating at both layers ensures correctness whether someone uses the UI or calls the API directly.

## How I used AI

- **Tools used**: Antigravity (Gemini 4 Hydrogen model)
- **What I changed in the generated code**: The AI initially imported `Task` as a value import in `tasks.controller.ts`, which caused a TypeScript build error under `isolatedModules` with `emitDecoratorMetadata`. I changed it to `import type { Task }` to fix this. I also removed the Google Fonts (`Geist` / `Geist_Mono`) imports from `app/layout.tsx` after the `next build` failed because the build environment had no internet access to reach `fonts.googleapis.com`; I replaced them with the system `font-sans` class instead.
- **A mistake the AI made and how I noticed it**: The AI generated the task table with only four data columns (title, description, status, and due date) and left out the `createdAt` field entirely, even though it was defined on the `Task` interface and returned by the API. I noticed it was missing when I looked at the running app and saw the table had no "Created At" column, while the API response clearly included the field.
