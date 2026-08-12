#!/usr/bin/env node
/**
 * 민감정보 린터 — content/ 아래 mdx에서 공개 금지 패턴을 검사한다.
 * 사용: node scripts/check-sensitive.mjs [파일경로...]
 *   인자 없으면 content/**\/*.mdx 전체 검사. 하나라도 걸리면 exit 1.
 *
 * Obsidian 작업 기록을 블로그로 옮길 때 고객사명·내부 시스템 실명·시크릿이
 * 실수로 발행되는 것을 막는 마지막 게이트. CI에서도 실행된다.
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const CONTENT_DIR = join(ROOT, "content")

// [패턴, 사유] — 패턴은 대소문자 구분 없이 검사
const RULES = [
  // 고객사·인명 (익명화 필수)
  [/모인랩|moinlab/i, "고객사 실명"],
  [/BGF\s?리테일/i, "고객사 실명"],
  [/웹케시/i, "고객사 실명"],
  [/(?<![가-힣])더갓/i, "고객사 실명"],
  [/고은별|eb_1oo7/i, "실사용자 개인정보"],
  [/BFLOW_\d/i, "고객사 식별자"],
  [/선우님/i, "사내 인명"],
  // 내부 시스템·레포 실명 (일반화 필요)
  [/\bflow-was\b/i, "내부 시스템 실명"],
  [/\bflow-matex/i, "내부 레포 실명"],
  [/madrascheck-dev/i, "사내 GitHub 조직명"],
  [/chaeseungmin\//i, "내부 브랜치명"],
  [/\bOpenGate\b/i, "내부 게이트웨이 실명"],
  [/Mate-X/i, "구 브랜드명 — 현 공식 명칭 'Flow AI' 사용"],
  // 내부 API·DB 식별자
  [/\bACT_[A-Z0-9_]{4,}/, "내부 전문 액션코드"],
  [/\bCOLABO2_[A-Z0-9_]+/, "내부 전문 액션코드"],
  [/\bFLOW_[A-Z]+_[CRUD]\d{3}\b/, "내부 전문 액션코드"],
  [/colabo_sendience|empl_infm|api_crtc_infm/i, "내부 DB 테이블명"],
  [/flowdbdec|expdbdec/i, "내부 DB 함수명"],
  [/CNTS_CRTC_KEY/i, "내부 인증 키 이름"],
  [/PTL_\d{2,}/, "내부 플랫폼 식별자"],
  // 내부 인프라
  [/flowtest\.info/i, "내부 테스트 호스트"],
  [/release\.flow\.team/i, "내부 registry 호스트"],
  [/\.workers\.dev/i, "내부 Worker 실 URL"],
  [/x-flow-api-key/i, "내부 인증 헤더명"],
  // 시크릿 이름·값 패턴
  [/client_secret\s*[:=]\s*["']?[0-9a-f-]{8,}/i, "시크릿 값 노출"],
  [/sk-(?:ant-)?[A-Za-z0-9_-]{16,}/, "API 키 패턴"],
  [/SHARED_JWT_SECRET|INTROSPECT_SECRET|FLOW_WIKI_SECRET|DRIVE_SERVICE_SECRET/i, "내부 시크릿 env 이름"],
  // 변환 누락 흔적
  [/\[\[[^\]]+\]\]/, "미변환 Obsidian 위키링크"],
  [/마스터 이력서/i, "이력서 연계 링크"],
  // 문체 규칙
  [/[—―]/, "em-dash 사용 금지 (AI 문체 흔적, 쉼표/마침표/콜론으로 대체)"],
]

function collectMdx(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) files.push(...collectMdx(full))
    else if (/\.mdx?$/.test(entry)) files.push(full)
  }
  return files
}

// 허용 목록: 본인이 검토 후 의도적으로 남긴 언급 (파일 상대경로 → 허용 사유 문자열 배열)
// 새 항목 추가 시 반드시 공개 가능 여부를 먼저 확인할 것
const ALLOWLIST = {
  // 2025 회고: 본인 검토 완료 전까지 임시 허용 — 고객사 도입 현황 문장 (공개 수위 재확인 권장)
  "content/posts/recap/2025/road_to_carefree_life_2025.mdx": ["고객사 실명"],
}

const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) : collectMdx(CONTENT_DIR)

let violations = 0
for (const file of targets) {
  const rel = relative(ROOT, file)
  const allowed = ALLOWLIST[rel] ?? []
  const lines = readFileSync(file, "utf8").split("\n")
  lines.forEach((line, i) => {
    for (const [pattern, reason] of RULES) {
      const match = line.match(pattern)
      if (match) {
        if (allowed.includes(reason)) continue
        violations++
        console.error(`✗ ${rel}:${i + 1} [${reason}] "${match[0].slice(0, 40)}"`)
      }
    }
  })
}

if (violations > 0) {
  console.error(`\n민감정보 ${violations}건 발견 — 발행 전 제거/치환이 필요합니다.`)
  process.exit(1)
} else {
  console.log(`✓ 민감정보 검사 통과 (${targets.length}개 파일)`)
}
