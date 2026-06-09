"use client";

import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function MintPage() {
  const [tokenId, setTokenId] = useState(0);
  const [totalMinted, setTotalMinted] = useState("0");
  const [lastTxHash, setLastTxHash] = useState("");
  const [recentMints, setRecentMints] = useState<number[]>([]);
async function loadSupply() {
  try {
    if (!(window as any).ethereum) return;

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT!,
      [
        "function totalSupply() view returns (uint256)"
      ],
      provider
    );

    const supply = await contract.totalSupply();
    setTotalMinted(supply.toString());
const total = Number(supply.toString());

const recent = [];

for (let i = total - 1; i >= 0 && recent.length < 5; i--) {
  recent.push(i);
}

setRecentMints(recent);

  } catch (error) {
    console.error(error);
  }
}
function viewToken() {
  window.location.href = `/token/${tokenId}`;
}
useEffect(() => {
  loadSupply();
}, []);
  async function mint() {
  try {
    if (!(window as any).ethereum) {
      alert("Please install or open MetaMask.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_ROOTSPEAKERS_CONTRACT!,
  [
    "function mint(uint256 quantity) payable",
    "function totalSupply() view returns (uint256)"
  ],
  signer
);
const supply = await contract.totalSupply();
setTotalMinted(supply.toString());

    const tx = await contract.mint(1, {
  value: ethers.utils.parseEther("0.05"),
});
setLastTxHash(tx.hash);
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
<p
  style={{
    fontSize: "1.2rem",
    marginTop: "10px",
    marginBottom: "20px",
  }}
>
  Total Minted: {totalMinted} / 1111
</p>
<div style={{ marginTop: "20px" }}>
  <h2>Recent Mints</h2>

  {recentMints.map((id) => (
    <a
      key={id}
      href={`/token/${id}`}
      style={{
        color: "cyan",
        display: "block",
        marginTop: "8px",
      }}
    >
      Rootspeaker #{id}
    </a>
  ))}
</div>
<p
  style={{
    marginTop: "20px",
    marginBottom: "8px",
    opacity: 0.7,
  }}
>
  Token Lookup
</p>
      <input
  type="number"
  value={tokenId}
  onChange={(e) => setTokenId(Number(e.target.value))}
  min={0}
  style={{
    width: "120px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#111",
    color: "white",
    textAlign: "center",
    fontSize: "1rem",
    marginBottom: "20px",
  }}
/>
<button
  onClick={viewToken}
  style={{
    padding: "12px 24px",
    borderRadius: "999px",
    border: "1px solid #333",
    background: "#111",
    color: "white",
    cursor: "pointer",
    marginTop: "12px",
    marginBottom: "30px",
  }}
>
  View Rootspeaker
</button>
        

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
{lastTxHash && (
  <a
    href={`https://sepolia.etherscan.io/tx/${lastTxHash}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "cyan",
      marginTop: "20px",
      display: "block",
    }}
  >
    View Mint Transaction
  </a>
)}
    </main>
  );
}
