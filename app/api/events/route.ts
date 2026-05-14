import { getRandomEvent } from "@/lib/events";
import { getMutationRules } from "@/lib/mutationRules";
import { getNextEra } from "@/lib/eraEngine";
import fs from "fs";
import path from "path";

export async function POST() {

  const event = getRandomEvent();

const eventName = event.name;

const eventDescription = event.description;
  const worldFile = path.join(
  process.cwd(),
  "public/world/state.json"
);

const worldState = JSON.parse(
  fs.readFileSync(worldFile, "utf8")
);
const historyFile = path.join(
  process.cwd(),
  "public/world/history.json"
);

const history = JSON.parse(
  fs.readFileSync(historyFile, "utf8")
);
worldState.lastEvent = eventName;

worldState.eventCount += 1;

const nextEra = getNextEra(worldState.eventCount);
const rules = getMutationRules(nextEra.name);
worldState.era = nextEra.name;

worldState.condition = nextEra.condition;

worldState.description = nextEra.description;
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

    if (eventName === "The Infinite Bloom") {

  stageTrait.value = "Living Confluence";

  anomalyTrait.value = "Singularity";
}

else if (eventName === "The Silence Tide") {

  // mutation freeze
}

else if (eventName === "The Null Echo") {

  anomalyTrait.value = "Singularity";
}

else if (
  eventName === "The Convergence Pulse"
) {

  stageTrait.value = "Living Confluence";
}

else if (
  eventName === "The Returning Spiral"
) {

  stageTrait.value = "Root Listener";

  anomalyTrait.value = "Stable";
  
  worldState.cycle =
  (worldState.cycle || 1) + 1;

worldState.era = "Genesis Era";

worldState.condition = "Reawakening";

worldState.description =
  "The Continuum begins again from the first breath.";
}

else {

  if (
    Math.random() < rules.stageChance &&
    stageIndex < stages.length - 1
  ) {
    stageTrait.value =
      stages[stageIndex + 1];
  }

  if (
    Math.random() < rules.anomalyChance &&
    anomalyIndex < anomalies.length - 1
  ) {
    anomalyTrait.value =
      anomalies[anomalyIndex + 1];
  }

  if (rules.forceConvergence) {
    stageTrait.value =
      "Living Confluence";
  }
}

    metadata.description =
  `${metadata.name} was altered during ${eventName}. ${eventDescription}`;

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
history.push({
  event: eventName,
  era: worldState.era,
  description: eventDescription,
  eventNumber: worldState.eventCount,
});

fs.writeFileSync(
  historyFile,
  JSON.stringify(history, null, 2)
);  
  return Response.json({
    success: true,
    message:
      `${eventName} reshaped the Continuum.`,
  });
}
