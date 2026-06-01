# Featured Image Generator — Implementation Plan

> A hybrid (Option C) featured-image generation tool. Browser-based live editor for humans, Satori-based API endpoint for automation. Built as a Turborepo monorepo.

---

## 1. Product Summary

A web app where users:
1. Paste a URL, upload a markdown/MDX file, or fill a form
2. Metadata is extracted automatically
3. Pick a template from a grid
4. Auto-filled preview appears; user can either **download** or **enter edit mode** to tweak background, fonts, colors, layout, etc.
5. Logged-in users can save presets and view generation history
6. Developers can hit `GET /api/og?...` to generate images programmatically

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Monorepo | Turborepo + pnpm |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Auth.js (NextAuth v5) — magic link via Resend + Google OAuth |
| Email | Resend |
| Storage | Cloudinary (preferred for image transforms) OR Cloudflare R2 |
| Browser → PNG | `html-to-image` |
| Server → PNG | `@vercel/og` (Satori) |
| State | Zustand (editor), React Hook Form + Zod (forms) |
| Scraping | `open-graph-scraper` + `cheerio` |
| Markdown | `gray-matter` + `remark` |
| Rate limit | Upstash Redis (only needed at Phase 8) |
| Deployment | Vercel |

---

## 3. Architecture Decision (Option C in one paragraph)

Every template is defined **twice but from one source of truth**: a shared `definition` (metadata schema, default props, customization options) and **two renderers** — a React/Tailwind component for the live browser editor, and a Satori-compatible JSX component for the server endpoint. They share types and design tokens. Browser version uses full CSS for the editor experience; Satori version is constrained to what Satori supports for the API. Both produce visually equivalent (not pixel-identical) output.

---

## 4. Monorepo Structure

```
featured-image-gen/
├── apps/
│   └── web/                          # Next.js 16 app
│       ├── app/
│       │   ├── (marketing)/
│       │   ├── editor/[templateId]/
│       │   ├── dashboard/
│       │   ├── api/
│       │   │   ├── og/route.tsx      # Satori endpoint
│       │   │   ├── scrape/route.ts
│       │   │   ├── parse/route.ts
│       │   │   └── auth/[...nextauth]/
│       │   └── layout.tsx
│       └── components/
├── packages/
│   ├── db/                           # Prisma client + schema
│   ├── templates/                    # All templates (dual renderers)
│   │   ├── src/
│   │   │   ├── registry.ts
│   │   │   ├── shared/               # tokens, fonts, types
│   │   │   └── <template-id>/
│   │   │       ├── definition.ts
│   │   │       ├── browser.tsx
│   │   │       ├── satori.tsx
│   │   │       └── preview.png
│   ├── metadata/                     # scraper + parser + Zod schema
│   ├── ui/                           # shadcn components, design system
│   ├── storage/                      # Cloudinary/R2 abstraction
│   ├── email/                        # Resend templates
│   └── config/                       # eslint, tsconfig, tailwind presets
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 5. How to Use This Document

Each phase below is **self-contained**. To execute a phase with an AI assistant:
1. Share this file
2. Say: "Execute Phase N. Here is the current repo state: [paste `tree` output or relevant files]."
3. Use the **Prompt for AI** section at the end of each phase verbatim if you want a clean starting prompt.

Phases are sequential — don't skip. Each ends with **acceptance criteria** you can manually verify before moving on.

---

# Phase 0 — Foundation

**Goal:** Empty but correctly configured monorepo that builds and lints.

**Deliverables**
- pnpm workspace + Turborepo configured
- Next.js 16 app scaffolded in `apps/web` with App Router, Tailwind v4, TypeScript strict
- Shared `packages/config` with base `tsconfig`, `eslint`, `tailwind` presets
- Empty placeholder packages: `db`, `templates`, `metadata`, `ui`, `storage`, `email`
- `.env.example` listing every env var the full project will need (commented)
- README with setup instructions
- Git initialized, sensible `.gitignore`

**Acceptance criteria**
- `pnpm install` succeeds
- `pnpm dev` opens a working Next.js page at `localhost:3000`
- `pnpm build` and `pnpm lint` pass with zero errors
- Importing from `@repo/ui` in `apps/web` works (even with a stub export)

**Prompt for AI**
> Execute Phase 0 from IMPLEMENTATION_PLAN.md. Scaffold the Turborepo monorepo with the exact structure in section 4. Use pnpm, Next.js 16 with App Router, Tailwind v4, TypeScript strict mode. Create empty placeholder packages with valid `package.json` and `index.ts` exports. Confirm everything builds before stopping.

---

# Phase 1 — Schema & Template Registry

**Goal:** Define the single source of truth — `Metadata` type, `TemplateDefinition` interface, and the registry. No rendering yet.

**Deliverables**

In `packages/metadata`:
- `schema.ts` — Zod schema for `Metadata`:
  ```
  title, subtitle?, description?, author?, authorAvatar?, authorHandle?,
  siteName?, siteUrl?, siteLogo?, tags[], publishedAt?, readingTime?,
  heroImage?, themeColor?, customFields: Record<string, string>
  ```
- Export inferred TS type

In `packages/templates`:
- `shared/types.ts` — `TemplateDefinition`:
  - `id`, `name`, `description`, `category` ('minimal' | 'bold' | 'dev' | etc.)
  - `supportedDimensions: Array<{w, h, label}>` (OG, Twitter, LinkedIn, Square)
  - `requiredFields: (keyof Metadata)[]`
  - `customizations: CustomizationSchema` (typed map of {key → control: color | text | select | slider | toggle | image})
  - `defaults: { metadata: Partial<Metadata>, customizations: Record<string, any> }`
  - `BrowserComponent: ComponentType<TemplateProps>`
  - `SatoriComponent: ComponentType<TemplateProps>`
  - `previewImagePath: string`
- `shared/tokens.ts` — shared colors, font families, spacing scale used by both renderers
- `shared/fonts.ts` — font loader for Satori (ArrayBuffer) and Google Fonts links for browser
- `registry.ts` — `templates: TemplateDefinition[]` (empty array for now) + lookup helpers

In `packages/db`:
- Prisma schema with `User`, `Account`, `Session`, `VerificationToken` (Auth.js standard) + placeholder `Preset` and `Generation` models
- Run `prisma generate`; export typed client from `index.ts`

**Acceptance criteria**
- `Metadata` validates a sample object via Zod
- `registry.ts` exports an empty array and helpers compile
- `pnpm --filter @repo/db db:generate` works
- No runtime code in `templates` yet — just types and shared utilities

**Prompt for AI**
> Execute Phase 1 from IMPLEMENTATION_PLAN.md. Define the Metadata Zod schema, TemplateDefinition interface, shared tokens/fonts, empty registry, and Prisma schema with Auth.js + placeholder Preset/Generation models. Make sure types flow correctly between packages.

---

# Phase 2 — First Template (Dual-Mode) + Satori API

**Goal:** Ship one end-to-end working template — proves the dual-renderer pattern works and the API endpoint generates real PNGs.

**Deliverables**

Template: `minimal-card`
- `definition.ts` — full TemplateDefinition with realistic defaults and 3-4 customizations (bg color, text color, accent color, font size scale)
- `browser.tsx` — React + Tailwind component, fixed 1200×630 wrapper, accepts `{metadata, customizations, dimensions}`
- `satori.tsx` — equivalent component using inline styles only (Satori limitation), no Tailwind classes
- `preview.png` — placeholder image
- Register in `registry.ts`

API: `apps/web/app/api/og/route.tsx`
- `GET /api/og?templateId=minimal-card&title=...&subtitle=...` etc.
- Validate query params against template's required fields
- Load fonts via fetch + ArrayBuffer
- Render `SatoriComponent` via `ImageResponse`
- Return PNG with appropriate cache headers (`Cache-Control: public, immutable, max-age=31536000` keyed by params)
- Edge runtime

A minimal preview page at `/editor/minimal-card`:
- Just renders the `BrowserComponent` with default props on screen
- No editor UI yet, just visual confirmation

**Acceptance criteria**
- Visiting `/editor/minimal-card` shows the template rendered in browser
- Visiting `/api/og?templateId=minimal-card&title=Hello%20World` returns a valid PNG
- Browser and Satori versions look visually similar (not identical — that's fine)
- Changing query params changes the output

**Gotchas to flag in the prompt**
- Satori cannot use `className`; only `style={{}}`
- Satori needs absolute font URLs and ArrayBuffer loading
- No `background: url(...)` for remote images without fetching first
- `display: flex` is required on most parent divs in Satori (it complains otherwise)

**Prompt for AI**
> Execute Phase 2 from IMPLEMENTATION_PLAN.md. Build the `minimal-card` template in both browser (Tailwind) and Satori (inline styles) versions, register it, and implement the `/api/og` route with proper font loading and caching. Render a static preview page at `/editor/minimal-card` showing the browser version. Note Satori's constraints: no className, inline styles only, parent divs need `display: flex`.

---

# Phase 3 — Metadata Sources

**Goal:** Three input paths all feeding the same `Metadata` shape.

**Deliverables**

In `packages/metadata`:
- `scrape.ts` — given a URL, fetch + parse OG/Twitter/JSON-LD/standard meta tags, normalize to `Metadata`. Handle missing fields gracefully.
- `parse-markdown.ts` — given markdown/MDX content, parse frontmatter (gray-matter) + fallback (first H1 → title, first paragraph → description)
- Both return `Promise<Metadata>` and throw typed errors on failure

In `apps/web/app/api`:
- `POST /api/scrape` — `{url: string}` → `Metadata`
- `POST /api/parse` — `{content: string, filename?: string}` → `Metadata`
- Both validate input, return 4xx on bad input, 5xx on fetch failure
- Add basic rate limiting (per-IP, 20 req/min via in-memory map is fine here)

In `apps/web`:
- A throwaway test page `/test/metadata` with 3 forms (URL / markdown paste / file upload) that POST to the routes and display the resulting JSON
- This page is for verification; it'll be replaced by the real editor in Phase 4

**Acceptance criteria**
- Scrape works on at least 5 popular sites (Vercel blog, NYT article, Substack post, GitHub README, dev.to post)
- Markdown parse correctly extracts frontmatter from a sample `.md` and falls back when frontmatter is missing
- File upload of a `.md` file works and surfaces the parsed metadata
- Bad URLs return clean error messages, not stack traces

**Prompt for AI**
> Execute Phase 3 from IMPLEMENTATION_PLAN.md. Build the scraper and markdown parser in `@repo/metadata`, expose them via `/api/scrape` and `/api/parse` routes, and create a test page at `/test/metadata` to verify all three input paths work end-to-end.

---

# Phase 4 — Editor UI (the main UX)

**Goal:** This is the heart of the product. The flow from your sketch: paste URL → pick template → edit live → download.

**Deliverables**

Pages:
- `/` (home) — input section (URL paste, file upload, manual form toggle), then template grid below. On selecting a template, navigate to editor.
- `/editor/[templateId]?metadataId=...` — full editor

Editor layout:
- **Left panel:** Metadata fields (editable; pre-filled from scrape/parse)
- **Center:** Live preview using `BrowserComponent`, rendered inside a div with `ref` for `html-to-image`
- **Right panel:** Template customizations rendered dynamically from `definition.customizations` (color pickers, sliders, toggles, image uploaders)
- **Top bar:** Template name, dimension switcher (OG/Twitter/LinkedIn/Square), download button, "Save Preset" button (disabled if not logged in — Phase 5)

State:
- Zustand store with `{metadata, customizations, dimensions, templateId}`
- Metadata temporarily passed via URL param ID + sessionStorage (no DB yet)

Download:
- `html-to-image` → `toPng()` on the preview ref
- Trigger browser download with templated filename: `{title-slugified}-{template}.png`
- Show toast on success/error

Polish:
- Debounce customization changes to avoid jank
- "Reset to defaults" button per panel
- Mobile: collapse panels into tabs

**Acceptance criteria**
- User can paste a URL on `/`, pick a template, land in editor with data pre-filled
- All customizations update the preview in real-time
- Download produces a clean PNG matching the preview
- Switching dimensions reflows the preview correctly
- Works on mobile (panels stack/tab)

**Prompt for AI**
> Execute Phase 4 from IMPLEMENTATION_PLAN.md. Build the home page with input + template grid, and the editor page with three-panel layout (metadata / preview / customizations). Use Zustand for state, html-to-image for download. Make the customizations panel render dynamically from the template's `customizations` schema. Mobile-responsive.

---

# Phase 5 — Auth (Resend Magic Links + Google)

**Goal:** Users can sign in. No paid features yet — just identity.

**Deliverables**

- Auth.js v5 configured in `apps/web/auth.ts`
- Providers: Google OAuth + Resend email magic link
- Prisma adapter wired to `@repo/db`
- Resend email templates in `@repo/email` (sign-in link, welcome)
- `/login` page with both options
- Session available throughout app via `auth()` and `useSession()`
- Header shows user avatar + dropdown when logged in
- Protected route: `/dashboard` (placeholder page, just "Hello {name}")
- Sign out works

**Env vars added**
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- `AUTH_RESEND_KEY`, `EMAIL_FROM`
- `DATABASE_URL`

**Acceptance criteria**
- Magic link email arrives and signs user in
- Google OAuth works
- Sessions persist across reloads
- `/dashboard` redirects to `/login` when signed out
- Sign out clears session

**Prompt for AI**
> Execute Phase 5 from IMPLEMENTATION_PLAN.md. Wire up Auth.js v5 with Resend magic links and Google OAuth, using the Prisma adapter. Add a /login page, /dashboard placeholder, and header with user dropdown. Test both auth flows end-to-end.

---

# Phase 6 — Storage, Presets & Generation History

**Goal:** Logged-in users can save customized template configurations and view their generation history.

**Deliverables**

In `packages/storage`:
- Unified interface: `upload(buffer, options) → {url, publicId}`, `delete(publicId)`
- Cloudinary adapter (primary). R2 adapter as fallback if Cloudinary signup is friction.
- Used for user avatars (if uploaded), custom background images in templates, and saved generated PNGs

Prisma — flesh out previously placeholder models:
- `Preset { id, userId, name, templateId, metadata Json, customizations Json, dimensions Json, createdAt, updatedAt }`
- `Generation { id, userId?, templateId, imageUrl, imagePublicId, metadata Json, customizations Json, createdAt }`
- Run migration

Editor additions:
- "Save Preset" → modal asks for name → POST to `/api/presets`
- "Load Preset" → dropdown in editor pulls user's presets and applies them
- On download (when logged in), also upload to storage + create `Generation` record

Dashboard:
- `/dashboard/presets` — grid of saved presets with thumbnails (rendered live with their BrowserComponent at small size); click to open in editor
- `/dashboard/history` — recent generations with download links
- Delete actions on both

API routes:
- `GET/POST /api/presets`, `DELETE /api/presets/[id]`
- `GET /api/generations`, `DELETE /api/generations/[id]`
- All scoped to authenticated user

**Acceptance criteria**
- Logged-in user can save a preset and reload it later (state restored exactly)
- Download while logged in creates a Generation record visible in /dashboard/history
- Deleting a preset removes it from DB and storage (for any associated uploads)
- Anonymous users see "Sign in to save" CTA instead of preset features

**Prompt for AI**
> Execute Phase 6 from IMPLEMENTATION_PLAN.md. Build the `@repo/storage` package with Cloudinary, add Preset and Generation Prisma models, wire up save/load preset in the editor, persist generations on download, and build the /dashboard/presets and /dashboard/history pages.

---

# Phase 7 — Template Library (10-12 templates)

**Goal:** Real product depth. Repeat the Phase 2 pattern for each.

**Deliverables**

Templates to build (one per category for variety):

| ID | Category | Vibe |
|---|---|---|
| `minimal-card` | minimal | (already done in Phase 2) |
| `bold-editorial` | bold | Large serif, full-bleed color |
| `dev-terminal` | dev | Monospace, dark, code block aesthetic |
| `dev-snippet` | dev | Inspired by Carbon/ray.so |
| `podcast-episode` | podcast | Cover art + episode title + host |
| `quote-card` | social | Big pull-quote, small attribution |
| `gradient-modern` | bold | Mesh gradient bg, sans-serif |
| `photo-overlay` | photo | Hero image + dark gradient + text |
| `magazine-spread` | editorial | Multi-column, asymmetric |
| `linkedin-pro` | social | Optimized 1200×627, professional |
| `twitter-punchy` | social | Optimized 1600×900, high contrast |
| `newsletter-classic` | minimal | Letter-style, refined |

For each:
- Both `browser.tsx` and `satori.tsx`
- Realistic `customizations` (4-8 options per template)
- Real `preview.png` (run the template once with defaults and screenshot/save)
- Register in registry

Template grid on home page:
- Filterable by category
- Search by name/tag
- Hover shows live preview animation (optional polish)

**Acceptance criteria**
- All 12 templates render in browser and via API
- Each has a unique visual identity (not just color variations of one layout)
- Preview PNGs match actual output
- Category filtering works

**Prompt for AI**
> Execute Phase 7 from IMPLEMENTATION_PLAN.md. Build templates from the list, one at a time. For each: create the folder, definition.ts, browser.tsx, satori.tsx, generate a preview.png, register it. After each template, verify it works in /editor/[templateId] and via /api/og before moving to the next. Focus on visual distinctiveness — these should not look like variations of the same design.

---

# Phase 8 — Public API + Rate Limiting + Keys

**Goal:** Developers can use the `/api/og` endpoint in production with proper limits.

**Deliverables**

- API key model: `ApiKey { id, userId, key (hashed), name, lastUsedAt, createdAt }`
- `/dashboard/api-keys` page: create / revoke / view keys (full key shown once on creation only)
- `/api/og` accepts `?apiKey=...` or `Authorization: Bearer ...` header
- Upstash Redis for rate limiting:
  - Anonymous: 10 req/hour per IP
  - Authenticated free: 100 req/day per user
  - Authenticated paid (Phase 9+): higher
- Public API docs page at `/docs/api` with examples
- Usage tracking: increment counter per API call, display in dashboard

**Env vars added**
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

**Acceptance criteria**
- API key generation/revocation works
- Rate limits enforced (test by spamming)
- Docs page has copy-pasteable curl + JS examples
- Usage counters update in real-time

**Prompt for AI**
> Execute Phase 8 from IMPLEMENTATION_PLAN.md. Add API key management (model, dashboard page, hashed storage), authenticate /api/og via key or session, enforce per-tier rate limits via Upstash Redis, build /docs/api page with examples.

---

# Phase 9 — Polish, Launch Prep

**Goal:** Ship-ready.

**Deliverables**
- Landing page with hero, template showcase, feature list, pricing (even if free for now), FAQ
- SEO: metadata, sitemap, robots.txt, OG images for the app itself (eat your own dog food)
- Error pages: 404, 500, custom error boundary
- Loading states everywhere (Suspense, skeletons)
- Analytics (Vercel Analytics + Posthog if you want events)
- Privacy policy + ToS pages
- `CONTRIBUTING.md` and template authoring guide (so others can PR templates)
- Performance audit: Lighthouse > 90 on all pages
- Accessibility audit: keyboard nav, ARIA labels, color contrast

**Optional / Phase 10+**
- Stripe billing for higher rate limits
- Team workspaces
- Webhooks (notify on generation)
- Figma plugin
- CLI tool (`npx fig generate ...`)

**Prompt for AI**
> Execute Phase 9 from IMPLEMENTATION_PLAN.md. Build landing page, error/loading states, SEO, analytics, legal pages, contributing guide. Run Lighthouse and a11y audits and fix issues until both are green.

---

# Appendix A — Conventions

**Commit style:** Conventional Commits (`feat:`, `fix:`, `chore:` ...) scoped by package (`feat(templates): add gradient-modern`)

**Branching:** `main` is always deployable. Feature branches per phase: `phase-N-description`. Tag releases at end of each phase: `v0.N.0`.

**Testing strategy:**
- Phase 1-3: type-level + manual
- Phase 4+: add Vitest for `@repo/metadata` and `@repo/templates` definitions
- Phase 6+: Playwright smoke test for editor + auth flow

**File naming:** kebab-case for files, PascalCase for components, camelCase for functions.

**Imports:** Always use workspace aliases (`@repo/templates`), never relative paths across packages.

---

# Appendix B — Env Vars Master List

```
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_RESEND_KEY=
EMAIL_FROM=

# Storage (choose one or both)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# OR
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=

# Rate limiting (Phase 8+)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# Appendix C — How to Resume After a Break

When picking this back up (yourself or with an AI):
1. Run `git log --oneline | head -20` to see where you left off
2. Check which phase's acceptance criteria are met
3. Re-read that phase + the next one
4. Start the next phase with its **Prompt for AI** as the first message

This doc + the repo state are sufficient context. No memory needed.
