import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAUTRACE — Maritime Domain Intelligence | Satellite Oil-Spill Detection & Vessel Attribution",
  description: "Advanced Maritime Intelligence platform utilizing Sentinel-1 SAR imagery, Copernicus met-ocean hindcasting, and explainable AI vessel attribution with end-to-end uncertainty propagation. Built for SIH 2026 PS-26143 by Team SAMARTH.",
  keywords: ["Oil Spill Detection", "Sentinel-1 SAR", "OpenDrift Hindcasting", "AIS Vessel Attribution", "Maritime Intelligence", "SIH 2026", "Team SAMARTH"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-marine-950 text-slate-200 antialiased selection:bg-radar-cyan selection:text-marine-950 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
