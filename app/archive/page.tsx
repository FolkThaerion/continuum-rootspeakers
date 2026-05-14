"use client";

import { useEffect, useState } from "react";

type CycleArchive = {
  archivedCycle: number;
  archivedEra: string;
  archivedCondition: string;
  archivedEventCount: number;
  archivedAtEvent: string;
};

export default function ArchivePage() {
  const [cycles, setCycles] = useState<CycleArchive[]>([]);

  useEffect(() => {
    fetch("/archive/cycles.json")
      .then((res) => res.json())
      .then(setCycles);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <h1>Ancient Cycle Archive</h1>

      {cycles.length === 0 && (
        <p>No previous civilizations have been archived yet.</p>
      )}

      {cycles.map((cycle, index) => (
        <div key={index} style={{ border: "1px solid #333", padding: "20px", marginTop: "20px" }}>
          <h2>Cycle {cycle.archivedCycle}</h2>
          <p>Era: {cycle.archivedEra}</p>
          <p>Condition: {cycle.archivedCondition}</p>
          <p>Events Recorded: {cycle.archivedEventCount}</p>
          <p>Archived By: {cycle.archivedAtEvent}</p>
        </div>
      ))}
    </main>
  );
}
