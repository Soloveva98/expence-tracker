# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Expense tracker monorepo managed with **npm workspaces**. Three workspaces:

- `apps/web` — Next.js 16 frontend (App Router, Tailwind v4, shadcn/ui)
- `apps/api` — NestJS 11 backend with Prisma + PostgreSQL (NestJS pinned to v11 because `nestjs-zod` peers on `@nestjs/common@^10 || ^11`)
- `packages/shared` — `@expence-tracker/shared`, the single source of Zod schemas and TypeScript types consumed by both apps

This is an early-stage scaffold: there is no auth (no `User` model / `auth` module yet), and only a placeholder `Expense` domain exists. Tests are not yet set up.

## Commands

Run from the repo root unless noted. Target one workspace with `-w <name>` (`web`, `api`, or `@expence-tracker/shared`).

| Command | Purpose |
|---|---|
| `npm install` | Install all workspaces |
| `npm run dev` | Run shared (watch), api, and web concurrently |
| `npm run build` | Build in order: shared → api → web |
| `npm run lint` | ESLint across the repo (flat config) |
| `npm run format` | Prettier write |
| `npm run prisma:generate` | Generate Prisma Client (delegates to `-w api`) |
| `npm run prisma:migrate` | `prisma migrate dev` (delegates to `-w api`) |
| `docker compose up -d` | Start PostgreSQL 17 |

First-time setup requires two env files: `cp .env.example .env` (docker-compose) and `cp apps/api/.env.example apps/api/.env` (Prisma CLI + NestJS). After that: `docker compose up -d`, `npm run prisma:generate`, `npm run prisma:migrate`, `npm run build -w @expence-tracker/shared`, then `npm run dev`.

Default ports: web `3000`, api `4000` (Swagger at `/docs`, health at `/health`).

## Architecture

### Shared contract is the hub

`packages/shared/src/index.ts` defines Zod schemas (e.g. `createExpenseSchema`, `expenseSchema`) and exports both the schema and its inferred type. This is the **one place** request/response shapes are declared — do not duplicate validation types in the apps.

- The API validates every DTO against these schemas via a global `ZodValidationPipe` (`nestjs-zod`) set up in `apps/api/src/main.ts`. Build Nest DTOs from the shared schemas rather than writing `class-validator` classes.
- The web app imports schemas/types directly for form and fetch typing.
- `packages/shared` compiles to `dist/`. **The API consumes the built `dist/`**, so it must be built before the API runs (`npm run build -w @expence-tracker/shared`, or the watch task that `npm run dev` starts). The web app pulls the source via Next's `transpilePackages: ['@expence-tracker/shared']` (`apps/web/next.config.ts`), but still resolves the package entry to `dist/`.

When changing a schema in `packages/shared`, keep `apps/api/prisma/schema.prisma` in sync — the Prisma `Expense` model intentionally mirrors `createExpenseSchema`.

### API (NestJS)

- Entry: `apps/api/src/main.ts` — creates the app, registers the global Zod pipe, enables CORS for the web dev server, and mounts Swagger at `/docs`.
- `PrismaModule` (`src/prisma/`) is `@Global()` and exports `PrismaService` (a `PrismaClient` subclass wired to Nest lifecycle hooks). Inject `PrismaService` anywhere; do not instantiate `PrismaClient` directly.
- `ConfigModule.forRoot({ isGlobal: true })` loads env. Both Prisma CLI and NestJS read `.env` from the `apps/api` directory, which is why `apps/api/.env` exists separately from the root `.env`.
- Prisma schema lives at `apps/api/prisma/schema.prisma`; after editing it run `npm run prisma:migrate`.

### Web (Next.js)

- App Router under `apps/web/app/`. Tailwind v4 is configured CSS-first via `app/globals.css` (`@import 'tailwindcss'`) and `postcss.config.mjs` — there is no `tailwind.config.js`.
- shadcn/ui is configured in `apps/web/components.json` (new-york style, `@/` alias, `cn` helper in `lib/utils.ts`). Add components with `npx shadcn@latest add <name>` from `apps/web`.

## Conventions

- **npm workspaces only** — not pnpm/yarn. Cross-workspace deps use `"@expence-tracker/shared": "*"`.
- TypeScript is pinned to `^6.0.3` across all workspaces to match the NestJS toolchain; keep versions aligned when adding deps.
- Formatting: single quotes, semicolons, trailing commas, 100-char width (`.prettierrc`).
