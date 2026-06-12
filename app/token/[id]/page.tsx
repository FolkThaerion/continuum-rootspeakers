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
const stage = String(trait("Stage"));

const evolutionRequirement =
  stage === "Root Listener"
    ? 15
    : stage === "Pattern Speaker"
    ? 30
    : stage === "Galaxy Speaker"
    ? 50
    : stage === "Living Confluence"
    ? 75
    : 15;
const nextEvolution =
  stage === "Root Listener"
    ? "Pattern Speaker"
    : stage === "Pattern Speaker"
    ? "Galaxy Speaker"
    : stage === "Galaxy Speaker"
    ? "Living Confluence"
    : stage === "Living Confluence"
    ? "Transcendent Confluence"
    : "Unknown";
const currentCycle = Number(world?.cycle || 0);
const evolutionReady = currentCycle >= evolutionRequirement;
const evolutionProgress = Math.min(
  100,
  Math.floor((currentCycle / evolutionRequirement) * 100)
);
const cyclesRemaining = Math.max(
  0,
  evolutionRequirement - currentCycle
);

  const relic = trait("Relic");

const relicBonus =
  relic === "Echo of Cycle 1"
    ? 5
    : relic === "Echo of Cycle 2"
    ? 10
    : relic === "Echo of Cycle 3"
    ? 15
    : 0;

const relicEffect =
  relic === "Echo of Cycle 1"
    ? "+5% Evolution Resonance"
    : relic === "Echo of Cycle 2"
    ? "+10% Evolution Resonance"
    : relic === "Echo of Cycle 3"
    ? "+15% Evolution Resonance"
    : "Unknown Effect";

const effectiveProgress = Math.min(
  100,
  evolutionProgress + relicBonus
);
const evolutionReadiness = effectiveProgress;
const readinessColor =
  evolutionReadiness >= 100
    ? "violet"
    : evolutionReadiness >= 75
    ? "gold"
    : evolutionReadiness >= 50
    ? "lime"
    : evolutionReadiness >= 25
    ? "cyan"
    : "#aaa";
const evolutionRank =
  evolutionReadiness >= 100
    ? "Ascendant"
    : evolutionReadiness >= 75
    ? "IV"
    : evolutionReadiness >= 50
    ? "III"
    : evolutionReadiness >= 25
    ? "II"
    : "I";
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
      
{world && (
  <div
    style={{
      border: evolutionReady ? "1px solid lime" : "1px solid #333",
      borderRadius: "16px",
      padding: "20px",
      marginTop: "20px",
      marginBottom: "20px",
      background: evolutionReady ? "rgba(0,255,0,0.08)" : "#111",
      color: "white",
      boxShadow: evolutionReady
        ? "0 0 18px rgba(0,255,0,0.3)"
        : "none",
    }}
  >
    <h2>🌱 Evolution Status</h2>

    <p><strong>Current Stage:</strong> {trait("Stage")}</p>
    <p><strong>Evolution Requirement:</strong> Cycle {evolutionRequirement}</p>
    <p><strong>Current World Cycle:</strong> {world.cycle}</p>
    <p><strong>Progress:</strong> {evolutionProgress}%</p>
    <p><strong>Relic Bonus:</strong> +{relicBonus}%</p>
    <p><strong>Effective Progress:</strong> {effectiveProgress}%</p>
    <p><strong>Cycles Remaining:</strong> {cyclesRemaining}</p>
    <p><strong>Target Cycle:</strong> {evolutionRequirement}</p>

    <div
      style={{
        width: "100%",
        height: "12px",
        background: "#222",
        borderRadius: "999px",
        overflow: "hidden",
        marginTop: "10px",
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          width: `${effectiveProgress}%`,
          height: "100%",
          background: evolutionReady ? "lime" : "cyan",
          transition: "width 0.5s ease",
        }}
      />
    </div>

    <p style={{ marginTop: "15px", color: "#00ffff", fontWeight: "bold" }}>
      Next Evolution: {nextEvolution}
    </p>

    <p style={{ color: "#7CFF7C", fontWeight: "bold", marginTop: "10px" }}>
      🌱 Evolution Tier: {trait("Stage")}
    </p>

    <p style={{ color: "#ffd700", fontWeight: "bold", marginTop: "10px" }}>
     🏅 Evolution Rank: {evolutionRank}

    </p>

    <div
      style={{
        marginTop: "15px",
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(0,255,255,0.05)",
        border: "1px solid #333",
      }}
    >
      <h3>🔮 Relic Bonus</h3>
      <p><strong>Relic:</strong> {trait("Relic")}</p>
      <p><strong>Effect:</strong> {relicEffect}</p>
      <p><strong>Status:</strong> Active</p>
    </div>

    <div
      style={{
        marginTop: "15px",
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid #333",
      }}
    >
      <strong>Requirements:</strong>
      <p>{evolutionReady ? "✓" : "✗"} Reach Cycle {evolutionRequirement}</p>
      <p>✓ Current Cycle: {world.cycle}</p>
      <p>✗ Evolution Trigger Locked</p>
    </div>

    <p style={{ color: readinessColor, fontWeight: "bold" }}>
      <strong>⚡ Evolution Readiness:</strong> {evolutionReadiness}%
    </p>

    <p
      style={{
        color: evolutionReady ? "lime" : "#aaa",
        fontWeight: "bold",
      }}
    >
      Status: {evolutionReady ? "READY TO EVOLVE" : "Dormant"}
    </p>

    {evolutionReady ? (
      <p style={{ color: "lime", fontWeight: "bold", marginTop: "12px" }}>
        🌱 Evolution Available — the Rootspeaker is ready to ascend.
      </p>
    ) : (
      <p style={{ color: "#888", marginTop: "12px" }}>
        Evolution remains dormant until the required cycle is reached.
      </p>
    )}
  </div>
)}
 


   <p
  style={{
    maxWidth: "700px",
    margin: "30px auto",
    textAlign: "center",
    lineHeight: "1.8",
    color: "#ddd",
    fontStyle: "italic",
  }}
>
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
