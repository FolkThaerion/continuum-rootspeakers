"use client";

import { useEffect, useState } from "react";

type Attribute = {
  trait_type: string;
  value: string | number;
};

type Metadata = {
  attributes: Attribute[];
};

export default function StatsPage() {
  const [tokens, setTokens] = useState<Metadata[]>([]);

  useEffect(() => {
    async function load() {
      const results: Metadata[] = [];

      for (let i = 0; i < 10; i++) {
        const res = await fetch(`/metadata/${i}`);
        const data = await res.json();
        results.push(data);
      }

      setTokens(results);
    }

    load();
  }, []);

  const hasTrait = (token: Metadata, trait: string) =>
    token.attributes.some((a) => a.trait_type === trait);

  const hasValue = (token: Metadata, trait: string, value: string) =>
    token.attributes.some((a) => a.trait_type === trait && a.value === value);

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <h1>Continuum Collection Stats</h1>

      <p>Total Rootspeakers: {tokens.length}</p>
      <p>Ancient Relics: {tokens.filter((t) => hasTrait(t, "Relic")).length}</p>
      <p>Legendary Entities: {tokens.filter((t) => hasTrait(t, "Legendary Name")).length}</p>
      <p>Singularities: {tokens.filter((t) => hasValue(t, "Anomaly", "Singularity")).length}</p>
      <p>Living Confluence: {tokens.filter((t) => hasValue(t, "Stage", "Living Confluence")).length}</p>
    </main>
  );
}
