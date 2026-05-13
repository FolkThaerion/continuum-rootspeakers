"use client";

import { useEffect, useState } from "react";

type WorldState = {
  era: string;
  lastEvent: string;
  eventCount: number;
  condition: string;
  description: string;
};

export default function WorldPage() {
  const [world, setWorld] = useState<WorldState | null>(null);

  useEffect(() => {
    fetch("/world/state.json")
      .then((res) => res.json())
      .then(setWorld);
  }, []);

  if (!world) return <main>Loading...</main>;

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <h1>Continuum World State</h1>
      <h2>{world.era}</h2>
      <p>{world.description}</p>
      <p>Condition: {world.condition}</p>
      <p>Last Event: {world.lastEvent}</p>
      <p>Total Events: {world.eventCount}</p>
    </main>
  );
}
