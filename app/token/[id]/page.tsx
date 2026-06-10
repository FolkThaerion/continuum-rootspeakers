"use client";

import React, { useEffect, useState } from "react";

type Attribute = {
  trait_type: string;
  value: string | number;
};

type Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
};

type TokenHistory = {
  event: string;
  description: string;
  stage: string;
  anomaly?: string;
};
 
export default function TokenPage(props: any) {
  const { id } = React.use(props.params) as { id: string };
 const [token, setToken] = useState<Metadata | null>(null);
const [history, setHistory] = useState<TokenHistory[]>([]);
const [world, setWorld] = useState<any>(null);
  useEffect(() => {
    fetch(`/metadata/${id}`)
      .then((res) => res.json())
      .then(setToken);
fetch(`/token-history/${id}.json`)
  .then((res) => res.json())
  .then(setHistory);

fetch("/world/state.json")
  .then((res) => res.json())
  .then(setWorld);
 }, [id]);

  if (!token) return <main>Loading...</main>;
function trait(name: string) {
  return token?.attributes.find((a) => a.trait_type === name)?.value || "None";
}
  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <h1>{token.name}</h1>

      <img
        src={token.image}
        alt={token.name}
        style={{ width: "100%", maxWidth: "500px", borderRadius: "20px" }}
      />
<div
  style={{
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "20px",
    marginBottom: "20px",
    background: "#111",
  }}
>
  <h2>Rootspeaker Profile</h2>

  <p><strong>Name:</strong> {token.name}</p>
  <p><strong>Path:</strong> {trait("Path")}</p>
<p><strong>Stage:</strong> {trait("Stage")}</p>
<p><strong>Anomaly:</strong> {trait("Anomaly")}</p>
<p><strong>Rarity:</strong> {trait("Rarity")}</p>
<p><strong>Relic:</strong> {trait("Relic")}</p>
<p><strong>Ancient Era:</strong> {trait("Ancient Era")}</p>
  <p><strong>Token ID:</strong> #{id}</p>
</div>
{world && (
  <div
    style={{
      border: "1px solid cyan",
      borderRadius: "16px",
      padding: "20px",
      marginTop: "20px",
      marginBottom: "20px",
      background: "rgba(0,255,255,0.08)",
      color: "white",
    }}
  >
    <h2>🌌 World Effects</h2>

    <p><strong>Current Era:</strong> {world.era}</p>

    <p><strong>Current Event:</strong> {world.lastEvent}</p>

    <p style={{ color: "cyan", fontWeight: "bold" }}>
      ✓ Status: Convergence-Touched
    </p>

    <p style={{ color: "cyan" }}>
      ✓ Affected By: {world.lastEvent}
    </p>
  </div>
)}
      <p style={{ maxWidth: "700px", marginTop: "30px" }}>
        {token.description}
      </p>

      

      
<h2 style={{ marginTop: "40px" }}>
  Evolution History
</h2>

{history.map((entry, index) => (
  <div
    key={index}
    style={{
      border: "1px solid #333",
      padding: "16px",
      marginTop: "16px",
      borderRadius: "12px",
    }}
  >
    <h3>{entry.event}</h3>

    <p>{entry.description}</p>

    <p>
      <strong>Stage:</strong> {entry.stage}
    </p>

    {entry.anomaly && (
      <p>
        <strong>Anomaly:</strong> {entry.anomaly}
      </p>
    )}
  </div>
))}   
 </main>
  );
}
