"use client";

import { useEffect, useState } from "react";

type EventItem = {
  event: string;
  era: string;
  description: string;
  eventNumber: number;
};

export default function TimelinePage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch("/world/history.json")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "40px" }}>
        Continuum Timeline
      </h1>

      {events.map((item, index) => (
        <div key={index} style={{ borderLeft: "2px solid white", paddingLeft: "20px", marginBottom: "30px" }}>
          <p style={{ opacity: 0.6 }}>Event #{item.eventNumber}</p>
          <h2>{item.event}</h2>
          <h3>{item.era}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </main>
  );
}
