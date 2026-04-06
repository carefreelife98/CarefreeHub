// packages/craftity-core/src/templates/tsconfig-json.ts

/**
 * Generates a tsconfig.json string suitable for a Phaser 3 + Vite project.
 *
 * @returns A formatted JSON string ready to be written to disk.
 */
export function generateTsconfig(): string {
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      isolatedModules: true,
      outDir: "./dist",
      rootDir: "./src",
    },
    include: ["src"],
    exclude: ["node_modules", "dist"],
  };

  return JSON.stringify(tsconfig, null, 2);
}
