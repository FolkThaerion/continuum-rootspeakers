"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function MyRootspeakers() {
  const [wallet, setWallet] = useState("");
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);

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
      setOwnedTokens([0, 1, 2]);

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
        <p style={{ marginTop: "20px" }}>
          Connected: {wallet}
{ownedTokens.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h2>Owned Rootspeakers</h2>

    {ownedTokens.map((id) => (
      <a
        key={id}
        href={`/token/${id}`}
        style={{
          display: "block",
          marginTop: "10px",
          color: "cyan",
        }}
      >
        Rootspeaker #{id}
      </a>
    ))}
  </div>
)}
        </p>
      )}
    </main>
  );
}
