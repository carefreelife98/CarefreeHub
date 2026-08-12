#!/usr/bin/env node
/**
 * 스크린샷이 없는 포스트용 시리즈 컬러 썸네일 생성 (1200x630 PNG)
 * 사용: node scripts/generate-thumbnails.mjs
 * 출력: public/images/flow-ai/thumb-*.png
 */
import sharp from "sharp"
import { mkdirSync } from "node:fs"
import { join } from "node:path"

const OUT_DIR = new URL("../public/images/flow-ai", import.meta.url).pathname
mkdirSync(OUT_DIR, { recursive: true })

// [파일명, 큰 라벨, 작은 라벨, 시작색, 끝색]
const SPECS = [
  ["thumb-streaming-backend", "SSE", "ABORT + LIFECYCLE", "#4C1D95", "#7C3AED"],
  ["thumb-mcp-01", "MCP", "WHY MCP", "#155E75", "#0E7490"],
  ["thumb-mcp-02", "MCP", "4-DAY SPRINT", "#155E75", "#0891B2"],
  ["thumb-mcp-03", "MCP", "ARCHITECTURE ADR", "#164E63", "#0E7490"],
  ["thumb-mcp-04", "MCP", "TOOL CATALOG", "#155E75", "#06B6D4"],
  ["thumb-mcp-05", "MCP", "OAUTH 2.1 DESIGN", "#134E4A", "#0D9488"],
  ["thumb-mcp-06", "MCP", "OAUTH 2.1 BUILD", "#134E4A", "#14B8A6"],
]

function svg(big, small, c1, c2) {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1050" cy="90" r="180" fill="rgba(255,255,255,0.05)"/>
  <circle cx="130" cy="560" r="220" fill="rgba(0,0,0,0.12)"/>
  <!-- 노드-엣지 모티프 -->
  <g stroke="rgba(255,255,255,0.35)" stroke-width="3" fill="none">
    <path d="M 850 470 L 950 430 L 1060 480"/>
    <path d="M 950 430 L 990 340"/>
  </g>
  <g fill="rgba(255,255,255,0.85)">
    <circle cx="850" cy="470" r="10"/>
    <circle cx="950" cy="430" r="14"/>
    <circle cx="1060" cy="480" r="10"/>
    <circle cx="990" cy="340" r="8"/>
  </g>
  <text x="90" y="330" font-family="Helvetica, Arial, sans-serif" font-size="170" font-weight="700" fill="#FFFFFF" letter-spacing="4">${big}</text>
  <rect x="94" y="380" width="76" height="8" rx="4" fill="rgba(255,255,255,0.9)"/>
  <text x="92" y="450" font-family="Helvetica, Arial, sans-serif" font-size="42" font-weight="500" fill="rgba(255,255,255,0.85)" letter-spacing="6">${small}</text>
  <text x="92" y="560" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.55)" letter-spacing="2">FLOW AI DEV LOG</text>
</svg>`
}

for (const [name, big, small, c1, c2] of SPECS) {
  const out = join(OUT_DIR, `${name}.png`)
  await sharp(Buffer.from(svg(big, small, c1, c2))).png().toFile(out)
  console.log(`✓ ${out}`)
}
