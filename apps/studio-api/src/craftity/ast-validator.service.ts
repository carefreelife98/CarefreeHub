import { Injectable, OnModuleInit, Logger } from "@nestjs/common"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { execSync } from "child_process"
import * as ts from "typescript"
import type { GeneratedFile, ValidationError } from "@carefree-studio/shared"

@Injectable()
export class AstValidatorService implements OnModuleInit {
  private readonly logger = new Logger(AstValidatorService.name)
  private phaserTypesDir: string | null = null

  async onModuleInit(): Promise<void> {
    try {
      await this.ensurePhaserTypes()
      this.logger.log("Phaser type definitions cached successfully")
    } catch (error) {
      this.logger.warn(
        `Failed to pre-cache Phaser types: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  private async ensurePhaserTypes(): Promise<string> {
    if (this.phaserTypesDir) {
      return this.phaserTypesDir
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "phaser-types-"))
    this.logger.log(`Installing Phaser types in ${tmpDir}`)

    try {
      execSync("npm install phaser --ignore-scripts --prefer-offline 2>/dev/null || npm install phaser --ignore-scripts", {
        cwd: tmpDir,
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 120000,
      })

      const phaserTypesPath = path.join(tmpDir, "node_modules", "phaser")
      if (!fs.existsSync(phaserTypesPath)) {
        throw new Error("Phaser package not found after install")
      }

      this.phaserTypesDir = tmpDir
      return tmpDir
    } catch (error) {
      // Clean up on failure
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true })
      } catch {}
      throw error
    }
  }

  async validate(files: GeneratedFile[]): Promise<ValidationError[]> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "craftity-validate-"))

    try {
      // Write all files to disk
      for (const file of files) {
        const filePath = path.join(tmpDir, file.path)
        const fileDir = path.dirname(filePath)
        fs.mkdirSync(fileDir, { recursive: true })
        fs.writeFileSync(filePath, file.content, "utf8")
      }

      // Ensure phaser types are available
      let nodeModulesPath: string | null = null
      try {
        const phaserTypesDir = await this.ensurePhaserTypes()
        nodeModulesPath = path.join(phaserTypesDir, "node_modules")

        // Symlink node_modules from cached phaser types
        const targetNodeModules = path.join(tmpDir, "node_modules")
        if (!fs.existsSync(targetNodeModules)) {
          fs.symlinkSync(nodeModulesPath, targetNodeModules, "dir")
        }
      } catch (err) {
        this.logger.warn(`Could not link Phaser types: ${err instanceof Error ? err.message : String(err)}`)
      }

      // Write tsconfig.json
      const tsConfig = {
        compilerOptions: {
          target: "ES2020",
          module: "ES2020",
          moduleResolution: "bundler",
          strict: false,
          noEmit: true,
          allowJs: true,
          esModuleInterop: true,
          skipLibCheck: true,
          ...(nodeModulesPath
            ? {
                typeRoots: [path.join(tmpDir, "node_modules", "@types")],
                paths: {
                  phaser: [path.join(tmpDir, "node_modules", "phaser", "types", "phaser.d.ts")],
                },
              }
            : {}),
        },
        include: ["./**/*.ts"],
        exclude: ["node_modules"],
      }

      const tsconfigPath = path.join(tmpDir, "tsconfig.json")
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2), "utf8")

      // Use TypeScript compiler API
      const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
      const parsedConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        tmpDir
      )

      const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options)
      const allDiagnostics = ts.getPreEmitDiagnostics(program)

      const errors: ValidationError[] = []

      allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file && diagnostic.start !== undefined) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
          const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")

          // Make the file path relative to tmpDir
          const absoluteFilePath = diagnostic.file.fileName
          const relativeFilePath = absoluteFilePath.startsWith(tmpDir)
            ? absoluteFilePath.slice(tmpDir.length).replace(/^[\\/]/, "")
            : absoluteFilePath

          errors.push({
            file: relativeFilePath,
            line: line + 1,
            column: character + 1,
            message,
            code: diagnostic.code,
          })
        }
      })

      return errors
    } finally {
      // Clean up temp directory
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true })
      } catch (cleanupError) {
        this.logger.warn(
          `Failed to clean up temp dir ${tmpDir}: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`
        )
      }
    }
  }
}
