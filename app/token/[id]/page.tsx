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
  useEffect(() => {
    fetch(`/metadata/${id}`)
      .then((res) => res.json())
      .then(setToken);
fetch(`/token-history/${id}.json`)
  .then((res) => res.json())
  .then(setHistory); 
 }, [id]);

  if (!token) return <main>Loading...</main>;

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <h1>{token.name}</h1>

      <img
        src={token.image}
        alt={token.name}
        style={{ width: "100%", maxWidth: "500px", borderRadius: "20px" }}
      />

      <p style={{ maxWidth: "700px", marginTop: "30px" }}>
        {token.description}
      </p>

      <h2>Traits</h2>

      {token.attributes.map((attr, index) => (
        <p key={index}>
          <strong>{attr.trait_type}:</strong> {attr.value}
        </p>
      ))}
<h2 style={{ marginTop: "40px" }}>
  Evolution History
</h2>

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
