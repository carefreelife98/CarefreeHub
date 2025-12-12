# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarefreeHub is a personal tech blog and portfolio platform built as a Turbo monorepo with:

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4
- **Backend**: NestJS 11 (planned for comments, analytics, RAG chatbot)

## Commands

```bash
# Development (runs all apps)
pnpm dev

# Build all apps
pnpm build

# Lint
pnpm lint

# Web app only (from apps/web)
pnpm dev          # Next.js dev server
pnpm build        # Production build
pnpm lint         # ESLint

# Server only (from apps/server)
pnpm dev          # NestJS watch mode
pnpm build        # Compile
pnpm test         # Jest unit tests
pnpm test:e2e     # E2E tests
pnpm format       # Prettier
```

## Architecture

```
CarefreeHub/
├── apps/
│   ├── web/                    # Next.js 16 frontend
│   │   ├── app/                # App Router pages
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components (Radix + CVA)
│   │   │   └── common/         # App-specific components
│   │   │       ├── sidebar/    # Collapsible sidebar with animations
│   │   │       ├── header/     # Navigation, blog header
│   │   │       └── icons/      # Logo, custom icons
│   │   ├── config/             # Site metadata (site.ts)
│   │   ├── hooks/              # Custom hooks (use-mobile)
│   │   └── lib/                # Utilities (cn for class merging)
│   └── server/                 # NestJS 11 backend
│       └── src/                # Modules, controllers, services
└── packages/                   # Shared packages (empty)
```

## Development Rules

### UI Components

- **shadcn/ui 우선 사용**: 새 컴포넌트 구현 시 https://ui.shadcn.com/ 컴포넌트 우선 활용
- **설치되지 않은 shadcn/ui 컴포넌트는 설치 허용**: `npx shadcn@latest add [component]`
- **커스텀 컴포넌트**: shadcn/ui에 없는 경우에만 직접 구현
- **Radix UI 직접 사용**: shadcn/ui wrapper가 불필요한 경우 Radix 직접 사용 가능

## Key Patterns

### Styling

- **Tailwind CSS 4** with PostCSS (not tailwind.config.js)
- **cn() utility** for conditional classes: `cn("base-class", condition && "conditional-class")`
- **CSS variables** for theming (oklch color space in globals.css)
- **CVA (class-variance-authority)** for component variants

### Components

- **shadcn/ui style**: Radix primitives + Tailwind + CVA
- **"use client"** directive required for interactive components
- **Import alias**: `@/` maps to app root

### Animations

- Use `transform-gpu` for GPU acceleration
- Prefer `transition-[specific-props]` over `transition-all`
- Apple-style easing: `ease-[cubic-bezier(0.32,0.72,0,1)]`
- Grid-based height animations: `grid-rows-[1fr]` → `grid-rows-[0fr]`

### Layout

- SidebarProvider wraps the app with collapsible sidebar
- Responsive breakpoint at 768px (useIsMobile hook)

## Tech Stack Details

| Layer              | Technology             | Version |
| ------------------ | ---------------------- | ------- |
| Frontend Framework | Next.js                | 16.0.1  |
| React              | React + React Compiler | 19.2.0  |
| Styling            | Tailwind CSS           | 4.x     |
| UI Primitives      | Radix UI               | Latest  |
| Animation          | Motion (Framer)        | 12.x    |
| Icons              | Lucide React           | 0.552.0 |
| Backend            | NestJS                 | 11.0.1  |
| Testing            | Jest                   | 30.0.0  |
| Package Manager    | pnpm                   | 10.15.1 |
| Monorepo           | Turbo                  | 2.3.0   |

## Configuration Notes

- **React Compiler** is enabled in next.config.ts
- **TypeScript strict mode** is enabled
- **Path alias**: `@/*` → `./*` in each app
- **Server port**: 3001 (configurable via env)
