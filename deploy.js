const fs = require("fs");
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  throw new Error("Missing RPC_URL or PRIVATE_KEY");
}

async function main() {
  const abi = JSON.parse(fs.readFileSync("build/GenesisRootspeakers.abi.json", "utf8"));
  const bytecode = fs.readFileSync("build/GenesisRootspeakers.bytecode.txt", "utf8");

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying from:", wallet.address);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  const baseURI = "https://your-domain.com/api/metadata/";

  const contract = await factory.deploy(baseURI);
  await contract.deployed();

  console.log("GenesisRootspeakers deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
