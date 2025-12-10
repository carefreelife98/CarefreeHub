import type { NextConfig } from "next"
import { build } from "velite"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true, // 리액트 컴파일러 1.0 적용
  turbopack: {}, // Turbopack 활성화 (Next.js 16 기본값)
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin())
    return config
  },
}

class VeliteWebpackPlugin {
  static started = false
  apply(compiler: any) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return
      VeliteWebpackPlugin.started = true
      const dev = compiler.options.mode === "development"
      await build({ watch: dev, clean: !dev })
    })
  }
}

export default nextConfig
