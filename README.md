# CarefreeHub

개인 기술 블로그 & 포트폴리오 — [carefreelab.cloud](https://www.carefreelab.cloud)

## 구성

Turbo 모노레포이며, 현재는 블로그 앱 하나로 구성되어 있습니다.

| 경로       | 설명                                                              |
| ---------- | ----------------------------------------------------------------- |
| `apps/web` | Next.js 16 블로그 (React 19 + Tailwind CSS 4 + velite MDX 파이프라인) |

> 중단된 Carefree Studio 프로젝트(studio-web/studio-api/packages)는 `archive/studio` 브랜치에 보존되어 있습니다.

## 시작하기

```bash
# 요구사항: Node.js 20+, pnpm 10
pnpm install

# 개발 서버 (http://localhost:4000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 린트 / 포맷
pnpm lint
pnpm format
```

## 포스트 작성

`apps/web/content/posts/` 아래에 `.mdx` 파일을 추가하면 velite가 빌드합니다.

```yaml
---
title: 제목
description: 설명 (선택)
date: 2026-01-01
categories: [spring] # 최하위 카테고리 slug (src/shared/config/categories.ts 참고)
tags: [Spring Boot, 회고]
published: true # false면 비공개
thumbnail: /static/... # 선택
---
```

- slug는 파일명(마지막 경로 세그먼트)으로 결정되며, 중복 시 빌드가 실패합니다.
- 개발 서버 실행 중에는 velite watch가 함께 돌아 `.mdx` 변경이 즉시 반영됩니다.

## 배포

Vercel (`apps/web/vercel.json`). `main` 브랜치 push 시 자동 배포되며, GitHub Actions CI가 lint/build를 검증합니다.
