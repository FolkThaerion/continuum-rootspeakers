const fs = require("fs");

const tokenId = Number(process.argv[2]);

if (Number.isNaN(tokenId)) {
  console.log("Usage: node evolve-token.js 1");
  process.exit(1);
}

const file = `public/metadata/${tokenId}.json`;
const fileNoExt = `public/metadata/${tokenId}`;

const metadata = JSON.parse(fs.readFileSync(file, "utf8"));

function getTrait(name) {
  return metadata.attributes.find((t) => t.trait_type === name);
}

const stage = getTrait("Stage");
const anomaly = getTrait("Anomaly");

const stages = [
  "Root Listener",
  "Pattern Speaker",
  "Weave Anchor",
  "Living Confluence"
];

const anomalies = [
  "Stable",
  "Glitched",
  "Fractured",
  "Singularity"
];

const currentStageIndex = stages.indexOf(stage.value);
const currentAnomalyIndex = anomalies.indexOf(anomaly.value);

if (currentStageIndex < stages.length - 1) {
  stage.value = stages[currentStageIndex + 1];
}

if (Math.random() < 0.35 && currentAnomalyIndex < anomalies.length - 1) {
  anomaly.value = anomalies[currentAnomalyIndex + 1];
}

metadata.description =
  `This Rootspeaker has evolved into ${stage.value}.`;

fs.writeFileSync(file, JSON.stringify(metadata, null, 2));
fs.writeFileSync(fileNoExt, JSON.stringify(metadata, null, 2));

console.log(`Evolved token ${tokenId} to ${stage.value}`);
