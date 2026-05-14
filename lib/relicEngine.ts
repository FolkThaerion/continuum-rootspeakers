export function maybeAddRelicTrait(metadata: any, archive: any[]) {
  if (!archive || archive.length === 0) {
    return metadata;
  }

  const alreadyHasRelic = metadata.attributes.some(
    (attr: any) => attr.trait_type === "Relic"
  );

  if (alreadyHasRelic) {
    return metadata;
  }

  const relicChance = 0.08;

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

  metadata.description =
    `${metadata.description} It carries a relic-memory from ${ancientCycle.archivedEra}.`;

  return metadata;
}
