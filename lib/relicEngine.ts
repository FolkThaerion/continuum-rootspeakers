import { generateLegendaryName } from "./legendaryNames";
export function maybeAddRelicTrait(metadata: any, archive: any[]) {
  if (!archive || archive.length === 0) {
    return metadata;
  }

  // const alreadyHasRelic = metadata.attributes.some(
//   (attr: any) => attr.trait_type === "Relic"
// );

// if (alreadyHasRelic) {
//   return metadata;
// } 

  const relicChance = 1;

  if (Math.random() > relicChance) {
    return metadata;
  }

  const ancientCycle =
    archive[Math.floor(Math.random() * archive.length)];

  metadata.attributes.push({
    trait_type: "Relic",
    value: `Echo of Cycle ${ancientCycle.archivedCycle}`,
  });

  metadata.attributes.push({
    trait_type: "Ancient Era",
    value: ancientCycle.archivedEra,
  });
if (Math.random() < 1) {
  const legendaryName = generateLegendaryName();

  metadata.attributes.push({
    trait_type: "Legendary Name",
    value: legendaryName,
  });

  metadata.name = legendaryName;
}
  metadata.description =
    `${metadata.description} It carries a relic-memory from ${ancientCycle.archivedEra}.`;

  return metadata;
}
