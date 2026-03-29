"use client";

import React, { useEffect, useRef, useState } from "react";
import { levelFromXp, levelTitle, XP_PER_LEVEL } from "@/lib/gameStore";

interface XPBarProps {
  xp: number;
  animated?: boolean;
}

export function XPBar({ xp, animated = true }: XPBarProps) {
  const { level, currentXp } = levelFromXp(xp);
  const pct = Math.round((currentXp / XP_PER_LEVEL) * 100);
  const title = levelTitle(level);

  const [displayPct, setDisplayPct] = useState(animated ? 0 : pct);

  useEffect(() => {
    if (!animated) { setDisplayPct(pct); return; }
    let start: number | null = null;
    const from = displayPct;
    const to = pct;
    const duration = 800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPct(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [pct]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Level badge */}
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, #1D9E75, #9FE1CB)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 2px 8px rgba(29,158,117,0.35)",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{level}</span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A" }}>{title}</span>
          <span style={{ fontSize: 11, color: "#888780" }}>{currentXp} / {XP_PER_LEVEL} XP</span>
        </div>
        {/* Track */}
        <div style={{ height: 10, background: "#E1F5EE", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${displayPct}%`,
            background: "linear-gradient(90deg, #1D9E75, #9FE1CB)",
            borderRadius: 99, transition: "none",
          }} />
        </div>
      </div>
    </div>
  );
}