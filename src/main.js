import Phaser from "phaser";
import WorldScene from "./scenes/WorldScene.js";

const config = {
  type: Phaser.AUTO,
  width: 750,
  height: 600,
  parent: "game-container",
  backgroundColor: "#1e2a1e",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [WorldScene],
};

new Phaser.Game(config);
