import fs from "fs";
import path from "path";

export async function POST() {

  const tokenId = 1;

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

  const currentStage = stages.indexOf(stageTrait.value);
  const currentAnomaly = anomalies.indexOf(anomalyTrait.value);

  if (currentStage < stages.length - 1) {
    stageTrait.value = stages[currentStage + 1];
  }

  if (
    Math.random() < 0.35 &&
    currentAnomaly < anomalies.length - 1
  ) {
    anomalyTrait.value =
      anomalies[currentAnomaly + 1];
  }

  metadata.description =
    `This Rootspeaker has evolved into ${stageTrait.value}.`;

  fs.writeFileSync(
    file,
    JSON.stringify(metadata, null, 2)
  );

  fs.writeFileSync(
    fileNoExt,
    JSON.stringify(metadata, null, 2)
  );

  return Response.json({
    success: true,
    message:
      `Rootspeaker evolved into ${stageTrait.value}`,
  });
}
