const fs = require("fs");

function weightedRandom(options) {

  const total = options.reduce((sum, o) => sum + o.weight, 0);

  let roll = Math.random() * total;

  for (const option of options) {
    if (roll < option.weight) {
      return option.value;
    }

    roll -= option.weight;
  }

  return options[0].value;
}

const PATHS = [
  { value: "Harmonic Ascent", weight: 40 },
  { value: "Reality Binder", weight: 25 },
  { value: "Galaxy Speaker", weight: 20 },
  { value: "Silence Listener", weight: 10 },
  { value: "Void-Touched", weight: 5 },
];

const STAGES = [
  { value: "Root Listener", weight: 50 },
  { value: "Pattern Speaker", weight: 30 },
  { value: "Weave Anchor", weight: 15 },
  { value: "Living Confluence", weight: 5 },
];

const ANOMALIES = [
  { value: "Stable", weight: 50 },
  { value: "Glitched", weight: 30 },
  { value: "Fractured", weight: 15 },
  { value: "Singularity", weight: 5 },
];

const RARITIES = [
  { value: "Common", weight: 50 },
  { value: "Rare", weight: 30 },
  { value: "Epic", weight: 15 },
  { value: "Mythic", weight: 5 },
];

fs.mkdirSync("public/metadata", { recursive: true });

for (let i = 0; i < 10; i++) {

  const path = weightedRandom(PATHS);
  const stage = weightedRandom(STAGES);
  const anomaly = weightedRandom(ANOMALIES);
  const rarity = weightedRandom(RARITIES);

  const metadata = {
    name: `Genesis Rootspeaker #${i}`,

    description:
      "A living entity emerging from the Continuum Weave.",

    image:
      `https://continuum-rootspeakers.vercel.app/rootspeakers/${i}.png`,

    attributes: [
      {
        trait_type: "Path",
        value: path,
      },

      {
        trait_type: "Stage",
        value: stage,
      },

      {
        trait_type: "Anomaly",
        value: anomaly,
      },

      {
        trait_type: "Rarity",
        value: rarity,
      },

      {
        trait_type: "Genesis",
        value: Math.floor(Math.random() * 100),
      },
    ],
  };

  fs.writeFileSync(
    `public/metadata/${i}.json`,
    JSON.stringify(metadata, null, 2)
  );

  fs.writeFileSync(
    `public/metadata/${i}`,
    JSON.stringify(metadata, null, 2)
  );
}

console.log("Generated weighted rarity metadata.");
