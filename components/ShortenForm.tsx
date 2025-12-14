"use client";

import { LinkResult } from "@/app/page";
import { useState } from "react";

export default function ShortenForm({
  onResult,
}: {
  onResult: (data: LinkResult) => void;
}) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          slug: slug || undefined,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        onResult(data.link);
        setUrl("");
        setSlug("");
        setPassword("");
        setExpiresAt("");
        setShowOptions(false);
      }
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
    width: "100%",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Main URL input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="https://your-very-long-url.com/goes/here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={inputStyle}
          className="flex-1 mono text-sm"
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "var(--accent-dim)" : "var(--accent)",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            fontFamily: "Syne, sans-serif",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "..." : "Shorten →"}
        </button>
      </div>

      {/* Toggle options */}
      <button
        type="button"
        onClick={() => setShowOptions((v) => !v)}
        style={{
          color: "var(--muted)",
          fontSize: "13px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {showOptions ? "− Hide options" : "+ Custom slug, password, expiry"}
      </button>

      {/* Options */}
      {showOptions && (
        <div className="space-y-3 pt-1">
          <input
            type="text"
            placeholder="Custom slug (e.g. my-link)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={inputStyle}
            className="mono text-sm"
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <input
            type="password"
            placeholder="Password protect (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            className="text-sm"
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <div>
            <label
              style={{
                color: "var(--muted)",
                fontSize: "12px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Expires at (optional)
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
              className="text-sm"
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p style={{ color: "#ff6b6b", fontSize: "13px" }}>⚠ {error}</p>}
    </form>
  );
}
