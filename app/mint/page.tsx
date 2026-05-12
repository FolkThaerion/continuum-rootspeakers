"use client";

import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT =
  process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT || "";

const ABI = [
  "function mint(uint256 quantity) payable",
  "function mintPrice() view returns (uint256)"
];

export default function MintPage() {
  const [status, setStatus] = useState("");

  async function mint() {
    try {
      if (!(window as any).ethereum) {
        alert("Install MetaMask");
        return;
      }

      setStatus("Connecting wallet...");

      await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT,
        ABI,
        signer
      );

      const mintPrice = await contract.mintPrice();

      setStatus("Minting Rootspeaker...");

      const tx = await contract.mint(1, {
        value: mintPrice,
      });

      await tx.wait();

      setStatus("Rootspeaker minted successfully.");
    } catch (err: any) {
      console.error(err);
      setStatus("Mint failed.");
    }
  }

  return (
  <main
    style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
    }}
  >
    <h1 style={{ fontSize: "3rem" }}>
      Continuum Rootspeakers
    </h1>

    <div style={{ display: "flex", gap: "20px" }}>

      <button
        onClick={mint}
        style={{
          padding: "16px 32px",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
      >
        Mint Rootspeaker
      </button>

      <button
        onClick={async () => {

          try {

            setStatus("Evolving Rootspeaker...");

            let wallet = "development-wallet";

if ((window as any).ethereum) {

  const provider = new ethers.providers.Web3Provider(
    (window as any).ethereum
  );

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  wallet = await signer.getAddress();
}

const response = await fetch("/api/evolve", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    tokenId: 0,
    wallet,
  }),
}); 
           

            const text = await response.text();

const data = text
  ? JSON.parse(text)
  : { message: "No response from server." };

            setStatus(data.message);

          } catch (err) {

            console.error(err);

            setStatus("Evolution failed.");
          }
        }}

        style={{
          padding: "16px 32px",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
      >
        Evolve Rootspeaker
      </button>

    </div>

    <p>{status}</p>
  </main>
);
}
