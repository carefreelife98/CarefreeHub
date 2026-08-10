import path from "node:path"
import type { NextConfig } from "next"

// velite 빌드는 next 실행 전에 수행된다 (package.json 참고)
// - dev: `velite && concurrently "velite dev" "next dev"` — Turbopack은 webpack 플러그인을 실행하지 않으므로 watch를 별도 프로세스로 구동
// - build: `velite && next build`
const nextConfig: NextConfig = {
  reactCompiler: true, // 리액트 컴파일러 1.0 적용
  turbopack: {
    root: path.resolve(process.cwd(), "../.."), // 모노레포 루트 (외부 락파일 오인 방지)
  },
}

export default nextConfig
