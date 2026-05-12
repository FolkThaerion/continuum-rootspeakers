import { ethers } from "ethers";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try { 

  const body = await request.json();

const tokenId = body.tokenId;
const wallet = body.wallet;
const abi = [
  "function ownerOf(uint256 tokenId) view returns (address)"
];

 const rpcUrl =
  process.env.RPC_URL ||
  process.env.NEXT_PUBLIC_RPC_URL;

if (!rpcUrl) {

  return Response.json(
    {
      success: false,
      message: "Missing RPC_URL in .env.local",
    },
    { status: 500 }
  );
}

console.log("Using RPC URL:", rpcUrl);

const provider =
  new ethers.providers.StaticJsonRpcProvider(
    rpcUrl,
    {
      name: "sepolia",
      chainId: 11155111,
    }
  );

const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT!,
  abi,
  provider
);

  
console.log("Evolution request from:", wallet);

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

    } catch (error: any) {

    console.error("EVOLVE API ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error.message || "Evolution failed on server.",
      },
      { status: 500 }
    );
  }
}
