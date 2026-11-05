# Expense Tracker

Монорепозиторий трекера расходов.

- **`apps/web`** — frontend на Next.js (App Router, TypeScript, Tailwind CSS v4, shadcn/ui)
- **`apps/api`** — backend на NestJS (TypeScript, Swagger, Prisma)
- **`packages/shared`** — общие TypeScript-типы и Zod-схемы для web и api
- **PostgreSQL** — через Docker Compose, ORM — **Prisma**

Управление пакетами — **npm workspaces**.

## Структура

```
expence-tracker/
├── apps/
│   ├── web/                 # Next.js
│   └── api/                 # NestJS + Prisma
├── packages/
│   └── shared/              # общие типы и Zod-схемы
├── docker-compose.yml       # PostgreSQL
└── package.json             # workspaces + корневые скрипты
```

## Требования

- Node.js LTS (см. `.nvmrc`, версия 20+)
- npm 10+
- Docker (для PostgreSQL)

## Быстрый старт

```bash
# 1. Переменные окружения
cp .env.example .env                 # для docker-compose
cp apps/api/.env.example apps/api/.env   # DATABASE_URL для Prisma и NestJS

# 2. Установка зависимостей (всех воркспейсов разом)
npm install

# 3. Поднять PostgreSQL
docker compose up -d

# 4. Сгенерировать Prisma Client и применить миграции
npm run prisma:generate
npm run prisma:migrate       # создаст первую миграцию в apps/api/prisma/migrations

# 5. Собрать общий пакет (нужен web и api)
npm run build -w @expence-tracker/shared

# 6. Запуск в режиме разработки (web + api параллельно)
npm run dev
```

После запуска:

- Web: http://localhost:3000
- API: http://localhost:4000
- Swagger: http://localhost:4000/docs
- Health-check: http://localhost:4000/health

## Полезные скрипты

Корень:

| Команда | Действие |
|---|---|
| `npm run dev` | web и api в watch-режиме параллельно |
| `npm run build` | сборка shared → api → web |
| `npm run lint` | ESLint по всему репозиторию |
| `npm run format` | Prettier --write |
| `npm run prisma:generate` | генерация Prisma Client |
| `npm run prisma:migrate` | миграции dev |

Отдельные воркспейсы: `npm run <script> -w web`, `-w api`, `-w @expence-tracker/shared`.

## shadcn/ui

Конфигурация в `apps/web/components.json`. Добавление компонентов (после `npm install`):

```bash
cd apps/web
npx shadcn@latest add button
```

## Заметки

- `packages/shared` компилируется в `dist/` (`npm run build -w @expence-tracker/shared`).
  В dev удобно держать его в watch-режиме: `npm run dev -w @expence-tracker/shared`.
- Схема БД — `apps/api/prisma/schema.prisma`. После изменений: `npm run prisma:migrate`.
- Авторизации в MVP нет — модели User и модуль auth добавляются отдельным этапом.
