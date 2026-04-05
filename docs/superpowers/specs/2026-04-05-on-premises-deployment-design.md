# On-Premises Deployment Design: Carefree Studio

> Date: 2026-04-05

## Overview

Carefree Studio(studio-web + studio-api)를 M1 Pro 맥북 온프레미스 + Vercel로 배포하는 설계.

## Architecture

```
[Browser] ── carefreelab.cloud ──> [Vercel] studio-web (Next.js 16)
    │
    └── api.carefreelab.cloud ──> [Cloudflare Tunnel] ──> [M1 Pro MacBook]
                                                            ├── studio-api (Docker, :3001)
                                                            └── PostgreSQL 17 (Docker, :5432)
```

## Components

| Component | Technology | Location | Cost |
|-----------|-----------|----------|------|
| studio-web | Next.js 16 | Vercel Hobby | $0 |
| studio-api | NestJS 11, Docker | M1 Pro MacBook | 전기세 ~3,000원/월 |
| PostgreSQL | PostgreSQL 17 Alpine, Docker | M1 Pro MacBook | 포함 |
| Tunnel | Cloudflare Tunnel (cloudflared) | M1 Pro MacBook | $0 |
| DNS | Cloudflare (NS 위임 from 가비아) | Cloudflare | $0 |

## DNS Configuration

| Record | Type | Value | Managed By |
|--------|------|-------|------------|
| `carefreelab.cloud` | CNAME | `cname.vercel-dns.com` | Cloudflare |
| `api.carefreelab.cloud` | CNAME | `<tunnel-uuid>.cfargotunnel.com` | cloudflared (자동) |

### Why Cloudflare NS delegation?

가비아에서 직접 DNS 관리하면 Cloudflare Tunnel의 자동 CNAME 생성이 불가능. 가비아 네임서버를 Cloudflare로 위임하면:
- Cloudflare Tunnel DNS 라우팅 자동화
- Cloudflare CDN/보안 기능 무료 사용
- SSL 인증서 자동 발급

## Docker Compose

두 개의 서비스로 구성:

### postgres
- Image: `postgres:17-alpine`
- Port: 5432
- Volume: `pgdata` (영구 저장)
- Healthcheck: `pg_isready`

### studio-api
- Multi-stage Dockerfile (build → production)
- Port: 3001
- depends_on: postgres (healthy)
- Environment: DATABASE_URL, OPENAI_API_KEY, ANTHROPIC_API_KEY, ALLOWED_ORIGINS

## Cloudflare Tunnel Configuration

```yaml
# ~/.cloudflared/config.yml
tunnel: <uuid>
credentials-file: /Users/<user>/.cloudflared/<uuid>.json

ingress:
  - hostname: api.carefreelab.cloud
    service: http://localhost:3001
    originRequest:
      disableChunkedEncoding: false
  - service: http_status:404
```

Background service via `brew services start cloudflared`.

## SSE Streaming Requirements

Cloudflare Tunnel을 통한 SSE 스트리밍을 위해:

1. **Cloudflare 압축 비활성화** — Brotli/Gzip이 SSE 응답을 버퍼링. Cloudflare Dashboard > Speed > Optimization에서 비활성화
2. **응답 헤더 필수** — studio-api SSE 응답에:
   - `Content-Type: text/event-stream`
   - `Cache-Control: no-cache`
   - `X-Accel-Buffering: no`
   - `Connection: keep-alive`
3. **Keepalive ping** — Cloudflare 100초 idle timeout 방지. studio-api에 이미 15초 heartbeat 구현됨
4. **Named tunnel 사용** — Quick tunnel은 SSE를 버퍼링하므로 반드시 named tunnel 사용

## MacBook Always-On Configuration

1. **잠자기 방지**: `caffeinate -s` 또는 Amphetamine 앱
2. **디스플레이 끄기**: 시스템 설정 > 에너지 > 1분
3. **정전 후 자동 재시작**: 시스템 설정 > 에너지 > 활성화
4. **Docker Desktop 자동 시작**: 시스템 설정 > 로그인 항목 > Docker Desktop 추가
5. **Docker Compose restart policy**: `unless-stopped` (Docker 재시작 시 자동 복구)

## Vercel Deployment

- Project: studio-web
- Root Directory: `apps/studio-web`
- Framework: Next.js
- Environment variable: `API_URL=https://api.carefreelab.cloud`
- Build command: (Vercel auto-detect)
- Node.js: 22.x

## CORS Configuration

studio-api `ALLOWED_ORIGINS` 환경변수:
```
https://carefreelab.cloud,https://www.carefreelab.cloud,http://localhost:4000
```

## Deployment Steps

1. **맥북에서 CarefreeHub clone**
2. **`.env.docker` 설정** — API 키 입력
3. **`docker compose --env-file .env.docker up -d --build`**
4. **DB 마이그레이션** — `drizzle-kit push`
5. **가비아 NS를 Cloudflare로 위임**
6. **Cloudflare Tunnel 생성 및 DNS 라우팅**
7. **cloudflared 백그라운드 서비스 등록**
8. **맥북 상시 가동 설정**
9. **Vercel에 studio-web 배포**
10. **Cloudflare 압축 비활성화**
11. **E2E 검증** — gentity 분석 + buildity PRD 생성 + SSE 스트리밍

## Error Recovery

| 장애 | 복구 |
|------|------|
| 맥북 재시작 | Docker `unless-stopped` → 자동 복구, cloudflared `brew services` → 자동 재시작 |
| Docker crash | `restart: unless-stopped` 정책으로 자동 재시작 |
| DB 데이터 손실 | `pgdata` Docker volume은 Docker 삭제해도 보존. 추가로 주기적 pg_dump 권장 |
| Cloudflare Tunnel 끊김 | cloudflared launchd 서비스가 자동 재연결 |
| 인터넷 끊김 | 복구 후 cloudflared 자동 재연결 |

## Success Criteria

- `https://carefreelab.cloud` 에서 studio-web 정상 로드
- `https://api.carefreelab.cloud/api/gentity/analyze` POST 요청 정상 응답
- gentity 분석 SSE 스트리밍 end-to-end 동작
- buildity PRD 생성 SSE 스트리밍 동작
- 맥북 재시작 후 자동 복구 확인
