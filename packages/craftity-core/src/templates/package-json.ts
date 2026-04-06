// packages/craftity-core/src/templates/package-json.ts

/**
 * Generates a package.json string for a new Phaser 3 game project.
 *
 * @param gameTitle - Human-readable game title used as the package name slug.
 * @returns A formatted JSON string ready to be written to disk.
 */
export function generatePackageJson(gameTitle: string): string {
  const slug = gameTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const pkg = {
    name: slug,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview",
      "type-check": "tsc --noEmit",
    },
    dependencies: {
      phaser: "^3.87.0",
    },
    devDependencies: {
      vite: "^6.0.0",
      typescript: "^5.7.0",
    },
  };

  return JSON.stringify(pkg, null, 2);
}
