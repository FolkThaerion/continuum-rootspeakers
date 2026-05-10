const fs = require("fs");
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const CONTRACT = process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const abi = JSON.parse(
    fs.readFileSync("build/GenesisRootspeakers.abi.json", "utf8")
  );

  const contract = new ethers.Contract(CONTRACT, abi, provider);

  const maxSupply = await contract.MAX_SUPPLY();
  const mintPrice = await contract.mintPrice();
  const mintOpen = await contract.publicMintOpen();

  console.log("MAX_SUPPLY:", maxSupply.toString());
  console.log("Mint Price:", ethers.utils.formatEther(mintPrice), "ETH");
  console.log("Mint Open:", mintOpen);
}

main().catch(console.error);
