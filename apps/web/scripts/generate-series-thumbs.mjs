#!/usr/bin/env node
/**
 * 시리즈 썸네일 생성기 (1200x630 OG 규격, 시리즈별 색상/타이틀)
 * 사용: node scripts/generate-series-thumbs.mjs [mcp|sdk]  (인자 없으면 전체)
 */
import sharp from "sharp"
import { join } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const OUT_DIR = join(ROOT, "public/images/flow-ai")

const SERIES = {
  mcp: {
    title: "MCP",
    gradient: ["#136c86", "#2189a4"],
    circleDark: "#0a4c60",
    episodes: [
      { no: "07", subtitle: "EVAL GATE" },
      { no: "08", subtitle: "SCHEMA CONTRACT" },
      { no: "09", subtitle: "OPS & INCIDENTS" },
      { no: "10", subtitle: "LIVING SPEC" },
    ],
  },
  sdk: {
    title: "SDK",
    gradient: ["#3a4494", "#5b66c0"],
    circleDark: "#252c66",
    episodes: [
      { no: "01", subtitle: "WHY SDK" },
      { no: "02", subtitle: "CORRECTNESS" },
      { no: "03", subtitle: "WRONG PREMISE" },
      { no: "04", subtitle: "TRUST LEDGER" },
      { no: "05", subtitle: "SIX CLIENTS" },
      { no: "06", subtitle: "DX FIRST" },
      { no: "07", subtitle: "CONTRACT" },
      { no: "08", subtitle: "REGISTRY" },
      { no: "09", subtitle: "NOT 1.0 YET" },
    ],
  },
}

function gridLines() {
  const lines = []
  for (let x = 0; x <= 1200; x += 40) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>`)
  }
  for (let y = 0; y <= 630; y += 40) {
    lines.push(`<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>`)
  }
  return lines.join("\n")
}

function svgFor(series, { subtitle }) {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${series.gradient[0]}"/>
      <stop offset="100%" stop-color="${series.gradient[1]}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${gridLines()}
  <circle cx="1060" cy="90" r="250" fill="#ffffff" fill-opacity="0.07"/>
  <circle cx="150" cy="480" r="185" fill="${series.circleDark}" fill-opacity="0.35"/>

  <!-- node-graph motif -->
  <g stroke="#dcecf1" stroke-opacity="0.75" stroke-width="3">
    <line x1="948" y1="430" x2="988" y2="341"/>
    <line x1="948" y1="430" x2="851" y2="470"/>
    <line x1="948" y1="430" x2="1057" y2="481"/>
  </g>
  <circle cx="948" cy="430" r="15" fill="#eef6f8"/>
  <circle cx="988" cy="341" r="9" fill="#eef6f8"/>
  <circle cx="851" cy="470" r="9" fill="#eef6f8"/>
  <circle cx="1057" cy="481" r="9" fill="#eef6f8"/>

  <text x="95" y="292" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="150" font-weight="700" fill="#ffffff">${series.title}</text>
  <rect x="97" y="376" width="70" height="9" rx="4.5" fill="#ffffff"/>
  <text x="95" y="448" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="36" font-weight="500" letter-spacing="7" fill="#ffffff">${subtitle.replace(/&/g, "&amp;")}</text>
  <text x="95" y="560" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="23" font-weight="500" letter-spacing="5" fill="#ffffff" fill-opacity="0.55">FLOW AI DEV LOG</text>
</svg>`
}

const target = process.argv[2]
for (const [key, series] of Object.entries(SERIES)) {
  if (target && target !== key) continue
  for (const ep of series.episodes) {
    const out = join(OUT_DIR, `thumb-${key}-${ep.no}.png`)
    await sharp(Buffer.from(svgFor(series, ep))).png().toFile(out)
    console.log(`✓ ${out}`)
  }
}
