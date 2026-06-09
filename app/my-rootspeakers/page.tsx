"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function MyRootspeakers() {
  const [wallet, setWallet] = useState("");

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
        </p>
      )}
    </main>
  );
}
