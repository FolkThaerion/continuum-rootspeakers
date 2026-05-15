"use client";

import { useEffect, useState } from "react";

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

export default function GalleryPage() {

  const [tokens, setTokens] = useState<Metadata[]>([]);
  const [era, setEra] = useState("Genesis Era");
  useEffect(() => {

    async function load() {

      const results: Metadata[] = [];

      for (let i = 0; i < 10; i++) {

        try {

          const response = await fetch(`/metadata/${i}`);

          const data = await response.json();

          results.push(data);

        } catch (err) {

          console.error(err);
        }
      }

      setTokens(results);
      fetch("/world/state.json")
  .then((res) => res.json())
  .then((data) => {
    setEra(data.era);
  });
    }

    load();

  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px",
      }}
    >

      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Rootspeakers Gallery
      </h1>
      <div
  style={{
    marginBottom: "40px",
    padding: "20px",
    borderRadius: "20px",
    textAlign: "center",
    background:
      era === "Era of Convergence"
        ? "#0f2f2f"
        : era === "Age of Fractures"
        ? "#2f0f0f"
        : era === "The Silence Bloom"
        ? "#1a1a1a"
        : "#151515",
    border:
      era === "Era of Convergence"
        ? "1px solid cyan"
        : era === "Age of Fractures"
        ? "1px solid crimson"
        : "1px solid #333",
  }}
>
  <h2>{era}</h2>

  <p>
    The Continuum currently exists within this era.
  </p>
</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
        }}
      >

        {tokens.map((token, index) => (

          <div
            key={index}
            style={{
              border:
  era === "Age of Fractures"
    ? "1px solid crimson"
    : era === "Era of Convergence"
    ? "1px solid cyan"
    : "1px solid #333",
              borderRadius: "20px",
              padding: "20px",
              background:
  era === "Genesis Era"
    ? "#111"
    : era === "Era of Spiral Instability"
    ? "#1a0f1f"
    : era === "Age of Fractures"
    ? "#2a0f0f"
    : era === "The Silence Bloom"
    ? "#1a1a1a"
    : "#0f1f1a",
            }}
          >
          <a href={`/token/${index}`}>
            <img
  src={token.image}
  alt={token.name}
  style={{
    width: "100%",
    borderRadius: "12px",
    marginBottom: "20px",
    filter:
      era === "Era of Spiral Instability"
        ? "hue-rotate(45deg) saturate(1.8)"
        : era === "Age of Fractures"
        ? "contrast(1.4) saturate(0.7)"
        : era === "The Silence Bloom"
        ? "grayscale(1) brightness(0.7)"
        : era === "Era of Convergence"
        ? "brightness(1.6) saturate(2.5) hue-rotate(90deg)"
        : "none",
  }}
/>
</a>   

            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "10px",
              }}
            >
              {token.name}
            </h2>
            {token.attributes.some((attr) => attr.trait_type === "Relic") && (
  <div
    style={{
      marginBottom: "12px",
      padding: "8px 12px",
      border: "1px solid gold",
      borderRadius: "999px",
      color: "gold",
      display: "inline-block",
      fontSize: "0.9rem",
    }}
  >
    Ancient Relic
  </div>
)}
{token.attributes.some((attr) => attr.trait_type === "Legendary Name") && (
  <div
    style={{
      marginBottom: "12px",
      padding: "8px 12px",
      border: "1px solid violet",
      borderRadius: "999px",
      color: "violet",
      display: "inline-block",
      fontSize: "0.9rem",
    }}
  >
    Legendary Entity
  </div>
)} 
            <p
              style={{
                opacity: 0.8,
                marginBottom: "20px",
              }}
            >
              {token.description}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >

              {token.attributes.map((attr, i) => (

                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #222",
                    paddingBottom: "6px",
                  }}
                >
                  <span>{attr.trait_type}</span>
                  <strong>{attr.value}</strong>
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}
