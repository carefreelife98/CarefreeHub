#!/usr/bin/env node
/**
 * Obsidian 노트 → 블로그 포스트 임포트
 *
 * 사용:
 *   node scripts/import-obsidian.mjs <노트경로.md> --slug my-post \
 *     [--dir flow-ai] [--series flow-mcp --order 1] [--category tech] [--tags "MCP,LangGraph"]
 *
 * 하는 일:
 *   1. frontmatter를 블로그 스키마로 매핑 (published: false로 초기화)
 *   2. [[위키링크]] → 일반 텍스트, 이력서/related 링크 제거
 *   3. ![[이미지]] → 볼트에서 파일을 찾아 public/static/imported/<slug>/로 복사 후 경로 재작성
 *   4. 결과물을 content/posts/<dir>/<slug>.mdx로 저장
 *   5. 민감정보 린터(check-sensitive.mjs)를 해당 파일에 실행 — 걸리면 경고와 함께 종료 코드 1
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs"
import { join, basename, dirname } from "node:path"
import { execFileSync } from "node:child_process"

const ROOT = new URL("..", import.meta.url).pathname
const DEFAULT_VAULT = join(process.env.HOME ?? "", "Desktop/Obsidian/Carefreelife")

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      args[argv[i].slice(2)] = argv[i + 1]
      i++
    } else {
      args._.push(argv[i])
    }
  }
  return args
}

const args = parseArgs(process.argv.slice(2))
const sourcePath = args._[0]
const slug = args.slug

if (!sourcePath || !slug) {
  console.error("사용법: node scripts/import-obsidian.mjs <노트.md> --slug <slug> [--dir <하위폴더>] [--series <slug> --order <n>] [--category <cat>] [--tags a,b]")
  process.exit(1)
}

const vault = args.vault ?? DEFAULT_VAULT
const raw = readFileSync(sourcePath, "utf8")

// --- frontmatter 분리 ---
let srcFm = {}
let body = raw
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/)
if (fmMatch) {
  body = raw.slice(fmMatch[0].length)
  for (const line of fmMatch[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/)
    if (kv) srcFm[kv[1]] = kv[2].replace(/^["']|["']$/g, "")
  }
}

// --- 제목: frontmatter title → 첫 h1 → 파일명 ---
let title = srcFm.title
if (!title) {
  const h1 = body.match(/^#\s+(.+)$/m)
  if (h1) {
    title = h1[1].trim()
    body = body.replace(h1[0] + "\n", "")
  } else {
    title = basename(sourcePath, ".md")
  }
}

// --- 본문 변환 ---
// 이력서·related 계열 라인 제거
body = body
  .split("\n")
  .filter((line) => !/마스터 이력서|이력서 bullet|^related:/i.test(line))
  .join("\n")

// 이미지 임베드: ![[file.png]] → 자산 복사 + 마크다운 이미지
const vaultIndex = new Map()
function indexVault(dir) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.startsWith(".")) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) indexVault(full)
    else vaultIndex.set(entry, full)
  }
}
indexVault(vault)

const assetDir = join(ROOT, "public/static/imported", slug)
body = body.replace(/!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g, (_, file) => {
  const found = vaultIndex.get(file.trim())
  if (!found) {
    console.warn(`⚠ 이미지 못 찾음: ${file} — 수동 처리 필요`)
    return `<!-- TODO: 이미지 누락 ${file} -->`
  }
  mkdirSync(assetDir, { recursive: true })
  copyFileSync(found, join(assetDir, basename(found)))
  return `![${basename(found)}](/static/imported/${slug}/${basename(found)})`
})

// 일반 위키링크: [[target|alias]] → alias, [[target]] → target
body = body.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1")

// --- 블로그 frontmatter 조립 ---
const today = new Date().toISOString().slice(0, 10)
const fm = [
  "---",
  `title: ${JSON.stringify(title)}`,
  srcFm.description ? `description: ${JSON.stringify(srcFm.description)}` : null,
  `date: ${args.date ?? today}`,
  `published: false`, // 검토 후 수동으로 발행
  args.category ? `categories: [${args.category}]` : `categories: []`,
  `tags: [${(args.tags ?? srcFm.tags ?? "").split(",").filter(Boolean).map((t) => JSON.stringify(t.trim())).join(", ")}]`,
  args.series ? `series: ${args.series}` : null,
  args.order ? `seriesOrder: ${Number(args.order)}` : null,
  "---",
].filter(Boolean)

const outDir = join(ROOT, "content/posts", args.dir ?? "")
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, `${slug}.mdx`)
writeFileSync(outPath, fm.join("\n") + "\n\n" + body.trim() + "\n")
console.log(`✓ 생성: ${outPath} (published: false)`)

// --- 민감정보 검사 ---
try {
  execFileSync("node", [join(dirname(new URL(import.meta.url).pathname), "check-sensitive.mjs"), outPath], {
    stdio: "inherit",
  })
} catch {
  console.error("\n⚠ 민감정보가 검출됐습니다. 위 항목을 치환/제거하기 전까지 발행하지 마세요.")
  process.exit(1)
}
