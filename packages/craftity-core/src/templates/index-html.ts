// packages/craftity-core/src/templates/index-html.ts

/**
 * Generates an index.html string for a Phaser 3 game project.
 *
 * Features:
 * - Black background to match typical game aesthetics.
 * - Centered canvas via CSS flexbox.
 * - Module script tag pointing to /src/main.ts (Vite resolves this).
 *
 * @param gameTitle - The title shown in the browser tab.
 * @returns The full HTML document as a string.
 */
export function generateIndexHtml(gameTitle: string): string {
  const escapedTitle = gameTitle
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapedTitle}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        background-color: #000000;
        overflow: hidden;
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      canvas {
        display: block;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }
    </style>
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;
}
