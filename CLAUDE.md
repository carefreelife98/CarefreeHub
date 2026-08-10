# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarefreeHub is a personal tech blog and portfolio platform (Korean-language) built as a Turbo monorepo with a single app:

- **apps/web**: Next.js 16 + React 19 + Tailwind CSS 4, MDX content via velite

> Note: The discontinued "Carefree Studio" project (studio-web, studio-api, gentity packages) is preserved in the `archive/studio` branch and no longer lives on `main`.

## Commands

```bash
# Development (repo root)
pnpm dev          # turbo run dev (Next.js dev server on port 4000)

# Build / Lint (repo root)
pnpm build        # velite && next build
pnpm lint         # ESLint
pnpm format       # Prettier write

# From apps/web
pnpm dev          # velite dev + next dev -p 4000 (concurrently)
pnpm build        # velite && next build
pnpm lint         # eslint
```

## Architecture

```
CarefreeHub/
├── apps/web/                   # Next.js 16 frontend (the blog)
│   ├── app/                    # App Router pages
│   │   ├── (blog)/             # Blog pages (sidebar + header layout)
│   │   │   ├── posts/          # List, detail, category, tag, pagination
│   │   │   ├── recap/          # Fullscreen yearly recap slides
│   │   │   └── about/          # About (placeholder)
│   │   ├── portfolio/          # Portfolio pages (no blog chrome)
│   │   └── api/search-index/   # Static lightweight search index (JSON)
│   ├── content/posts/          # MDX post sources (velite input)
│   ├── .velite/                # Generated content data (gitignored)
│   └── src/                    # FSD-style layers
│       ├── features/           # analytics, portfolio, post, recap, search, sidebar
│       ├── widgets/            # header, main-section
│       └── shared/             # config, hooks, icons, lib, ui (shadcn/ui)
```

### Content pipeline (velite)

- Posts live in `apps/web/content/posts/**/*.mdx`; velite compiles them into `.velite/`.
- Turbopack does not run webpack plugins, so the dev script runs `velite dev` (watch) alongside `next dev` via concurrently. Production builds run `velite && next build`.
- Slug = last path segment of the file; duplicate slugs fail the build (checked in `velite.config.ts` prepare hook).
- Import content via `#site/content`.

## Development Rules

### UI Components

- **shadcn/ui 우선 사용**: 새 컴포넌트 구현 시 https://ui.shadcn.com/ 컴포넌트 우선 활용
- **설치되지 않은 shadcn/ui 컴포넌트는 설치 허용**: `npx shadcn@latest add [component]`
- **커스텀 컴포넌트**: shadcn/ui에 없는 경우에만 직접 구현
- **Radix UI 직접 사용**: shadcn/ui wrapper가 불필요한 경우 Radix 직접 사용 가능

### FSD layering (apps/web/src)

- `shared` → `features` → `widgets` → `app` 방향으로만 import (역방향 금지)
- 각 레이어/피처는 `index.ts` 배럴을 통해서만 외부 노출

## Key Patterns

### Styling

- **Tailwind CSS 4** with PostCSS (not tailwind.config.js)
- **cn() utility** for conditional classes: `cn("base-class", condition && "conditional-class")`
- **CSS variables** for theming (oklch color space in globals.css)
- **Dark mode**: class-based via next-themes (`ThemeProvider` in root layout, `ThemeToggle` in BlogHeader)
- **CVA (class-variance-authority)** for component variants

### Components

- **"use client"** directive required for interactive components
- **Import aliases**: `@/` → app root, `@shared/*`, `@features/*`, `@widgets/*` → `src/*` layers, `#site/content` → velite output
- Post list cards must use real `<Link>` elements (SEO/a11y) — never div+onClick navigation
- Tag URLs must be `encodeURIComponent(tag.toLowerCase())` (tags can contain `#`, spaces, Korean)

### Analytics (GA4)

- `GoogleAnalyticsProvider` in root layout handles page views
- `PostAnalytics` on post detail pages tracks scroll depth + external link clicks
- Event helpers in `@features/analytics` (trackPostClick, trackSearch, trackTocClick, ...)
- Env vars: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GA_DEBUG_MODE` (declared in turbo.json build env)

### Layout

- SidebarProvider wraps the blog with collapsible sidebar; recap/portfolio escape it (fullscreen / own layout)
- Responsive breakpoint at 768px (useIsMobile hook)

## Tech Stack Details

| Layer              | Technology             | Version |
| ------------------ | ---------------------- | ------- |
| Frontend Framework | Next.js                | 16.0.7  |
| React              | React + React Compiler | 19.2.0  |
| Styling            | Tailwind CSS           | 4.x     |
| UI Primitives      | Radix UI               | Latest  |
| Content            | velite (MDX)           | 0.3.x   |
| Animation          | Motion (Framer)        | 12.x    |
| Icons              | Lucide React           | 0.552.0 |
| Theming            | next-themes            | 0.4.x   |
| Package Manager    | pnpm                   | 10.15.1 |
| Monorepo           | Turbo                  | 2.3.0   |

## Configuration Notes

- **React Compiler** is enabled in next.config.ts
- **TypeScript strict mode** is enabled
- **Path alias**: `@/*` → `./*` in apps/web
- **Dev server port**: 4000
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) runs lint + build on push/PR
