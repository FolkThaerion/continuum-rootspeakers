"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function MyRootspeakers() {
  const [wallet, setWallet] = useState("");
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);
  const [ownedMetadata, setOwnedMetadata] = useState<any[]>([]);
  const [world, setWorld] = useState<any>(null);
  useEffect(() => {
  fetch("/world/state.json")
    .then((res) => res.json())
    .then(setWorld);
}, []);
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
    background: "#050505",
    color: "white",
  }}
>
    <h1
  style={{
    fontSize: "2.2rem",
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "600",
    textShadow: "0 0 6px rgba(0,255,255,0.1)",
  }}
>
  My Rootspeakers
</h1>
{world && (
  <div
    style={{
      border:
  world?.era === "Era of Convergence"
    ? "2px solid cyan"
    : "1px solid #333",
    boxShadow:
  world?.era === "Era of Convergence"
    ? "0 0 20px rgba(0,255,255,0.25)"
    : "none",
      borderRadius: "20px",
      padding: "20px",
      marginBottom: "30px",
      background: "#111",
      color: "white",
      maxWidth: "500px",
      margin: "0 auto 30px auto",
    }}
  >
    <h2>🌌 Current World Status</h2>
<div
  style={{
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid cyan",
    color: "cyan",
    marginBottom: "16px",
    boxShadow: "0 0 12px rgba(0,255,255,0.35)",
    fontWeight: "bold",
  }}
>
  🌀 CONVERGENCE ACTIVE
</div>

    <p>
      <strong>Era:</strong> {world.era}
    </p>

    <p>
      <strong>Event:</strong> {world.lastEvent}
    </p>

    <p>
      <strong>Cycle:</strong> {world.cycle}
    </p>

    <p>
      <strong>Condition:</strong> {world.condition}
    </p>
  </div>
)}
<hr
  style={{
    border: "none",
    borderTop: "1px solid #222",
    maxWidth: "500px",
    margin: "40px auto",
  }}
/>
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
         <div
  style={{
    marginTop: "12px",
    marginBottom: "12px",
    padding: "8px",
    borderRadius: "12px",
    background: "rgba(0,255,255,0.08)",
    border: "1px solid rgba(0,255,255,0.25)",
    color: "cyan",
    fontSize: "0.9rem",
  }}

>
  ✓ Affected By: {world?.lastEvent}
<div
  style={{
    marginTop: "8px",
    color:
      world?.era === "Era of Convergence"
        ? "cyan"
        : world?.era === "Age of Fractures"
        ? "crimson"
        : world?.era === "Genesis Era"
        ? "gold"
        : "#aaa",
    fontWeight: "bold",
  }}
>
  Status: {
    world?.era === "Era of Convergence"
      ? "Convergence-Touched"
      : world?.era === "Age of Fractures"
      ? "Fracture-Touched"
      : world?.era === "Genesis Era"
      ? "Genesis-Blessed"
      : "World-Touched"
  }
</div>

</div>
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
