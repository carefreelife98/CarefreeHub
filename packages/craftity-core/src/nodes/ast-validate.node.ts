// packages/craftity-core/src/nodes/ast-validate.node.ts

import { BaseNode } from "./base.node.js"
import { createLlmModel, type LlmModel } from "../llm/factory.js"
import { AST_VALIDATE_FIX_PROMPT } from "../prompts/system-prompts.js"
import type { NodeCompleteSummary, NodeEventEmitter, LlmConfig } from "@carefree-studio/shared"
import type { GeneratedFile, ValidationError, ValidationResult } from "@carefree-studio/shared"

export interface AstValidateInput {
  files: GeneratedFile[]
}

export interface AstValidateOutput {
  files: GeneratedFile[]
  validation: ValidationResult
}

export interface AstValidateDeps {
  validateFn: (files: GeneratedFile[]) => Promise<ValidationError[]>
}

export class AstValidateNode extends BaseNode<AstValidateInput, AstValidateOutput> {
  readonly nodeId = "ast-validate"

  private readonly model: LlmModel
  private readonly deps: AstValidateDeps
  private readonly maxAttempts = 3

  constructor(
    emitter: NodeEventEmitter,
    graphId: string,
    llmConfig: LlmConfig,
    deps: AstValidateDeps
  ) {
    super(emitter, graphId)
    this.model = createLlmModel(llmConfig)
    this.deps = deps
  }

  protected async process(input: AstValidateInput): Promise<AstValidateOutput> {
    let currentFiles = [...input.files]

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      const progressPct = Math.round((attempt / this.maxAttempts) * 80)
      this.emitProgress(
        `TypeScript 컴파일 검증 중 (시도 ${attempt}/${this.maxAttempts})`,
        progressPct
      )

      const errors = await this.deps.validateFn(currentFiles)

      if (errors.length === 0) {
        this.emitProgress("AST 검증 통과", 100)
        return {
          files: currentFiles,
          validation: {
            passed: true,
            errors: [],
            attempt,
          },
        }
      }

      // Last attempt — return with remaining errors
      if (attempt === this.maxAttempts) {
        return {
          files: currentFiles,
          validation: {
            passed: false,
            errors,
            attempt,
          },
        }
      }

      // Fix errors with LLM
      this.emitProgress(
        `${errors.length}개의 오류를 LLM으로 수정 중 (시도 ${attempt}/${this.maxAttempts})`,
        progressPct + 5
      )

      const errorFilePaths = [...new Set(errors.map((e) => e.file))]

      for (const filePath of errorFilePaths) {
        const fileErrors = errors.filter((e) => e.file === filePath)
        const targetFile = currentFiles.find((f) => f.path === filePath)

        if (!targetFile) continue

        // Build error messages string
        const errorMessages = fileErrors
          .map((e) => `[${e.file}:${e.line}:${e.column}] TS${e.code}: ${e.message}`)
          .join("\n")

        // Build context: all other files
        const otherFiles = currentFiles
          .filter((f) => f.path !== filePath)
          .map((f) => `// === ${f.path} ===\n${f.content}`)
          .join("\n\n")

        const userMessage = [
          `## File to Fix: ${targetFile.path}`,
          "",
          "### Current Source Code",
          "```typescript",
          targetFile.content,
          "```",
          "",
          "### TypeScript Compiler Errors",
          "```",
          errorMessages,
          "```",
          "",
          "### Other Project Files (for context)",
          "```typescript",
          otherFiles,
          "```",
        ].join("\n")

        const response = await this.model.invoke([
          { role: "system", content: AST_VALIDATE_FIX_PROMPT },
          { role: "user", content: userMessage },
        ])

        const rawContent =
          typeof response.content === "string"
            ? response.content
            : response.content
                .filter((c) => typeof c === "object" && "text" in c)
                .map((c) => (c as { text: string }).text)
                .join("")

        // Strip markdown code block wrappers
        const fixedContent = rawContent
          .replace(/^```(?:typescript|ts)?\n/m, "")
          .replace(/\n```\s*$/m, "")
          .trim()

        // Replace the file in currentFiles
        currentFiles = currentFiles.map((f) =>
          f.path === filePath ? { ...f, content: fixedContent } : f
        )
      }
    }

    // Fallback (should not reach here)
    return {
      files: currentFiles,
      validation: {
        passed: false,
        errors: await this.deps.validateFn(currentFiles),
        attempt: this.maxAttempts,
      },
    }
  }

  protected buildSummary(result: AstValidateOutput): NodeCompleteSummary {
    return {
      kind: "ast-validate",
      passed: result.validation.passed,
      attempt: result.validation.attempt,
      errorCount: result.validation.errors.length,
    }
  }
}
