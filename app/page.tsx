"use client";

import { useState } from "react";
import ShortenForm from "@/components/ShortenForm";
import ResultCard from "@/components/ResultCard";
import StatsCard from "@/components/StatsCard";
import { LinkData } from "@/lib/links";

export interface LinkResult extends LinkData {
  shortUrl: string;
  hasPassword: boolean;
}

export default function Home() {
  const [result, setResult] = useState<LinkResult | null>(null);

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p
          className="mono text-xs tracking-widest mb-3"
          style={{ color: "var(--accent)" }}
        >
          URL SHORTENER
        </p>
        <h1 className="text-5xl font-extrabold leading-none tracking-tight mb-3">
          Make it
          <br />
          <span style={{ color: "var(--accent)" }}>short.</span>
        </h1>
        <p style={{ color: "var(--muted)" }} className="text-sm">
          Custom slugs · Click analytics · Expiration · Password protection
        </p>
      </div>

      {/* Shorten Form */}
      <ShortenForm onResult={setResult} />

      {/* Result */}
      {result && (
        <div className="mt-6">
          <ResultCard link={result} />
        </div>
      )}

      {/* Divider */}
      <div
        className="my-12 border-t"
        style={{ borderColor: "var(--border)" }}
      />

      {/* Stats Lookup */}
      <StatsCard />
    </main>
  );
}
