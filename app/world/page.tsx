"use client";

import { useEffect, useState } from "react";

type WorldState = {
  era: string;
  lastEvent: string;
  eventCount: number;
  condition: string;
  description: string;
  cycle: number;
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
      <p>World Cycle: {world.cycle}</p>      
 <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #333" }}>
  <h2>Active Mutation Rules</h2>

  {world.era === "Genesis Era" && (
    <p>Low mutation. Low anomaly spread. The Continuum is stable.</p>
  )}

  {world.era === "Era of Spiral Instability" && (
    <p>Medium evolution. High anomaly spread. The Spiral is unstable.</p>
  )}

  {world.era === "Age of Fractures" && (
    <p>Rapid mutation. Extreme anomaly spread. Forms fracture quickly.</p>
  )}

  {world.era === "The Silence Bloom" && (
    <p>Evolution nearly stops. Anomalies become quiet and rare.</p>
  )}

  {world.era === "Era of Convergence" && (
    <p>All Rootspeakers are pulled toward Living Confluence.</p>
  )}
</div>
    </main>
  );
}

