const TITLES = [
  "The First Echo",
  "The Silent Witness",
  "The Fractured Herald",
  "The Spiral Walker",
  "The Last Speaker",
  "The Hollow Flame",
  "The Ancient Voice",
];

const NAMES = [
  "Vael-Tor",
  "Kireth",
  "Astra-Vey",
  "Thalor",
  "Nyra-Kai",
  "Veyrith",
  "Orryx",
];

export function generateLegendaryName() {
  const title =
    TITLES[Math.floor(Math.random() * TITLES.length)];

  const name =
    NAMES[Math.floor(Math.random() * NAMES.length)];

  return `${title} — ${name}`;
}
