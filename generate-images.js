const fs = require("fs");
const path = require("path");
const { Jimp } = require("jimp");

const OUTPUT_DIR = "public/rootspeakers";

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function loadMetadata(tokenId) {
  return JSON.parse(
    fs.readFileSync(`public/metadata/${tokenId}.json`, "utf8")
  );
}

function traitValue(metadata, trait) {
  const found = metadata.attributes.find(
    (a) => a.trait_type === trait
  );

  return found ? found.value : null;
}

async function generateToken(tokenId) {

  const metadata = loadMetadata(tokenId);

  const rarity = traitValue(metadata, "Rarity");
  const anomaly = traitValue(metadata, "Anomaly");

  let backgroundPath =
    "layers/background/bg.png";

  let corePath =
    "layers/core/core.png";

  if (rarity === "Mythic") {
    backgroundPath =
      "layers/background/mythic.png";
  }

  if (anomaly === "Singularity") {
    corePath =
      "layers/core/singularity.png";
  }

  const base = await Jimp.read(backgroundPath);

  base.resize({ w: 1024, h: 1024 });

  const core = await Jimp.read(corePath);

  core.resize({ w: 1024, h: 1024 });

  base.composite(core, 0, 0);

  await base.write(`public/rootspeakers/${tokenId}.png`);

  console.log(
    `Generated token ${tokenId} | ${rarity} | ${anomaly}`
  );
}

async function main() {

  for (let i = 0; i < 10; i++) {
    await generateToken(i);
  }

  console.log("Generated trait-driven Rootspeakers.");
}

main().catch(console.error);
