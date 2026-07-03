import Phaser from "phaser";
import content from "../data/content.generated.json";
import DialogBox from "../ui/DialogBox.js";

const INTERACT_RANGE = 56;
const PLAYER_SPEED = 180;

// Flip to true once you've added public/assets/tileset.png + map.json
// (see public/assets/README.md). Leave false to keep running on the
// zero-asset placeholder grid.
const USE_TILEMAP = true;

// Must match the tileset name you gave it inside Tiled when you added the
// image (Tiled → Map → Add External Tileset), not the PNG filename.
const TILESET_NAME_IN_TILED = "tileset";

// Flip to true once you've added public/assets/characters.png (from
// Kenney's separate "Roguelike Characters" pack — the environment pack has
// no characters). Leave false to keep using placeholder rectangles.
const USE_CHARACTER_SPRITES = true;

// Frame index of the player within characters.png, counting left-to-right,
// top-to-bottom from 0. Open the sheet in an image viewer and count grid
// cells to find one you like, or use Tiled's tileset view which numbers
// them for you.
const PLAYER_FRAME = 487;

// Default frame used for any NPC that doesn't specify its own `sprite` in
// its markdown frontmatter (see content/*.md).
const DEFAULT_NPC_FRAME = 1;

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene");
  }

  preload() {
    // Only fires if you've dropped real files into public/assets — see
    // public/assets/README.md. Safe to leave unused while running on the
    // placeholder grid.
    if (USE_TILEMAP) {
      // Margin/spacing values come from the tilemap.txt included in the
      // Kenney download — some sheets have a 1px gap between tiles.
      this.load.spritesheet("tiles", "assets/tileset.png", {
        frameWidth: 16,
        frameHeight: 16,
        margin: 0,
        spacing: 0,
      });
      this.load.tilemapTiledJSON("map", "assets/map.json");
    }

    if (USE_CHARACTER_SPRITES) {
      // Adjust frameWidth/frameHeight/margin/spacing to match the
      // Roguelike Characters pack's own tilemap.txt — it may not match
      // the environment tileset's grid.
      this.load.spritesheet("characters", "assets/characters.png", {
        frameWidth: 16,
        frameHeight: 16,
        margin: 1,
        spacing: 1,
      });
    }
  }

  create() {
    this.dialog = new DialogBox();

    if (USE_TILEMAP) {
      this.buildTilemap();
    } else {
      this.drawGroundPlaceholder();
    }

    this.npcs = content.map((entry) => this.createNpc(entry));

    this.player = this.createPlayer();

    this.physics.add.collider(
      this.player,
      this.npcs.map((n) => n.sprite),
    );

    if (USE_TILEMAP && this.wallsLayer) {
      this.physics.add.collider(this.player, this.wallsLayer);
    }

    this.interactLabel = this.add
      .text(0, 0, "Press E", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#14121f",
        backgroundColor: "#c9a35c",
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5, 1)
      .setVisible(false)
      .setDepth(10);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D,E");

    this.activeNpc = null;
  }

  drawGroundPlaceholder() {
    // Simple two-tone grid standing in for a tilemap floor.
    const tile = 32;
    const g = this.add.graphics();
    for (let y = 0; y < 600; y += tile) {
      for (let x = 0; x < 750; x += tile) {
        const shade = (x / tile + y / tile) % 2 === 0 ? 0x24331f : 0x1e2a1e;
        g.fillStyle(shade, 1);
        g.fillRect(x, y, tile, tile);
      }
    }
  }

  buildTilemap() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(TILESET_NAME_IN_TILED, "tiles");

    // Adjust these layer names to whatever you named them in Tiled.
    map.createLayer("Ground", tileset, 0, 0);
    this.floorsLayer = map.createLayer("Floors", tileset, 0, 0);
    this.wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    // Requires a boolean custom property named "collides" set on the
    // relevant tiles in Tiled (Tile → Properties, not layer properties).
    this.wallsLayer.setCollisionByProperty({ collides: true });
  }

  createNpc(entry) {
    const sprite = USE_CHARACTER_SPRITES
      ? this.add.sprite(
          entry.x,
          entry.y,
          "characters",
          entry.sprite ?? DEFAULT_NPC_FRAME,
        )
      : this.add
          .rectangle(entry.x, entry.y, 28, 28, 0xc9a35c)
          .setStrokeStyle(2, 0x14121f);

    this.physics.add.existing(sprite, true); // static body

    this.add
      .text(entry.x, entry.y - 26, entry.npc, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#f3e6d0",
      })
      .setOrigin(0.5);

    return { ...entry, sprite };
  }

  createPlayer() {
    const player = USE_CHARACTER_SPRITES
      ? this.add.sprite(400, 460, "characters", PLAYER_FRAME)
      : this.add
          .rectangle(400, 460, 24, 24, 0x57d1c9)
          .setStrokeStyle(2, 0x14121f);

    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setSize(24, 24);
    return player;
  }

  update() {
    if (this.dialog.isOpen()) {
      this.player.body.setVelocity(0);
      return;
    }

    this.handleMovement();
    this.handleInteraction();
  }

  handleMovement() {
    const body = this.player.body;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -PLAYER_SPEED;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = PLAYER_SPEED;

    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -PLAYER_SPEED;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = PLAYER_SPEED;

    // Normalize diagonal movement so it isn't faster than cardinal movement.
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    body.setVelocity(vx, vy);
  }

  handleInteraction() {
    let nearest = null;
    let nearestDist = INTERACT_RANGE;

    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y,
      );
      if (dist < nearestDist) {
        nearest = npc;
        nearestDist = dist;
      }
    }

    this.activeNpc = nearest;

    if (nearest) {
      this.interactLabel
        .setPosition(nearest.x, nearest.y - 34)
        .setVisible(true);
    } else {
      this.interactLabel.setVisible(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.wasd.E) && this.activeNpc) {
      this.dialog.open(
        this.activeNpc.npc,
        this.activeNpc.title,
        this.activeNpc.html,
      );
    }
  }
}
