"use client"

import { useState, useRef, useCallback } from "react"
import type { GeneratedFile } from "@carefree-studio/shared"

export type WebContainerStatus =
  | "idle"
  | "booting"
  | "installing"
  | "running"
  | "ready"
  | "error"

interface WebContainerState {
  status: WebContainerStatus
  url: string | null
  error: string | null
}

export function useWebContainer() {
  const [state, setState] = useState<WebContainerState>({
    status: "idle",
    url: null,
    error: null,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>(null)

  const mountAndRun = useCallback(async (files: GeneratedFile[]) => {
    setState({ status: "booting", url: null, error: null })

    try {
      const { WebContainer } = await import("@webcontainer/api")

      if (containerRef.current) {
        containerRef.current.teardown()
        containerRef.current = null
      }

      const container = await WebContainer.boot()
      containerRef.current = container

      // Convert GeneratedFile[] to WebContainer file tree
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileTree: Record<string, any> = {}

      for (const file of files) {
        const parts = file.path.replace(/^\//, "").split("/")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: Record<string, any> = fileTree

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i]
          if (!current[part]) {
            current[part] = { directory: {} }
          }
          current = current[part].directory as Record<string, unknown>
        }

        const fileName = parts[parts.length - 1]
        current[fileName] = {
          file: {
            contents: file.content,
          },
        }
      }

      await container.mount(fileTree)

      setState((prev) => ({ ...prev, status: "installing" }))

      const installProcess = await container.spawn("npm", ["install"])
      const installExit = await installProcess.exit
      if (installExit !== 0) {
        throw new Error(`npm install failed with exit code ${installExit}`)
      }

      setState((prev) => ({ ...prev, status: "running" }))

      await container.spawn("npx", ["vite", "--host"])

      container.on("server-ready", (_port: number, url: string) => {
        setState({ status: "ready", url, error: null })
      })
    } catch (err) {
      setState({
        status: "error",
        url: null,
        error: err instanceof Error ? err.message : "WebContainer 오류가 발생했습니다",
      })
    }
  }, [])

  const teardown = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.teardown()
      containerRef.current = null
    }
    setState({ status: "idle", url: null, error: null })
  }, [])

  return { state, mountAndRun, teardown }
}
