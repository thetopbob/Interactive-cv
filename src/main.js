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

// Wait for web fonts (Saira) before starting the game, so Phaser canvas
// text doesn't render in a fallback font. document.fonts.ready resolves
// even if font loading fails, so this can't stall the game.
document.fonts.ready.then(() => {
  new Phaser.Game(config);
});
