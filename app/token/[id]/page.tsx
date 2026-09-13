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
  const [forgedArtifacts, setForgedArtifacts] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState(
  "Nexus Expansion Mandate"
);
  const [activeProject, setActiveProject] = useState(
  "Nexus Megastructure"
);
const [projectProgress, setProjectProgress] = useState(0);
const [completedProjects, setCompletedProjects] =
  useState<string[]>([]);
const galacticWonderUnlocked =
  completedProjects.length >= 4;

const galacticWonder =
  galacticWonderUnlocked
    ? "Worldforge Array"
    : "Locked";

const galacticWonderEffect =
  galacticWonderUnlocked
    ? "+50 Empire Growth"
    : "Complete all civilization projects";

const galacticWonderBonus =
  galacticWonderUnlocked
    ? 50
    : 0;
const civilizationAge =
  galacticWonderUnlocked
    ? "Legendary Age"
    : completedProjects.length >= 2
    ? "Expansion Age"
    : "Founding Age";
const civilizationAgeBonus =
  civilizationAge === "Legendary Age"
    ? 25
    : civilizationAge === "Expansion Age"
    ? 10
    : 0;
const civilizationAscensionUnlocked =
  civilizationAge === "Legendary Age" &&
  galacticWonderUnlocked;

const civilizationAscension =
  civilizationAscensionUnlocked
    ? "Ascendant Civilization"
    : "Not Yet Ascended";
const civilizationAscensionBonus =
  civilizationAscensionUnlocked
    ? 100
    : 0;
useEffect(() => {
  const saved = localStorage.getItem("civilization-save");

  if (saved) {
    const data = JSON.parse(saved);

    setActiveProject(data.activeProject ?? "Nexus Megastructure");
    setProjectProgress(data.projectProgress ?? 0);
    setCompletedProjects(data.completedProjects ?? []);
    setSelectedPolicy(data.selectedPolicy ?? "Nexus Expansion Mandate");
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "civilization-save",
    JSON.stringify({
      activeProject,
      projectProgress,
      completedProjects,
      selectedPolicy,
    })
  );
}, [
  activeProject,
  projectProgress,
  completedProjects,
  selectedPolicy,
]);

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
    setForgedArtifacts(data.forgedArtifacts ?? []);
    setSelectedPolicy(
  data.selectedPolicy ?? "Nexus Expansion Mandate"
);
setActiveProject(
  data.activeProject ?? "Nexus Megastructure"
);

setProjectProgress(
  data.projectProgress ?? 0
);
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
    forgedArtifacts,
    selectedPolicy,
    activeProject,
    projectProgress,
  })
);
}, [
  reputation,
  relics,
  companionBond,
  hasEvolved,
  evolvedStage,
  realityWeaveUsed,
  worldEvent,
  legendaryRelics,
  forgedArtifacts,
  id,
  statsLoaded,
]);

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
const settlementBonus = forgedArtifacts.includes("Living Worldseed")
  ? 10
  : 0;

const settlementDevelopment = Math.min(
  100,
  18 +
    settlementBonus +
    Math.floor(reputation / 10) +
    Math.floor(relics / 50)
);

const settlementPopulation =
  24 + Math.floor(settlementDevelopment / 5);

const settlementLevel =
  settlementDevelopment >= 75
    ? "III"
    : settlementDevelopment >= 40
    ? "II"
    : "I";

const nextSettlementUpgrade =
  settlementLevel === "I"
    ? "Trading Post"
    : settlementLevel === "II"
    ? "Harmonic Citadel"
    : "World Nexus";
const settlementStatus =
  settlementLevel === "III"
    ? "Fully Developed"
    : nextSettlementUpgrade;

const unlockedBuildings = ["Frontier Hall"];

if (settlementLevel === "II" || settlementLevel === "III") {
  unlockedBuildings.push("Trading Post");
}

if (settlementLevel === "III") {
  unlockedBuildings.push("Harmonic Citadel");
}

const buildingPopulationBonus =
  unlockedBuildings.includes("Frontier Hall")
    ? 5
    : 0;

const totalPopulation =
  settlementPopulation + buildingPopulationBonus;

const reputationBuildingBonus =
  unlockedBuildings.includes("Trading Post")
    ? 10
    : 0;

const expeditionBonus =
  forgedArtifacts.includes("Celestial Navigator")
    ? 10
    : 0;

const expeditionProgress =
  32 + expeditionBonus;

const activePolicy = selectedPolicy;

const policyEffect =
  activePolicy === "Nexus Expansion Mandate"
    ? "+10 Region Control"
    : activePolicy === "Trade Stabilization Accord"
    ? "+10 Treasury Growth"
    : activePolicy === "Frontier Cooperation Pact"
    ? "+5 Colony Stability"
    : "None";

const policyRegionBonus =
  activePolicy === "Nexus Expansion Mandate"
    ? 10
    : 0;

const policyTreasuryBonus =
  activePolicy === "Trade Stabilization Accord"
    ? 100
    : 0;

const policyColonyBonus =
  activePolicy === "Frontier Cooperation Pact"
    ? 1
    : 0;

const nexusInfluence =
  settlementLevel === "III"
    ? 25
    : settlementLevel === "II"
    ? 10
    : 0;

const regionControl =
  8 + nexusInfluence + policyRegionBonus;

const regionStatus =
  regionControl >= 50
    ? "Established"
    : regionControl >= 25
    ? "Expanding"
    : "Frontier";

const colonyCount =
  (
    regionControl >= 75
      ? 3
      : regionControl >= 50
      ? 2
      : regionControl >= 25
      ? 1
      : 0
  ) + policyColonyBonus;

const colonyStatus =
  colonyCount > 0
    ? "Operational"
    : "Not Established";

const tradeRoutes = colonyCount;

const tradeIncome =
  tradeRoutes * 25;

const tradeStatus =
  tradeRoutes > 0
    ? "Active"
    : "Inactive";

const treasury =
  tradeIncome * 10 + policyTreasuryBonus;

const treasuryStatus =
  treasury >= 500
    ? "Prosperous"
    : treasury >= 250
    ? "Growing"
    : "Developing";

const treasuryBonus =
  treasury >= 500
    ? 20
    : treasury >= 250
    ? 10
    : 5;

const projectCompleted =
  projectProgress >= 100;

const projectBonus =
  projectCompleted
    ? activeProject === "Nexus Megastructure"
      ? 25
      : activeProject === "Stellar Shipyards"
      ? 10
      : activeProject === "Grand Archive"
      ? 50
      : activeProject === "Harmonic Beacon"
      ? 15
      : 0
    : 0;

const tradeRouteBonus =
  unlockedBuildings.includes("Trading Post")
    ? 5
    : 0;

const totalExpeditionProgress =
  expeditionProgress +
  tradeRouteBonus +
  (
    activeProject === "Stellar Shipyards"
      ? projectBonus
      : 0
  );

const totalReputation =
  reputation +
  reputationBuildingBonus +
  treasuryBonus +
  (
    activeProject === "Grand Archive"
      ? projectBonus
      : 0
  );

const factionInfluence =
  Math.min(
    100,
    Math.floor(
      (
        totalReputation +
        (
          activeProject === "Nexus Megastructure"
            ? projectBonus
            : 0
        )
      ) / 50
    )
  );

const factionRank =
  factionInfluence >= 75
    ? "Council Power"
    : factionInfluence >= 50
    ? "Regional Authority"
    : factionInfluence >= 25
    ? "Trusted Ally"
    : "Local Contact";

const diplomaticRelations =
  factionInfluence >= 75
    ? 3
    : factionInfluence >= 50
    ? 2
    : factionInfluence >= 25
    ? 1
    : 0;

const diplomaticStatus =
  diplomaticRelations >= 3
    ? "Council Member"
    : diplomaticRelations >= 2
    ? "Recognized Power"
    : diplomaticRelations >= 1
    ? "Known Contact"
    : "Unknown";

const councilSeats =
  diplomaticRelations;

const councilRank =
  factionInfluence >= 75
    ? "High Council"
    : factionInfluence >= 50
    ? "Council Delegate"
    : "Observer";

const councilVotingPower =
  councilSeats * 10;

const empireTerritories =
  colonyCount +
  Math.floor(councilVotingPower / 10) +
  galacticWonderBonus +
  civilizationAgeBonus +
  civilizationAscensionBonus;
const ascensionLevel =
  !civilizationAscensionUnlocked
    ? 0
    : empireTerritories >= 250
    ? 3
    : empireTerritories >= 200
    ? 2
    : 1;
const ascensionTier =
  ascensionLevel >= 3
    ? "Transcendent Dominion"
    : ascensionLevel >= 2
    ? "Galactic Ascendancy"
    : ascensionLevel >= 1
    ? "Ascendant Civilization"
    : "Unascended";
const ascensionLevelBonus =
  ascensionLevel >= 3
    ? 75
    : ascensionLevel >= 2
    ? 40
    : ascensionLevel >= 1
    ? 15
    : 0;
const ascensionPower =
  civilizationAscensionBonus +
  ascensionLevelBonus;
const ascensionPowerRank =
  ascensionPower >= 175
    ? "Cosmic Sovereign"
    : ascensionPower >= 140
    ? "Galactic Ascendant"
    : ascensionPower >= 115
    ? "Ascendant Power"
    : "Dormant";
const transcendenceUnlocked =
  ascensionPower >= 175 &&
  ascensionLevel >= 3;

const transcendenceState =
  transcendenceUnlocked
    ? "Transcendent Civilization"
    : "Locked";
const transcendenceBonus =
  transcendenceUnlocked
    ? 250
    : 0;
const transcendencePower =
  ascensionPower +
  transcendenceBonus;
const transcendenceRank =
  transcendencePower >= 425
    ? "Reality Sovereign"
    : transcendencePower >= 390
    ? "Cosmic Transcendent"
    : transcendencePower >= 365
    ? "Transcendent Power"
    : "Pre-Transcendent";
const realityAscensionUnlocked =
  transcendenceUnlocked &&
  transcendenceRank === "Reality Sovereign";

const realityAscensionState =
  realityAscensionUnlocked
    ? "Reality-Ascendant Civilization"
    : "Locked";
const realityAscensionBonus =
  realityAscensionUnlocked
    ? 500
    : 0;
const realityPower =
  transcendencePower +
  realityAscensionBonus;
const realityPowerRank =
  realityPower >= 925
    ? "Continuum Sovereign"
    : realityPower >= 890
    ? "Reality Architect"
    : realityPower >= 865
    ? "Reality Ascendant"
    : "Pre-Reality";
const continuumPower =
  realityPower +
  civilizationAscensionBonus +
  galacticWonderBonus;

const continuumPowerRank =
  continuumPower >= 1000
    ? "Continuum Transcendent"
    : continuumPower >= 950
    ? "Continuum Master"
    : continuumPower >= 900
    ? "Continuum Initiate"
    : "Below Continuum";
const continuumAscensionBonus =
  continuumPower >= 1000
    ? 40
    : continuumPower >= 950
    ? 25
    : continuumPower >= 900
    ? 15
    : 0;
const effectiveContinuumPower =
  continuumPower +
  continuumAscensionBonus;
const continuumEvolutionRank =
  effectiveContinuumPower >= 1050
    ? "Infinite Continuum"
    : effectiveContinuumPower >= 1000
    ? "Transcendent Continuum"
    : effectiveContinuumPower >= 950
    ? "Awakened Continuum"
    : "Emergent Continuum";
const continuumEvolutionBonus =
  effectiveContinuumPower >= 1050
    ? 50
    : effectiveContinuumPower >= 1000
    ? 35
    : effectiveContinuumPower >= 950
    ? 20
    : 5;
const totalContinuumAuthority =
  effectiveContinuumPower +
  continuumEvolutionBonus;
const continuumAuthorityRank =
  totalContinuumAuthority >= 1100
    ? "Absolute Continuum"
    : totalContinuumAuthority >= 1050
    ? "Continuum Dominion"
    : totalContinuumAuthority >= 1000
    ? "Continuum Authority"
    : "Continuum Aspirant";
const continuumAuthorityBonus =
  totalContinuumAuthority >= 1100
    ? 60
    : totalContinuumAuthority >= 1050
    ? 40
    : totalContinuumAuthority >= 1000
    ? 25
    : 10;
const effectiveContinuumAuthority =
  totalContinuumAuthority +
  continuumAuthorityBonus;
const continuumSovereigntyRank =
  effectiveContinuumAuthority >= 1175
    ? "Sovereign of Continuity"
    : effectiveContinuumAuthority >= 1125
    ? "Continuum Sovereign"
    : effectiveContinuumAuthority >= 1075
    ? "Continuum Regent"
    : "Continuum Emergent";
const continuumSovereigntyBonus =
  effectiveContinuumAuthority >= 1175
    ? 75
    : effectiveContinuumAuthority >= 1125
    ? 50
    : effectiveContinuumAuthority >= 1075
    ? 30
    : 15;
const totalRealityDominion =
  effectiveContinuumAuthority +
  continuumSovereigntyBonus;
const realityDominionRank =
  totalRealityDominion >= 1250
    ? "Absolute Reality Dominion"
    : totalRealityDominion >= 1200
    ? "Reality Sovereign"
    : totalRealityDominion >= 1150
    ? "Reality Regent"
    : "Emergent Dominion";
const realityDominionBonus =
  totalRealityDominion >= 1250
    ? 90
    : totalRealityDominion >= 1200
    ? 60
    : totalRealityDominion >= 1150
    ? 35
    : 20;
const effectiveRealityDominion =
  totalRealityDominion +
  realityDominionBonus;
const transRealityRank =
  effectiveRealityDominion >= 1350
    ? "Trans-Reality Sovereign"
    : effectiveRealityDominion >= 1300
    ? "Trans-Reality Architect"
    : effectiveRealityDominion >= 1250
    ? "Trans-Reality Ascendant"
    : "Pre-Trans-Reality";
const transRealityBonus =
  effectiveRealityDominion >= 1350
    ? 100
    : effectiveRealityDominion >= 1300
    ? 70
    : effectiveRealityDominion >= 1250
    ? 40
    : 20;
const totalTransRealityPower =
  effectiveRealityDominion +
  transRealityBonus;
const transRealitySovereigntyRank =
  totalTransRealityPower >= 1450
    ? "Absolute Trans-Reality"
    : totalTransRealityPower >= 1400
    ? "Trans-Reality Sovereign"
    : totalTransRealityPower >= 1350
    ? "Trans-Reality Regent"
    : "Emergent Trans-Reality";
const transRealitySovereigntyBonus =
  totalTransRealityPower >= 1450
    ? 120
    : totalTransRealityPower >= 1400
    ? 85
    : totalTransRealityPower >= 1350
    ? 50
    : 25;
const effectiveTransRealitySovereignty =
  totalTransRealityPower +
  transRealitySovereigntyBonus;
const metaRealityRank =
  effectiveTransRealitySovereignty >= 1600
    ? "Meta-Reality Sovereign"
    : effectiveTransRealitySovereignty >= 1525
    ? "Meta-Reality Architect"
    : effectiveTransRealitySovereignty >= 1475
    ? "Meta-Reality Ascendant"
    : "Pre-Meta-Reality";
const metaRealityBonus =
  effectiveTransRealitySovereignty >= 1600
    ? 140
    : effectiveTransRealitySovereignty >= 1525
    ? 100
    : effectiveTransRealitySovereignty >= 1475
    ? 60
    : 30;
const totalMetaRealityPower =
  effectiveTransRealitySovereignty +
  metaRealityBonus;
const metaRealitySovereigntyRank =
  totalMetaRealityPower >= 1750
    ? "Absolute Meta-Reality"
    : totalMetaRealityPower >= 1675
    ? "Meta-Reality Sovereign"
    : totalMetaRealityPower >= 1600
    ? "Meta-Reality Regent"
    : "Emergent Meta-Reality";
const metaRealitySovereigntyBonus =
  totalMetaRealityPower >= 1750
    ? 160
    : totalMetaRealityPower >= 1675
    ? 115
    : totalMetaRealityPower >= 1600
    ? 70
    : 35;
const effectiveMetaRealitySovereignty =
  totalMetaRealityPower +
  metaRealitySovereigntyBonus;
const ontologicalRank =
  effectiveMetaRealitySovereignty >= 1950
    ? "Ontological Sovereign"
    : effectiveMetaRealitySovereignty >= 1850
    ? "Ontological Architect"
    : effectiveMetaRealitySovereignty >= 1750
    ? "Ontological Ascendant"
    : "Pre-Ontological";
const ontologicalBonus =
  effectiveMetaRealitySovereignty >= 1950
    ? 180
    : effectiveMetaRealitySovereignty >= 1850
    ? 130
    : effectiveMetaRealitySovereignty >= 1750
    ? 80
    : 40;
const totalOntologicalPower =
  effectiveMetaRealitySovereignty +
  ontologicalBonus;
const ontologicalSovereigntyRank =
  totalOntologicalPower >= 2150
    ? "Absolute Ontology"
    : totalOntologicalPower >= 2050
    ? "Ontological Sovereign"
    : totalOntologicalPower >= 1950
    ? "Ontological Regent"
    : "Emergent Ontology";
const ontologicalSovereigntyBonus =
  totalOntologicalPower >= 2150
    ? 200
    : totalOntologicalPower >= 2050
    ? 145
    : totalOntologicalPower >= 1950
    ? 90
    : 45;
const effectiveOntologicalSovereignty =
  totalOntologicalPower +
  ontologicalSovereigntyBonus;
const transOntologicalRank =
  effectiveOntologicalSovereignty >= 2400
    ? "Trans-Ontological Sovereign"
    : effectiveOntologicalSovereignty >= 2275
    ? "Trans-Ontological Architect"
    : effectiveOntologicalSovereignty >= 2175
    ? "Trans-Ontological Ascendant"
    : "Pre-Trans-Ontological";
const transOntologicalBonus =
  effectiveOntologicalSovereignty >= 2400
    ? 225
    : effectiveOntologicalSovereignty >= 2275
    ? 160
    : effectiveOntologicalSovereignty >= 2175
    ? 100
    : 50;
const totalTransOntologicalPower =
  effectiveOntologicalSovereignty +
  transOntologicalBonus;
const transOntologicalSovereigntyRank =
  totalTransOntologicalPower >= 2650
    ? "Absolute Trans-Ontology"
    : totalTransOntologicalPower >= 2525
    ? "Trans-Ontological Sovereign"
    : totalTransOntologicalPower >= 2400
    ? "Trans-Ontological Regent"
    : "Emergent Trans-Ontology";
const transOntologicalSovereigntyBonus =
  totalTransOntologicalPower >= 2650
    ? 250
    : totalTransOntologicalPower >= 2525
    ? 180
    : totalTransOntologicalPower >= 2400
    ? 110
    : 55;
const effectiveTransOntologicalSovereignty =
  totalTransOntologicalPower +
  transOntologicalSovereigntyBonus;
const axiomaticRank =
  effectiveTransOntologicalSovereignty >= 2950
    ? "Axiomatic Sovereign"
    : effectiveTransOntologicalSovereignty >= 2800
    ? "Axiomatic Architect"
    : effectiveTransOntologicalSovereignty >= 2675
    ? "Axiomatic Ascendant"
    : "Pre-Axiomatic";
const axiomaticBonus =
  effectiveTransOntologicalSovereignty >= 2950
    ? 275
    : effectiveTransOntologicalSovereignty >= 2800
    ? 195
    : effectiveTransOntologicalSovereignty >= 2675
    ? 120
    : 60;
const totalAxiomaticPower =
  effectiveTransOntologicalSovereignty +
  axiomaticBonus;
const axiomaticSovereigntyRank =
  totalAxiomaticPower >= 3250
    ? "Absolute Axiom"
    : totalAxiomaticPower >= 3100
    ? "Axiomatic Sovereign"
    : totalAxiomaticPower >= 2950
    ? "Axiomatic Regent"
    : "Emergent Axiom";
const axiomaticSovereigntyBonus =
  totalAxiomaticPower >= 3250
    ? 300
    : totalAxiomaticPower >= 3100
    ? 215
    : totalAxiomaticPower >= 2950
    ? 130
    : 65;
const effectiveAxiomaticSovereignty =
  totalAxiomaticPower +
  axiomaticSovereigntyBonus;
const transAxiomaticRank =
  effectiveAxiomaticSovereignty >= 3600
    ? "Trans-Axiomatic Sovereign"
    : effectiveAxiomaticSovereignty >= 3425
    ? "Trans-Axiomatic Architect"
    : effectiveAxiomaticSovereignty >= 3275
    ? "Trans-Axiomatic Ascendant"
    : "Pre-Trans-Axiomatic";
const transAxiomaticBonus =
  effectiveAxiomaticSovereignty >= 3600
    ? 325
    : effectiveAxiomaticSovereignty >= 3425
    ? 235
    : effectiveAxiomaticSovereignty >= 3275
    ? 140
    : 70;
const totalTransAxiomaticPower =
  effectiveAxiomaticSovereignty +
  transAxiomaticBonus;
const transAxiomaticSovereigntyRank =
  totalTransAxiomaticPower >= 3950
    ? "Absolute Trans-Axiom"
    : totalTransAxiomaticPower >= 3775
    ? "Trans-Axiomatic Sovereign"
    : totalTransAxiomaticPower >= 3600
    ? "Trans-Axiomatic Regent"
    : "Emergent Trans-Axiom";
const transAxiomaticSovereigntyBonus =
  totalTransAxiomaticPower >= 3950
    ? 350
    : totalTransAxiomaticPower >= 3775
    ? 255
    : totalTransAxiomaticPower >= 3600
    ? 150
    : 75;
const effectiveTransAxiomaticSovereignty =
  totalTransAxiomaticPower +
  transAxiomaticSovereigntyBonus;
const metaAxiomaticRank =
  effectiveTransAxiomaticSovereignty >= 4350
    ? "Meta-Axiomatic Sovereign"
    : effectiveTransAxiomaticSovereignty >= 4150
    ? "Meta-Axiomatic Architect"
    : effectiveTransAxiomaticSovereignty >= 3975
    ? "Meta-Axiomatic Ascendant"
    : "Pre-Meta-Axiomatic";
const metaAxiomaticBonus =
  effectiveTransAxiomaticSovereignty >= 4350
    ? 375
    : effectiveTransAxiomaticSovereignty >= 4150
    ? 275
    : effectiveTransAxiomaticSovereignty >= 3975
    ? 160
    : 80;
const totalMetaAxiomaticPower =
  effectiveTransAxiomaticSovereignty +
  metaAxiomaticBonus;
const metaAxiomaticSovereigntyRank =
  totalMetaAxiomaticPower >= 4750
    ? "Absolute Meta-Axiom"
    : totalMetaAxiomaticPower >= 4550
    ? "Meta-Axiomatic Sovereign"
    : totalMetaAxiomaticPower >= 4350
    ? "Meta-Axiomatic Regent"
    : "Emergent Meta-Axiom";
const metaAxiomaticSovereigntyBonus =
  totalMetaAxiomaticPower >= 4750
    ? 400
    : totalMetaAxiomaticPower >= 4550
    ? 295
    : totalMetaAxiomaticPower >= 4350
    ? 170
    : 85;
const effectiveMetaAxiomaticSovereignty =
  totalMetaAxiomaticPower +
  metaAxiomaticSovereigntyBonus;
const transMetaAxiomaticRank =
  effectiveMetaAxiomaticSovereignty >= 5200
    ? "Trans-Meta-Axiomatic Sovereign"
    : effectiveMetaAxiomaticSovereignty >= 4975
    ? "Trans-Meta-Axiomatic Architect"
    : effectiveMetaAxiomaticSovereignty >= 4775
    ? "Trans-Meta-Axiomatic Ascendant"
    : "Pre-Trans-Meta-Axiomatic";
const transMetaAxiomaticBonus =
  effectiveMetaAxiomaticSovereignty >= 5200
    ? 425
    : effectiveMetaAxiomaticSovereignty >= 4975
    ? 315
    : effectiveMetaAxiomaticSovereignty >= 4775
    ? 180
    : 90;
const totalTransMetaAxiomaticPower =
  effectiveMetaAxiomaticSovereignty +
  transMetaAxiomaticBonus;
const transMetaAxiomaticSovereigntyRank =
  totalTransMetaAxiomaticPower >= 5650
    ? "Absolute Trans-Meta-Axiom"
    : totalTransMetaAxiomaticPower >= 5425
    ? "Trans-Meta-Axiomatic Sovereign"
    : totalTransMetaAxiomaticPower >= 5200
    ? "Trans-Meta-Axiomatic Regent"
    : "Emergent Trans-Meta-Axiom";
const transMetaAxiomaticSovereigntyBonus =
  totalTransMetaAxiomaticPower >= 5650
    ? 450
    : totalTransMetaAxiomaticPower >= 5425
    ? 335
    : totalTransMetaAxiomaticPower >= 5200
    ? 190
    : 95;
const effectiveTransMetaAxiomaticSovereignty =
  totalTransMetaAxiomaticPower +
  transMetaAxiomaticSovereigntyBonus;
const supraAxiomaticRank =
  effectiveTransMetaAxiomaticSovereignty >= 6150
    ? "Supra-Axiomatic Sovereign"
    : effectiveTransMetaAxiomaticSovereignty >= 5900
    ? "Supra-Axiomatic Architect"
    : effectiveTransMetaAxiomaticSovereignty >= 5675
    ? "Supra-Axiomatic Ascendant"
    : "Pre-Supra-Axiomatic";
const supraAxiomaticBonus =
  effectiveTransMetaAxiomaticSovereignty >= 6150
    ? 475
    : effectiveTransMetaAxiomaticSovereignty >= 5900
    ? 355
    : effectiveTransMetaAxiomaticSovereignty >= 5675
    ? 200
    : 100;
const totalSupraAxiomaticPower =
  effectiveTransMetaAxiomaticSovereignty +
  supraAxiomaticBonus;
const supraAxiomaticSovereigntyRank =
  totalSupraAxiomaticPower >= 6650
    ? "Absolute Supra-Axiom"
    : totalSupraAxiomaticPower >= 6400
    ? "Supra-Axiomatic Sovereign"
    : totalSupraAxiomaticPower >= 6150
    ? "Supra-Axiomatic Regent"
    : "Emergent Supra-Axiom";
const supraAxiomaticSovereigntyBonus =
  totalSupraAxiomaticPower >= 6650
    ? 500
    : totalSupraAxiomaticPower >= 6400
    ? 375
    : totalSupraAxiomaticPower >= 6150
    ? 210
    : 105;
const effectiveSupraAxiomaticSovereignty =
  totalSupraAxiomaticPower +
  supraAxiomaticSovereigntyBonus;
const postAxiomaticRank =
  effectiveSupraAxiomaticSovereignty >= 7200
    ? "Post-Axiomatic Sovereign"
    : effectiveSupraAxiomaticSovereignty >= 6925
    ? "Post-Axiomatic Architect"
    : effectiveSupraAxiomaticSovereignty >= 6675
    ? "Post-Axiomatic Ascendant"
    : "Pre-Post-Axiomatic";
const postAxiomaticBonus =
  effectiveSupraAxiomaticSovereignty >= 7200
    ? 525
    : effectiveSupraAxiomaticSovereignty >= 6925
    ? 395
    : effectiveSupraAxiomaticSovereignty >= 6675
    ? 220
    : 110;
const totalPostAxiomaticPower =
  effectiveSupraAxiomaticSovereignty +
  postAxiomaticBonus;
const postAxiomaticSovereigntyRank =
  totalPostAxiomaticPower >= 7750
    ? "Absolute Post-Axiom"
    : totalPostAxiomaticPower >= 7475
    ? "Post-Axiomatic Sovereign"
    : totalPostAxiomaticPower >= 7200
    ? "Post-Axiomatic Regent"
    : "Emergent Post-Axiom";
const postAxiomaticSovereigntyBonus =
  totalPostAxiomaticPower >= 7750
    ? 550
    : totalPostAxiomaticPower >= 7475
    ? 415
    : totalPostAxiomaticPower >= 7200
    ? 230
    : 115;
const effectivePostAxiomaticSovereignty =
  totalPostAxiomaticPower +
  postAxiomaticSovereigntyBonus;
const transPostAxiomaticRank =
  effectivePostAxiomaticSovereignty >= 8350
    ? "Trans-Post-Axiomatic Sovereign"
    : effectivePostAxiomaticSovereignty >= 8050
    ? "Trans-Post-Axiomatic Architect"
    : effectivePostAxiomaticSovereignty >= 7775
    ? "Trans-Post-Axiomatic Ascendant"
    : "Pre-Trans-Post-Axiomatic";
const transPostAxiomaticBonus =
  effectivePostAxiomaticSovereignty >= 8350
    ? 575
    : effectivePostAxiomaticSovereignty >= 8050
    ? 435
    : effectivePostAxiomaticSovereignty >= 7775
    ? 240
    : 120;
const totalTransPostAxiomaticPower =
  effectivePostAxiomaticSovereignty +
  transPostAxiomaticBonus;
const transPostAxiomaticSovereigntyRank =
  totalTransPostAxiomaticPower >= 8950
    ? "Absolute Trans-Post-Axiom"
    : totalTransPostAxiomaticPower >= 8650
    ? "Trans-Post-Axiomatic Sovereign"
    : totalTransPostAxiomaticPower >= 8350
    ? "Trans-Post-Axiomatic Regent"
    : "Emergent Trans-Post-Axiom";
const transPostAxiomaticSovereigntyBonus =
  totalTransPostAxiomaticPower >= 8950
    ? 600
    : totalTransPostAxiomaticPower >= 8650
    ? 455
    : totalTransPostAxiomaticPower >= 8350
    ? 250
    : 125;
const effectiveTransPostAxiomaticSovereignty =
  totalTransPostAxiomaticPower +
  transPostAxiomaticSovereigntyBonus;
const hyperAxiomaticRank =
  effectiveTransPostAxiomaticSovereignty >= 9600
    ? "Hyper-Axiomatic Sovereign"
    : effectiveTransPostAxiomaticSovereignty >= 9275
    ? "Hyper-Axiomatic Architect"
    : effectiveTransPostAxiomaticSovereignty >= 8975
    ? "Hyper-Axiomatic Ascendant"
    : "Pre-Hyper-Axiomatic";
const hyperAxiomaticBonus =
  effectiveTransPostAxiomaticSovereignty >= 9600
    ? 625
    : effectiveTransPostAxiomaticSovereignty >= 9275
    ? 475
    : effectiveTransPostAxiomaticSovereignty >= 8975
    ? 260
    : 130;
const totalHyperAxiomaticPower =
  effectiveTransPostAxiomaticSovereignty +
  hyperAxiomaticBonus;
const hyperAxiomaticSovereigntyRank =
  totalHyperAxiomaticPower >= 10250
    ? "Absolute Hyper-Axiom"
    : totalHyperAxiomaticPower >= 9925
    ? "Hyper-Axiomatic Sovereign"
    : totalHyperAxiomaticPower >= 9600
    ? "Hyper-Axiomatic Regent"
    : "Emergent Hyper-Axiom";
const hyperAxiomaticSovereigntyBonus =
  totalHyperAxiomaticPower >= 10250
    ? 650
    : totalHyperAxiomaticPower >= 9925
    ? 495
    : totalHyperAxiomaticPower >= 9600
    ? 270
    : 135;
const effectiveHyperAxiomaticSovereignty =
  totalHyperAxiomaticPower +
  hyperAxiomaticSovereigntyBonus;
const ultraAxiomaticRank =
  effectiveHyperAxiomaticSovereignty >= 10950
    ? "Ultra-Axiomatic Sovereign"
    : effectiveHyperAxiomaticSovereignty >= 10600
    ? "Ultra-Axiomatic Architect"
    : effectiveHyperAxiomaticSovereignty >= 10275
    ? "Ultra-Axiomatic Ascendant"
    : "Pre-Ultra-Axiomatic";
const ultraAxiomaticBonus =
  effectiveHyperAxiomaticSovereignty >= 10950
    ? 675
    : effectiveHyperAxiomaticSovereignty >= 10600
    ? 515
    : effectiveHyperAxiomaticSovereignty >= 10275
    ? 280
    : 140;
const totalUltraAxiomaticPower =
  effectiveHyperAxiomaticSovereignty +
  ultraAxiomaticBonus;
const ultraAxiomaticSovereigntyRank =
  totalUltraAxiomaticPower >= 11650
    ? "Absolute Ultra-Axiom"
    : totalUltraAxiomaticPower >= 11300
    ? "Ultra-Axiomatic Sovereign"
    : totalUltraAxiomaticPower >= 10950
    ? "Ultra-Axiomatic Regent"
    : "Emergent Ultra-Axiom";
const ultraAxiomaticSovereigntyBonus =
  totalUltraAxiomaticPower >= 11650
    ? 700
    : totalUltraAxiomaticPower >= 11300
    ? 535
    : totalUltraAxiomaticPower >= 10950
    ? 290
    : 145;
const effectiveUltraAxiomaticSovereignty =
  totalUltraAxiomaticPower +
  ultraAxiomaticSovereigntyBonus;
const omegaAxiomaticRank =
  effectiveUltraAxiomaticSovereignty >= 12400
    ? "Omega-Axiomatic Sovereign"
    : effectiveUltraAxiomaticSovereignty >= 12025
    ? "Omega-Axiomatic Architect"
    : effectiveUltraAxiomaticSovereignty >= 11675
    ? "Omega-Axiomatic Ascendant"
    : "Pre-Omega-Axiomatic";
const omegaAxiomaticBonus =
  effectiveUltraAxiomaticSovereignty >= 12400
    ? 725
    : effectiveUltraAxiomaticSovereignty >= 12025
    ? 555
    : effectiveUltraAxiomaticSovereignty >= 11675
    ? 300
    : 150;
const totalOmegaAxiomaticPower =
  effectiveUltraAxiomaticSovereignty +
  omegaAxiomaticBonus;
const omegaAxiomaticSovereigntyRank =
  totalOmegaAxiomaticPower >= 13150
    ? "Absolute Omega-Axiom"
    : totalOmegaAxiomaticPower >= 12775
    ? "Omega-Axiomatic Sovereign"
    : totalOmegaAxiomaticPower >= 12400
    ? "Omega-Axiomatic Regent"
    : "Emergent Omega-Axiom";
const omegaAxiomaticSovereigntyBonus =
  totalOmegaAxiomaticPower >= 13150
    ? 750
    : totalOmegaAxiomaticPower >= 12775
    ? 575
    : totalOmegaAxiomaticPower >= 12400
    ? 310
    : 155;
const effectiveOmegaAxiomaticSovereignty =
  totalOmegaAxiomaticPower +
  omegaAxiomaticSovereigntyBonus;
const transOmegaAxiomaticRank =
  effectiveOmegaAxiomaticSovereignty >= 13950
    ? "Trans-Omega-Axiomatic Sovereign"
    : effectiveOmegaAxiomaticSovereignty >= 13550
    ? "Trans-Omega-Axiomatic Architect"
    : effectiveOmegaAxiomaticSovereignty >= 13175
    ? "Trans-Omega-Axiomatic Ascendant"
    : "Pre-Trans-Omega-Axiomatic";
const transOmegaAxiomaticBonus =
  effectiveOmegaAxiomaticSovereignty >= 13950
    ? 775
    : effectiveOmegaAxiomaticSovereignty >= 13550
    ? 595
    : effectiveOmegaAxiomaticSovereignty >= 13175
    ? 320
    : 160;
const totalTransOmegaAxiomaticPower =
  effectiveOmegaAxiomaticSovereignty +
  transOmegaAxiomaticBonus;
const transOmegaAxiomaticSovereigntyRank =
  totalTransOmegaAxiomaticPower >= 14750
    ? "Absolute Trans-Omega-Axiom"
    : totalTransOmegaAxiomaticPower >= 14350
    ? "Trans-Omega-Axiomatic Sovereign"
    : totalTransOmegaAxiomaticPower >= 13950
    ? "Trans-Omega-Axiomatic Regent"
    : "Emergent Trans-Omega-Axiom";
const transOmegaAxiomaticSovereigntyBonus =
  totalTransOmegaAxiomaticPower >= 14750
    ? 800
    : totalTransOmegaAxiomaticPower >= 14350
    ? 615
    : totalTransOmegaAxiomaticPower >= 13950
    ? 330
    : 165;
const effectiveTransOmegaAxiomaticSovereignty =
  totalTransOmegaAxiomaticPower +
  transOmegaAxiomaticSovereigntyBonus;
const beyondAxiomaticRank =
  effectiveTransOmegaAxiomaticSovereignty >= 15600
    ? "Beyond-Axiomatic Sovereign"
    : effectiveTransOmegaAxiomaticSovereignty >= 15175
    ? "Beyond-Axiomatic Architect"
    : effectiveTransOmegaAxiomaticSovereignty >= 14775
    ? "Beyond-Axiomatic Ascendant"
    : "Pre-Beyond-Axiomatic";
const beyondAxiomaticBonus =
  effectiveTransOmegaAxiomaticSovereignty >= 15600
    ? 825
    : effectiveTransOmegaAxiomaticSovereignty >= 15175
    ? 635
    : effectiveTransOmegaAxiomaticSovereignty >= 14775
    ? 340
    : 170;
const totalBeyondAxiomaticPower =
  effectiveTransOmegaAxiomaticSovereignty +
  beyondAxiomaticBonus;
const beyondAxiomaticSovereigntyRank =
  totalBeyondAxiomaticPower >= 16450
    ? "Absolute Beyond-Axiom"
    : totalBeyondAxiomaticPower >= 16025
    ? "Beyond-Axiomatic Sovereign"
    : totalBeyondAxiomaticPower >= 15600
    ? "Beyond-Axiomatic Regent"
    : "Emergent Beyond-Axiom";
const beyondAxiomaticSovereigntyBonus =
  totalBeyondAxiomaticPower >= 16450
    ? 850
    : totalBeyondAxiomaticPower >= 16025
    ? 655
    : totalBeyondAxiomaticPower >= 15600
    ? 350
    : 175;
const effectiveBeyondAxiomaticSovereignty =
  totalBeyondAxiomaticPower +
  beyondAxiomaticSovereigntyBonus;
const transcendentAxiomaticRank =
  effectiveBeyondAxiomaticSovereignty >= 17350
    ? "Transcendent-Axiomatic Sovereign"
    : effectiveBeyondAxiomaticSovereignty >= 16900
    ? "Transcendent-Axiomatic Architect"
    : effectiveBeyondAxiomaticSovereignty >= 16475
    ? "Transcendent-Axiomatic Ascendant"
    : "Pre-Transcendent-Axiomatic";
const transcendentAxiomaticBonus =
  effectiveBeyondAxiomaticSovereignty >= 17350
    ? 875
    : effectiveBeyondAxiomaticSovereignty >= 16900
    ? 675
    : effectiveBeyondAxiomaticSovereignty >= 16475
    ? 360
    : 180;
const totalTranscendentAxiomaticPower =
  effectiveBeyondAxiomaticSovereignty +
  transcendentAxiomaticBonus;
const transcendentAxiomaticSovereigntyRank =
  totalTranscendentAxiomaticPower >= 18250
    ? "Absolute Transcendent-Axiom"
    : totalTranscendentAxiomaticPower >= 17800
    ? "Transcendent-Axiomatic Sovereign"
    : totalTranscendentAxiomaticPower >= 17350
    ? "Transcendent-Axiomatic Regent"
    : "Emergent Transcendent-Axiom";
const transcendentAxiomaticSovereigntyBonus =
  totalTranscendentAxiomaticPower >= 18250
    ? 900
    : totalTranscendentAxiomaticPower >= 17800
    ? 695
    : totalTranscendentAxiomaticPower >= 17350
    ? 370
    : 185;
const effectiveTranscendentAxiomaticSovereignty =
  totalTranscendentAxiomaticPower +
  transcendentAxiomaticSovereigntyBonus;
const primordialAxiomaticRank =
  effectiveTranscendentAxiomaticSovereignty >= 19200
    ? "Primordial-Axiomatic Sovereign"
    : effectiveTranscendentAxiomaticSovereignty >= 18725
    ? "Primordial-Axiomatic Architect"
    : effectiveTranscendentAxiomaticSovereignty >= 18275
    ? "Primordial-Axiomatic Ascendant"
    : "Pre-Primordial-Axiomatic";
const primordialAxiomaticBonus =
  effectiveTranscendentAxiomaticSovereignty >= 19200
    ? 925
    : effectiveTranscendentAxiomaticSovereignty >= 18725
    ? 715
    : effectiveTranscendentAxiomaticSovereignty >= 18275
    ? 380
    : 190;
const totalPrimordialAxiomaticPower =
  effectiveTranscendentAxiomaticSovereignty +
  primordialAxiomaticBonus;
const primordialAxiomaticSovereigntyRank =
  totalPrimordialAxiomaticPower >= 20150
    ? "Absolute Primordial-Axiom"
    : totalPrimordialAxiomaticPower >= 19675
    ? "Primordial-Axiomatic Sovereign"
    : totalPrimordialAxiomaticPower >= 19200
    ? "Primordial-Axiomatic Regent"
    : "Emergent Primordial-Axiom";
const primordialAxiomaticSovereigntyBonus =
  totalPrimordialAxiomaticPower >= 20150
    ? 950
    : totalPrimordialAxiomaticPower >= 19675
    ? 735
    : totalPrimordialAxiomaticPower >= 19200
    ? 390
    : 195;
const effectivePrimordialAxiomaticSovereignty =
  totalPrimordialAxiomaticPower +
  primordialAxiomaticSovereigntyBonus;
const originAxiomaticRank =
  effectivePrimordialAxiomaticSovereignty >= 21150
    ? "Origin-Axiomatic Sovereign"
    : effectivePrimordialAxiomaticSovereignty >= 20650
    ? "Origin-Axiomatic Architect"
    : effectivePrimordialAxiomaticSovereignty >= 20175
    ? "Origin-Axiomatic Ascendant"
    : "Pre-Origin-Axiomatic";
const originAxiomaticBonus =
  effectivePrimordialAxiomaticSovereignty >= 21150
    ? 975
    : effectivePrimordialAxiomaticSovereignty >= 20650
    ? 755
    : effectivePrimordialAxiomaticSovereignty >= 20175
    ? 400
    : 200;
const totalOriginAxiomaticPower =
  effectivePrimordialAxiomaticSovereignty +
  originAxiomaticBonus;
const originAxiomaticSovereigntyRank =
  totalOriginAxiomaticPower >= 22150
    ? "Absolute Origin-Axiom"
    : totalOriginAxiomaticPower >= 21650
    ? "Origin-Axiomatic Sovereign"
    : totalOriginAxiomaticPower >= 21150
    ? "Origin-Axiomatic Regent"
    : "Emergent Origin-Axiom";
const originAxiomaticSovereigntyBonus =
  totalOriginAxiomaticPower >= 22150
    ? 1000
    : totalOriginAxiomaticPower >= 21650
    ? 775
    : totalOriginAxiomaticPower >= 21150
    ? 410
    : 205;
const effectiveOriginAxiomaticSovereignty =
  totalOriginAxiomaticPower +
  originAxiomaticSovereigntyBonus;
const sourceAxiomaticRank =
  effectiveOriginAxiomaticSovereignty >= 23200
    ? "Source-Axiomatic Sovereign"
    : effectiveOriginAxiomaticSovereignty >= 22675
    ? "Source-Axiomatic Architect"
    : effectiveOriginAxiomaticSovereignty >= 22175
    ? "Source-Axiomatic Ascendant"
    : "Pre-Source-Axiomatic";
const sourceAxiomaticBonus =
  effectiveOriginAxiomaticSovereignty >= 23200
    ? 1025
    : effectiveOriginAxiomaticSovereignty >= 22675
    ? 795
    : effectiveOriginAxiomaticSovereignty >= 22175
    ? 420
    : 210;
const totalSourceAxiomaticPower =
  effectiveOriginAxiomaticSovereignty +
  sourceAxiomaticBonus;
const sourceAxiomaticSovereigntyRank =
  totalSourceAxiomaticPower >= 24250
    ? "Absolute Source-Axiom"
    : totalSourceAxiomaticPower >= 23725
    ? "Source-Axiomatic Sovereign"
    : totalSourceAxiomaticPower >= 23200
    ? "Source-Axiomatic Regent"
    : "Emergent Source-Axiom";
const sourceAxiomaticSovereigntyBonus =
  totalSourceAxiomaticPower >= 24250
    ? 1050
    : totalSourceAxiomaticPower >= 23725
    ? 815
    : totalSourceAxiomaticPower >= 23200
    ? 430
    : 215;
const effectiveSourceAxiomaticSovereignty =
  totalSourceAxiomaticPower +
  sourceAxiomaticSovereigntyBonus;
const genesisAxiomaticRank =
  effectiveSourceAxiomaticSovereignty >= 25350
    ? "Genesis-Axiomatic Sovereign"
    : effectiveSourceAxiomaticSovereignty >= 24800
    ? "Genesis-Axiomatic Architect"
    : effectiveSourceAxiomaticSovereignty >= 24275
    ? "Genesis-Axiomatic Ascendant"
    : "Pre-Genesis-Axiomatic";
const genesisAxiomaticBonus =
  effectiveSourceAxiomaticSovereignty >= 25350
    ? 1075
    : effectiveSourceAxiomaticSovereignty >= 24800
    ? 835
    : effectiveSourceAxiomaticSovereignty >= 24275
    ? 440
    : 220;
const totalGenesisAxiomaticPower =
  effectiveSourceAxiomaticSovereignty +
  genesisAxiomaticBonus;
const genesisAxiomaticSovereigntyRank =
  totalGenesisAxiomaticPower >= 26450
    ? "Absolute Genesis-Axiom"
    : totalGenesisAxiomaticPower >= 25900
    ? "Genesis-Axiomatic Sovereign"
    : totalGenesisAxiomaticPower >= 25350
    ? "Genesis-Axiomatic Regent"
    : "Emergent Genesis-Axiom";
const genesisAxiomaticSovereigntyBonus =
  totalGenesisAxiomaticPower >= 26450
    ? 1100
    : totalGenesisAxiomaticPower >= 25900
    ? 855
    : totalGenesisAxiomaticPower >= 25350
    ? 450
    : 225;
const effectiveGenesisAxiomaticSovereignty =
  totalGenesisAxiomaticPower +
  genesisAxiomaticSovereigntyBonus;
const creationAxiomaticRank =
  effectiveGenesisAxiomaticSovereignty >= 27600
    ? "Creation-Axiomatic Sovereign"
    : effectiveGenesisAxiomaticSovereignty >= 27025
    ? "Creation-Axiomatic Architect"
    : effectiveGenesisAxiomaticSovereignty >= 26475
    ? "Creation-Axiomatic Ascendant"
    : "Pre-Creation-Axiomatic";
const creationAxiomaticBonus =
  effectiveGenesisAxiomaticSovereignty >= 27600
    ? 1125
    : effectiveGenesisAxiomaticSovereignty >= 27025
    ? 875
    : effectiveGenesisAxiomaticSovereignty >= 26475
    ? 460
    : 230;
const totalCreationAxiomaticPower =
  effectiveGenesisAxiomaticSovereignty +
  creationAxiomaticBonus;
const nextAscensionRequirement =
  ascensionLevel >= 3
    ? "Maximum Ascension Reached"
    : ascensionLevel === 2
    ? "Reach 250 Empire Territories"
    : ascensionLevel === 1
    ? "Reach 200 Empire Territories"
    : "Unlock Civilization Ascension";
const creationAxiomaticSovereigntyRank =
  totalCreationAxiomaticPower >= 28750
    ? "Absolute Creation-Axiom"
    : totalCreationAxiomaticPower >= 28175
    ? "Creation-Axiomatic Sovereign"
    : totalCreationAxiomaticPower >= 27600
    ? "Creation-Axiomatic Regent"
    : "Emergent Creation-Axiom";
const creationAxiomaticSovereigntyBonus =
  totalCreationAxiomaticPower >= 28750
    ? 1150
    : totalCreationAxiomaticPower >= 28175
    ? 895
    : totalCreationAxiomaticPower >= 27600
    ? 470
    : 235;
const effectiveCreationAxiomaticSovereignty =
  totalCreationAxiomaticPower +
  creationAxiomaticSovereigntyBonus;
const firstCauseAxiomaticRank =
  effectiveCreationAxiomaticSovereignty >= 29950
    ? "First-Cause Axiomatic Sovereign"
    : effectiveCreationAxiomaticSovereignty >= 29350
    ? "First-Cause Axiomatic Architect"
    : effectiveCreationAxiomaticSovereignty >= 28775
    ? "First-Cause Axiomatic Ascendant"
    : "Pre-First-Cause Axiomatic";
const firstCauseAxiomaticBonus =
  effectiveCreationAxiomaticSovereignty >= 29950
    ? 1175
    : effectiveCreationAxiomaticSovereignty >= 29350
    ? 915
    : effectiveCreationAxiomaticSovereignty >= 28775
    ? 480
    : 240;
const totalFirstCauseAxiomaticPower =
  effectiveCreationAxiomaticSovereignty +
  firstCauseAxiomaticBonus;
const firstCauseAxiomaticSovereigntyRank =
  totalFirstCauseAxiomaticPower >= 31150
    ? "Absolute First-Cause Axiom"
    : totalFirstCauseAxiomaticPower >= 30550
    ? "First-Cause Axiomatic Sovereign"
    : totalFirstCauseAxiomaticPower >= 29950
    ? "First-Cause Axiomatic Regent"
    : "Emergent First-Cause Axiom";
const firstCauseAxiomaticSovereigntyBonus =
  totalFirstCauseAxiomaticPower >= 31150
    ? 1200
    : totalFirstCauseAxiomaticPower >= 30550
    ? 935
    : totalFirstCauseAxiomaticPower >= 29950
    ? 490
    : 245;
const effectiveFirstCauseAxiomaticSovereignty =
  totalFirstCauseAxiomaticPower +
  firstCauseAxiomaticSovereigntyBonus;
const absoluteOriginRank =
  effectiveFirstCauseAxiomaticSovereignty >= 32400
    ? "Absolute-Origin Sovereign"
    : effectiveFirstCauseAxiomaticSovereignty >= 31775
    ? "Absolute-Origin Architect"
    : effectiveFirstCauseAxiomaticSovereignty >= 31175
    ? "Absolute-Origin Ascendant"
    : "Pre-Absolute-Origin";
const absoluteOriginBonus =
  effectiveFirstCauseAxiomaticSovereignty >= 32400
    ? 1225
    : effectiveFirstCauseAxiomaticSovereignty >= 31775
    ? 955
    : effectiveFirstCauseAxiomaticSovereignty >= 31175
    ? 500
    : 250;
const totalAbsoluteOriginPower =
  effectiveFirstCauseAxiomaticSovereignty +
  absoluteOriginBonus;
const absoluteOriginSovereigntyRank =
  totalAbsoluteOriginPower >= 33650
    ? "Absolute Origin"
    : totalAbsoluteOriginPower >= 33025
    ? "Absolute-Origin Sovereign"
    : totalAbsoluteOriginPower >= 32400
    ? "Absolute-Origin Regent"
    : "Emergent Absolute-Origin";
const absoluteOriginSovereigntyBonus =
  totalAbsoluteOriginPower >= 33650
    ? 1250
    : totalAbsoluteOriginPower >= 33025
    ? 975
    : totalAbsoluteOriginPower >= 32400
    ? 510
    : 255;
const effectiveAbsoluteOriginSovereignty =
  totalAbsoluteOriginPower +
  absoluteOriginSovereigntyBonus;
const preExistentialRank =
  effectiveAbsoluteOriginSovereignty >= 34950
    ? "Pre-Existential Sovereign"
    : effectiveAbsoluteOriginSovereignty >= 34300
    ? "Pre-Existential Architect"
    : effectiveAbsoluteOriginSovereignty >= 33675
    ? "Pre-Existential Ascendant"
    : "Approaching Pre-Existence";
const preExistentialBonus =
  effectiveAbsoluteOriginSovereignty >= 34950
    ? 1275
    : effectiveAbsoluteOriginSovereignty >= 34300
    ? 995
    : effectiveAbsoluteOriginSovereignty >= 33675
    ? 520
    : 260;
const totalPreExistentialPower =
  effectiveAbsoluteOriginSovereignty +
  preExistentialBonus;
const preExistentialSovereigntyRank =
  totalPreExistentialPower >= 36250
    ? "Absolute Pre-Existence"
    : totalPreExistentialPower >= 35600
    ? "Pre-Existential Sovereign"
    : totalPreExistentialPower >= 34950
    ? "Pre-Existential Regent"
    : "Emergent Pre-Existence";
const preExistentialSovereigntyBonus =
  totalPreExistentialPower >= 36250
    ? 1300
    : totalPreExistentialPower >= 35600
    ? 1015
    : totalPreExistentialPower >= 34950
    ? 530
    : 265;
const effectivePreExistentialSovereignty =
  totalPreExistentialPower +
  preExistentialSovereigntyBonus;
const existentialRank =
  effectivePreExistentialSovereignty >= 37600
    ? "Existential Sovereign"
    : effectivePreExistentialSovereignty >= 36925
    ? "Existential Architect"
    : effectivePreExistentialSovereignty >= 36275
    ? "Existential Ascendant"
    : "Pre-Existential";
const existentialBonus =
  effectivePreExistentialSovereignty >= 37600
    ? 1325
    : effectivePreExistentialSovereignty >= 36925
    ? 1035
    : effectivePreExistentialSovereignty >= 36275
    ? 540
    : 270;
const totalExistentialPower =
  effectivePreExistentialSovereignty +
  existentialBonus;
const existentialSovereigntyRank =
  totalExistentialPower >= 38950
    ? "Absolute Existence"
    : totalExistentialPower >= 38275
    ? "Existential Sovereign"
    : totalExistentialPower >= 37600
    ? "Existential Regent"
    : "Emergent Existence";
const existentialSovereigntyBonus =
  totalExistentialPower >= 38950
    ? 1350
    : totalExistentialPower >= 38275
    ? 1055
    : totalExistentialPower >= 37600
    ? 550
    : 275;
const effectiveExistentialSovereignty =
  totalExistentialPower +
  existentialSovereigntyBonus;
const transExistentialRank =
  effectiveExistentialSovereignty >= 40350
    ? "Trans-Existential Sovereign"
    : effectiveExistentialSovereignty >= 39650
    ? "Trans-Existential Architect"
    : effectiveExistentialSovereignty >= 38975
    ? "Trans-Existential Ascendant"
    : "Pre-Trans-Existential";
const transExistentialBonus =
  effectiveExistentialSovereignty >= 40350
    ? 1375
    : effectiveExistentialSovereignty >= 39650
    ? 1075
    : effectiveExistentialSovereignty >= 38975
    ? 560
    : 280;
const totalTransExistentialPower =
  effectiveExistentialSovereignty +
  transExistentialBonus;
const transExistentialSovereigntyRank =
  totalTransExistentialPower >= 41750
    ? "Absolute Trans-Existence"
    : totalTransExistentialPower >= 41050
    ? "Trans-Existential Sovereign"
    : totalTransExistentialPower >= 40350
    ? "Trans-Existential Regent"
    : "Emergent Trans-Existence";
const transExistentialSovereigntyBonus =
  totalTransExistentialPower >= 41750
    ? 1400
    : totalTransExistentialPower >= 41050
    ? 1095
    : totalTransExistentialPower >= 40350
    ? 570
    : 285;
const effectiveTransExistentialSovereignty =
  totalTransExistentialPower +
  transExistentialSovereigntyBonus;
const metaExistentialRank =
  effectiveTransExistentialSovereignty >= 43200
    ? "Meta-Existential Sovereign"
    : effectiveTransExistentialSovereignty >= 42475
    ? "Meta-Existential Architect"
    : effectiveTransExistentialSovereignty >= 41775
    ? "Meta-Existential Ascendant"
    : "Pre-Meta-Existential";
const metaExistentialBonus =
  effectiveTransExistentialSovereignty >= 43200
    ? 1425
    : effectiveTransExistentialSovereignty >= 42475
    ? 1115
    : effectiveTransExistentialSovereignty >= 41775
    ? 580
    : 290;
const totalMetaExistentialPower =
  effectiveTransExistentialSovereignty +
  metaExistentialBonus;
const metaExistentialSovereigntyRank =
  totalMetaExistentialPower >= 44650
    ? "Absolute Meta-Existence"
    : totalMetaExistentialPower >= 43925
    ? "Meta-Existential Sovereign"
    : totalMetaExistentialPower >= 43200
    ? "Meta-Existential Regent"
    : "Emergent Meta-Existence";
const metaExistentialSovereigntyBonus =
  totalMetaExistentialPower >= 44650
    ? 1450
    : totalMetaExistentialPower >= 43925
    ? 1135
    : totalMetaExistentialPower >= 43200
    ? 590
    : 295;
const effectiveMetaExistentialSovereignty =
  totalMetaExistentialPower +
  metaExistentialSovereigntyBonus;
const supraExistentialRank =
  effectiveMetaExistentialSovereignty >= 46150
    ? "Supra-Existential Sovereign"
    : effectiveMetaExistentialSovereignty >= 45400
    ? "Supra-Existential Architect"
    : effectiveMetaExistentialSovereignty >= 44675
    ? "Supra-Existential Ascendant"
    : "Pre-Supra-Existential";
const supraExistentialBonus =
  effectiveMetaExistentialSovereignty >= 46150
    ? 1475
    : effectiveMetaExistentialSovereignty >= 45400
    ? 1155
    : effectiveMetaExistentialSovereignty >= 44675
    ? 600
    : 300;
const totalSupraExistentialPower =
  effectiveMetaExistentialSovereignty +
  supraExistentialBonus;
const supraExistentialSovereigntyRank =
  totalSupraExistentialPower >= 47650
    ? "Absolute Supra-Existence"
    : totalSupraExistentialPower >= 46900
    ? "Supra-Existential Sovereign"
    : totalSupraExistentialPower >= 46150
    ? "Supra-Existential Regent"
    : "Emergent Supra-Existence";
const supraExistentialSovereigntyBonus =
  totalSupraExistentialPower >= 47650
    ? 1500
    : totalSupraExistentialPower >= 46900
    ? 1175
    : totalSupraExistentialPower >= 46150
    ? 610
    : 305;
const effectiveSupraExistentialSovereignty =
  totalSupraExistentialPower +
  supraExistentialSovereigntyBonus;
const hyperExistentialRank =
  effectiveSupraExistentialSovereignty >= 49200
    ? "Hyper-Existential Sovereign"
    : effectiveSupraExistentialSovereignty >= 48425
    ? "Hyper-Existential Architect"
    : effectiveSupraExistentialSovereignty >= 47675
    ? "Hyper-Existential Ascendant"
    : "Pre-Hyper-Existential";
const hyperExistentialBonus =
  effectiveSupraExistentialSovereignty >= 49200
    ? 1525
    : effectiveSupraExistentialSovereignty >= 48425
    ? 1195
    : effectiveSupraExistentialSovereignty >= 47675
    ? 620
    : 310;
const totalHyperExistentialPower =
  effectiveSupraExistentialSovereignty +
  hyperExistentialBonus;
const hyperExistentialSovereigntyRank =
  totalHyperExistentialPower >= 50750
    ? "Absolute Hyper-Existence"
    : totalHyperExistentialPower >= 49975
    ? "Hyper-Existential Sovereign"
    : totalHyperExistentialPower >= 49200
    ? "Hyper-Existential Regent"
    : "Emergent Hyper-Existence";
const hyperExistentialSovereigntyBonus =
  totalHyperExistentialPower >= 50750
    ? 1550
    : totalHyperExistentialPower >= 49975
    ? 1215
    : totalHyperExistentialPower >= 49200
    ? 630
    : 315;
const effectiveHyperExistentialSovereignty =
  totalHyperExistentialPower +
  hyperExistentialSovereigntyBonus;
const ultraExistentialRank =
  effectiveHyperExistentialSovereignty >= 52350
    ? "Ultra-Existential Sovereign"
    : effectiveHyperExistentialSovereignty >= 51550
    ? "Ultra-Existential Architect"
    : effectiveHyperExistentialSovereignty >= 50775
    ? "Ultra-Existential Ascendant"
    : "Pre-Ultra-Existential";
const ultraExistentialBonus =
  effectiveHyperExistentialSovereignty >= 52350
    ? 1575
    : effectiveHyperExistentialSovereignty >= 51550
    ? 1235
    : effectiveHyperExistentialSovereignty >= 50775
    ? 640
    : 320;
const totalUltraExistentialPower =
  effectiveHyperExistentialSovereignty +
  ultraExistentialBonus;
const ultraExistentialSovereigntyRank =
  totalUltraExistentialPower >= 53950
    ? "Absolute Ultra-Existence"
    : totalUltraExistentialPower >= 53150
    ? "Ultra-Existential Sovereign"
    : totalUltraExistentialPower >= 52350
    ? "Ultra-Existential Regent"
    : "Emergent Ultra-Existence";
const ultraExistentialSovereigntyBonus =
  totalUltraExistentialPower >= 53950
    ? 1600
    : totalUltraExistentialPower >= 53150
    ? 1255
    : totalUltraExistentialPower >= 52350
    ? 650
    : 325;
const effectiveUltraExistentialSovereignty =
  totalUltraExistentialPower +
  ultraExistentialSovereigntyBonus;
const omegaExistentialRank =
  effectiveUltraExistentialSovereignty >= 55600
    ? "Omega-Existential Sovereign"
    : effectiveUltraExistentialSovereignty >= 54775
    ? "Omega-Existential Architect"
    : effectiveUltraExistentialSovereignty >= 53975
    ? "Omega-Existential Ascendant"
    : "Pre-Omega-Existential";
const omegaExistentialBonus =
  effectiveUltraExistentialSovereignty >= 55600
    ? 1625
    : effectiveUltraExistentialSovereignty >= 54775
    ? 1275
    : effectiveUltraExistentialSovereignty >= 53975
    ? 660
    : 330;
const totalOmegaExistentialPower =
  effectiveUltraExistentialSovereignty +
  omegaExistentialBonus;
const omegaExistentialSovereigntyRank =
  totalOmegaExistentialPower >= 57250
    ? "Absolute Omega-Existence"
    : totalOmegaExistentialPower >= 56425
    ? "Omega-Existential Sovereign"
    : totalOmegaExistentialPower >= 55600
    ? "Omega-Existential Regent"
    : "Emergent Omega-Existence";
const omegaExistentialSovereigntyBonus =
  totalOmegaExistentialPower >= 57250
    ? 1650
    : totalOmegaExistentialPower >= 56425
    ? 1295
    : totalOmegaExistentialPower >= 55600
    ? 670
    : 335;
const effectiveOmegaExistentialSovereignty =
  totalOmegaExistentialPower +
  omegaExistentialSovereigntyBonus;
const transOmegaExistentialRank =
  effectiveOmegaExistentialSovereignty >= 58950
    ? "Trans-Omega-Existential Sovereign"
    : effectiveOmegaExistentialSovereignty >= 58100
    ? "Trans-Omega-Existential Architect"
    : effectiveOmegaExistentialSovereignty >= 57275
    ? "Trans-Omega-Existential Ascendant"
    : "Pre-Trans-Omega-Existential";
const transOmegaExistentialBonus =
  effectiveOmegaExistentialSovereignty >= 58950
    ? 1675
    : effectiveOmegaExistentialSovereignty >= 58100
    ? 1315
    : effectiveOmegaExistentialSovereignty >= 57275
    ? 680
    : 340;
const totalTransOmegaExistentialPower =
  effectiveOmegaExistentialSovereignty +
  transOmegaExistentialBonus;
const transOmegaExistentialSovereigntyRank =
  totalTransOmegaExistentialPower >= 60650
    ? "Absolute Trans-Omega-Existence"
    : totalTransOmegaExistentialPower >= 59800
    ? "Trans-Omega-Existential Sovereign"
    : totalTransOmegaExistentialPower >= 58950
    ? "Trans-Omega-Existential Regent"
    : "Emergent Trans-Omega-Existence";
const transOmegaExistentialSovereigntyBonus =
  totalTransOmegaExistentialPower >= 60650
    ? 1700
    : totalTransOmegaExistentialPower >= 59800
    ? 1335
    : totalTransOmegaExistentialPower >= 58950
    ? 690
    : 345;
const effectiveTransOmegaExistentialSovereignty =
  totalTransOmegaExistentialPower +
  transOmegaExistentialSovereigntyBonus;
const beyondExistentialRank =
  effectiveTransOmegaExistentialSovereignty >= 62400
    ? "Beyond-Existential Sovereign"
    : effectiveTransOmegaExistentialSovereignty >= 61525
    ? "Beyond-Existential Architect"
    : effectiveTransOmegaExistentialSovereignty >= 60675
    ? "Beyond-Existential Ascendant"
    : "Pre-Beyond-Existential";
const beyondExistentialBonus =
  effectiveTransOmegaExistentialSovereignty >= 62400
    ? 1725
    : effectiveTransOmegaExistentialSovereignty >= 61525
    ? 1355
    : effectiveTransOmegaExistentialSovereignty >= 60675
    ? 700
    : 350;
const totalBeyondExistentialPower =
  effectiveTransOmegaExistentialSovereignty +
  beyondExistentialBonus;
const beyondExistentialSovereigntyRank =
  totalBeyondExistentialPower >= 64150
    ? "Absolute Beyond-Existence"
    : totalBeyondExistentialPower >= 63275
    ? "Beyond-Existential Sovereign"
    : totalBeyondExistentialPower >= 62400
    ? "Beyond-Existential Regent"
    : "Emergent Beyond-Existence";
const beyondExistentialSovereigntyBonus =
  totalBeyondExistentialPower >= 64150
    ? 1750
    : totalBeyondExistentialPower >= 63275
    ? 1375
    : totalBeyondExistentialPower >= 62400
    ? 710
    : 355;
const effectiveBeyondExistentialSovereignty =
  totalBeyondExistentialPower +
  beyondExistentialSovereigntyBonus;
const transcendentExistentialRank =
  effectiveBeyondExistentialSovereignty >= 65950
    ? "Transcendent-Existential Sovereign"
    : effectiveBeyondExistentialSovereignty >= 65050
    ? "Transcendent-Existential Architect"
    : effectiveBeyondExistentialSovereignty >= 64175
    ? "Transcendent-Existential Ascendant"
    : "Pre-Transcendent-Existential";
const transcendentExistentialBonus =
  effectiveBeyondExistentialSovereignty >= 65950
    ? 1775
    : effectiveBeyondExistentialSovereignty >= 65050
    ? 1395
    : effectiveBeyondExistentialSovereignty >= 64175
    ? 720
    : 360;
const totalTranscendentExistentialPower =
  effectiveBeyondExistentialSovereignty +
  transcendentExistentialBonus;
const transcendentExistentialSovereigntyRank =
  totalTranscendentExistentialPower >= 67750
    ? "Absolute Transcendent-Existence"
    : totalTranscendentExistentialPower >= 66850
    ? "Transcendent-Existential Sovereign"
    : totalTranscendentExistentialPower >= 65950
    ? "Transcendent-Existential Regent"
    : "Emergent Transcendent-Existence";
const transcendentExistentialSovereigntyBonus =
  totalTranscendentExistentialPower >= 67750
    ? 1800
    : totalTranscendentExistentialPower >= 66850
    ? 1415
    : totalTranscendentExistentialPower >= 65950
    ? 730
    : 365;
const effectiveTranscendentExistentialSovereignty =
  totalTranscendentExistentialPower +
  transcendentExistentialSovereigntyBonus;
const primordialExistentialRank =
  effectiveTranscendentExistentialSovereignty >= 69600
    ? "Primordial-Existential Sovereign"
    : effectiveTranscendentExistentialSovereignty >= 68675
    ? "Primordial-Existential Architect"
    : effectiveTranscendentExistentialSovereignty >= 67775
    ? "Primordial-Existential Ascendant"
    : "Pre-Primordial-Existential";
const primordialExistentialBonus =
  effectiveTranscendentExistentialSovereignty >= 69600
    ? 1825
    : effectiveTranscendentExistentialSovereignty >= 68675
    ? 1435
    : effectiveTranscendentExistentialSovereignty >= 67775
    ? 740
    : 370;
const totalPrimordialExistentialPower =
  effectiveTranscendentExistentialSovereignty +
  primordialExistentialBonus;
const primordialExistentialSovereigntyRank =
  totalPrimordialExistentialPower >= 71450
    ? "Absolute Primordial-Existence"
    : totalPrimordialExistentialPower >= 70525
    ? "Primordial-Existential Sovereign"
    : totalPrimordialExistentialPower >= 69600
    ? "Primordial-Existential Regent"
    : "Emergent Primordial-Existence";
const primordialExistentialSovereigntyBonus =
  totalPrimordialExistentialPower >= 71450
    ? 1850
    : totalPrimordialExistentialPower >= 70525
    ? 1455
    : totalPrimordialExistentialPower >= 69600
    ? 750
    : 375;
const effectivePrimordialExistentialSovereignty =
  totalPrimordialExistentialPower +
  primordialExistentialSovereigntyBonus;
const originExistentialRank =
  effectivePrimordialExistentialSovereignty >= 73350
    ? "Origin-Existential Sovereign"
    : effectivePrimordialExistentialSovereignty >= 72400
    ? "Origin-Existential Architect"
    : effectivePrimordialExistentialSovereignty >= 71475
    ? "Origin-Existential Ascendant"
    : "Pre-Origin-Existential";
const originExistentialBonus =
  effectivePrimordialExistentialSovereignty >= 73350
    ? 1875
    : effectivePrimordialExistentialSovereignty >= 72400
    ? 1475
    : effectivePrimordialExistentialSovereignty >= 71475
    ? 760
    : 380;
const totalOriginExistentialPower =
  effectivePrimordialExistentialSovereignty +
  originExistentialBonus;
const originExistentialSovereigntyRank =
  totalOriginExistentialPower >= 75250
    ? "Absolute Origin-Existence"
    : totalOriginExistentialPower >= 74300
    ? "Origin-Existential Sovereign"
    : totalOriginExistentialPower >= 73350
    ? "Origin-Existential Regent"
    : "Emergent Origin-Existence";
const originExistentialSovereigntyBonus =
  totalOriginExistentialPower >= 75250
    ? 1900
    : totalOriginExistentialPower >= 74300
    ? 1495
    : totalOriginExistentialPower >= 73350
    ? 770
    : 385;
const effectiveOriginExistentialSovereignty =
  totalOriginExistentialPower +
  originExistentialSovereigntyBonus;
const sourceExistentialRank =
  effectiveOriginExistentialSovereignty >= 77200
    ? "Source-Existential Sovereign"
    : effectiveOriginExistentialSovereignty >= 76225
    ? "Source-Existential Architect"
    : effectiveOriginExistentialSovereignty >= 75275
    ? "Source-Existential Ascendant"
    : "Pre-Source-Existential";
const sourceExistentialBonus =
  effectiveOriginExistentialSovereignty >= 77200
    ? 1925
    : effectiveOriginExistentialSovereignty >= 76225
    ? 1515
    : effectiveOriginExistentialSovereignty >= 75275
    ? 780
    : 390;
const totalSourceExistentialPower =
  effectiveOriginExistentialSovereignty +
  sourceExistentialBonus;
const sourceExistentialSovereigntyRank =
  totalSourceExistentialPower >= 79150
    ? "Absolute Source-Existence"
    : totalSourceExistentialPower >= 78175
    ? "Source-Existential Sovereign"
    : totalSourceExistentialPower >= 77200
    ? "Source-Existential Regent"
    : "Emergent Source-Existence";
const sourceExistentialSovereigntyBonus =
  totalSourceExistentialPower >= 79150
    ? 1950
    : totalSourceExistentialPower >= 78175
    ? 1535
    : totalSourceExistentialPower >= 77200
    ? 790
    : 395;
const effectiveSourceExistentialSovereignty =
  totalSourceExistentialPower +
  sourceExistentialSovereigntyBonus;
const genesisExistentialRank =
  effectiveSourceExistentialSovereignty >= 81150
    ? "Genesis-Existential Sovereign"
    : effectiveSourceExistentialSovereignty >= 80150
    ? "Genesis-Existential Architect"
    : effectiveSourceExistentialSovereignty >= 79175
    ? "Genesis-Existential Ascendant"
    : "Pre-Genesis-Existential";
const genesisExistentialBonus =
  effectiveSourceExistentialSovereignty >= 81150
    ? 1975
    : effectiveSourceExistentialSovereignty >= 80150
    ? 1555
    : effectiveSourceExistentialSovereignty >= 79175
    ? 800
    : 400;
const totalGenesisExistentialPower =
  effectiveSourceExistentialSovereignty +
  genesisExistentialBonus;
const genesisExistentialSovereigntyRank =
  totalGenesisExistentialPower >= 83150
    ? "Absolute Genesis-Existence"
    : totalGenesisExistentialPower >= 82150
    ? "Genesis-Existential Sovereign"
    : totalGenesisExistentialPower >= 81150
    ? "Genesis-Existential Regent"
    : "Emergent Genesis-Existence";
const genesisExistentialSovereigntyBonus =
  totalGenesisExistentialPower >= 83150
    ? 2000
    : totalGenesisExistentialPower >= 82150
    ? 1575
    : totalGenesisExistentialPower >= 81150
    ? 810
    : 405;
const effectiveGenesisExistentialSovereignty =
  totalGenesisExistentialPower +
  genesisExistentialSovereigntyBonus;
const creationExistentialRank =
  effectiveGenesisExistentialSovereignty >= 85200
    ? "Creation-Existential Sovereign"
    : effectiveGenesisExistentialSovereignty >= 84175
    ? "Creation-Existential Architect"
    : effectiveGenesisExistentialSovereignty >= 83175
    ? "Creation-Existential Ascendant"
    : "Pre-Creation-Existential";
const creationExistentialBonus =
  effectiveGenesisExistentialSovereignty >= 85200
    ? 2025
    : effectiveGenesisExistentialSovereignty >= 84175
    ? 1595
    : effectiveGenesisExistentialSovereignty >= 83175
    ? 820
    : 410;
const totalCreationExistentialPower =
  effectiveGenesisExistentialSovereignty +
  creationExistentialBonus;
const creationExistentialSovereigntyRank =
  totalCreationExistentialPower >= 87250
    ? "Absolute Creation-Existence"
    : totalCreationExistentialPower >= 86225
    ? "Creation-Existential Sovereign"
    : totalCreationExistentialPower >= 85200
    ? "Creation-Existential Regent"
    : "Emergent Creation-Existence";
const creationExistentialSovereigntyBonus =
  totalCreationExistentialPower >= 87250
    ? 2050
    : totalCreationExistentialPower >= 86225
    ? 1615
    : totalCreationExistentialPower >= 85200
    ? 830
    : 415;
const effectiveCreationExistentialSovereignty =
  totalCreationExistentialPower +
  creationExistentialSovereigntyBonus;
const firstCauseExistentialRank =
  effectiveCreationExistentialSovereignty >= 89350
    ? "First-Cause Existential Sovereign"
    : effectiveCreationExistentialSovereignty >= 88300
    ? "First-Cause Existential Architect"
    : effectiveCreationExistentialSovereignty >= 87275
    ? "First-Cause Existential Ascendant"
    : "Pre-First-Cause Existential";
const firstCauseExistentialBonus =
  effectiveCreationExistentialSovereignty >= 89350
    ? 2075
    : effectiveCreationExistentialSovereignty >= 88300
    ? 1635
    : effectiveCreationExistentialSovereignty >= 87275
    ? 840
    : 420;
const totalFirstCauseExistentialPower =
  effectiveCreationExistentialSovereignty +
  firstCauseExistentialBonus;
const firstCauseExistentialSovereigntyRank =
  totalFirstCauseExistentialPower >= 91450
    ? "Absolute First-Cause Existence"
    : totalFirstCauseExistentialPower >= 90400
    ? "First-Cause Existential Sovereign"
    : totalFirstCauseExistentialPower >= 89350
    ? "First-Cause Existential Regent"
    : "Emergent First-Cause Existence";
const firstCauseExistentialSovereigntyBonus =
  totalFirstCauseExistentialPower >= 91450
    ? 2100
    : totalFirstCauseExistentialPower >= 90400
    ? 1655
    : totalFirstCauseExistentialPower >= 89350
    ? 850
    : 425;
const effectiveFirstCauseExistentialSovereignty =
  totalFirstCauseExistentialPower +
  firstCauseExistentialSovereigntyBonus;
const absoluteExistentialRank =
  effectiveFirstCauseExistentialSovereignty >= 93600
    ? "Absolute-Existential Sovereign"
    : effectiveFirstCauseExistentialSovereignty >= 92525
    ? "Absolute-Existential Architect"
    : effectiveFirstCauseExistentialSovereignty >= 91475
    ? "Absolute-Existential Ascendant"
    : "Pre-Absolute-Existential";
const absoluteExistentialBonus =
  effectiveFirstCauseExistentialSovereignty >= 93600
    ? 2125
    : effectiveFirstCauseExistentialSovereignty >= 92525
    ? 1675
    : effectiveFirstCauseExistentialSovereignty >= 91475
    ? 860
    : 430;
const totalAbsoluteExistentialPower =
  effectiveFirstCauseExistentialSovereignty +
  absoluteExistentialBonus;
const absoluteExistentialSovereigntyRank =
  totalAbsoluteExistentialPower >= 95750
    ? "Absolute Existence"
    : totalAbsoluteExistentialPower >= 94675
    ? "Absolute-Existential Sovereign"
    : totalAbsoluteExistentialPower >= 93600
    ? "Absolute-Existential Regent"
    : "Emergent Absolute-Existence";
const absoluteExistentialSovereigntyBonus =
  totalAbsoluteExistentialPower >= 95750
    ? 2150
    : totalAbsoluteExistentialPower >= 94675
    ? 1695
    : totalAbsoluteExistentialPower >= 93600
    ? 870
    : 435;
const effectiveAbsoluteExistentialSovereignty =
  totalAbsoluteExistentialPower +
  absoluteExistentialSovereigntyBonus;
const transAbsoluteExistentialRank =
  effectiveAbsoluteExistentialSovereignty >= 97950
    ? "Trans-Absolute-Existential Sovereign"
    : effectiveAbsoluteExistentialSovereignty >= 96850
    ? "Trans-Absolute-Existential Architect"
    : effectiveAbsoluteExistentialSovereignty >= 95775
    ? "Trans-Absolute-Existential Ascendant"
    : "Pre-Trans-Absolute-Existential";
const transAbsoluteExistentialBonus =
  effectiveAbsoluteExistentialSovereignty >= 97950
    ? 2175
    : effectiveAbsoluteExistentialSovereignty >= 96850
    ? 1715
    : effectiveAbsoluteExistentialSovereignty >= 95775
    ? 880
    : 440;
const totalTransAbsoluteExistentialPower =
  effectiveAbsoluteExistentialSovereignty +
  transAbsoluteExistentialBonus;
const transAbsoluteExistentialSovereigntyRank =
  totalTransAbsoluteExistentialPower >= 100150
    ? "Absolute Trans-Absolute-Existence"
    : totalTransAbsoluteExistentialPower >= 99050
    ? "Trans-Absolute-Existential Sovereign"
    : totalTransAbsoluteExistentialPower >= 97950
    ? "Trans-Absolute-Existential Regent"
    : "Emergent Trans-Absolute-Existence";
const transAbsoluteExistentialSovereigntyBonus =
  totalTransAbsoluteExistentialPower >= 100150
    ? 2200
    : totalTransAbsoluteExistentialPower >= 99050
    ? 1735
    : totalTransAbsoluteExistentialPower >= 97950
    ? 890
    : 445;
const effectiveTransAbsoluteExistentialSovereignty =
  totalTransAbsoluteExistentialPower +
  transAbsoluteExistentialSovereigntyBonus;
const metaAbsoluteExistentialRank =
  effectiveTransAbsoluteExistentialSovereignty >= 102400
    ? "Meta-Absolute-Existential Sovereign"
    : effectiveTransAbsoluteExistentialSovereignty >= 101275
    ? "Meta-Absolute-Existential Architect"
    : effectiveTransAbsoluteExistentialSovereignty >= 100175
    ? "Meta-Absolute-Existential Ascendant"
    : "Pre-Meta-Absolute-Existential";
const metaAbsoluteExistentialBonus =
  effectiveTransAbsoluteExistentialSovereignty >= 102400
    ? 2225
    : effectiveTransAbsoluteExistentialSovereignty >= 101275
    ? 1755
    : effectiveTransAbsoluteExistentialSovereignty >= 100175
    ? 900
    : 450;
const totalMetaAbsoluteExistentialPower =
  effectiveTransAbsoluteExistentialSovereignty +
  metaAbsoluteExistentialBonus;
const metaAbsoluteExistentialSovereigntyRank =
  totalMetaAbsoluteExistentialPower >= 104650
    ? "Absolute Meta-Absolute-Existence"
    : totalMetaAbsoluteExistentialPower >= 103525
    ? "Meta-Absolute-Existential Sovereign"
    : totalMetaAbsoluteExistentialPower >= 102400
    ? "Meta-Absolute-Existential Regent"
    : "Emergent Meta-Absolute-Existence";
const metaAbsoluteExistentialSovereigntyBonus =
  totalMetaAbsoluteExistentialPower >= 104650
    ? 2250
    : totalMetaAbsoluteExistentialPower >= 103525
    ? 1775
    : totalMetaAbsoluteExistentialPower >= 102400
    ? 910
    : 455;
const effectiveMetaAbsoluteExistentialSovereignty =
  totalMetaAbsoluteExistentialPower +
  metaAbsoluteExistentialSovereigntyBonus;
const supraAbsoluteExistentialRank =
  effectiveMetaAbsoluteExistentialSovereignty >= 106950
    ? "Supra-Absolute-Existential Sovereign"
    : effectiveMetaAbsoluteExistentialSovereignty >= 105800
    ? "Supra-Absolute-Existential Architect"
    : effectiveMetaAbsoluteExistentialSovereignty >= 104675
    ? "Supra-Absolute-Existential Ascendant"
    : "Pre-Supra-Absolute-Existential";
const supraAbsoluteExistentialBonus =
  effectiveMetaAbsoluteExistentialSovereignty >= 106950
    ? 2275
    : effectiveMetaAbsoluteExistentialSovereignty >= 105800
    ? 1795
    : effectiveMetaAbsoluteExistentialSovereignty >= 104675
    ? 920
    : 460;
const totalSupraAbsoluteExistentialPower =
  effectiveMetaAbsoluteExistentialSovereignty +
  supraAbsoluteExistentialBonus;
const supraAbsoluteExistentialSovereigntyRank =
  totalSupraAbsoluteExistentialPower >= 109250
    ? "Absolute Supra-Absolute-Existence"
    : totalSupraAbsoluteExistentialPower >= 108100
    ? "Supra-Absolute-Existential Sovereign"
    : totalSupraAbsoluteExistentialPower >= 106950
    ? "Supra-Absolute-Existential Regent"
    : "Emergent Supra-Absolute-Existence";
const supraAbsoluteExistentialSovereigntyBonus =
  totalSupraAbsoluteExistentialPower >= 109250
    ? 2300
    : totalSupraAbsoluteExistentialPower >= 108100
    ? 1815
    : totalSupraAbsoluteExistentialPower >= 106950
    ? 930
    : 465;
const effectiveSupraAbsoluteExistentialSovereignty =
  totalSupraAbsoluteExistentialPower +
  supraAbsoluteExistentialSovereigntyBonus;
const hyperAbsoluteExistentialRank =
  effectiveSupraAbsoluteExistentialSovereignty >= 111600
    ? "Hyper-Absolute-Existential Sovereign"
    : effectiveSupraAbsoluteExistentialSovereignty >= 110425
    ? "Hyper-Absolute-Existential Architect"
    : effectiveSupraAbsoluteExistentialSovereignty >= 109275
    ? "Hyper-Absolute-Existential Ascendant"
    : "Pre-Hyper-Absolute-Existential";
const hyperAbsoluteExistentialBonus =
  effectiveSupraAbsoluteExistentialSovereignty >= 111600
    ? 2325
    : effectiveSupraAbsoluteExistentialSovereignty >= 110425
    ? 1835
    : effectiveSupraAbsoluteExistentialSovereignty >= 109275
    ? 940
    : 470;
const totalHyperAbsoluteExistentialPower =
  effectiveSupraAbsoluteExistentialSovereignty +
  hyperAbsoluteExistentialBonus;
const hyperAbsoluteExistentialSovereigntyRank =
  totalHyperAbsoluteExistentialPower >= 113950
    ? "Absolute Hyper-Absolute-Existence"
    : totalHyperAbsoluteExistentialPower >= 112775
    ? "Hyper-Absolute-Existential Sovereign"
    : totalHyperAbsoluteExistentialPower >= 111600
    ? "Hyper-Absolute-Existential Regent"
    : "Emergent Hyper-Absolute-Existence";
const hyperAbsoluteExistentialSovereigntyBonus =
  totalHyperAbsoluteExistentialPower >= 113950
    ? 2350
    : totalHyperAbsoluteExistentialPower >= 112775
    ? 1855
    : totalHyperAbsoluteExistentialPower >= 111600
    ? 950
    : 475;
const effectiveHyperAbsoluteExistentialSovereignty =
  totalHyperAbsoluteExistentialPower +
  hyperAbsoluteExistentialSovereigntyBonus;
const ultraAbsoluteExistentialRank =
  effectiveHyperAbsoluteExistentialSovereignty >= 116350
    ? "Ultra-Absolute-Existential Sovereign"
    : effectiveHyperAbsoluteExistentialSovereignty >= 115150
    ? "Ultra-Absolute-Existential Architect"
    : effectiveHyperAbsoluteExistentialSovereignty >= 113975
    ? "Ultra-Absolute-Existential Ascendant"
    : "Pre-Ultra-Absolute-Existential";
const ultraAbsoluteExistentialBonus =
  effectiveHyperAbsoluteExistentialSovereignty >= 116350
    ? 2375
    : effectiveHyperAbsoluteExistentialSovereignty >= 115150
    ? 1875
    : effectiveHyperAbsoluteExistentialSovereignty >= 113975
    ? 960
    : 480;
const totalUltraAbsoluteExistentialPower =
  effectiveHyperAbsoluteExistentialSovereignty +
  ultraAbsoluteExistentialBonus;
const ultraAbsoluteExistentialSovereigntyRank =
  totalUltraAbsoluteExistentialPower >= 118750
    ? "Absolute Ultra-Absolute-Existence"
    : totalUltraAbsoluteExistentialPower >= 117550
    ? "Ultra-Absolute-Existential Sovereign"
    : totalUltraAbsoluteExistentialPower >= 116350
    ? "Ultra-Absolute-Existential Regent"
    : "Emergent Ultra-Absolute-Existence";
const ultraAbsoluteExistentialSovereigntyBonus =
  totalUltraAbsoluteExistentialPower >= 118750
    ? 2400
    : totalUltraAbsoluteExistentialPower >= 117550
    ? 1895
    : totalUltraAbsoluteExistentialPower >= 116350
    ? 970
    : 485;
const effectiveUltraAbsoluteExistentialSovereignty =
  totalUltraAbsoluteExistentialPower +
  ultraAbsoluteExistentialSovereigntyBonus;
const omegaAbsoluteExistentialRank =
  effectiveUltraAbsoluteExistentialSovereignty >= 121200
    ? "Omega-Absolute-Existential Sovereign"
    : effectiveUltraAbsoluteExistentialSovereignty >= 119975
    ? "Omega-Absolute-Existential Architect"
    : effectiveUltraAbsoluteExistentialSovereignty >= 118775
    ? "Omega-Absolute-Existential Ascendant"
    : "Pre-Omega-Absolute-Existential";
const omegaAbsoluteExistentialBonus =
  effectiveUltraAbsoluteExistentialSovereignty >= 121200
    ? 2425
    : effectiveUltraAbsoluteExistentialSovereignty >= 119975
    ? 1915
    : effectiveUltraAbsoluteExistentialSovereignty >= 118775
    ? 980
    : 490;
const totalOmegaAbsoluteExistentialPower =
  effectiveUltraAbsoluteExistentialSovereignty +
  omegaAbsoluteExistentialBonus;
const omegaAbsoluteExistentialSovereigntyRank =
  totalOmegaAbsoluteExistentialPower >= 123650
    ? "Absolute Omega-Absolute-Existence"
    : totalOmegaAbsoluteExistentialPower >= 122425
    ? "Omega-Absolute-Existential Sovereign"
    : totalOmegaAbsoluteExistentialPower >= 121200
    ? "Omega-Absolute-Existential Regent"
    : "Emergent Omega-Absolute-Existence";
const omegaAbsoluteExistentialSovereigntyBonus =
  totalOmegaAbsoluteExistentialPower >= 123650
    ? 2450
    : totalOmegaAbsoluteExistentialPower >= 122425
    ? 1935
    : totalOmegaAbsoluteExistentialPower >= 121200
    ? 990
    : 495;
const effectiveOmegaAbsoluteExistentialSovereignty =
  totalOmegaAbsoluteExistentialPower +
  omegaAbsoluteExistentialSovereigntyBonus;
const transOmegaAbsoluteExistentialRank =
  effectiveOmegaAbsoluteExistentialSovereignty >= 126150
    ? "Trans-Omega-Absolute-Existential Sovereign"
    : effectiveOmegaAbsoluteExistentialSovereignty >= 124900
    ? "Trans-Omega-Absolute-Existential Architect"
    : effectiveOmegaAbsoluteExistentialSovereignty >= 123675
    ? "Trans-Omega-Absolute-Existential Ascendant"
    : "Pre-Trans-Omega-Absolute-Existential";
const transOmegaAbsoluteExistentialBonus =
  effectiveOmegaAbsoluteExistentialSovereignty >= 126150
    ? 2475
    : effectiveOmegaAbsoluteExistentialSovereignty >= 124900
    ? 1955
    : effectiveOmegaAbsoluteExistentialSovereignty >= 123675
    ? 1000
    : 500;
const totalTransOmegaAbsoluteExistentialPower =
  effectiveOmegaAbsoluteExistentialSovereignty +
  transOmegaAbsoluteExistentialBonus;
const transOmegaAbsoluteExistentialSovereigntyRank =
  totalTransOmegaAbsoluteExistentialPower >= 128650
    ? "Absolute Trans-Omega-Absolute-Existence"
    : totalTransOmegaAbsoluteExistentialPower >= 127400
    ? "Trans-Omega-Absolute-Existential Sovereign"
    : totalTransOmegaAbsoluteExistentialPower >= 126150
    ? "Trans-Omega-Absolute-Existential Regent"
    : "Emergent Trans-Omega-Absolute-Existence";
const transOmegaAbsoluteExistentialSovereigntyBonus =
  totalTransOmegaAbsoluteExistentialPower >= 128650
    ? 2500
    : totalTransOmegaAbsoluteExistentialPower >= 127400
    ? 1975
    : totalTransOmegaAbsoluteExistentialPower >= 126150
    ? 1010
    : 505;
const effectiveTransOmegaAbsoluteExistentialSovereignty =
  totalTransOmegaAbsoluteExistentialPower +
  transOmegaAbsoluteExistentialSovereigntyBonus;
const beyondAbsoluteExistentialRank =
  effectiveTransOmegaAbsoluteExistentialSovereignty >= 131200
    ? "Beyond-Absolute-Existential Sovereign"
    : effectiveTransOmegaAbsoluteExistentialSovereignty >= 129925
    ? "Beyond-Absolute-Existential Architect"
    : effectiveTransOmegaAbsoluteExistentialSovereignty >= 128675
    ? "Beyond-Absolute-Existential Ascendant"
    : "Pre-Beyond-Absolute-Existential";
const beyondAbsoluteExistentialBonus =
  effectiveTransOmegaAbsoluteExistentialSovereignty >= 131200
    ? 2525
    : effectiveTransOmegaAbsoluteExistentialSovereignty >= 129925
    ? 1995
    : effectiveTransOmegaAbsoluteExistentialSovereignty >= 128675
    ? 1020
    : 510;
const totalBeyondAbsoluteExistentialPower =
  effectiveTransOmegaAbsoluteExistentialSovereignty +
  beyondAbsoluteExistentialBonus;
const beyondAbsoluteExistentialSovereigntyRank =
  totalBeyondAbsoluteExistentialPower >= 133750
    ? "Absolute Beyond-Absolute-Existence"
    : totalBeyondAbsoluteExistentialPower >= 132475
    ? "Beyond-Absolute-Existential Sovereign"
    : totalBeyondAbsoluteExistentialPower >= 131200
    ? "Beyond-Absolute-Existential Regent"
    : "Emergent Beyond-Absolute-Existence";
const beyondAbsoluteExistentialSovereigntyBonus =
  totalBeyondAbsoluteExistentialPower >= 133750
    ? 2550
    : totalBeyondAbsoluteExistentialPower >= 132475
    ? 2015
    : totalBeyondAbsoluteExistentialPower >= 131200
    ? 1030
    : 515;
const effectiveBeyondAbsoluteExistentialSovereignty =
  totalBeyondAbsoluteExistentialPower +
  beyondAbsoluteExistentialSovereigntyBonus;
const transcendentAbsoluteExistentialRank =
  effectiveBeyondAbsoluteExistentialSovereignty >= 136350
    ? "Transcendent-Absolute-Existential Sovereign"
    : effectiveBeyondAbsoluteExistentialSovereignty >= 135050
    ? "Transcendent-Absolute-Existential Architect"
    : effectiveBeyondAbsoluteExistentialSovereignty >= 133775
    ? "Transcendent-Absolute-Existential Ascendant"
    : "Pre-Transcendent-Absolute-Existential";
const transcendentAbsoluteExistentialBonus =
  effectiveBeyondAbsoluteExistentialSovereignty >= 136350
    ? 2575
    : effectiveBeyondAbsoluteExistentialSovereignty >= 135050
    ? 2035
    : effectiveBeyondAbsoluteExistentialSovereignty >= 133775
    ? 1040
    : 520;
const totalTranscendentAbsoluteExistentialPower =
  effectiveBeyondAbsoluteExistentialSovereignty +
  transcendentAbsoluteExistentialBonus;
const transcendentAbsoluteExistentialSovereigntyRank =
  totalTranscendentAbsoluteExistentialPower >= 138950
    ? "Absolute Transcendent-Absolute-Existence"
    : totalTranscendentAbsoluteExistentialPower >= 137650
    ? "Transcendent-Absolute-Existential Sovereign"
    : totalTranscendentAbsoluteExistentialPower >= 136350
    ? "Transcendent-Absolute-Existential Regent"
    : "Emergent Transcendent-Absolute-Existence";
const transcendentAbsoluteExistentialSovereigntyBonus =
  totalTranscendentAbsoluteExistentialPower >= 138950
    ? 2600
    : totalTranscendentAbsoluteExistentialPower >= 137650
    ? 2055
    : totalTranscendentAbsoluteExistentialPower >= 136350
    ? 1050
    : 525;
const effectiveTranscendentAbsoluteExistentialSovereignty =
  totalTranscendentAbsoluteExistentialPower +
  transcendentAbsoluteExistentialSovereigntyBonus;
const primordialAbsoluteExistentialRank =
  effectiveTranscendentAbsoluteExistentialSovereignty >= 141600
    ? "Primordial-Absolute-Existential Sovereign"
    : effectiveTranscendentAbsoluteExistentialSovereignty >= 140275
    ? "Primordial-Absolute-Existential Architect"
    : effectiveTranscendentAbsoluteExistentialSovereignty >= 138975
    ? "Primordial-Absolute-Existential Ascendant"
    : "Pre-Primordial-Absolute-Existential";
const primordialAbsoluteExistentialBonus =
  effectiveTranscendentAbsoluteExistentialSovereignty >= 141600
    ? 2625
    : effectiveTranscendentAbsoluteExistentialSovereignty >= 140275
    ? 2075
    : effectiveTranscendentAbsoluteExistentialSovereignty >= 138975
    ? 1060
    : 530;
const totalPrimordialAbsoluteExistentialPower =
  effectiveTranscendentAbsoluteExistentialSovereignty +
  primordialAbsoluteExistentialBonus;
const primordialAbsoluteExistentialSovereigntyRank =
  totalPrimordialAbsoluteExistentialPower >= 144250
    ? "Absolute Primordial-Absolute-Existence"
    : totalPrimordialAbsoluteExistentialPower >= 142925
    ? "Primordial-Absolute-Existential Sovereign"
    : totalPrimordialAbsoluteExistentialPower >= 141600
    ? "Primordial-Absolute-Existential Regent"
    : "Emergent Primordial-Absolute-Existence";
const primordialAbsoluteExistentialSovereigntyBonus =
  totalPrimordialAbsoluteExistentialPower >= 144250
    ? 2650
    : totalPrimordialAbsoluteExistentialPower >= 142925
    ? 2095
    : totalPrimordialAbsoluteExistentialPower >= 141600
    ? 1070
    : 535;
const effectivePrimordialAbsoluteExistentialSovereignty =
  totalPrimordialAbsoluteExistentialPower +
  primordialAbsoluteExistentialSovereigntyBonus;
const originAbsoluteExistentialRank =
  effectivePrimordialAbsoluteExistentialSovereignty >= 146950
    ? "Origin-Absolute-Existential Sovereign"
    : effectivePrimordialAbsoluteExistentialSovereignty >= 145600
    ? "Origin-Absolute-Existential Architect"
    : effectivePrimordialAbsoluteExistentialSovereignty >= 144275
    ? "Origin-Absolute-Existential Ascendant"
    : "Pre-Origin-Absolute-Existential";
const originAbsoluteExistentialBonus =
  effectivePrimordialAbsoluteExistentialSovereignty >= 146950
    ? 2675
    : effectivePrimordialAbsoluteExistentialSovereignty >= 145600
    ? 2115
    : effectivePrimordialAbsoluteExistentialSovereignty >= 144275
    ? 1080
    : 540;
const totalOriginAbsoluteExistentialPower =
  effectivePrimordialAbsoluteExistentialSovereignty +
  originAbsoluteExistentialBonus;
const originAbsoluteExistentialSovereigntyRank =
  totalOriginAbsoluteExistentialPower >= 149650
    ? "Absolute Origin-Absolute-Existence"
    : totalOriginAbsoluteExistentialPower >= 148300
    ? "Origin-Absolute-Existential Sovereign"
    : totalOriginAbsoluteExistentialPower >= 146950
    ? "Origin-Absolute-Existential Regent"
    : "Emergent Origin-Absolute-Existence";
const originAbsoluteExistentialSovereigntyBonus =
  totalOriginAbsoluteExistentialPower >= 149650
    ? 2700
    : totalOriginAbsoluteExistentialPower >= 148300
    ? 2135
    : totalOriginAbsoluteExistentialPower >= 146950
    ? 1090
    : 545;
const effectiveOriginAbsoluteExistentialSovereignty =
  totalOriginAbsoluteExistentialPower +
  originAbsoluteExistentialSovereigntyBonus;
const sourceAbsoluteExistentialRank =
  effectiveOriginAbsoluteExistentialSovereignty >= 152400
    ? "Source-Absolute-Existential Sovereign"
    : effectiveOriginAbsoluteExistentialSovereignty >= 151025
    ? "Source-Absolute-Existential Architect"
    : effectiveOriginAbsoluteExistentialSovereignty >= 149675
    ? "Source-Absolute-Existential Ascendant"
    : "Pre-Source-Absolute-Existential";
const sourceAbsoluteExistentialBonus =
  effectiveOriginAbsoluteExistentialSovereignty >= 152400
    ? 2725
    : effectiveOriginAbsoluteExistentialSovereignty >= 151025
    ? 2155
    : effectiveOriginAbsoluteExistentialSovereignty >= 149675
    ? 1100
    : 550;
const totalSourceAbsoluteExistentialPower =
  effectiveOriginAbsoluteExistentialSovereignty +
  sourceAbsoluteExistentialBonus;
const sourceAbsoluteExistentialSovereigntyRank =
  totalSourceAbsoluteExistentialPower >= 155150
    ? "Absolute Source-Absolute-Existence"
    : totalSourceAbsoluteExistentialPower >= 153775
    ? "Source-Absolute-Existential Sovereign"
    : totalSourceAbsoluteExistentialPower >= 152400
    ? "Source-Absolute-Existential Regent"
    : "Emergent Source-Absolute-Existence";
const sourceAbsoluteExistentialSovereigntyBonus =
  totalSourceAbsoluteExistentialPower >= 155150
    ? 2750
    : totalSourceAbsoluteExistentialPower >= 153775
    ? 2175
    : totalSourceAbsoluteExistentialPower >= 152400
    ? 1110
    : 555;
const effectiveSourceAbsoluteExistentialSovereignty =
  totalSourceAbsoluteExistentialPower +
  sourceAbsoluteExistentialSovereigntyBonus;
const genesisAbsoluteExistentialRank =
  effectiveSourceAbsoluteExistentialSovereignty >= 157950
    ? "Genesis-Absolute-Existential Sovereign"
    : effectiveSourceAbsoluteExistentialSovereignty >= 156550
    ? "Genesis-Absolute-Existential Architect"
    : effectiveSourceAbsoluteExistentialSovereignty >= 155175
    ? "Genesis-Absolute-Existential Ascendant"
    : "Pre-Genesis-Absolute-Existential";
const genesisAbsoluteExistentialBonus =
  effectiveSourceAbsoluteExistentialSovereignty >= 157950
    ? 2775
    : effectiveSourceAbsoluteExistentialSovereignty >= 156550
    ? 2195
    : effectiveSourceAbsoluteExistentialSovereignty >= 155175
    ? 1120
    : 560;
const totalGenesisAbsoluteExistentialPower =
  effectiveSourceAbsoluteExistentialSovereignty +
  genesisAbsoluteExistentialBonus;
const genesisAbsoluteExistentialSovereigntyRank =
  totalGenesisAbsoluteExistentialPower >= 160750
    ? "Absolute Genesis-Absolute-Existence"
    : totalGenesisAbsoluteExistentialPower >= 159350
    ? "Genesis-Absolute-Existential Sovereign"
    : totalGenesisAbsoluteExistentialPower >= 157950
    ? "Genesis-Absolute-Existential Regent"
    : "Emergent Genesis-Absolute-Existence";
const genesisAbsoluteExistentialSovereigntyBonus =
  totalGenesisAbsoluteExistentialPower >= 160750
    ? 2800
    : totalGenesisAbsoluteExistentialPower >= 159350
    ? 2215
    : totalGenesisAbsoluteExistentialPower >= 157950
    ? 1130
    : 565;
const effectiveGenesisAbsoluteExistentialSovereignty =
  totalGenesisAbsoluteExistentialPower +
  genesisAbsoluteExistentialSovereigntyBonus;
const creationAbsoluteExistentialRank =
  effectiveGenesisAbsoluteExistentialSovereignty >= 163600
    ? "Creation-Absolute-Existential Sovereign"
    : effectiveGenesisAbsoluteExistentialSovereignty >= 162175
    ? "Creation-Absolute-Existential Architect"
    : effectiveGenesisAbsoluteExistentialSovereignty >= 160775
    ? "Creation-Absolute-Existential Ascendant"
    : "Pre-Creation-Absolute-Existential";
const creationAbsoluteExistentialBonus =
  effectiveGenesisAbsoluteExistentialSovereignty >= 163600
    ? 2825
    : effectiveGenesisAbsoluteExistentialSovereignty >= 162175
    ? 2235
    : effectiveGenesisAbsoluteExistentialSovereignty >= 160775
    ? 1140
    : 570;
const totalCreationAbsoluteExistentialPower =
  effectiveGenesisAbsoluteExistentialSovereignty +
  creationAbsoluteExistentialBonus;
const creationAbsoluteExistentialSovereigntyRank =
  totalCreationAbsoluteExistentialPower >= 166450
    ? "Absolute Creation-Absolute-Existence"
    : totalCreationAbsoluteExistentialPower >= 165025
    ? "Creation-Absolute-Existential Sovereign"
    : totalCreationAbsoluteExistentialPower >= 163600
    ? "Creation-Absolute-Existential Regent"
    : "Emergent Creation-Absolute-Existence";
const creationAbsoluteExistentialSovereigntyBonus =
  totalCreationAbsoluteExistentialPower >= 166450
    ? 2850
    : totalCreationAbsoluteExistentialPower >= 165025
    ? 2255
    : totalCreationAbsoluteExistentialPower >= 163600
    ? 1150
    : 575;
const effectiveCreationAbsoluteExistentialSovereignty =
  totalCreationAbsoluteExistentialPower +
  creationAbsoluteExistentialSovereigntyBonus;
const firstCauseAbsoluteExistentialRank =
  effectiveCreationAbsoluteExistentialSovereignty >= 169350
    ? "First-Cause-Absolute-Existential Sovereign"
    : effectiveCreationAbsoluteExistentialSovereignty >= 167900
    ? "First-Cause-Absolute-Existential Architect"
    : effectiveCreationAbsoluteExistentialSovereignty >= 166475
    ? "First-Cause-Absolute-Existential Ascendant"
    : "Pre-First-Cause-Absolute-Existential";
const firstCauseAbsoluteExistentialBonus =
  effectiveCreationAbsoluteExistentialSovereignty >= 169350
    ? 2875
    : effectiveCreationAbsoluteExistentialSovereignty >= 167900
    ? 2275
    : effectiveCreationAbsoluteExistentialSovereignty >= 166475
    ? 1160
    : 580;
const totalFirstCauseAbsoluteExistentialPower =
  effectiveCreationAbsoluteExistentialSovereignty +
  firstCauseAbsoluteExistentialBonus;
const firstCauseAbsoluteExistentialSovereigntyRank =
  totalFirstCauseAbsoluteExistentialPower >= 172250
    ? "Absolute First-Cause-Absolute-Existence"
    : totalFirstCauseAbsoluteExistentialPower >= 170800
    ? "First-Cause-Absolute-Existential Sovereign"
    : totalFirstCauseAbsoluteExistentialPower >= 169350
    ? "First-Cause-Absolute-Existential Regent"
    : "Emergent First-Cause-Absolute-Existence";
const firstCauseAbsoluteExistentialSovereigntyBonus =
  totalFirstCauseAbsoluteExistentialPower >= 172250
    ? 2900
    : totalFirstCauseAbsoluteExistentialPower >= 170800
    ? 2295
    : totalFirstCauseAbsoluteExistentialPower >= 169350
    ? 1170
    : 585;
const effectiveFirstCauseAbsoluteExistentialSovereignty =
  totalFirstCauseAbsoluteExistentialPower +
  firstCauseAbsoluteExistentialSovereigntyBonus;
const absoluteAbsoluteExistentialRank =
  effectiveFirstCauseAbsoluteExistentialSovereignty >= 175200
    ? "Absolute-Absolute-Existential Sovereign"
    : effectiveFirstCauseAbsoluteExistentialSovereignty >= 173725
    ? "Absolute-Absolute-Existential Architect"
    : effectiveFirstCauseAbsoluteExistentialSovereignty >= 172275
    ? "Absolute-Absolute-Existential Ascendant"
    : "Pre-Absolute-Absolute-Existential";
const absoluteAbsoluteExistentialBonus =
  effectiveFirstCauseAbsoluteExistentialSovereignty >= 175200
    ? 2925
    : effectiveFirstCauseAbsoluteExistentialSovereignty >= 173725
    ? 2315
    : effectiveFirstCauseAbsoluteExistentialSovereignty >= 172275
    ? 1180
    : 590;
const totalAbsoluteAbsoluteExistentialPower =
  effectiveFirstCauseAbsoluteExistentialSovereignty +
  absoluteAbsoluteExistentialBonus;
const absoluteAbsoluteExistentialSovereigntyRank =
  totalAbsoluteAbsoluteExistentialPower >= 178150
    ? "Absolute Absolute-Absolute-Existence"
    : totalAbsoluteAbsoluteExistentialPower >= 176675
    ? "Absolute-Absolute-Existential Sovereign"
    : totalAbsoluteAbsoluteExistentialPower >= 175200
    ? "Absolute-Absolute-Existential Regent"
    : "Emergent Absolute-Absolute-Existence";
const absoluteAbsoluteExistentialSovereigntyBonus =
  totalAbsoluteAbsoluteExistentialPower >= 178150
    ? 2950
    : totalAbsoluteAbsoluteExistentialPower >= 176675
    ? 2335
    : totalAbsoluteAbsoluteExistentialPower >= 175200
    ? 1190
    : 595;
const effectiveAbsoluteAbsoluteExistentialSovereignty =
  totalAbsoluteAbsoluteExistentialPower +
  absoluteAbsoluteExistentialSovereigntyBonus;
const transAbsoluteAbsoluteExistentialRank =
  effectiveAbsoluteAbsoluteExistentialSovereignty >= 181150
    ? "Trans-Absolute-Absolute-Existential Sovereign"
    : effectiveAbsoluteAbsoluteExistentialSovereignty >= 179650
    ? "Trans-Absolute-Absolute-Existential Architect"
    : effectiveAbsoluteAbsoluteExistentialSovereignty >= 178175
    ? "Trans-Absolute-Absolute-Existential Ascendant"
    : "Pre-Trans-Absolute-Absolute-Existential";
const transAbsoluteAbsoluteExistentialBonus =
  effectiveAbsoluteAbsoluteExistentialSovereignty >= 181150
    ? 2975
    : effectiveAbsoluteAbsoluteExistentialSovereignty >= 179650
    ? 2355
    : effectiveAbsoluteAbsoluteExistentialSovereignty >= 178175
    ? 1200
    : 600;
const totalTransAbsoluteAbsoluteExistentialPower =
  effectiveAbsoluteAbsoluteExistentialSovereignty +
  transAbsoluteAbsoluteExistentialBonus;
const transAbsoluteAbsoluteExistentialSovereigntyRank =
  totalTransAbsoluteAbsoluteExistentialPower >= 184150
    ? "Absolute Trans-Absolute-Absolute-Existence"
    : totalTransAbsoluteAbsoluteExistentialPower >= 182650
    ? "Trans-Absolute-Absolute-Existential Sovereign"
    : totalTransAbsoluteAbsoluteExistentialPower >= 181150
    ? "Trans-Absolute-Absolute-Existential Regent"
    : "Emergent Trans-Absolute-Absolute-Existence";
const transAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalTransAbsoluteAbsoluteExistentialPower >= 184150
    ? 3000
    : totalTransAbsoluteAbsoluteExistentialPower >= 182650
    ? 2375
    : totalTransAbsoluteAbsoluteExistentialPower >= 181150
    ? 1210
    : 605;
const effectiveTransAbsoluteAbsoluteExistentialSovereignty =
  totalTransAbsoluteAbsoluteExistentialPower +
  transAbsoluteAbsoluteExistentialSovereigntyBonus;
const metaAbsoluteAbsoluteExistentialRank =
  effectiveTransAbsoluteAbsoluteExistentialSovereignty >= 187200
    ? "Meta-Absolute-Absolute-Existential Sovereign"
    : effectiveTransAbsoluteAbsoluteExistentialSovereignty >= 185675
    ? "Meta-Absolute-Absolute-Existential Architect"
    : effectiveTransAbsoluteAbsoluteExistentialSovereignty >= 184175
    ? "Meta-Absolute-Absolute-Existential Ascendant"
    : "Pre-Meta-Absolute-Absolute-Existential";
const metaAbsoluteAbsoluteExistentialBonus =
  effectiveTransAbsoluteAbsoluteExistentialSovereignty >= 187200
    ? 3025
    : effectiveTransAbsoluteAbsoluteExistentialSovereignty >= 185675
    ? 2395
    : effectiveTransAbsoluteAbsoluteExistentialSovereignty >= 184175
    ? 1220
    : 610;
const totalMetaAbsoluteAbsoluteExistentialPower =
  effectiveTransAbsoluteAbsoluteExistentialSovereignty +
  metaAbsoluteAbsoluteExistentialBonus;
const metaAbsoluteAbsoluteExistentialSovereigntyRank =
  totalMetaAbsoluteAbsoluteExistentialPower >= 190250
    ? "Absolute Meta-Absolute-Absolute-Existence"
    : totalMetaAbsoluteAbsoluteExistentialPower >= 188725
    ? "Meta-Absolute-Absolute-Existential Sovereign"
    : totalMetaAbsoluteAbsoluteExistentialPower >= 187200
    ? "Meta-Absolute-Absolute-Existential Regent"
    : "Emergent Meta-Absolute-Absolute-Existence";
const metaAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalMetaAbsoluteAbsoluteExistentialPower >= 190250
    ? 3050
    : totalMetaAbsoluteAbsoluteExistentialPower >= 188725
    ? 2415
    : totalMetaAbsoluteAbsoluteExistentialPower >= 187200
    ? 1230
    : 615;
const effectiveMetaAbsoluteAbsoluteExistentialSovereignty =
  totalMetaAbsoluteAbsoluteExistentialPower +
  metaAbsoluteAbsoluteExistentialSovereigntyBonus;
const supraAbsoluteAbsoluteExistentialRank =
  effectiveMetaAbsoluteAbsoluteExistentialSovereignty >= 193350
    ? "Supra-Absolute-Absolute-Existential Sovereign"
    : effectiveMetaAbsoluteAbsoluteExistentialSovereignty >= 191800
    ? "Supra-Absolute-Absolute-Existential Architect"
    : effectiveMetaAbsoluteAbsoluteExistentialSovereignty >= 190275
    ? "Supra-Absolute-Absolute-Existential Ascendant"
    : "Pre-Supra-Absolute-Absolute-Existential";
const supraAbsoluteAbsoluteExistentialBonus =
  effectiveMetaAbsoluteAbsoluteExistentialSovereignty >= 193350
    ? 3075
    : effectiveMetaAbsoluteAbsoluteExistentialSovereignty >= 191800
    ? 2435
    : effectiveMetaAbsoluteAbsoluteExistentialSovereignty >= 190275
    ? 1240
    : 620;
const totalSupraAbsoluteAbsoluteExistentialPower =
  effectiveMetaAbsoluteAbsoluteExistentialSovereignty +
  supraAbsoluteAbsoluteExistentialBonus;
const ascensionProgress =
  ascensionLevel >= 3
    ? 100
    : ascensionLevel === 2
    ? Math.min(100, Math.floor((empireTerritories / 250) * 100))
    : ascensionLevel === 1
    ? Math.min(100, Math.floor((empireTerritories / 200) * 100))
    : 0;
const supraAbsoluteAbsoluteExistentialSovereigntyRank =
  totalSupraAbsoluteAbsoluteExistentialPower >= 196450
    ? "Absolute Supra-Absolute-Absolute-Existence"
    : totalSupraAbsoluteAbsoluteExistentialPower >= 194900
    ? "Supra-Absolute-Absolute-Existential Sovereign"
    : totalSupraAbsoluteAbsoluteExistentialPower >= 193350
    ? "Supra-Absolute-Absolute-Existential Regent"
    : "Emergent Supra-Absolute-Absolute-Existence";
const supraAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalSupraAbsoluteAbsoluteExistentialPower >= 196450
    ? 3100
    : totalSupraAbsoluteAbsoluteExistentialPower >= 194900
    ? 2455
    : totalSupraAbsoluteAbsoluteExistentialPower >= 193350
    ? 1250
    : 625;
const effectiveSupraAbsoluteAbsoluteExistentialSovereignty =
  totalSupraAbsoluteAbsoluteExistentialPower +
  supraAbsoluteAbsoluteExistentialSovereigntyBonus;
const hyperAbsoluteAbsoluteExistentialRank =
  effectiveSupraAbsoluteAbsoluteExistentialSovereignty >= 199600
    ? "Hyper-Absolute-Absolute-Existential Sovereign"
    : effectiveSupraAbsoluteAbsoluteExistentialSovereignty >= 198025
    ? "Hyper-Absolute-Absolute-Existential Architect"
    : effectiveSupraAbsoluteAbsoluteExistentialSovereignty >= 196475
    ? "Hyper-Absolute-Absolute-Existential Ascendant"
    : "Pre-Hyper-Absolute-Absolute-Existential";
const hyperAbsoluteAbsoluteExistentialBonus =
  effectiveSupraAbsoluteAbsoluteExistentialSovereignty >= 199600
    ? 3125
    : effectiveSupraAbsoluteAbsoluteExistentialSovereignty >= 198025
    ? 2475
    : effectiveSupraAbsoluteAbsoluteExistentialSovereignty >= 196475
    ? 1260
    : 630;
const totalHyperAbsoluteAbsoluteExistentialPower =
  effectiveSupraAbsoluteAbsoluteExistentialSovereignty +
  hyperAbsoluteAbsoluteExistentialBonus;
const hyperAbsoluteAbsoluteExistentialSovereigntyRank =
  totalHyperAbsoluteAbsoluteExistentialPower >= 202750
    ? "Absolute Hyper-Absolute-Absolute-Existence"
    : totalHyperAbsoluteAbsoluteExistentialPower >= 201175
    ? "Hyper-Absolute-Absolute-Existential Sovereign"
    : totalHyperAbsoluteAbsoluteExistentialPower >= 199600
    ? "Hyper-Absolute-Absolute-Existential Regent"
    : "Emergent Hyper-Absolute-Absolute-Existence";
const hyperAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalHyperAbsoluteAbsoluteExistentialPower >= 202750
    ? 3150
    : totalHyperAbsoluteAbsoluteExistentialPower >= 201175
    ? 2495
    : totalHyperAbsoluteAbsoluteExistentialPower >= 199600
    ? 1270
    : 635;
const effectiveHyperAbsoluteAbsoluteExistentialSovereignty =
  totalHyperAbsoluteAbsoluteExistentialPower +
  hyperAbsoluteAbsoluteExistentialSovereigntyBonus;
const ultraAbsoluteAbsoluteExistentialRank =
  effectiveHyperAbsoluteAbsoluteExistentialSovereignty >= 205950
    ? "Ultra-Absolute-Absolute-Existential Sovereign"
    : effectiveHyperAbsoluteAbsoluteExistentialSovereignty >= 204350
    ? "Ultra-Absolute-Absolute-Existential Architect"
    : effectiveHyperAbsoluteAbsoluteExistentialSovereignty >= 202775
    ? "Ultra-Absolute-Absolute-Existential Ascendant"
    : "Pre-Ultra-Absolute-Absolute-Existential";
const ultraAbsoluteAbsoluteExistentialBonus =
  effectiveHyperAbsoluteAbsoluteExistentialSovereignty >= 205950
    ? 3175
    : effectiveHyperAbsoluteAbsoluteExistentialSovereignty >= 204350
    ? 2515
    : effectiveHyperAbsoluteAbsoluteExistentialSovereignty >= 202775
    ? 1280
    : 640;
const totalUltraAbsoluteAbsoluteExistentialPower =
  effectiveHyperAbsoluteAbsoluteExistentialSovereignty +
  ultraAbsoluteAbsoluteExistentialBonus;
const ultraAbsoluteAbsoluteExistentialSovereigntyRank =
  totalUltraAbsoluteAbsoluteExistentialPower >= 209150
    ? "Absolute Ultra-Absolute-Absolute-Existence"
    : totalUltraAbsoluteAbsoluteExistentialPower >= 207550
    ? "Ultra-Absolute-Absolute-Existential Sovereign"
    : totalUltraAbsoluteAbsoluteExistentialPower >= 205950
    ? "Ultra-Absolute-Absolute-Existential Regent"
    : "Emergent Ultra-Absolute-Absolute-Existence";
const ultraAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalUltraAbsoluteAbsoluteExistentialPower >= 209150
    ? 3200
    : totalUltraAbsoluteAbsoluteExistentialPower >= 207550
    ? 2535
    : totalUltraAbsoluteAbsoluteExistentialPower >= 205950
    ? 1290
    : 645;
const effectiveUltraAbsoluteAbsoluteExistentialSovereignty =
  totalUltraAbsoluteAbsoluteExistentialPower +
  ultraAbsoluteAbsoluteExistentialSovereigntyBonus;
const omegaAbsoluteAbsoluteExistentialRank =
  effectiveUltraAbsoluteAbsoluteExistentialSovereignty >= 212400
    ? "Omega-Absolute-Absolute-Existential Sovereign"
    : effectiveUltraAbsoluteAbsoluteExistentialSovereignty >= 210775
    ? "Omega-Absolute-Absolute-Existential Architect"
    : effectiveUltraAbsoluteAbsoluteExistentialSovereignty >= 209175
    ? "Omega-Absolute-Absolute-Existential Ascendant"
    : "Pre-Omega-Absolute-Absolute-Existential";
const omegaAbsoluteAbsoluteExistentialBonus =
  effectiveUltraAbsoluteAbsoluteExistentialSovereignty >= 212400
    ? 3225
    : effectiveUltraAbsoluteAbsoluteExistentialSovereignty >= 210775
    ? 2555
    : effectiveUltraAbsoluteAbsoluteExistentialSovereignty >= 209175
    ? 1300
    : 650;
const totalOmegaAbsoluteAbsoluteExistentialPower =
  effectiveUltraAbsoluteAbsoluteExistentialSovereignty +
  omegaAbsoluteAbsoluteExistentialBonus;
const omegaAbsoluteAbsoluteExistentialSovereigntyRank =
  totalOmegaAbsoluteAbsoluteExistentialPower >= 215650
    ? "Absolute Omega-Absolute-Absolute-Existence"
    : totalOmegaAbsoluteAbsoluteExistentialPower >= 214025
    ? "Omega-Absolute-Absolute-Existential Sovereign"
    : totalOmegaAbsoluteAbsoluteExistentialPower >= 212400
    ? "Omega-Absolute-Absolute-Existential Regent"
    : "Emergent Omega-Absolute-Absolute-Existence";
const omegaAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalOmegaAbsoluteAbsoluteExistentialPower >= 215650
    ? 3250
    : totalOmegaAbsoluteAbsoluteExistentialPower >= 214025
    ? 2575
    : totalOmegaAbsoluteAbsoluteExistentialPower >= 212400
    ? 1310
    : 655;
const effectiveOmegaAbsoluteAbsoluteExistentialSovereignty =
  totalOmegaAbsoluteAbsoluteExistentialPower +
  omegaAbsoluteAbsoluteExistentialSovereigntyBonus;
const transOmegaAbsoluteAbsoluteExistentialRank =
  effectiveOmegaAbsoluteAbsoluteExistentialSovereignty >= 218950
    ? "Trans-Omega-Absolute-Absolute-Existential Sovereign"
    : effectiveOmegaAbsoluteAbsoluteExistentialSovereignty >= 217300
    ? "Trans-Omega-Absolute-Absolute-Existential Architect"
    : effectiveOmegaAbsoluteAbsoluteExistentialSovereignty >= 215675
    ? "Trans-Omega-Absolute-Absolute-Existential Ascendant"
    : "Pre-Trans-Omega-Absolute-Absolute-Existential";
const transOmegaAbsoluteAbsoluteExistentialBonus =
  effectiveOmegaAbsoluteAbsoluteExistentialSovereignty >= 218950
    ? 3275
    : effectiveOmegaAbsoluteAbsoluteExistentialSovereignty >= 217300
    ? 2595
    : effectiveOmegaAbsoluteAbsoluteExistentialSovereignty >= 215675
    ? 1320
    : 660;
const totalTransOmegaAbsoluteAbsoluteExistentialPower =
  effectiveOmegaAbsoluteAbsoluteExistentialSovereignty +
  transOmegaAbsoluteAbsoluteExistentialBonus;
const transOmegaAbsoluteAbsoluteExistentialSovereigntyRank =
  totalTransOmegaAbsoluteAbsoluteExistentialPower >= 222250
    ? "Absolute Trans-Omega-Absolute-Absolute-Existence"
    : totalTransOmegaAbsoluteAbsoluteExistentialPower >= 220600
    ? "Trans-Omega-Absolute-Absolute-Existential Sovereign"
    : totalTransOmegaAbsoluteAbsoluteExistentialPower >= 218950
    ? "Trans-Omega-Absolute-Absolute-Existential Regent"
    : "Emergent Trans-Omega-Absolute-Absolute-Existence";
const transOmegaAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalTransOmegaAbsoluteAbsoluteExistentialPower >= 222250
    ? 3300
    : totalTransOmegaAbsoluteAbsoluteExistentialPower >= 220600
    ? 2615
    : totalTransOmegaAbsoluteAbsoluteExistentialPower >= 218950
    ? 1330
    : 665;
const effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty =
  totalTransOmegaAbsoluteAbsoluteExistentialPower +
  transOmegaAbsoluteAbsoluteExistentialSovereigntyBonus;
const beyondAbsoluteAbsoluteExistentialRank =
  effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty >= 225600
    ? "Beyond-Absolute-Absolute-Existential Sovereign"
    : effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty >= 223925
    ? "Beyond-Absolute-Absolute-Existential Architect"
    : effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty >= 222275
    ? "Beyond-Absolute-Absolute-Existential Ascendant"
    : "Pre-Beyond-Absolute-Absolute-Existential";
const beyondAbsoluteAbsoluteExistentialBonus =
  effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty >= 225600
    ? 3325
    : effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty >= 223925
    ? 2635
    : effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty >= 222275
    ? 1340
    : 670;
const totalBeyondAbsoluteAbsoluteExistentialPower =
  effectiveTransOmegaAbsoluteAbsoluteExistentialSovereignty +
  beyondAbsoluteAbsoluteExistentialBonus;
const beyondAbsoluteAbsoluteExistentialSovereigntyRank =
  totalBeyondAbsoluteAbsoluteExistentialPower >= 228950
    ? "Absolute Beyond-Absolute-Absolute-Existence"
    : totalBeyondAbsoluteAbsoluteExistentialPower >= 227275
    ? "Beyond-Absolute-Absolute-Existential Sovereign"
    : totalBeyondAbsoluteAbsoluteExistentialPower >= 225600
    ? "Beyond-Absolute-Absolute-Existential Regent"
    : "Emergent Beyond-Absolute-Absolute-Existence";
const beyondAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalBeyondAbsoluteAbsoluteExistentialPower >= 228950
    ? 3350
    : totalBeyondAbsoluteAbsoluteExistentialPower >= 227275
    ? 2655
    : totalBeyondAbsoluteAbsoluteExistentialPower >= 225600
    ? 1350
    : 675;
const effectiveBeyondAbsoluteAbsoluteExistentialSovereignty =
  totalBeyondAbsoluteAbsoluteExistentialPower +
  beyondAbsoluteAbsoluteExistentialSovereigntyBonus;
const transcendentAbsoluteAbsoluteExistentialRank =
  effectiveBeyondAbsoluteAbsoluteExistentialSovereignty >= 232350
    ? "Transcendent-Absolute-Absolute-Existential Sovereign"
    : effectiveBeyondAbsoluteAbsoluteExistentialSovereignty >= 230650
    ? "Transcendent-Absolute-Absolute-Existential Architect"
    : effectiveBeyondAbsoluteAbsoluteExistentialSovereignty >= 228975
    ? "Transcendent-Absolute-Absolute-Existential Ascendant"
    : "Pre-Transcendent-Absolute-Absolute-Existential";

const transcendentAbsoluteAbsoluteExistentialBonus =
  effectiveBeyondAbsoluteAbsoluteExistentialSovereignty >= 232350
    ? 3375
    : effectiveBeyondAbsoluteAbsoluteExistentialSovereignty >= 230650
    ? 2675
    : effectiveBeyondAbsoluteAbsoluteExistentialSovereignty >= 228975
    ? 1360
    : 680;
const totalTranscendentAbsoluteAbsoluteExistentialPower =
  effectiveBeyondAbsoluteAbsoluteExistentialSovereignty +
  transcendentAbsoluteAbsoluteExistentialBonus;
const transcendentAbsoluteAbsoluteExistentialSovereigntyRank =
  totalTranscendentAbsoluteAbsoluteExistentialPower >= 235750
    ? "Absolute Transcendent-Absolute-Absolute-Existence"
    : totalTranscendentAbsoluteAbsoluteExistentialPower >= 234050
    ? "Transcendent-Absolute-Absolute-Existential Sovereign"
    : totalTranscendentAbsoluteAbsoluteExistentialPower >= 232350
    ? "Transcendent-Absolute-Absolute-Existential Regent"
    : "Emergent Transcendent-Absolute-Absolute-Existence";
const transcendentAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalTranscendentAbsoluteAbsoluteExistentialPower >= 235750
    ? 3400
    : totalTranscendentAbsoluteAbsoluteExistentialPower >= 234050
    ? 2695
    : totalTranscendentAbsoluteAbsoluteExistentialPower >= 232350
    ? 1370
    : 685;
const effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty =
  totalTranscendentAbsoluteAbsoluteExistentialPower +
  transcendentAbsoluteAbsoluteExistentialSovereigntyBonus;
const primordialAbsoluteAbsoluteExistentialRank =
  effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty >= 239200
    ? "Primordial-Absolute-Absolute-Existential Sovereign"
    : effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty >= 237475
    ? "Primordial-Absolute-Absolute-Existential Architect"
    : effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty >= 235775
    ? "Primordial-Absolute-Absolute-Existential Ascendant"
    : "Pre-Primordial-Absolute-Absolute-Existential";
const primordialAbsoluteAbsoluteExistentialBonus =
  effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty >= 239200
    ? 3425
    : effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty >= 237475
    ? 2715
    : effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty >= 235775
    ? 1380
    : 690;
const totalPrimordialAbsoluteAbsoluteExistentialPower =
  effectiveTranscendentAbsoluteAbsoluteExistentialSovereignty +
  primordialAbsoluteAbsoluteExistentialBonus;
const primordialAbsoluteAbsoluteExistentialSovereigntyRank =
  totalPrimordialAbsoluteAbsoluteExistentialPower >= 242650
    ? "Absolute Primordial-Absolute-Absolute-Existence"
    : totalPrimordialAbsoluteAbsoluteExistentialPower >= 240925
    ? "Primordial-Absolute-Absolute-Existential Sovereign"
    : totalPrimordialAbsoluteAbsoluteExistentialPower >= 239200
    ? "Primordial-Absolute-Absolute-Existential Regent"
    : "Emergent Primordial-Absolute-Absolute-Existence";
const primordialAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalPrimordialAbsoluteAbsoluteExistentialPower >= 242650
    ? 3450
    : totalPrimordialAbsoluteAbsoluteExistentialPower >= 240925
    ? 2735
    : totalPrimordialAbsoluteAbsoluteExistentialPower >= 239200
    ? 1390
    : 695;
const effectivePrimordialAbsoluteAbsoluteExistentialSovereignty =
  totalPrimordialAbsoluteAbsoluteExistentialPower +
  primordialAbsoluteAbsoluteExistentialSovereigntyBonus;
const originAbsoluteAbsoluteExistentialRank =
  effectivePrimordialAbsoluteAbsoluteExistentialSovereignty >= 246150
    ? "Origin-Absolute-Absolute-Existential Sovereign"
    : effectivePrimordialAbsoluteAbsoluteExistentialSovereignty >= 244400
    ? "Origin-Absolute-Absolute-Existential Architect"
    : effectivePrimordialAbsoluteAbsoluteExistentialSovereignty >= 242675
    ? "Origin-Absolute-Absolute-Existential Ascendant"
    : "Pre-Origin-Absolute-Absolute-Existential";
const originAbsoluteAbsoluteExistentialBonus =
  effectivePrimordialAbsoluteAbsoluteExistentialSovereignty >= 246150
    ? 3475
    : effectivePrimordialAbsoluteAbsoluteExistentialSovereignty >= 244400
    ? 2755
    : effectivePrimordialAbsoluteAbsoluteExistentialSovereignty >= 242675
    ? 1400
    : 700;
const totalOriginAbsoluteAbsoluteExistentialPower =
  effectivePrimordialAbsoluteAbsoluteExistentialSovereignty +
  originAbsoluteAbsoluteExistentialBonus;
const originAbsoluteAbsoluteExistentialSovereigntyRank =
  totalOriginAbsoluteAbsoluteExistentialPower >= 249650
    ? "Absolute Origin-Absolute-Absolute-Existence"
    : totalOriginAbsoluteAbsoluteExistentialPower >= 247900
    ? "Origin-Absolute-Absolute-Existential Sovereign"
    : totalOriginAbsoluteAbsoluteExistentialPower >= 246150
    ? "Origin-Absolute-Absolute-Existential Regent"
    : "Emergent Origin-Absolute-Absolute-Existence";
const originAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalOriginAbsoluteAbsoluteExistentialPower >= 249650
    ? 3500
    : totalOriginAbsoluteAbsoluteExistentialPower >= 247900
    ? 2775
    : totalOriginAbsoluteAbsoluteExistentialPower >= 246150
    ? 1410
    : 705;
const effectiveOriginAbsoluteAbsoluteExistentialSovereignty =
  totalOriginAbsoluteAbsoluteExistentialPower +
  originAbsoluteAbsoluteExistentialSovereigntyBonus;
const sourceAbsoluteAbsoluteExistentialRank =
  effectiveOriginAbsoluteAbsoluteExistentialSovereignty >= 253200
    ? "Source-Absolute-Absolute-Existential Sovereign"
    : effectiveOriginAbsoluteAbsoluteExistentialSovereignty >= 251425
    ? "Source-Absolute-Absolute-Existential Architect"
    : effectiveOriginAbsoluteAbsoluteExistentialSovereignty >= 249675
    ? "Source-Absolute-Absolute-Existential Ascendant"
    : "Pre-Source-Absolute-Absolute-Existential";
const sourceAbsoluteAbsoluteExistentialBonus =
  effectiveOriginAbsoluteAbsoluteExistentialSovereignty >= 253200
    ? 3525
    : effectiveOriginAbsoluteAbsoluteExistentialSovereignty >= 251425
    ? 2795
    : effectiveOriginAbsoluteAbsoluteExistentialSovereignty >= 249675
    ? 1420
    : 710;
const totalSourceAbsoluteAbsoluteExistentialPower =
  effectiveOriginAbsoluteAbsoluteExistentialSovereignty +
  sourceAbsoluteAbsoluteExistentialBonus;
const sourceAbsoluteAbsoluteExistentialSovereigntyRank =
  totalSourceAbsoluteAbsoluteExistentialPower >= 256750
    ? "Absolute Source-Absolute-Absolute-Existence"
    : totalSourceAbsoluteAbsoluteExistentialPower >= 254975
    ? "Source-Absolute-Absolute-Existential Sovereign"
    : totalSourceAbsoluteAbsoluteExistentialPower >= 253200
    ? "Source-Absolute-Absolute-Existential Regent"
    : "Emergent Source-Absolute-Absolute-Existence";
const sourceAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalSourceAbsoluteAbsoluteExistentialPower >= 256750
    ? 3550
    : totalSourceAbsoluteAbsoluteExistentialPower >= 254975
    ? 2815
    : totalSourceAbsoluteAbsoluteExistentialPower >= 253200
    ? 1430
    : 715;
const effectiveSourceAbsoluteAbsoluteExistentialSovereignty =
  totalSourceAbsoluteAbsoluteExistentialPower +
  sourceAbsoluteAbsoluteExistentialSovereigntyBonus;
const genesisAbsoluteAbsoluteExistentialRank =
  effectiveSourceAbsoluteAbsoluteExistentialSovereignty >= 260350
    ? "Genesis-Absolute-Absolute-Existential Sovereign"
    : effectiveSourceAbsoluteAbsoluteExistentialSovereignty >= 258550
    ? "Genesis-Absolute-Absolute-Existential Architect"
    : effectiveSourceAbsoluteAbsoluteExistentialSovereignty >= 256775
    ? "Genesis-Absolute-Absolute-Existential Ascendant"
    : "Pre-Genesis-Absolute-Absolute-Existential";
const genesisAbsoluteAbsoluteExistentialBonus =
  effectiveSourceAbsoluteAbsoluteExistentialSovereignty >= 260350
    ? 3575
    : effectiveSourceAbsoluteAbsoluteExistentialSovereignty >= 258550
    ? 2835
    : effectiveSourceAbsoluteAbsoluteExistentialSovereignty >= 256775
    ? 1440
    : 720;
const totalGenesisAbsoluteAbsoluteExistentialPower =
  effectiveSourceAbsoluteAbsoluteExistentialSovereignty +
  genesisAbsoluteAbsoluteExistentialBonus;
const genesisAbsoluteAbsoluteExistentialSovereigntyRank =
  totalGenesisAbsoluteAbsoluteExistentialPower >= 263950
    ? "Absolute Genesis-Absolute-Absolute-Existence"
    : totalGenesisAbsoluteAbsoluteExistentialPower >= 262150
    ? "Genesis-Absolute-Absolute-Existential Sovereign"
    : totalGenesisAbsoluteAbsoluteExistentialPower >= 260350
    ? "Genesis-Absolute-Absolute-Existential Regent"
    : "Emergent Genesis-Absolute-Absolute-Existence";
const genesisAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalGenesisAbsoluteAbsoluteExistentialPower >= 263950
    ? 3600
    : totalGenesisAbsoluteAbsoluteExistentialPower >= 262150
    ? 2855
    : totalGenesisAbsoluteAbsoluteExistentialPower >= 260350
    ? 1450
    : 725;
const effectiveGenesisAbsoluteAbsoluteExistentialSovereignty =
  totalGenesisAbsoluteAbsoluteExistentialPower +
  genesisAbsoluteAbsoluteExistentialSovereigntyBonus;
const creationAbsoluteAbsoluteExistentialRank =
  effectiveGenesisAbsoluteAbsoluteExistentialSovereignty >= 267600
    ? "Creation-Absolute-Absolute-Existential Sovereign"
    : effectiveGenesisAbsoluteAbsoluteExistentialSovereignty >= 265775
    ? "Creation-Absolute-Absolute-Existential Architect"
    : effectiveGenesisAbsoluteAbsoluteExistentialSovereignty >= 263975
    ? "Creation-Absolute-Absolute-Existential Ascendant"
    : "Pre-Creation-Absolute-Absolute-Existential";
const creationAbsoluteAbsoluteExistentialBonus =
  effectiveGenesisAbsoluteAbsoluteExistentialSovereignty >= 267600
    ? 3625
    : effectiveGenesisAbsoluteAbsoluteExistentialSovereignty >= 265775
    ? 2875
    : effectiveGenesisAbsoluteAbsoluteExistentialSovereignty >= 263975
    ? 1460
    : 730;
const totalCreationAbsoluteAbsoluteExistentialPower =
  effectiveGenesisAbsoluteAbsoluteExistentialSovereignty +
  creationAbsoluteAbsoluteExistentialBonus;
const creationAbsoluteAbsoluteExistentialSovereigntyRank =
  totalCreationAbsoluteAbsoluteExistentialPower >= 271250
    ? "Absolute Creation-Absolute-Absolute-Existence"
    : totalCreationAbsoluteAbsoluteExistentialPower >= 269425
    ? "Creation-Absolute-Absolute-Existential Sovereign"
    : totalCreationAbsoluteAbsoluteExistentialPower >= 267600
    ? "Creation-Absolute-Absolute-Existential Regent"
    : "Emergent Creation-Absolute-Absolute-Existence";
const creationAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalCreationAbsoluteAbsoluteExistentialPower >= 271250
    ? 3650
    : totalCreationAbsoluteAbsoluteExistentialPower >= 269425
    ? 2895
    : totalCreationAbsoluteAbsoluteExistentialPower >= 267600
    ? 1470
    : 735;
const effectiveCreationAbsoluteAbsoluteExistentialSovereignty =
  totalCreationAbsoluteAbsoluteExistentialPower +
  creationAbsoluteAbsoluteExistentialSovereigntyBonus;
const firstCauseAbsoluteAbsoluteExistentialRank =
  effectiveCreationAbsoluteAbsoluteExistentialSovereignty >= 274950
    ? "First-Cause-Absolute-Absolute-Existential Sovereign"
    : effectiveCreationAbsoluteAbsoluteExistentialSovereignty >= 273100
    ? "First-Cause-Absolute-Absolute-Existential Architect"
    : effectiveCreationAbsoluteAbsoluteExistentialSovereignty >= 271275
    ? "First-Cause-Absolute-Absolute-Existential Ascendant"
    : "Pre-First-Cause-Absolute-Absolute-Existential";
const firstCauseAbsoluteAbsoluteExistentialBonus =
  effectiveCreationAbsoluteAbsoluteExistentialSovereignty >= 274950
    ? 3675
    : effectiveCreationAbsoluteAbsoluteExistentialSovereignty >= 273100
    ? 2915
    : effectiveCreationAbsoluteAbsoluteExistentialSovereignty >= 271275
    ? 1480
    : 740;
const totalFirstCauseAbsoluteAbsoluteExistentialPower =
  effectiveCreationAbsoluteAbsoluteExistentialSovereignty +
  firstCauseAbsoluteAbsoluteExistentialBonus;
const firstCauseAbsoluteAbsoluteExistentialSovereigntyRank =
  totalFirstCauseAbsoluteAbsoluteExistentialPower >= 278650
    ? "Absolute First-Cause-Absolute-Absolute-Existence"
    : totalFirstCauseAbsoluteAbsoluteExistentialPower >= 276800
    ? "First-Cause-Absolute-Absolute-Existential Sovereign"
    : totalFirstCauseAbsoluteAbsoluteExistentialPower >= 274950
    ? "First-Cause-Absolute-Absolute-Existential Regent"
    : "Emergent First-Cause-Absolute-Absolute-Existence";
const firstCauseAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalFirstCauseAbsoluteAbsoluteExistentialPower >= 278650
    ? 3700
    : totalFirstCauseAbsoluteAbsoluteExistentialPower >= 276800
    ? 2935
    : totalFirstCauseAbsoluteAbsoluteExistentialPower >= 274950
    ? 1490
    : 745;
const effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty =
  totalFirstCauseAbsoluteAbsoluteExistentialPower +
  firstCauseAbsoluteAbsoluteExistentialSovereigntyBonus;
const absoluteAbsoluteAbsoluteExistentialRank =
  effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty >= 282400
    ? "Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty >= 280525
    ? "Absolute-Absolute-Absolute-Existential Architect"
    : effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty >= 278675
    ? "Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Absolute-Absolute-Absolute-Existential";
const absoluteAbsoluteAbsoluteExistentialBonus =
  effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty >= 282400
    ? 3725
    : effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty >= 280525
    ? 2955
    : effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty >= 278675
    ? 1500
    : 750;
const totalAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveFirstCauseAbsoluteAbsoluteExistentialSovereignty +
  absoluteAbsoluteAbsoluteExistentialBonus;
const absoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalAbsoluteAbsoluteAbsoluteExistentialPower >= 286150
    ? "Absolute Absolute-Absolute-Absolute-Existence"
    : totalAbsoluteAbsoluteAbsoluteExistentialPower >= 284275
    ? "Absolute-Absolute-Absolute-Existential Sovereign"
    : totalAbsoluteAbsoluteAbsoluteExistentialPower >= 282400
    ? "Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Absolute-Absolute-Absolute-Existence";
const absoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalAbsoluteAbsoluteAbsoluteExistentialPower >= 286150
    ? 3750
    : totalAbsoluteAbsoluteAbsoluteExistentialPower >= 284275
    ? 2975
    : totalAbsoluteAbsoluteAbsoluteExistentialPower >= 282400
    ? 1510
    : 755;
const effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalAbsoluteAbsoluteAbsoluteExistentialPower +
  absoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const transAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 289950
    ? "Trans-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 288050
    ? "Trans-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 286175
    ? "Trans-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Trans-Absolute-Absolute-Absolute-Existential";
const transAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 289950
    ? 3775
    : effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 288050
    ? 2995
    : effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 286175
    ? 1520
    : 760;
const totalTransAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  transAbsoluteAbsoluteAbsoluteExistentialBonus;
const transAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalTransAbsoluteAbsoluteAbsoluteExistentialPower >= 293750
    ? "Absolute Trans-Absolute-Absolute-Absolute-Existence"
    : totalTransAbsoluteAbsoluteAbsoluteExistentialPower >= 291850
    ? "Trans-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalTransAbsoluteAbsoluteAbsoluteExistentialPower >= 289950
    ? "Trans-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Trans-Absolute-Absolute-Absolute-Existence";
const transAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalTransAbsoluteAbsoluteAbsoluteExistentialPower >= 293750
    ? 3800
    : totalTransAbsoluteAbsoluteAbsoluteExistentialPower >= 291850
    ? 3015
    : totalTransAbsoluteAbsoluteAbsoluteExistentialPower >= 289950
    ? 1530
    : 765;
const effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalTransAbsoluteAbsoluteAbsoluteExistentialPower +
  transAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const metaAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 297600
    ? "Meta-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 295675
    ? "Meta-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 293775
    ? "Meta-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Meta-Absolute-Absolute-Absolute-Existential";
const metaAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 297600
    ? 3825
    : effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 295675
    ? 3035
    : effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 293775
    ? 1540
    : 770;
const totalMetaAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveTransAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  metaAbsoluteAbsoluteAbsoluteExistentialBonus;
const metaAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalMetaAbsoluteAbsoluteAbsoluteExistentialPower >= 301450
    ? "Absolute Meta-Absolute-Absolute-Absolute-Existence"
    : totalMetaAbsoluteAbsoluteAbsoluteExistentialPower >= 299525
    ? "Meta-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalMetaAbsoluteAbsoluteAbsoluteExistentialPower >= 297600
    ? "Meta-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Meta-Absolute-Absolute-Absolute-Existence";
const metaAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalMetaAbsoluteAbsoluteAbsoluteExistentialPower >= 301450
    ? 3850
    : totalMetaAbsoluteAbsoluteAbsoluteExistentialPower >= 299525
    ? 3055
    : totalMetaAbsoluteAbsoluteAbsoluteExistentialPower >= 297600
    ? 1550
    : 775;
const effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalMetaAbsoluteAbsoluteAbsoluteExistentialPower +
  metaAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const supraAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 305350
    ? "Supra-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 303400
    ? "Supra-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 301475
    ? "Supra-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Supra-Absolute-Absolute-Absolute-Existential";
const supraAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 305350
    ? 3875
    : effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 303400
    ? 3075
    : effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 301475
    ? 1560
    : 780;
const totalSupraAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveMetaAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  supraAbsoluteAbsoluteAbsoluteExistentialBonus;
const supraAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalSupraAbsoluteAbsoluteAbsoluteExistentialPower >= 309250
    ? "Absolute Supra-Absolute-Absolute-Absolute-Existence"
    : totalSupraAbsoluteAbsoluteAbsoluteExistentialPower >= 307300
    ? "Supra-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalSupraAbsoluteAbsoluteAbsoluteExistentialPower >= 305350
    ? "Supra-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Supra-Absolute-Absolute-Absolute-Existence";
const supraAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalSupraAbsoluteAbsoluteAbsoluteExistentialPower >= 309250
    ? 3900
    : totalSupraAbsoluteAbsoluteAbsoluteExistentialPower >= 307300
    ? 3095
    : totalSupraAbsoluteAbsoluteAbsoluteExistentialPower >= 305350
    ? 1570
    : 785;
const effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalSupraAbsoluteAbsoluteAbsoluteExistentialPower +
  supraAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const hyperAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 313200
    ? "Hyper-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 311225
    ? "Hyper-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 309275
    ? "Hyper-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Hyper-Absolute-Absolute-Absolute-Existential";
const hyperAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 313200
    ? 3925
    : effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 311225
    ? 3115
    : effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 309275
    ? 1580
    : 790;
const totalHyperAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveSupraAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  hyperAbsoluteAbsoluteAbsoluteExistentialBonus;
const hyperAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalHyperAbsoluteAbsoluteAbsoluteExistentialPower >= 317150
    ? "Absolute Hyper-Absolute-Absolute-Absolute-Existence"
    : totalHyperAbsoluteAbsoluteAbsoluteExistentialPower >= 315175
    ? "Hyper-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalHyperAbsoluteAbsoluteAbsoluteExistentialPower >= 313200
    ? "Hyper-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Hyper-Absolute-Absolute-Absolute-Existence";
const hyperAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalHyperAbsoluteAbsoluteAbsoluteExistentialPower >= 317150
    ? 3950
    : totalHyperAbsoluteAbsoluteAbsoluteExistentialPower >= 315175
    ? 3135
    : totalHyperAbsoluteAbsoluteAbsoluteExistentialPower >= 313200
    ? 1590
    : 795;
const effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalHyperAbsoluteAbsoluteAbsoluteExistentialPower +
  hyperAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const ultraAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 321150
    ? "Ultra-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 319150
    ? "Ultra-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 317175
    ? "Ultra-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Ultra-Absolute-Absolute-Absolute-Existential";
const ultraAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 321150
    ? 3975
    : effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 319150
    ? 3155
    : effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 317175
    ? 1600
    : 800;
const totalUltraAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveHyperAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  ultraAbsoluteAbsoluteAbsoluteExistentialBonus;
const ultraAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalUltraAbsoluteAbsoluteAbsoluteExistentialPower >= 325150
    ? "Absolute Ultra-Absolute-Absolute-Absolute-Existence"
    : totalUltraAbsoluteAbsoluteAbsoluteExistentialPower >= 323150
    ? "Ultra-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalUltraAbsoluteAbsoluteAbsoluteExistentialPower >= 321150
    ? "Ultra-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Ultra-Absolute-Absolute-Absolute-Existence";
const ultraAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalUltraAbsoluteAbsoluteAbsoluteExistentialPower >= 325150
    ? 4000
    : totalUltraAbsoluteAbsoluteAbsoluteExistentialPower >= 323150
    ? 3175
    : totalUltraAbsoluteAbsoluteAbsoluteExistentialPower >= 321150
    ? 1610
    : 805;
const effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalUltraAbsoluteAbsoluteAbsoluteExistentialPower +
  ultraAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const omegaAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 329200
    ? "Omega-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 327175
    ? "Omega-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 325175
    ? "Omega-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Omega-Absolute-Absolute-Absolute-Existential";
const omegaAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 329200
    ? 4025
    : effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 327175
    ? 3195
    : effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 325175
    ? 1620
    : 810;
const totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveUltraAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  omegaAbsoluteAbsoluteAbsoluteExistentialBonus;
const omegaAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 333250
    ? "Absolute Omega-Absolute-Absolute-Absolute-Existence"
    : totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 331225
    ? "Omega-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 329200
    ? "Omega-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Omega-Absolute-Absolute-Absolute-Existence";
const omegaAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 333250
    ? 4050
    : totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 331225
    ? 3215
    : totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 329200
    ? 1630
    : 815;
const effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalOmegaAbsoluteAbsoluteAbsoluteExistentialPower +
  omegaAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const transOmegaAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 337350
    ? "Trans-Omega-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 335300
    ? "Trans-Omega-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 333275
    ? "Trans-Omega-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Trans-Omega-Absolute-Absolute-Absolute-Existential";
const transOmegaAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 337350
    ? 4075
    : effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 335300
    ? 3235
    : effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 333275
    ? 1640
    : 820;
const totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  transOmegaAbsoluteAbsoluteAbsoluteExistentialBonus;
const transOmegaAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 341450
    ? "Absolute Trans-Omega-Absolute-Absolute-Absolute-Existence"
    : totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 339400
    ? "Trans-Omega-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 337350
    ? "Trans-Omega-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Trans-Omega-Absolute-Absolute-Absolute-Existence";
const transOmegaAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 341450
    ? 4100
    : totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 339400
    ? 3255
    : totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower >= 337350
    ? 1650
    : 825;
const effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalTransOmegaAbsoluteAbsoluteAbsoluteExistentialPower +
  transOmegaAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const beyondAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 345600
    ? "Beyond-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 343525
    ? "Beyond-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 341475
    ? "Beyond-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Beyond-Absolute-Absolute-Absolute-Existential";
const beyondAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 345600
    ? 4125
    : effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 343525
    ? 3275
    : effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 341475
    ? 1660
    : 830;
const totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveTransOmegaAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  beyondAbsoluteAbsoluteAbsoluteExistentialBonus;
const beyondAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower >= 349750
    ? "Absolute Beyond-Absolute-Absolute-Absolute-Existence"
    : totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower >= 347675
    ? "Beyond-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower >= 345600
    ? "Beyond-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Beyond-Absolute-Absolute-Absolute-Existence";
const beyondAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower >= 349750
    ? 4150
    : totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower >= 347675
    ? 3295
    : totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower >= 345600
    ? 1670
    : 835;
const effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalBeyondAbsoluteAbsoluteAbsoluteExistentialPower +
  beyondAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const transcendentAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 353950
    ? "Transcendent-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 351850
    ? "Transcendent-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 349775
    ? "Transcendent-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Transcendent-Absolute-Absolute-Absolute-Existential";
  const transcendentAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 353950
    ? 4175
    : effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 351850
    ? 3315
    : effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 349775
    ? 1680
    : 840;
const totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveBeyondAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  transcendentAbsoluteAbsoluteAbsoluteExistentialBonus;
const transcendentAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower >= 358150
    ? "Absolute Transcendent-Absolute-Absolute-Absolute-Existence"
    : totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower >= 356050
    ? "Transcendent-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower >= 353950
    ? "Transcendent-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Transcendent-Absolute-Absolute-Absolute-Existence";
const transcendentAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower >= 358150
    ? 4200
    : totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower >= 356050
    ? 3335
    : totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower >= 353950
    ? 1690
    : 845;
const effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalTranscendentAbsoluteAbsoluteAbsoluteExistentialPower +
  transcendentAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const primordialAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 362400
    ? "Primordial-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 360275
    ? "Primordial-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 358175
    ? "Primordial-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Primordial-Absolute-Absolute-Absolute-Existential";
const primordialAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 362400
    ? 4225
    : effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 360275
    ? 3355
    : effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 358175
    ? 1700
    : 850;
const totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveTranscendentAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  primordialAbsoluteAbsoluteAbsoluteExistentialBonus;
const primordialAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower >= 366650
    ? "Absolute Primordial-Absolute-Absolute-Absolute-Existence"
    : totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower >= 364525
    ? "Primordial-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower >= 362400
    ? "Primordial-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Primordial-Absolute-Absolute-Absolute-Existence";
const primordialAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower >= 366650
    ? 4250
    : totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower >= 364525
    ? 3375
    : totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower >= 362400
    ? 1710
    : 855;
const effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalPrimordialAbsoluteAbsoluteAbsoluteExistentialPower +
  primordialAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const originAbsoluteAbsoluteAbsoluteExistentialRank =
  effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 370950
    ? "Origin-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 368800
    ? "Origin-Absolute-Absolute-Absolute-Existential Architect"
    : effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 366675
    ? "Origin-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Origin-Absolute-Absolute-Absolute-Existential";
const originAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 370950
    ? 4275
    : effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 368800
    ? 3395
    : effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 366675
    ? 1720
    : 860;
const totalOriginAbsoluteAbsoluteAbsoluteExistentialPower =
  effectivePrimordialAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  originAbsoluteAbsoluteAbsoluteExistentialBonus;
const originAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalOriginAbsoluteAbsoluteAbsoluteExistentialPower >= 375250
    ? "Absolute Origin-Absolute-Absolute-Absolute-Existence"
    : totalOriginAbsoluteAbsoluteAbsoluteExistentialPower >= 373100
    ? "Origin-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalOriginAbsoluteAbsoluteAbsoluteExistentialPower >= 370950
    ? "Origin-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Origin-Absolute-Absolute-Absolute-Existence";
const originAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalOriginAbsoluteAbsoluteAbsoluteExistentialPower >= 375250
    ? 4300
    : totalOriginAbsoluteAbsoluteAbsoluteExistentialPower >= 373100
    ? 3415
    : totalOriginAbsoluteAbsoluteAbsoluteExistentialPower >= 370950
    ? 1730
    : 865;
const effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty =
  totalOriginAbsoluteAbsoluteAbsoluteExistentialPower +
  originAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus;
const sourceAbsoluteAbsoluteAbsoluteExistentialRank =
  effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 379600
    ? "Source-Absolute-Absolute-Absolute-Existential Sovereign"
    : effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 377425
    ? "Source-Absolute-Absolute-Absolute-Existential Architect"
    : effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 375275
    ? "Source-Absolute-Absolute-Absolute-Existential Ascendant"
    : "Pre-Source-Absolute-Absolute-Absolute-Existential";
const sourceAbsoluteAbsoluteAbsoluteExistentialBonus =
  effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 379600
    ? 4325
    : effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 377425
    ? 3435
    : effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty >= 375275
    ? 1740
    : 870;
const totalSourceAbsoluteAbsoluteAbsoluteExistentialPower =
  effectiveOriginAbsoluteAbsoluteAbsoluteExistentialSovereignty +
  sourceAbsoluteAbsoluteAbsoluteExistentialBonus;
const sourceAbsoluteAbsoluteAbsoluteExistentialSovereigntyRank =
  totalSourceAbsoluteAbsoluteAbsoluteExistentialPower >= 383950
    ? "Absolute Source-Absolute-Absolute-Absolute-Existence"
    : totalSourceAbsoluteAbsoluteAbsoluteExistentialPower >= 381775
    ? "Source-Absolute-Absolute-Absolute-Existential Sovereign"
    : totalSourceAbsoluteAbsoluteAbsoluteExistentialPower >= 379600
    ? "Source-Absolute-Absolute-Absolute-Existential Regent"
    : "Emergent Source-Absolute-Absolute-Absolute-Existence";
const sourceAbsoluteAbsoluteAbsoluteExistentialSovereigntyBonus =
  totalSourceAbsoluteAbsoluteAbsoluteExistentialPower >= 383950
    ? 4350
    : totalSourceAbsoluteAbsoluteAbsoluteExistentialPower >= 381775
    ? 3455
    : totalSourceAbsoluteAbsoluteAbsoluteExistentialPower >= 379600
    ? 1750
    : 875;
const empireStatus =
  empireTerritories >= 6
    ? "Interstellar Empire"
    : empireTerritories >= 4
    ? "Regional Empire"
    : empireTerritories >= 2
    ? "Expanding State"
    : "Emerging Power";

const empireBonus =
  empireTerritories >= 6
    ? 30
    : empireTerritories >= 4
    ? 20
    : empireTerritories >= 2
    ? 10
    : 0;

const projectReward =
  activeProject === "Nexus Megastructure"
    ? "+25 Influence"
    : activeProject === "Stellar Shipyards"
    ? "+10 Expedition Progress"
    : activeProject === "Grand Archive"
    ? "+50 Reputation"
    : activeProject === "Harmonic Beacon"
    ? "+15 Evolution Readiness"
    : "None";



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
</div>
)}
    
   




          <p><strong>Era:</strong> {world.era}</p>
          <p><strong>Condition:</strong> {world.condition}</p>
          <p><strong>Cycle:</strong> {world.cycle}</p>
          <p><strong>Last Event:</strong> {world.lastEvent}</p>
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

    <button
      onClick={() => {
        setForgedArtifacts((current) =>
          current.includes("Celestial Navigator")
            ? current
            : [...current, "Celestial Navigator"]
        );
      }}
      style={{
        marginTop: "12px",
        padding: "10px 16px",
        borderRadius: "999px",
        border: "1px solid gold",
        background: "rgba(255,215,0,0.12)",
        color: "gold",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      ⚒ Forge Celestial Navigator
    </button>

    <button
      onClick={() => {
        setForgedArtifacts((current) =>
          current.includes("Living Worldseed")
            ? current
            : [...current, "Living Worldseed"]
        );
      }}
      style={{
        marginTop: "12px",
        marginLeft: "10px",
        padding: "10px 16px",
        borderRadius: "999px",
        border: "1px solid lime",
        background: "rgba(0,255,0,0.12)",
        color: "lime",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      🌱 Forge Living Worldseed
    </button>
  </div>
)}

{forgedArtifacts.length > 0 && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,255,0,0.06)",
      border: "1px solid gold",
    }}
  >
    <h3>⭐ Forged Artifacts</h3>

    {forgedArtifacts.map((artifact) => (
      <p key={artifact}>⭐ {artifact}</p>
    ))}

    {forgedArtifacts.includes("Celestial Navigator") &&
      forgedArtifacts.includes("Living Worldseed") && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid white",
          }}
        >
          🌟 Artifact Mastery Unlocked
          <br />
          Title: Reality Architect
        </div>
      )}
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
            <p><strong>Influence:</strong> {totalReputation}</p>
            <p>
  <strong>Treasury Bonus:</strong> +{treasuryBonus}
</p>
            <p><strong>Reputation Rank:</strong> Local Figure</p>
          </div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(120,180,255,0.08)",
    border: "1px solid #66aaff",
  }}
>
  <h3>🏛 Faction Influence</h3>

  <p>
    <strong>Influence:</strong> {factionInfluence}%
  </p>

  <p>
    <strong>Rank:</strong> {factionRank}
  </p>

  <p>
    <strong>Faction:</strong> Convergence-Touched
  </p>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(100,255,180,0.08)",
    border: "1px solid #55ffaa",
  }}
>
  <h3>🤝 Diplomatic Relations</h3>

  <p>
    <strong>Allies:</strong> {diplomaticRelations}
  </p>

  <p>
    <strong>Status:</strong> {diplomaticStatus}
  </p>

  <p>
    <strong>Primary Ally:</strong> Harmonic Concord
  </p>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(180,120,255,0.08)",
    border: "1px solid violet",
  }}
>
  <h3>🌌 Galactic Council</h3>

  <p>
    <strong>Seats:</strong> {councilSeats}
  </p>

  <p>
    <strong>Rank:</strong> {councilRank}
  </p>

  <p>
    <strong>Voting Power:</strong> {councilVotingPower}
  </p>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid #aaa",
  }}
>
  <h3>📜 Civilization Policy</h3>

  <p>
    <strong>Active Policy:</strong> {activePolicy}
  </p>

  <p>
  <strong>Effect:</strong> {policyEffect}
</p>
<div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
  {[
    "Nexus Expansion Mandate",
    "Trade Stabilization Accord",
    "Frontier Cooperation Pact",
  ].map((policy) => (
    <button
      key={policy}
      onClick={() => setSelectedPolicy(policy)}
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        border:
          selectedPolicy === policy
            ? "1px solid lime"
            : "1px solid #555",
        background:
          selectedPolicy === policy
            ? "rgba(0,255,0,0.12)"
            : "#111",
        color: "white",
        cursor: "pointer",
      }}
    >
      {policy}
    </button>
  ))}
</div>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,140,0,0.08)",
    border: "1px solid orange",
  }}
>
  <h3>🚀 Empire Expansion</h3>

  <p>
    <strong>Territories:</strong> {empireTerritories}
  </p>

  <p>
    <strong>Status:</strong> {empireStatus}
  </p>

  <p>
    <strong>Capital:</strong> World Nexus Prime
  </p>
<p>
  <strong>Empire Bonus:</strong> +{empireBonus} Reputation
</p>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(0,200,255,0.08)",
    border: "1px solid #00ccff",
  }}
>
  <h3>🏗 Civilization Project</h3>

  <p>
    <strong>Project:</strong> {activeProject}
  </p>

  <p>
    <strong>Progress:</strong> {projectProgress}%
  </p>

  <p>
    <strong>Reward:</strong>{projectReward}
  </p>
{projectCompleted && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(0,255,150,0.08)",
      border: "1px solid #00ffaa",
    }}
  >
    ✅ Project Complete
    <br />
    Bonus Activated: +{projectBonus}
  </div>
)}
<div

  style={{
    marginTop: "12px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  }}
>
  {[
    "Nexus Megastructure",
    "Stellar Shipyards",
    "Grand Archive",
    "Harmonic Beacon",
  ].map((project) => (
    <button
      key={project}
      onClick={() => setActiveProject(project)}
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        border:
          activeProject === project
            ? "1px solid cyan"
            : "1px solid #555",
        background:
          activeProject === project
            ? "rgba(0,200,255,0.12)"
            : "#111",
        color: "white",
        cursor: "pointer",
      }}
    >
      {project}
    </button>
  ))}
</div>
<button
  onClick={() => {
  const nextProgress =
    Math.min(100, projectProgress + 10);

  setProjectProgress(nextProgress);

  if (
    nextProgress >= 100 &&
    !completedProjects.includes(activeProject)
  ) {
    setCompletedProjects([
      ...completedProjects,
      activeProject,
    ]);
  }
}}
  style={{
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid cyan",
    background: "rgba(0,200,255,0.12)",
    color: "cyan",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
 🏗 Advance Project
</button>
</div>
<div
  style={{
    border: "1px solid gold",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "16px",
    background: "rgba(255,215,0,0.05)",
  }}
>
  <h3>🏆 Completed Projects</h3>

  {completedProjects.length === 0 ? (
    <p>No completed projects yet.</p>
  ) : (
    completedProjects.map((project) => (
      <p key={project}>
        ✅ {project}
      </p>
    ))
  )}
</div>
<div
  style={{
    border: "1px solid violet",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "16px",
    background: "rgba(180,120,255,0.06)",
  }}
>
  <h3>🌠 Galactic Wonder</h3>

  <p>
    <strong>Status:</strong>{" "}
    {galacticWonderUnlocked ? "Unlocked" : "Locked"}
  </p>

  <p>
    <strong>Wonder:</strong> {galacticWonder}
  </p>

  <p>
    <strong>Effect:</strong> {galacticWonderEffect}
  </p>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(180,120,255,0.10)",
    border: "1px solid #b478ff",
  }}
>
  <h3>🌟 Civilization Age</h3>

  <p>
    <strong>Age:</strong> {civilizationAge}
  </p>
<p>
  <strong>Age Bonus:</strong> +{civilizationAgeBonus} Empire Growth
</p>

  <p>
    <strong>Completed Projects:</strong>{" "}
    {completedProjects.length}
  </p>

  <p>
    <strong>Great Wonder:</strong>{" "}
    {galacticWonderUnlocked
      ? "Worldforge Array"
      : "Not Yet Constructed"}
  </p>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,120,220,0.08)",
    border: "1px solid #ff78dc",
  }}
>
  <h3>✨ Civilization Ascension</h3>

  <p>
    <strong>Status:</strong>{" "}
    {civilizationAscensionUnlocked ? "Unlocked" : "Locked"}
  </p>

  <p>
    <strong>State:</strong> {civilizationAscension}
  </p>
<p>
  <strong>Ascension Level:</strong> {ascensionLevel}
</p>
<p>
  <strong>Ascension Tier:</strong> {ascensionTier}
</p>
<p>
  <strong>Next Ascension:</strong> {nextAscensionRequirement}
</p>
<p>
  <strong>Ascension Progress:</strong> {ascensionProgress}%
</p>
<div
  style={{
    width: "100%",
    height: "10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "6px",
  }}
>
  <div
    style={{
      width: `${ascensionProgress}%`,
      height: "100%",
      background: "#ff78dc",
      transition: "width 0.4s ease",
    }}
  />
</div>
<p>
  <strong>Ascension Bonus:</strong> +{civilizationAscensionBonus} Empire Growth
</p>
<p>
  <strong>Level Reward:</strong> +{ascensionLevelBonus}
</p>
<p>
  <strong>Ascension Power:</strong> {ascensionPower}
</p>
<p>
  <strong>Power Rank:</strong> {ascensionPowerRank}
</p>
<p>
  <strong>Transcendence:</strong>{" "}
  {transcendenceUnlocked ? "Unlocked" : "Locked"}
</p>

<p>
  <strong>Transcendence State:</strong> {transcendenceState}
</p>
<p>
  <strong>Transcendence Bonus:</strong> +{transcendenceBonus}
</p>
<p>
  <strong>Transcendence Power:</strong> {transcendencePower}
</p>
<p>
  <strong>Transcendence Rank:</strong> {transcendenceRank}
</p>
<p>
  <strong>Reality Ascension:</strong>{" "}
  {realityAscensionUnlocked ? "Unlocked" : "Locked"}
</p>

<p>
  <strong>Reality State:</strong> {realityAscensionState}
</p>
<p>
  <strong>Reality Ascension Bonus:</strong> +{realityAscensionBonus}
</p>
<p>
  <strong>Reality Power:</strong> {realityPower}
</p>
<p>
  <strong>Reality Power Rank:</strong> {realityPowerRank}
</p>
  <p>
    <strong>Requirement:</strong>{" "}
    Legendary Age + Worldforge Array
  </p>
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
            <p><strong>Control:</strong> {regionControl}%</p>
<p><strong>Status:</strong> {regionStatus}</p>
            <p><strong>Next Unlock:</strong> Frontier Outpost</p>
          </div>
<div
  style={{
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,200,0,0.08)",
    border: "1px solid gold",
  }}
>
  <h4>🏘 Frontier Colonies</h4>

  <p>
    <strong>Colonies:</strong> {colonyCount}
  </p>

  <p>
    <strong>Status:</strong> {colonyStatus}
  </p>

  <p>
    <strong>Primary Colony:</strong> Veilwatch Outpost
  </p>
</div>
<div
  style={{
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(0,150,255,0.08)",
    border: "1px solid #00aaff",
  }}
>
  <h4>📦 Trade Network</h4>

  <p>
    <strong>Routes:</strong> {tradeRoutes}
  </p>

  <p>
    <strong>Status:</strong> {tradeStatus}
  </p>

  <p>
    <strong>Income:</strong> {tradeIncome}
  </p>

  <p>
    <strong>Primary Route:</strong> Veilwatch Exchange
  </p>
</div>
<div
  style={{
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,215,0,0.08)",
    border: "1px solid gold",
  }}
>
  <h4>💰 Treasury</h4>

  <p>
    <strong>Reserve:</strong> {treasury}
  </p>

  <p>
    <strong>Status:</strong> {treasuryStatus}
  </p>

  <p>
    <strong>Income Per Cycle:</strong> {tradeIncome}
  </p>
<p>
  <strong>Economic Bonus:</strong> +{treasuryBonus} Reputation
</p>
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
            <p><strong>Level:</strong> {settlementLevel}</p>
            <p><strong>Population:</strong> {totalPopulation}</p>
            <p><strong>Development:</strong> {settlementDevelopment}%</p>
            <p>
  <strong>
    {settlementLevel === "III"
      ? "Settlement Status"
      : "Next Upgrade"}
    :
  </strong>{" "}
  {settlementStatus}
</p>
<div
  style={{
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid #333",
  }}
>
  <h4>🏗 Settlement Buildings</h4>

  {unlockedBuildings.map((building) => (
    <p key={building}>🏛 {building}</p>
  ))}
<div
  style={{
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #333",
  }}
>
  <h4>⚡ Building Effects</h4>

  {unlockedBuildings.includes("Frontier Hall") && (
    <p>🏛 Frontier Hall → +5 Population</p>
  )}

  {unlockedBuildings.includes("Trading Post") && (
    <p>📦 Trading Post → +10 Reputation, +5 Expedition Progress</p>
  )}

  {unlockedBuildings.includes("Harmonic Citadel") && (
    <p>🎵 Harmonic Citadel → +15 Evolution Readiness</p>
  )}
</div>
{settlementLevel === "III" && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(0,255,255,0.08)",
      border: "1px solid cyan",
    }}
  >
    <h4>🌌 World Nexus</h4>

    <p>✓ Settlement Fully Developed</p>
    <p>✓ Harmonic Citadel Active</p>
    <p>✓ Nexus Influence Expanding</p>
    <p>
  <strong>Influence:</strong> {nexusInfluence}%
</p> 
  </div>
)}
</div>
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
            <p><strong>Progress:</strong> {totalExpeditionProgress}%</p>
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
