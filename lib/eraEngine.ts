export const ERAS = [
  {
    name: "Genesis Era",
    condition: "Stable",
    description: "The Continuum is newly awakened."
  },
  {
    name: "Era of Spiral Instability",
    condition: "Unstable",
    description: "The Spiral Surge distorted the Continuum."
  },
  {
    name: "Age of Fractures",
    condition: "Fracturing",
    description: "The Rootspeakers begin splitting into divergent forms."
  },
  {
    name: "The Silence Bloom",
    condition: "Silent",
    description: "A strange quiet spreads through the living weave."
  },
  {
    name: "Era of Convergence",
    condition: "Converging",
    description: "All paths begin bending toward a single living pattern."
  }
];

export function getNextEra(eventCount: number) {
  const index = Math.min(
    Math.floor(eventCount / 3),
    ERAS.length - 1
  );

  return ERAS[index];
}
