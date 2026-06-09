"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [world, setWorld] = useState<any>(null);

  useEffect(() => {
    fetch("/world/state.json")
      .then((res) => res.json())
      .then(setWorld);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "60px", textAlign: "center" }}>
     <h1
  style={{
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    lineHeight: 1.1,
  }}
> Continuum Rootspeakers</h1>

      <p style={{ maxWidth: "700px", margin: "30px auto", fontSize: "1.2rem", opacity: 0.8 }}>
        A living NFT civilization shaped by eras, relics, anomalies, legendary entities, and autonomous world events.
      </p>

      {world && (
        <div style={{ marginTop: "40px", padding: "30px", border: "1px solid #222", borderRadius: "20px", maxWidth: "700px", marginInline: "auto", background: "#0a0a0a" }}>
          <h2>Current World State</h2>
          <p><strong>Era:</strong> {world.era}</p>
          <p><strong>Condition:</strong> {world.condition}</p>
          <p><strong>Events:</strong> {world.eventCount}</p>
          <p><strong>Cycle:</strong> {world.cycle}</p>
          <p><strong>Last Event:</strong> {world.lastEvent}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginTop: "40px" }}>
        <a href="/mint" style={{ color: "white", border: "1px solid #333", padding: "12px 20px", borderRadius: "999px", textDecoration: "none" }}>
  Enter Mint
</a>

<a href="/gallery" style={{ color: "white", border: "1px solid #333", padding: "12px 20px", borderRadius: "999px", textDecoration: "none" }}>
  View Gallery
</a>

<a href="/world" style={{ color: "white", border: "1px solid #333", padding: "12px 20px", borderRadius: "999px", textDecoration: "none" }}>
  World State
</a>

<a href="/codex" style={{ color: "white", border: "1px solid #333", padding: "12px 20px", borderRadius: "999px", textDecoration: "none" }}>
  Read Codex
</a>
<a
  href="/my-rootspeakers"
  style={{
    color: "white",
    border: "1px solid #333",
    padding: "12px 20px",
    borderRadius: "999px",
    textDecoration: "none",
  }}
>
  My Rootspeakers
</a>
      </div>
    </main>
  );
}
