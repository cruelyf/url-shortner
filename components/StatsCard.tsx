"use client";

import { LinkData } from "@/lib/links";
import { useState } from "react";

interface StatsCardProps extends LinkData {
  isExpired: boolean;
  hasPassword: boolean;
}

export default function StatsCard() {
  const [slug, setSlug] = useState("");
  const [stats, setStats] = useState<StatsCardProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStats(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/links/${slug}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "Not found");
      else setStats(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div>
      <p
        className="mono text-xs tracking-widest mb-4"
        style={{ color: "var(--accent)" }}
      >
        ANALYTICS LOOKUP
      </p>

      <form onSubmit={lookup} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter slug (e.g. goog)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          style={{ ...inputStyle, flex: 1 }}
          className="mono text-sm"
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "transparent",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "Syne, sans-serif",
          }}
        >
          {loading ? "..." : "Look up"}
        </button>
      </form>

      {error && <p style={{ color: "#ff6b6b", fontSize: "13px" }}>⚠ {error}</p>}

      {stats && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          {/* Click count — hero stat */}
          <div className="mb-4">
            <span
              className="font-extrabold"
              style={{
                fontSize: "48px",
                color: "var(--accent)",
                lineHeight: 1,
              }}
            >
              {stats.clicks}
            </span>
            <span
              style={{
                color: "var(--muted)",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              clicks
            </span>
          </div>

          <div
            className="space-y-2"
            style={{ fontSize: "13px", color: "var(--muted)" }}
          >
            <p>
              <span>Slug: </span>
              <span className="mono" style={{ color: "var(--text)" }}>
                {stats.slug}
              </span>
            </p>
            <p>
              <span>Destination: </span>
              <a
                href={stats.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{ color: "var(--accent)", wordBreak: "break-all" }}
              >
                {stats.url.slice(0, 60)}
                {stats.url.length > 60 ? "…" : ""}
              </a>
            </p>
            <p>Created: {new Date(stats.createdAt).toLocaleString()}</p>
            {stats.expiresAt && (
              <p
                style={{ color: stats.isExpired ? "#ff6b6b" : "var(--muted)" }}
              >
                {stats.isExpired ? "⚠ Expired" : "⏱ Expires"}:{" "}
                {new Date(stats.expiresAt).toLocaleString()}
              </p>
            )}
            {stats.hasPassword && <p>🔒 Password protected</p>}
          </div>
        </div>
      )}
    </div>
  );
}
