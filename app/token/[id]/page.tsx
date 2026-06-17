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
  const [realityWeaveUsed, setRealityWeaveUsed] = useState(false);
  const [worldEvent, setWorldEvent] = useState("Silence Tide");
  const [legendaryRelics, setLegendaryRelics] = useState<string[]>([]);

  const [decision, setDecision] = useState<string | null>(null);
  const [eventIndex, setEventIndex] = useState(0);
  const [hasEvolved, setHasEvolved] = useState(false);
  const [evolvedStage, setEvolvedStage] = useState<string | null>(null);

  const [reputation, setReputation] = useState(12);
  const [relics, setRelics] = useState(2);
  const [companionBond, setCompanionBond] = useState(12);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const events = [
    {
      title: "Silent Frontier Signal",
      description:
        "Echo Wisp discovers a strange resonance signal beneath the ruins.",
    },
    {
      title: "Ancient Relic Cache",
      description: "A hidden vault emerges from the shifting sands.",
    },
    {
      title: "Convergence Rift",
      description: "A tear in reality opens near the frontier.",
    },
  ];
const WORLD_EVENTS = [
  "Silence Tide",
  "Convergence Bloom",
  "Relic Rain",
  "Void Eclipse",
  "Temporal Storm",
  "Echo Harvest",
];
const LEGENDARY_RELICS = [
  "Chronicle Core",
  "Void Lantern",
  "Worldseed Fragment",
  "Echo Crown",
  "Heart of the First Root",
  "Astral Compass",
];
  useEffect(() => {
    fetch(`/metadata/${id}.json`)
      .then((res) => res.json())
      .then(setToken);

    fetch(`/token-history/${id}.json`)
      .then((res) => res.json())
      .then(setHistory)
      .catch(() => setHistory([]));

    fetch("/world/state.json")
      .then((res) => res.json())
      .then(setWorld);
  }, [id]);

  useEffect(() => {
  const saved = localStorage.getItem(`rootspeaker-${id}`);

  if (saved) {
    const data = JSON.parse(saved);

    setReputation(data.reputation ?? 12);
    setRelics(data.relics ?? 2);
    setCompanionBond(data.companionBond ?? 12);

    setHasEvolved(data.hasEvolved ?? false);
    setEvolvedStage(data.evolvedStage ?? null);
    setRealityWeaveUsed(data.realityWeaveUsed ?? false);
    setLegendaryRelics(data.legendaryRelics ?? []);
  }

  setStatsLoaded(true);
}, [id]);

  useEffect(() => {
    if (!statsLoaded) return;

    localStorage.setItem(
  `rootspeaker-${id}`,
  JSON.stringify({
    reputation,
    relics,
    companionBond,
    hasEvolved,
    evolvedStage,
    realityWeaveUsed,
    worldEvent,
    legendaryRelics,
  })
);
}, [reputation, relics, companionBond, hasEvolved, evolvedStage, id, statsLoaded]);

  if (!token) return <main>Loading...</main>;

  function chooseDecision(choice: string) {
    if (decision) return;

    setDecision(choice);

    if (choice === "A") {
      setReputation((r) => r + 5);
      setCompanionBond((b) => b + 3);
    }

    if (choice === "B") {
      setRelics((r) => r + 1);
    }

    if (choice === "C") {
      setReputation((r) => r + 2);
    }
  }

  function trait(name: string) {
    return token?.attributes.find((a) => a.trait_type === name)?.value || "None";
  }

  const baseStage = String(trait("Stage"));
const stage = evolvedStage || baseStage;
  const relic = String(trait("Relic"));

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

    const nextEvolution = hasEvolved
  ? "Reality Weaver"
  : stage === "Root Listener"
  ? "Pattern Speaker"
  : stage === "Pattern Speaker"
  ? "Galaxy Speaker"
  : stage === "Galaxy Speaker"
  ? "Living Confluence"
  : stage === "Living Confluence"
  ? "Transcendent Confluence"
  : "Unknown";


  const currentCycle = Number(world?.cycle || 0);
  
  
  

  const evolutionProgress = Math.min(
    100,
    Math.floor((currentCycle / evolutionRequirement) * 100)
  );

  const cyclesRemaining = Math.max(0, evolutionRequirement - currentCycle);


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

  const statProgressBonus = Math.floor(
    reputation / 10 + relics * 2 + companionBond / 10
  );

  const effectiveProgress = Math.min(
    100,
    evolutionProgress + relicBonus + statProgressBonus
  );

  const evolutionReadiness = effectiveProgress;
const evolutionReady =
  evolutionReadiness >= 75;

  const evolutionRank = hasEvolved
  ? "MAX"
  : evolutionReadiness >= 100
  ? "Ascendant"
  : evolutionReadiness >= 75
  ? "IV"
  : evolutionReadiness >= 50
  ? "III"
  : evolutionReadiness >= 25
  ? "II"
  : "I";

  const rankI = evolutionReadiness < 25;
  const rankII = evolutionReadiness >= 25 && evolutionReadiness < 50;
  const rankIII = evolutionReadiness >= 50 && evolutionReadiness < 75;
  const rankIV = evolutionReadiness >= 75 && evolutionReadiness < 100;
  const rankV = evolutionReadiness >= 100;

  const currentRank =
    rankV
      ? "Rank V — Living Confluence"
      : rankIV
      ? "Rank IV — Relic Sage"
      : rankIII
      ? "Rank III — Echo Walker"
      : rankII
      ? "Rank II — Resonant Keeper"
      : "Rank I — Root Listener";
const displayRank = hasEvolved
  ? "Rank MAX — Transcendent Confluence"
  : currentRank;

  const currentRankAbility =
    rankV
      ? "Reality Weaving"
      : rankIV
      ? "Temporal Memory Sight"
      : rankIII
      ? "Echo Reconstruction"
      : rankII
      ? "Resonance Scan"
      : "Detect Hidden Relics";

  const rankColor =
    evolutionRank === "Ascendant"
      ? "violet"
      : evolutionRank === "IV"
      ? "gold"
      : evolutionRank === "III"
      ? "lime"
      : evolutionRank === "II"
      ? "cyan"
      : "#aaa";

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

  const nextRank =
    evolutionRank === "I"
      ? "II"
      : evolutionRank === "II"
      ? "III"
      : evolutionRank === "III"
      ? "IV"
      : evolutionRank === "IV"
      ? "Ascendant"
      : "MAX";

  const readinessToNextRank =
    evolutionReadiness < 25
      ? 25 - evolutionReadiness
      : evolutionReadiness < 50
      ? 50 - evolutionReadiness
      : evolutionReadiness < 75
      ? 75 - evolutionReadiness
      : evolutionReadiness < 100
      ? 100 - evolutionReadiness
      : 0;

  const rankProgress =
    evolutionReadiness >= 100
      ? 100
      : evolutionReadiness >= 75
      ? ((evolutionReadiness - 75) / 25) * 100
      : evolutionReadiness >= 50
      ? ((evolutionReadiness - 50) / 25) * 100
      : evolutionReadiness >= 25
      ? ((evolutionReadiness - 25) / 25) * 100
      : (evolutionReadiness / 25) * 100;

  const rankCountdownMessage =
    readinessToNextRank === 0
      ? "Threshold reached"
      : readinessToNextRank <= 5
      ? "Threshold almost reached"
      : "Progressing toward next rank";

  const rankUpReady = readinessToNextRank === 0;
  const rankIVUnlocked = evolutionReadiness >= 75;
  const canEvolve = evolutionReadiness >= 75;

  const milestone25 = evolutionReadiness >= 25;
  const milestone50 = evolutionReadiness >= 50;
  const milestone75 = evolutionReadiness >= 75;
  const milestone100 = evolutionReadiness >= 100;

  const rankReward =
    evolutionRank === "Ascendant"
      ? "Reality Shaper"
      : evolutionRank === "IV"
      ? "+20% Evolution Resonance"
      : evolutionRank === "III"
      ? "+15% Evolution Resonance"
      : evolutionRank === "II"
      ? "+10% Evolution Resonance"
      : "+5% Evolution Resonance";

  const evolutionTitle = hasEvolved
  ? "Worldshaper"
  : evolutionRank === "IV"
  ? "Convergence Master"
  : evolutionRank === "III"
  ? "Resonance Sage"
  : evolutionRank === "II"
  ? "Echo Keeper"
  : "Root Wanderer";

  const evolutionAbility = hasEvolved
  ? "Reality Weaving"
  : evolutionRank === "IV"
  ? "World Resonance"
  : evolutionRank === "III"
  ? "Echo Manipulation"
  : evolutionRank === "II"
  ? "Relic Synchronization"
  : "Cycle Awareness";

  const abilityDescription =
    evolutionRank === "Ascendant"
      ? "Can influence world evolution events."
      : evolutionRank === "IV"
      ? "Can resonate with active world states."
      : evolutionRank === "III"
      ? "Can strengthen relic effects."
      : evolutionRank === "II"
      ? "Can synchronize with multiple relic echoes."
      : "Can sense approaching evolutionary shifts.";

  const evolutionAura = hasEvolved
  ? "Cosmic Violet"
  : evolutionRank === "IV"
  ? "Golden Radiance"
  : evolutionRank === "III"
  ? "Emerald Glow"
  : evolutionRank === "II"
  ? "Azure Echo"
  : "Dormant Gray";

  const auraColor =
    evolutionRank === "Ascendant"
      ? "violet"
      : evolutionRank === "IV"
      ? "gold"
      : evolutionRank === "III"
      ? "lime"
      : evolutionRank === "II"
      ? "cyan"
      : "#888";

  const achievementFirstAwakening = reputation >= 15;
  const achievementRelicHunter = relics >= 5;
  const achievementSpiritbound = companionBond >= 20;
  const achievementLegendary =
    achievementFirstAwakening &&
    achievementRelicHunter &&
    achievementSpiritbound;

  const evolutionHistory = [
    "Cycle 1 — Rootspeaker awakened",
    "Cycle 1 — Echo of Cycle 1 discovered",
    "Cycle 11 — Convergence-Touched",
    `Next Event — Rank ${nextRank} Ascension`,
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>{token.name}</h1>

      <img
        src={token.image}
        alt={token.name}
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "20px",
        }}
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
        <p>
  <strong>Stage:</strong> {hasEvolved ? nextEvolution : stage}
</p>
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
            background: "rgba(0,255,255,0.05)",
          }}
        >
          <h2>🌌 World Effects</h2>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(0,255,255,0.08)",
    border: "1px solid cyan",
  }}
>
  <h3>🌍 Active World Event</h3>
  <p>{worldEvent}</p>
</div>

{legendaryRelics.length > 0 && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,215,0,0.08)",
      border: "1px solid gold",
    }}
  >
    <h3>🏺 Legendary Relic Collection</h3>

<p>
  <strong>Collected:</strong> {legendaryRelics.length} / {LEGENDARY_RELICS.length}
</p>

{legendaryRelics.map((relic) => (
  <p key={relic}>✓ {relic}</p>
))}

{legendaryRelics.length >= 3 && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,215,0,0.08)",
      border: "1px solid gold",
    }}
  >
    🏆 Relic Mastery I Unlocked
    <br />
    +10 Reputation Bonus
  </div>
)}
{legendaryRelics.length >= 6 && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(180,120,255,0.08)",
      border: "1px solid violet",
    }}
  >
    🏺 Ancient Relic Forge Unlocked
    <br />
    Craft legendary artifacts from relics.
  </div>
)}
{legendaryRelics.length >= 6 && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(120,80,255,0.08)",
      border: "1px solid violet",
    }}
  >
    <h3>⚒ Ancient Relic Forge</h3>

    <p>🔭 Astral Compass + Chronicle Core</p>
    <p>→ Celestial Navigator</p>

    <br />

    <p>🌱 Worldseed Fragment + Echo Crown</p>
    <p>→ Living Worldseed</p>

    <br />

    <p>
      <strong>Forge Status:</strong> READY
    </p>
  </div>
)}

</div>
)}

          <p><strong>Era:</strong> {world.era}</p>
          <p><strong>Condition:</strong> {world.condition}</p>
          <p><strong>Cycle:</strong> {world.cycle}</p>
          <p><strong>Last Event:</strong> {world.lastEvent}</p>
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

         <p>
  <strong>Current Stage:</strong>{" "}
  {hasEvolved ? "Transcendent Confluence" : stage}
</p>
          {!hasEvolved && (
  <p>
    <strong>Evolution Requirement:</strong> Cycle {evolutionRequirement}
  </p>
)}
          <p><strong>Current World Cycle:</strong> {world.cycle}</p>
          <p><strong>Progress:</strong> {evolutionProgress}%</p>
          <p><strong>Relic Bonus:</strong> +{relicBonus}%</p>
          <p><strong>Effective Progress:</strong> {effectiveProgress}%</p>
          {!hasEvolved && (
  <p>
    <strong>Cycles Remaining:</strong> {cyclesRemaining}
  </p>
)}
          {!hasEvolved && (
  <p>
    <strong>Target Cycle:</strong> {evolutionRequirement}
  </p>
)}

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

          {!hasEvolved && (
  <p style={{ marginTop: "15px", color: "#00ffff", fontWeight: "bold" }}>
    Next Evolution: {nextEvolution}
  </p>
)}

{hasEvolved && (
  <p style={{ marginTop: "15px", color: "#00ffff", fontWeight: "bold" }}>
    Ascension Path: Reality Weaver
  </p>
)}

          <p style={{ color: "#7CFF7C", fontWeight: "bold", marginTop: "10px" }}>
            🌱 Evolution Tier: {trait("Stage")}
          </p>

          <p style={{ color: rankColor, fontWeight: "bold", marginTop: "10px" }}>
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

          {!hasEvolved && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,215,0,0.06)",
      border: "1px solid #333",
    }}
  >
    <h3>🔮 Evolution Forecast</h3>
    <p><strong>Current Rank:</strong> {evolutionRank}</p>
    <p><strong>Next Rank:</strong> {nextRank}</p>
    <p><strong>Needed:</strong> {readinessToNextRank}% Readiness</p>
    <p><strong>Estimated Evolution:</strong> Cycle {evolutionRequirement}</p>
  </div>
)}

          {!hasEvolved && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,215,0,0.06)",
      border: "1px solid #333",
    }}
  >
    <h3>⏳ Evolution Countdown</h3>
    <p><strong>Current Readiness:</strong> {evolutionReadiness}%</p>
    <p><strong>Next Rank:</strong> {nextRank}</p>
    <p><strong>Remaining:</strong> {readinessToNextRank}%</p>
    <p><strong>Status:</strong> {rankCountdownMessage}</p>
  </div>
)}

            {!hasEvolved && rankUpReady && (
  <div
    style={{
      marginTop: "12px",
      padding: "10px",
      borderRadius: "12px",
      background: "rgba(0,255,0,0.08)",
      border: "1px solid lime",
      color: "lime",
      fontWeight: "bold",
    }}
  >
    🌱 Rank-Up Available — this Rootspeaker is ready to become Rank {nextRank}.
  </div>
)}
          

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #333",
            }}
          >
            <h3>🏆 Evolution Milestones</h3>
            <p>{milestone25 ? "✓" : "○"} 25% — Rank II Threshold</p>
            <p>{milestone50 ? "✓" : "○"} 50% — Rank III Threshold</p>
            <p>{milestone75 ? "✓" : "○"} 75% — Rank IV Threshold</p>
            <p>{milestone100 ? "✓" : "○"} 100% — Ascendant Evolution</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(0,255,150,0.05)",
              border: "1px solid #333",
            }}
          >
            <h3>🎁 Evolution Rewards</h3>
            <p><strong>Current Rank:</strong> {evolutionRank}</p>
            <p><strong>Reward:</strong> {rankReward}</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(180,120,255,0.05)",
              border: "1px solid #333",
            }}
          >
            <h3>👑 Evolution Title</h3>
            <p><strong>Current Title:</strong> {evolutionTitle}</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(0,120,255,0.06)",
              border: "1px solid #333",
            }}
          >
            <h3>✨ Evolution Ability</h3>
            <p><strong>Ability:</strong> {evolutionAbility}</p>
            <p><strong>Effect:</strong> {abilityDescription}</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${auraColor}`,
            }}
          >
            <h3>🌌 Evolution Aura</h3>
            <p><strong>Aura:</strong> {evolutionAura}</p>
            <p><strong>Title:</strong> {evolutionTitle}</p>
            <p style={{ color: auraColor }}>Resonance Signature Active</p>
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
            <h3>📜 Evolution History</h3>
            {evolutionHistory.map((entry, index) => (
              <p key={index}>• {entry}</p>
            ))}
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,215,0,0.05)",
              border: "1px solid #333",
            }}
          >
            <h3>🏛 Evolution Path</h3>
            <p>🌱 Root Wanderer</p>
            <p>↓</p>
            <p>🔹 Cycle Seeker</p>
            <p>↓</p>
            <p>🌿 Confluence Walker</p>
            <p>↓</p>
            <p>✨ Resonance Keeper</p>
            <p>↓</p>
            <p>👑 Ascendant Rootspeaker</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,215,0,0.05)",
              border: "1px solid #333",
            }}
          >
            <h3>🏅 Achievement Badges</h3>
            <p>🏅 First Awakening</p>
            <p>🔮 Relic Discoverer</p>
            <p>🌊 Convergence-Touched</p>
            <p>⏳ Cycle Survivor</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(0,255,255,0.05)",
              border: "1px solid #333",
            }}
          >
            <h3>🌍 World Reputation</h3>
            <p><strong>Standing:</strong> Known Wanderer</p>
            <p><strong>Faction:</strong> Convergence-Touched</p>
            <p><strong>Influence:</strong> {reputation}</p>
            <p><strong>Reputation Rank:</strong> Local Figure</p>
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
            <h3>🏰 Faction Alignment</h3>
            <p><strong>Faction:</strong> Convergence-Touched</p>
            <p><strong>Alignment:</strong> Loyal</p>
            <p><strong>Influence:</strong> {reputation}</p>
            <p><strong>Standing:</strong> Trusted Operative</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(0,80,120,0.15)",
              border: "1px solid #333",
            }}
          >
            <h3>🗺 Territory Influence</h3>
            <p><strong>Region:</strong> Astra-Vey Frontier</p>
            <p><strong>Control:</strong> 8%</p>
            <p><strong>Influence:</strong> Growing</p>
            <p><strong>Next Unlock:</strong> Frontier Outpost</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(120,80,0,0.15)",
              border: "1px solid #333",
            }}
          >
            <h3>🏛 Settlement Development</h3>
            <p><strong>Settlement:</strong> Frontier Outpost</p>
            <p><strong>Level:</strong> I</p>
            <p><strong>Population:</strong> 24</p>
            <p><strong>Development:</strong> 18%</p>
            <p><strong>Next Upgrade:</strong> Trading Post</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(120,0,0,0.15)",
              border: "1px solid #333",
            }}
          >
            <h3>⚔️ Active Expedition</h3>
            <p><strong>Destination:</strong> Silent Frontier</p>
            <p><strong>Status:</strong> Exploring</p>
            <p><strong>Progress:</strong> 32%</p>
            <p><strong>Discovery Chance:</strong> Moderate</p>
            <p><strong>Next Reward:</strong> Ancient Relic</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(80,40,120,0.15)",
              border: "1px solid #333",
            }}
          >
            <h3>🏺 Relic Collection</h3>
            <p><strong>Collected:</strong> {relics}</p>
            <p><strong>Active Relic:</strong> {relic}</p>
            <p><strong>Rarity:</strong> Ancient</p>
            <p><strong>Collection Bonus:</strong> +5% Resonance</p>
            <p><strong>Next Relic:</strong> Unknown</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(80,80,20,0.15)",
              border: "1px solid #333",
            }}
          >
            <h3>📜 Quest Log</h3>
            <p><strong>Active Quest:</strong> Echoes of the Silence Tide</p>
            <p><strong>Objective:</strong> Recover a lost relic</p>
            <p><strong>Progress:</strong> 1 / 3 Clues Found</p>
            <p><strong>Reward:</strong> Ancient Relic Cache</p>
            <p><strong>Status:</strong> Active</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(0,120,80,0.15)",
              border: "1px solid #333",
            }}
          >
            <h3>🧬 Mutation Tracker</h3>
            <p><strong>Mutation State:</strong> Stable</p>
            <p><strong>Exposure:</strong> Silence Tide</p>
            <p><strong>Mutation Chance:</strong> 4%</p>
            <p><strong>Potential Trait:</strong> Echo Sight</p>
            <p><strong>Status:</strong> Monitoring</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(60,60,100,0.15)",
              border: "1px solid #333",
            }}
          >
            <h3>🎒 Inventory</h3>
            <p><strong>Capacity:</strong> 4 / 20</p>
            <p><strong>Relics:</strong> {relics}</p>
            <p><strong>Artifacts:</strong> 1</p>
            <p><strong>Resources:</strong> 1</p>
            <p><strong>Rare Item:</strong> Ancient Compass</p>
            <p><strong>Status:</strong> Organized</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(40,80,60,0.2)",
              border: "1px solid #333",
            }}
          >
            <h3>👥 Companion</h3>
            <p><strong>Name:</strong> Echo Wisp</p>
            <p><strong>Type:</strong> Relic Spirit</p>
            <p><strong>Bond Level:</strong> {companionBond}%</p>
            <p><strong>Ability:</strong> Detect Hidden Relics</p>
            <p><strong>Mood:</strong> Curious</p>
            <p><strong>Status:</strong> Following</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(80,60,20,0.2)",
              border: "1px solid #333",
            }}
          >
            <h3>📅 World Events Timeline</h3>
            <p>🌊 Cycle 11 — The Silence Tide Begins</p>
            <p>🏺 Cycle 10 — Echo of Cycle 1 Discovered</p>
            <p>🌍 Cycle 8 — Convergence Era Declared</p>
            <p>✨ Cycle 3 — First Resonance Surge</p>
            <p>🌱 Cycle 1 — Rootspeaker Awakening</p>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(90,70,20,0.2)",
              border: "1px solid #333",
            }}
          >
            <h3>🏆 Achievement Gallery</h3>

            {achievementFirstAwakening && <p>🥇 First Awakening</p>}
            {achievementRelicHunter && <p>🏺 Relic Hunter</p>}
            {achievementSpiritbound && <p>👥 Spiritbound</p>}
            {achievementLegendary && <p>🌟 Legendary Rootspeaker</p>}
            {!achievementLegendary && (
              <p>🔒 Next Achievement: Legendary Rootspeaker</p>
            )}
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(80,20,20,0.25)",
              border: "1px solid #333",
            }}
          >
            <h3>🎲 {events[eventIndex].title}</h3>
            <p>{events[eventIndex].description}</p>

            <button onClick={() => chooseDecision("A")}>
              Investigate the Signal
            </button>

            <button
              onClick={() => chooseDecision("B")}
              style={{ marginLeft: "10px" }}
            >
              Secure Relic Cache
            </button>

            <button
              onClick={() => chooseDecision("C")}
              style={{ marginLeft: "10px" }}
            >
              Return to Outpost
            </button>

            {decision === "A" && (
              <p>🔮 Echo Wisp discovers an ancient resonance chamber.</p>
            )}

            {decision === "B" && (
              <p>🏺 You secure a cache containing forgotten relic fragments.</p>
            )}

            {decision === "C" && (
              <p>🏛 You return safely to Frontier Outpost with your findings.</p>
            )}

            <p>
              <strong>Status:</strong>{" "}
              {decision ? "Decision Recorded" : "Awaiting Decision"}
            </p>

            {decision && (
              <button
                onClick={() => {
                  setDecision(null);
                  setEventIndex((i) => (i + 1) % events.length);
                }}
                style={{
                  marginTop: "12px",
                  padding: "10px 16px",
                  borderRadius: "999px",
                  border: "1px solid #333",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Generate New Event
              </button>
            )}
          </div>

          <div style={{ marginTop: "12px" }}>
            <strong>📈 Rank Progress</strong>

            <div
              style={{
                height: "12px",
                background: "#222",
                borderRadius: "999px",
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  width: `${rankProgress}%`,
                  height: "100%",
                  background: rankColor,
                  transition: "width 0.5s ease",
                }}
              />
            </div>

            <p style={{ marginTop: "8px", fontWeight: "bold" }}>
  {displayRank}
</p>

            <p>Evolution Readiness: {evolutionReadiness}%</p>

            <p>
              <strong>Unlocked Ability:</strong> 🔮 {currentRankAbility}
            </p>

            <p
  style={{
    color: hasEvolved ? "cyan" : evolutionReady ? "lime" : "#aaa",
    fontWeight: "bold",
  }}
>
  Status: {hasEvolved
    ? "ASCENDED"
    : evolutionReady
    ? "READY TO EVOLVE"
    : "Dormant"}
</p>

            {evolutionReady && !hasEvolved ? (
  <p style={{ color: "lime", fontWeight: "bold", marginTop: "12px" }}>
    🌱 Evolution Available — the Rootspeaker is ready to ascend.
  </p>
) : !hasEvolved ? (
  <p style={{ color: "#888", marginTop: "12px" }}>
    Evolution remains dormant until the required cycle is reached.
  </p>
) : null}

            {canEvolve && !hasEvolved && (
              <button
                onClick={() => {
  setHasEvolved(true);
  setEvolvedStage(nextEvolution);
  setReputation((r) => r + 25);
  setRelics((r) => r + 5);
  setCompanionBond((b) => b + 10);
}}
                style={{
                  marginTop: "15px",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  border: "1px solid lime",
                  background: "rgba(0,255,0,0.12)",
                  color: "lime",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                🌱 Evolve Rootspeaker
              </button>
            )}

            {hasEvolved && (
  <>
    <div
      style={{
        marginTop: "15px",
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(0,255,0,0.08)",
        border: "1px solid lime",
        color: "lime",
        fontWeight: "bold",
      }}
    >
      🌱 Evolution Complete — this Rootspeaker has begun its ascension.
    </div>

    <button
      onClick={() => {
  setHasEvolved(false);
  setEvolvedStage(null);
  setRealityWeaveUsed(false);
  setWorldEvent("Silence Tide");
}}
      style={{
        marginTop: "12px",
        padding: "10px 16px",
        borderRadius: "999px",
        border: "1px solid #555",
        background: "#111",
        color: "white",
        cursor: "pointer",
      }}
    >
      Reset Evolution Test
    </button>
  </>
)}

            {rankIVUnlocked && !hasEvolved && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "rgba(0,255,255,0.08)",
                  border: "1px solid cyan",
                }}
              >
                <h3>🌌 Rank IV Rewards</h3>
                <p>✨ Ability: Temporal Echo</p>
                <p>🌠 Aura Upgrade: Celestial Resonance</p>
                <p>🏺 +5 Relics</p>
                <p>⭐ +10 Reputation</p>
              </div>
            )}
{hasEvolved && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,215,0,0.08)",
      border: "1px solid gold",
    }}
  >
    <h3>🏆 Ascension Rewards</h3>

    <p>✨ Ability: Reality Weaving</p>
    <p>👑 Title: Worldshaper</p>
    <p>🌌 Aura: Cosmic Violet</p>
    <p>🏺 +5 Relics</p>
    <p>⭐ +25 Reputation</p>
    <p>🤝 +10 Companion Bond</p>
  </div>
)}
{hasEvolved && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(180,0,255,0.08)",
      border: "1px solid violet",
    }}
  >
    <h3>🌌 Reality Weaving</h3>

    <p>The Worldshaper can bend the frontier’s fate.</p>

    {!realityWeaveUsed ? (
      <button
        onClick={() => {
  setRelics((r) => r + 10);
  setReputation((r) => r + 15);
  setRealityWeaveUsed(true);
  const randomEvent =
  WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];

setWorldEvent(randomEvent);
if (randomEvent === "Relic Rain") {
  setRelics((r) => r + 10);
}

if (randomEvent === "Convergence Bloom") {
  setReputation((r) => r + 25);
}

if (randomEvent === "Temporal Storm") {
  setWorld((w: any) => ({
    ...w,
    cycle: (w?.cycle || 0) + 10,
  }));
}

if (randomEvent === "Echo Harvest") {
  setCompanionBond((b) => b + 20);
}
if (randomEvent === "Void Eclipse") {
  const relic =
    LEGENDARY_RELICS[
      Math.floor(Math.random() * LEGENDARY_RELICS.length)
    ];

  setLegendaryRelics((current) =>
  current.includes(relic)
    ? current
    : [...current, relic]
);
}

  setWorld((w: any) => ({
    ...w,
    cycle: (w?.cycle || 0) + 5,
  }));
}}
        style={{
          marginTop: "12px",
          padding: "10px 16px",
          borderRadius: "999px",
          border: "1px solid violet",
          background: "rgba(180,0,255,0.12)",
          color: "violet",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        🌌 Weave Reality
      </button>
    ) : (
      <p style={{ color: "violet", fontWeight: "bold" }}>
        Reality has already been woven.
      </p>
    )}
  </div>
)}
          </div>
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

      <h2 style={{ marginTop: "40px" }}>Evolution History</h2>

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
