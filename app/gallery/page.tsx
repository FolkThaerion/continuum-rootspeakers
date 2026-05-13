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
              border: "1px solid #333",
              borderRadius: "20px",
              padding: "20px",
              background: "#111",
            }}
          >

            <img
              src={token.image}
              alt={token.name}
              style={{
                width: "100%",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            />

            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "10px",
              }}
            >
              {token.name}
            </h2>

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
