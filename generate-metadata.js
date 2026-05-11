const fs = require("fs");

const paths = [
  "Harmonic Ascent",
  "Void-Touched",
  "Silence Listener",
  "Galaxy Speaker",
  "Reality Binder"
];

const stages = [
  "Root Listener",
  "Pattern Speaker",
  "Weave Anchor",
  "Living Confluence"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

fs.mkdirSync("public/metadata", { recursive: true });

for (let i = 0; i < 10; i++) {

  const metadata = {
    name: `Genesis Rootspeaker #${i}`,
    description:
      "A living entity emerging from the Continuum Weave.",

    image:
      `https://continuum-rootspeakers.vercel.app/placeholder/rootspeaker0.png`,

    attributes: [
      {
        trait_type: "Path",
        value: random(paths),
      },
      {
        trait_type: "Stage",
        value: random(stages),
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

console.log("Generated metadata files.");
