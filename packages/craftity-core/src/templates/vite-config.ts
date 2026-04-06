// packages/craftity-core/src/templates/vite-config.ts

/**
 * Generates a vite.config.ts file content string for a Phaser 3 game project.
 *
 * Key settings:
 * - base: "./" — ensures assets resolve correctly when served from a subdirectory or file://.
 * - port: 3000 — default dev server port.
 *
 * @returns The vite.config.ts source code as a string.
 */
export function generateViteConfig(): string {
  return `import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
});
`;
}
