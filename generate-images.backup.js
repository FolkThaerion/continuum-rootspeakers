const fs = require("fs");
const path = require("path");
const { Jimp } = require("jimp");

const LAYERS = [
  "background",
  "weave",
  "core",
  "glyph",
  "halo",
  "anomaly",
];

const OUTPUT_DIR = "public/rootspeakers";
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function listPngs(folder) {
  const dir = path.join("layers", folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".png"))
    .map((file) => path.join(dir, file));
}

function pick(files) {
  if (files.length === 0) return null;
  return files[Math.floor(Math.random() * files.length)];
}

async function generateToken(tokenId) {
  const chosen = LAYERS
    .map((layer) => pick(listPngs(layer)))
    .filter(Boolean);

  if (chosen.length === 0) {
    throw new Error("No PNG layer files found.");
  }

  const base = await Jimp.read(chosen[0]);
  base.resize({ w: 1024, h: 1024 });

  for (const overlayPath of chosen.slice(1)) {
    const overlay = await Jimp.read(overlayPath);
    overlay.resize({ w: 1024, h: 1024 });
    base.composite(overlay, 0, 0);
  }

  await base.write(`${OUTPUT_DIR}/${tokenId}.png`);

  console.log(`Generated token ${tokenId}`);
}

async function main() {
  for (let i = 0; i < 10; i++) {
    await generateToken(i);
  }

  console.log("Generated Rootspeaker images.");
}

main().catch(console.error);
