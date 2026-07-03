import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the built app works when served from a GitHub Pages
  // project subpath (https://username.github.io/repo-name/) without needing
  // to hardcode the repo name here.
  base: './',
  build: {
    outDir: 'dist'
  }
});
