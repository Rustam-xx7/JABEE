// Run from the project root:  npm i -D sharp && node convert-frames.mjs
// Converts public/<folder>/ezgif-frame-###.png -> public/<folder>/frame-###.webp (1280w, q75).
// Originals are left alone; delete the PNGs once you've verified the result.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const FOLDERS = ['bikeAnimation', 'character1Animation', 'logoAnimation'];
const WIDTH = 1280;
const QUALITY = 75;

for (const folder of FOLDERS) {
  const dir = path.join('public', folder);
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.png')).sort();
  let before = 0, after = 0;
  for (const f of files) {
    const num = f.match(/(\d+)\.png$/)[1];
    const out = path.join(dir, `frame-${num}.webp`);
    before += (await fs.stat(path.join(dir, f))).size;
    await sharp(path.join(dir, f)).resize({ width: WIDTH }).webp({ quality: QUALITY }).toFile(out);
    after += (await fs.stat(out)).size;
  }
  console.log(`${folder}: ${files.length} frames, ${(before/1e6).toFixed(1)} MB -> ${(after/1e6).toFixed(1)} MB`);
}
