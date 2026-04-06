// packages/craftity-core/src/prompts/phaser-guide.ts

export const PHASER_PROJECT_STRUCTURE = `
## Fixed Phaser 3 Project Structure

All generated Phaser 3 projects MUST follow this exact directory structure:

\`\`\`
project-root/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts                     # Phaser.Game config entry point
    ├── config/
    │   └── constants.ts            # Game constants (WIDTH, HEIGHT, etc.)
    ├── scenes/
    │   ├── BootScene.ts            # Minimal boot/loading scene
    │   ├── MenuScene.ts            # Title/main menu scene
    │   └── GameScene.ts            # Primary gameplay scene
    ├── objects/                    # Reusable game object classes
    │   └── (domain-specific files) # e.g. Player.ts, Enemy.ts, Ball.ts
    └── types/
        └── index.ts                # Shared TypeScript interfaces and types
\`\`\`

### File Responsibilities

- **src/main.ts**: Instantiates \`Phaser.Game\` with config object. Registers all scenes. Sets canvas width/height from constants.
- **src/config/constants.ts**: Exports GAME_WIDTH, GAME_HEIGHT, and any gameplay constants (speeds, scores, etc.).
- **src/scenes/BootScene.ts**: Performs minimal setup, transitions immediately to MenuScene.
- **src/scenes/MenuScene.ts**: Shows game title and start instructions using geometric shapes and text only.
- **src/scenes/GameScene.ts**: Core gameplay loop. Uses physics, input, and custom game objects.
- **src/objects/**: Each file exports one class extending \`Phaser.GameObjects.Container\` or \`Phaser.Physics.Arcade.Sprite\`.
- **src/types/index.ts**: All shared interfaces and type aliases. No class implementations here.
`.trim();

export const PHASER_SCENE_LIFECYCLE = `
## Phaser 3 Scene Lifecycle

### Core Lifecycle Methods

\`\`\`typescript
class ExampleScene extends Phaser.Scene {
  // Called once to load assets — but NO external images allowed.
  preload(): void {
    // Only use programmatic asset creation (graphics, shapes, text).
    // DO NOT call this.load.image(), this.load.spritesheet(), etc.
  }

  // Called once after preload. Set up game objects, physics, input.
  create(): void {
    // Create geometric shapes, text, set up colliders, register input.
  }

  // Called every frame (~60fps). Handle movement, state updates.
  update(time: number, delta: number): void {
    // delta is milliseconds since last frame — use for frame-rate independent movement.
  }
}
\`\`\`

### No External Images Rule — Use Geometric Shapes Only

All visual elements MUST be created using Phaser's built-in drawing primitives:

\`\`\`typescript
// Rectangles (platforms, walls, UI panels)
const rect = this.add.rectangle(x, y, width, height, 0xff0000); // color as hex number

// Circles (balls, projectiles, coins)
const circle = this.add.circle(x, y, radius, 0x00ff00);

// Text (labels, scores, titles)
const label = this.add.text(x, y, 'Hello', {
  fontSize: '24px',
  color: '#ffffff',
  fontFamily: 'Arial',
});

// Graphics (custom polygons, lines)
const gfx = this.add.graphics();
gfx.fillStyle(0x0000ff, 1);
gfx.fillRect(0, 0, 100, 100);
gfx.strokeCircle(200, 200, 50);
\`\`\`

### Scene Transitions

\`\`\`typescript
// Start another scene (stops current)
this.scene.start('GameScene');

// Start another scene, passing data
this.scene.start('GameScene', { level: 1, score: 0 });

// Receive data in the target scene
init(data: { level: number; score: number }): void {
  this.level = data.level;
}

// Restart current scene
this.scene.restart();

// Launch a scene in parallel (overlay)
this.scene.launch('UIScene');

// Stop a parallel scene
this.scene.stop('UIScene');
\`\`\`

### Scene Registration in main.ts

\`\`\`typescript
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 300 }, debug: false },
  },
  scene: [BootScene, MenuScene, GameScene], // order matters — first is started first
};

new Phaser.Game(config);
\`\`\`
`.trim();

export const PHASER_BEST_PRACTICES = `
## Phaser 3 Best Practices

### Game Object Patterns

**Container (grouping child objects):**
\`\`\`typescript
class Player extends Phaser.GameObjects.Container {
  private body: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.body = scene.add.rectangle(0, 0, 32, 48, 0x4488ff);
    this.label = scene.add.text(0, -30, 'Player', { fontSize: '12px', color: '#fff' }).setOrigin(0.5);
    this.add([this.body, this.label]);
    scene.add.existing(this);
  }
}
\`\`\`

**Physics Sprite (arcade physics):**
\`\`\`typescript
class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ''); // empty texture key — use setDisplaySize for sizing
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // Draw shape separately and attach to this container
  }
}
\`\`\`

### Physics (Arcade Physics)

\`\`\`typescript
// Enable physics on a game object
scene.physics.add.existing(gameObject);

// Set velocity
(gameObject.body as Phaser.Physics.Arcade.Body).setVelocity(200, -300);
// or via sprite reference
sprite.setVelocityX(150);
sprite.setVelocityY(0);

// Bounce
sprite.setBounce(0.8); // 0 = no bounce, 1 = full bounce

// Collision with world bounds
sprite.setCollideWorldBounds(true);

// Static group (immovable platforms)
const platforms = scene.physics.add.staticGroup();
const platform = platforms.create(400, 500, '') as Phaser.Physics.Arcade.Sprite;
platform.setDisplaySize(200, 20).refreshBody();

// Collider between two objects/groups
scene.physics.add.collider(player, platforms);

// Overlap (no physics response — just callback)
scene.physics.add.overlap(player, coins, (obj1, obj2) => {
  (obj2 as Phaser.Physics.Arcade.Sprite).destroy();
});
\`\`\`

### Input Handling

\`\`\`typescript
// Cursor keys (arrow keys + shift + space)
const cursors = scene.input.keyboard!.createCursorKeys();

// In update():
if (cursors.left.isDown) {
  sprite.setVelocityX(-200);
} else if (cursors.right.isDown) {
  sprite.setVelocityX(200);
} else {
  sprite.setVelocityX(0);
}
if (cursors.up.isDown && sprite.body.blocked.down) {
  sprite.setVelocityY(-400);
}

// Custom key binding
const spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
if (Phaser.Input.Keyboard.JustDown(spaceKey)) { /* single press */ }

// Pointer / mouse input
scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
  console.log(pointer.x, pointer.y);
});

// Make an object interactive
gameObject.setInteractive();
gameObject.on('pointerdown', () => { /* clicked */ });
\`\`\`

### Timers

\`\`\`typescript
// Repeating timer (enemy spawn every 2 seconds)
this.time.addEvent({
  delay: 2000,
  callback: this.spawnEnemy,
  callbackScope: this,
  loop: true,
});

// One-shot delayed call
this.time.delayedCall(1500, () => {
  this.scene.start('MenuScene');
});

// Countdown timer stored for later use
const timerEvent = this.time.addEvent({
  delay: 30000,
  callback: this.onTimeUp,
  callbackScope: this,
});
// Query elapsed
const remaining = timerEvent.getRemainingSeconds();
\`\`\`

### Performance Tips

- Use \`setActive(false)\` + \`setVisible(false)\` instead of \`destroy()\` for pooled objects.
- Prefer \`Phaser.GameObjects.Group\` with \`createMultiple\` for object pools.
- Call \`refreshBody()\` after resizing a static physics body.
- Avoid creating new objects in \`update()\` — pre-allocate in \`create()\`.
- Use \`scene.physics.add.staticGroup()\` for non-moving platforms.
- Keep \`update()\` lean: delegate heavy logic to game object methods.
- Use \`delta\` for frame-rate independent movement: \`speed * (delta / 1000)\`.
`.trim();
