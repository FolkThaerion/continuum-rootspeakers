export const EVENTS = [
  {
    name: "The Spiral Surge",
    description:
      "Chaotic resonance spreads through the Continuum.",
    weight: 40,
  },

  {
    name: "The Fracture Bloom",
    description:
      "Reality begins splitting into unstable branches.",
    weight: 25,
  },

  {
    name: "The Silence Tide",
    description:
      "A strange quiet suppresses all mutation.",
    weight: 15,
  },

  {
    name: "The Convergence Pulse",
    description:
      "Rootspeakers synchronize into unified evolution.",
    weight: 12,
  },

  {
    name: "The Null Echo",
    description:
      "Forgotten patterns return from outside the Continuum.",
    weight: 6,
  },

  {
    name: "The Infinite Bloom",
    description:
      "Every Rootspeaker surges toward transcendence.",
    weight: 1,
  },

  {
    name: "The Returning Spiral",
    description:

      "The Continuum begins awakening again from the beginning.",
    weight: 1,
  },
];

export function getRandomEvent() {

  const totalWeight = EVENTS.reduce(
    (sum, event) => sum + event.weight,
    0
  );

  let random =
    Math.random() * totalWeight;

  for (const event of EVENTS) {

    random -= event.weight;

    if (random <= 0) {
      return event;
    }
  }

  return EVENTS[0];
}
