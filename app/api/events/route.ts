import fs from "fs";
import path from "path";

export async function POST() {

  const eventName = "The Spiral Surge";
  const worldFile = path.join(
  process.cwd(),
  "public/world/state.json"
);

const worldState = JSON.parse(
  fs.readFileSync(worldFile, "utf8")
);

worldState.lastEvent = eventName;

worldState.eventCount += 1;

worldState.era = "Era of Spiral Instability";

worldState.condition = "Unstable";

worldState.description =
  "The Spiral Surge distorted the Continuum.";
  for (let tokenId = 0; tokenId < 10; tokenId++) {

    const file = path.join(
      process.cwd(),
      `public/metadata/${tokenId}.json`
    );

    const fileNoExt = path.join(
      process.cwd(),
      `public/metadata/${tokenId}`
    );

    const metadata = JSON.parse(
      fs.readFileSync(file, "utf8")
    );

    const stageTrait = metadata.attributes.find(
      (a: any) => a.trait_type === "Stage"
    );

    const anomalyTrait = metadata.attributes.find(
      (a: any) => a.trait_type === "Anomaly"
    );

    const stages = [
      "Root Listener",
      "Pattern Speaker",
      "Weave Anchor",
      "Living Confluence",
    ];

    const anomalies = [
      "Stable",
      "Glitched",
      "Fractured",
      "Singularity",
    ];

    const stageIndex =
      stages.indexOf(stageTrait.value);

    const anomalyIndex =
      anomalies.indexOf(anomalyTrait.value);

    if (
      Math.random() < 0.5 &&
      stageIndex < stages.length - 1
    ) {
      stageTrait.value =
        stages[stageIndex + 1];
    }

    if (
      Math.random() < 0.7 &&
      anomalyIndex < anomalies.length - 1
    ) {
      anomalyTrait.value =
        anomalies[anomalyIndex + 1];
    }

    metadata.description =
      `${metadata.name} was altered during ${eventName}.`;

    fs.writeFileSync(
      file,
      JSON.stringify(metadata, null, 2)
    );

    fs.writeFileSync(
      fileNoExt,
      JSON.stringify(metadata, null, 2)
    );
  }
fs.writeFileSync(
  worldFile,
  JSON.stringify(worldState, null, 2)
);  
  return Response.json({
    success: true,
    message:
      `${eventName} reshaped the Continuum.`,
  });
}
