import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Continuum Rootspeakers",
  description: "An evolving Continuum NFT universe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav
          style={{
            padding: "20px",
            background: "#111",
            borderBottom: "1px solid #222",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <a
  href="/mint"
  style={{
    color: "white",
    textDecoration: "none",
  }}
>
  Mint
</a>
          <a
   href="/gallery"
   style={{
    color: "white",
    textDecoration: "none",
  }}
>
  Gallery
</a>
          <a 
   href="/world"
   style={{
    color: "white",
    textDecoration: "none",
  }} 
>
  World
</a>
          <a 
   href="/timeline"
   style={{
    color: "white",
    textDecoration: "none",
  }}
>
  Timeline
</a>
          <a
   href="/archive"
   style={{
    color: "white",
    textDecoration: "none",
  }}
>
  Archive
</a>
          <a 
    href="/codex"
    style={{
     color: "white",
     textDecoration: "none",
  }}
>
  Codex
</a>
        </nav>

        {children}
      </body>
    </html>
  );
}
