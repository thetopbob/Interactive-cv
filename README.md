# Interactive CV

A top-down, Secret-of-Mana-flavoured CV. Walk around a small overworld,
bump into NPCs, and read your own career history as dialog boxes.

Content lives in markdown, not code — add or edit a CV section by adding or
editing a `.md` file in `content/`.

## Stack

- **Phaser 3** — game engine (movement, collision, scene management)
- **Vite** — dev server + bundler
- **gray-matter + markdown-it** — build-time pipeline that turns
  `content/*.md` into `src/data/content.generated.json`, which the game
  loads directly

## Project structure

```
content/                   ← CV sections as markdown (edit these)
scripts/build-content.js   ← compiles content/*.md -> src/data/content.generated.json
src/
  main.js                  ← Phaser game config/entry point
  scenes/WorldScene.js      ← movement, collision, NPC interaction loop
  ui/DialogBox.js           ← DOM overlay that renders NPC dialog
  data/content.generated.json  ← build output (auto-regenerated, safe to ignore)
  style.css                 ← RPG dialog box styling
public/assets/              ← drop tileset/sprite images here (see its README)
.github/workflows/deploy.yml ← builds + deploys to GitHub Pages on push to main
```

## Adding a CV section

Create a new file in `content/`, e.g. `content/project-something.md`:

```markdown
---
npc: "The Whoever"      # name shown on the NPC nameplate
title: "Section Title"  # shown as the dialog heading
x: 400                  # position in the 800x600 overworld
y: 300
order: 5                # sort order (lower = built/considered first)
---

Whatever markdown you want here — lists, **bold**, links, etc.
It gets rendered into the dialog box as HTML.
```

The build script picks it up automatically next time you run `npm run dev`
or `npm run build` — no code changes needed.

## Running locally

```bash
npm install
npm run dev
```

This runs the content pipeline once, then starts the Vite dev server.
Open the printed local URL — arrow keys / WASD to move, `E` to talk to an
NPC, `Esc` or the ✕ button to close a dialog.

## Current state: placeholder art

Right now the "map" is a two-tone grid and NPCs are coloured rectangles —
no external assets required, so it runs immediately. See
`public/assets/README.md` for how to swap in a free CC0 tileset (Kenney's
Roguelike/RPG Pack is a good fit) and a real Tiled map once you're ready.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo's **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds the project and
   publishes `dist/` automatically.
4. Your CV will be live at `https://<username>.github.io/<repo-name>/`.

`vite.config.js` uses a relative build base (`base: './'`), so this works
regardless of the repo name — no config edit needed when you rename or fork
it.
