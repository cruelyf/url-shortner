"use client";

import { LinkData } from "@/lib/links";
import { useState } from "react";

interface ResultCardProps extends LinkData {
  shortUrl: string;
  hasPassword: boolean;
}

export default function ResultCard({ link }: { link: ResultCardProps }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(link.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--accent)",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <p
        style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "8px" }}
      >
        YOUR SHORT LINK
      </p>

      {/* Short URL + copy */}
      <div className="flex items-center gap-3 mb-4">
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-lg font-bold"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
            wordBreak: "break-all",
          }}
        >
          {link.shortUrl}
        </a>
        <button
          onClick={copy}
          style={{
            background: copied ? "var(--accent)" : "transparent",
            color: copied ? "#0a0a0a" : "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontFamily: "Syne, sans-serif",
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Meta info */}
      <div
        className="flex flex-wrap gap-4"
        style={{ fontSize: "12px", color: "var(--muted)" }}
      >
        <span>
          →{" "}
          <span style={{ color: "var(--text)" }} className="mono">
            {link.url.slice(0, 50)}
            {link.url.length > 50 ? "…" : ""}
          </span>
        </span>
        {link.expiresAt && (
          <span>⏱ Expires {new Date(link.expiresAt).toLocaleDateString()}</span>
        )}
        {link.hasPassword && <span>🔒 Password protected</span>}
      </div>
    </div>
  );
}
