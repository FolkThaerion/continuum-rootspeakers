"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function MyRootspeakers() {
  const [wallet, setWallet] = useState("");
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);
  const [ownedMetadata, setOwnedMetadata] = useState<any[]>([]);
  async function connectWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      const accounts = await provider.send(
        "eth_requestAccounts",
        []
      );

      setWallet(accounts[0]);
      const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT!,
  [
    "function totalSupply() view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ],
  provider
);

const supply = await contract.totalSupply();

const owned: number[] = [];

for (let i = 0; i < Number(supply.toString()); i++) {
  try {
    const owner = await contract.ownerOf(i);

    if (owner.toLowerCase() === accounts[0].toLowerCase()) {
      owned.push(i);
    }
  } catch (error) {
    console.error(error);
  }
}

setOwnedTokens(owned);
const metadataResults = await Promise.all(
  owned.map(async (id) => {
    const res = await fetch(`/metadata/${id}.json`);
    const data = await res.json();

    return {
      id,
      name: data.name,
      image: data.image,
    };
  })
);

setOwnedMetadata(metadataResults);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1>My Rootspeakers</h1>

      <button
        onClick={connectWallet}
        style={{
          padding: "12px 24px",
          borderRadius: "999px",
          cursor: "pointer",
        }}
      >
        Connect Wallet
      </button>

      {wallet && (
  <div style={{ marginTop: "20px" }}>
    <p>Connected: {wallet}</p>
{ownedMetadata.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h2>Owned Rootspeakers</h2>

    {ownedMetadata.map((token) => (
      <a
        key={token.id}
        href={`/token/${token.id}`}
        style={{
          display: "block",
          marginTop: "24px",
          color: "white",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            border: "1px solid #333",
            borderRadius: "20px",
            padding: "20px",
            background: "#111",
            maxWidth: "420px",
            margin: "0 auto",
          }}
        >
          <img
            src={token.image}
            alt={token.name}
            style={{
              width: "100%",
              borderRadius: "16px",
              marginBottom: "16px",
            }}
          />

          <h3>{token.name}</h3>

          <p style={{ color: "cyan" }}>
            Rootspeaker #{token.id}
          </p>
        </div>
      </a>
    ))}
  </div>
)}

  </div>
)}
        
      
    </main>
  );
}
