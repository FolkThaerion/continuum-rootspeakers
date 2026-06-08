"use client";

import { ethers } from "ethers";
import { useState } from "react";

export default function MintPage() {
  const [tokenId, setTokenId] = useState(0);

  async function mint() {
  try {
    if (!(window as any).ethereum) {
      alert("Please install or open MetaMask.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
const network = await provider.getNetwork();
alert(`Chain ID: ${network.chainId}`);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT!,
      [
        "function mint(uint256 quantity) payable",
        
      ],
      signer
    );

    const tx = await contract.mint(1, {
  value: ethers.utils.parseEther("0.05"),
});

    await tx.wait();

    alert("Rootspeaker minted successfully.");
  } catch (error) {
  console.error("Mint error:", error);
  const err = error as any;

alert(
  err?.reason ||
  err?.message ||
  JSON.stringify(err)
);
}
}

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2.5rem, 8vw, 4rem)",
          lineHeight: 1.1,
          wordBreak: "break-word",
          textAlign: "center",
        }}
      >
        Continuum Rootspeakers
      </h1>

      <input
        type="number"
        value={tokenId}
        onChange={(e) => setTokenId(Number(e.target.value))}
        min={0}
        style={{
          padding: "12px",
          fontSize: "1rem",
          width: "120px",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={mint}
          style={{
            padding: "12px 20px",
            borderRadius: "999px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          Mint Rootspeaker
        </button>

        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/events", {
                method: "POST",
              });

              const data = await response.json();

alert(data.message);

} catch (error) {

  console.error(error);

}
          }}
          style={{
            padding: "12px 20px",
            borderRadius: "999px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          Trigger Global Event
        </button>
      </div>
    </main>
  );
}
