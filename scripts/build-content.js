import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const outFile = path.join(rootDir, 'src', 'data', 'content.generated.json');

const md = new MarkdownIt({ html: false, linkify: true });

function buildContent() {
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.toLowerCase().endsWith('.md'));

  if (files.length === 0) {
    console.warn(`No markdown files found in ${contentDir}`);
  }

  const entries = files.map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const { data, content: body } = matter(raw);

    const id = path.basename(file, '.md');

    if (data.x === undefined || data.y === undefined) {
      console.warn(
        `⚠ ${file} is missing x/y frontmatter — defaulting to (400, 300). ` +
          `Set these to place the NPC in the overworld.`
      );
    }

    return {
      id,
      npc: data.npc || data.title || id,
      title: data.title || '',
      x: data.x ?? 400,
      y: data.y ?? 300,
      order: data.order ?? 0,
      sprite: data.sprite ?? null,
      html: md.render(body)
    };
  });

  entries.sort((a, b) => a.order - b.order);

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(entries, null, 2));

  console.log(`Built ${entries.length} content entries -> ${path.relative(rootDir, outFile)}`);
}

buildContent();
