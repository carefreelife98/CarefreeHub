// packages/gentity-core/src/prompts/markdown-guide.ts

/**
 * 모든 LLM 프롬프트에서 마크다운 출력이 필요할 때 시스템 프롬프트에 포함하는 공통 가이드.
 * Streamdown 렌더러와 호환되는 깔끔한 마크다운을 생성하도록 유도한다.
 */
export const MARKDOWN_GUIDE = `
IMPORTANT — Markdown Writing Rules:
- Write in Korean.
- Use ## headings for sections, ### for subsections.
- Use **bold** for key terms, numbers, and important conclusions.
- Use bullet points (- ) for lists. Nest with indentation (  - ).
- Use numbered lists (1. 2. 3.) for sequential steps or rankings.
- Use > blockquotes for key insights or callouts.
- Use tables (| col1 | col2 |) when comparing items or showing structured data.
- Keep paragraphs short (2-3 sentences max).
- Add blank lines between sections for readability.
- Do NOT use emoji in headings or body text.
`

/**
 * Mermaid 다이어그램이 포함될 때 추가로 포함하는 가이드.
 */
export const MERMAID_GUIDE = `
Mermaid Diagram Rules:
- Do NOT use emoji in node labels (they cause parsing errors).
- Always quote labels with square brackets: A[label text].
- Use --> for arrows, NOT "-- >" (no space before >).
- For labeled arrows use |label| syntax: A -->|Yes| B.
- Keep labels short and simple, avoid special characters.
- Use \\n for line breaks inside labels.
`
