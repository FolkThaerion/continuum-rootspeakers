const fs = require("fs");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function main() {
  const abi = JSON.parse(fs.readFileSync("build/GenesisRootspeakers.abi.json", "utf8"));
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT, abi, wallet);

  const price = await contract.mintPrice();

  const tx = await contract.mint(1, { value: price });
  console.log("Mint tx:", tx.hash);

  await tx.wait();
  console.log("Minted 1 Rootspeaker.");

  const totalSupply = await contract.totalSupply();
  console.log("Total supply:", totalSupply.toString());
}

main().catch(console.error);
