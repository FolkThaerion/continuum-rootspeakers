const fs = require("fs");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function main() {
  const abi = JSON.parse(fs.readFileSync("build/GenesisRootspeakers.abi.json", "utf8"));
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT, abi, wallet);

  const tx = await contract.setPublicMintOpen(true);
  console.log("Opening mint tx:", tx.hash);

  await tx.wait();
  console.log("Mint is now open.");
}

main().catch(console.error);
