# Metanip — Featured Image Generator

A hybrid featured-image generation tool. Browser-based live editor for humans, Satori-based API endpoint for automation. Built as a Turborepo monorepo.

## What it does

1. Paste a URL, upload a Markdown/MDX file, or fill a form
2. Metadata is extracted automatically
3. Pick a template from a grid
4. Auto-filled preview appears — download directly or enter edit mode to tweak background, fonts, colors, layout
5. Logged-in users can save presets and view generation history
6. Developers can hit `GET /api/og?...` to generate images programmatically

## Tech stack

| Layer         | Choice                                             |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                            |
| Monorepo      | Turborepo + Bun                                    |
| Language      | TypeScript (strict)                                |
| Styling       | Tailwind CSS v4                                    |
| Database      | PostgreSQL + Prisma v7                             |
| Auth          | better-auth (Google OAuth + magic link via Resend) |
| Email         | Resend                                             |
| Storage       | Cloudinary / Cloudflare R2                         |
| Browser → PNG | `html-to-image`                                    |
| Server → PNG  | `@vercel/og` (Satori)                              |
| State         | Zustand + React Hook Form + Zod                    |

## Monorepo structure

```
metanip/
├── apps/
│   └── www/               # Next.js 16 app
├── packages/
│   ├── auth/              # better-auth config + email templates
│   ├── database/          # Prisma client + schema
│   ├── email/             # Resend email templates (Phase 5)
│   ├── metadata/          # Zod schema + scraper + markdown parser
│   ├── storage/           # Cloudinary/R2 abstraction (Phase 6)
│   ├── templates/         # Dual-renderer templates + registry
│   ├── ui/                # Shared React components
│   ├── eslint-config/     # Shared ESLint flat configs
│   └── typescript-config/ # Shared tsconfig presets
```

## Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- Node.js >= 18
- PostgreSQL database

### Install

```sh
bun install
```

### Environment variables

Copy `.env.example` to `apps/www/.env.local` and fill in your values:

```sh
cp .env.example apps/www/.env.local
```

### Database

```sh
# Push schema and generate client
bun --filter @repo/database db:push
bun --filter @repo/database generate
```

### Develop

```sh
bun dev
```

Opens the app at [http://localhost:3000](http://localhost:3000).

### Build

```sh
bun run build
```

### Lint

```sh
bun run lint
```

## Implementation phases

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the full phase-by-phase roadmap.
