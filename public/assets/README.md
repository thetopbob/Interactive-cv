# Assets

This folder is empty on purpose — the game currently runs on a placeholder
grid + coloured rectangles so it's playable with zero external assets.

## Swapping in real art

1. Download a CC0 tileset, e.g.:
   - Kenney "Roguelike/RPG Pack" — https://kenney.nl/assets/roguelike-rpg-pack
   - Kenney "RPG Base" — https://kenney.nl/assets/rpg-base
2. Drop the spritesheet(s) in here, e.g. `public/assets/tileset.png`.
3. Build a map in [Tiled](https://www.mapeditor.org/) using that tileset,
   export it as JSON to `public/assets/map.json`.
4. In `src/scenes/WorldScene.js`:
   - Add a `preload()` method:
     ```js
     preload() {
       this.load.image('tiles', 'assets/tileset.png');
       this.load.tilemapTiledJSON('map', 'assets/map.json');
     }
     ```
   - Replace `drawGroundPlaceholder()` with:
     ```js
     const map = this.make.tilemap({ key: 'map' });
     const tileset = map.addTilesetImage('<tileset-name-in-tiled>', 'tiles');
     const ground = map.createLayer('Ground', tileset, 0, 0);
     const walls = map.createLayer('Walls', tileset, 0, 0);
     walls.setCollisionByProperty({ collides: true });
     this.physics.add.collider(this.player, walls);
     ```
   - Swap the `add.rectangle(...)` calls for `add.sprite(...)` using frames
     from a character spritesheet, and add an `anims` walk-cycle if you want
     directional animation.

Note: Kenney's 16x16 sheets export with a 1px gap between tiles in some
packs — if you see seams, check the tileset's margin/spacing settings when
adding it in Tiled.
