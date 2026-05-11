const fs = require("fs");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function main() {
  const abi = JSON.parse(fs.readFileSync("build/GenesisRootspeakers.abi.json", "utf8"));
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT, abi, wallet);

  const newBaseURI = "http://continuum-rootspeakers.vercel.app/metadata/";

  const tx = await contract.setBaseURI(newBaseURI);
  console.log("Set base URI tx:", tx.hash);

  await tx.wait();
  console.log("Base URI updated:", newBaseURI);
}

main().catch(console.error);
