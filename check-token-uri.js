const fs = require("fs");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

async function main() {
  const abi = JSON.parse(
    fs.readFileSync("build/GenesisRootspeakers.abi.json", "utf8")
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT,
    abi,
    provider
  );

  const uri = await contract.tokenURI(0);

  console.log("Token URI:", uri);
}

main().catch(console.error);
