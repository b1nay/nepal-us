"use client";

import React, { useEffect, useState } from "react";
import { DailyGoal } from "@/lib/gameStore";

interface DailyGoalRingProps {
  goal: DailyGoal;
  onUpdateGoal?: (words: number, minutes: number) => void;
}

export function DailyGoalRing({ goal, onUpdateGoal }: DailyGoalRingProps) {
  const wordsPct   = Math.min(100, Math.round((goal.wordsToday / goal.targetWords) * 100));
  const minutesPct = Math.min(100, Math.round((goal.minutesToday / goal.targetMinutes) * 100));
  const overallPct = Math.round((wordsPct + minutesPct) / 2);
  const met        = overallPct >= 100;

  // SVG ring
  const R    = 44;
  const CIRC = 2 * Math.PI * R;
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 900;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimPct(Math.round(overallPct * eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [overallPct]);

  const strokeDash = (CIRC * animPct) / 100;

  return (
    <div style={{
      background: met ? "linear-gradient(135deg, #EAF3DE, #C0DD97)" : "#F1EFE8",
      border: `1.5px solid ${met ? "#3B6D11" : "#D3D1C7"}`,
      borderRadius: 16, padding: "18px 20px",
      display: "flex", alignItems: "center", gap: 20,
    }}>
      {/* Ring */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={110} height={110} viewBox="0 0 110 110">
          {/* Track */}
          <circle cx={55} cy={55} r={R} fill="none"
            stroke={met ? "#C0DD97" : "#D3D1C7"} strokeWidth={10} />
          {/* Progress */}
          <circle cx={55} cy={55} r={R} fill="none"
            stroke={met ? "#3B6D11" : "#1D9E75"} strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${CIRC}`}
            strokeDashoffset={CIRC / 4}
            style={{ transition: "none" }}
          />
          {/* Centre text */}
          <text x={55} y={50} textAnchor="middle" fontSize={22} fontWeight={800}
            fill={met ? "#3B6D11" : "#2C2C2A"}>{animPct}%</text>
          <text x={55} y={66} textAnchor="middle" fontSize={11}
            fill={met ? "#3B6D11" : "#888780"}>{met ? "Done! 🎉" : "today"}</text>
        </svg>
      </div>

      {/* Stats */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2A", marginBottom: 10 }}>
          Daily goal
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 12, color: "#5F5E5A" }}>📖 Words</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2C2C2A" }}>
              {goal.wordsToday.toLocaleString()} / {goal.targetWords.toLocaleString()}
            </span>
          </div>
          <div style={{ height: 6, background: "#D3D1C7", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${wordsPct}%`, background: "#1D9E75", borderRadius: 99, transition: "width 0.6s ease" }} />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 12, color: "#5F5E5A" }}>⏱️ Minutes</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2C2C2A" }}>
              {goal.minutesToday} / {goal.targetMinutes}
            </span>
          </div>
          <div style={{ height: 6, background: "#D3D1C7", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${minutesPct}%`, background: "#534AB7", borderRadius: 99, transition: "width 0.6s ease" }} />
          </div>
        </div>

        {onUpdateGoal && (
          <button
            onClick={() => {
              const w = parseInt(prompt("Daily word goal:", String(goal.targetWords)) ?? "", 10);
              const m = parseInt(prompt("Daily minute goal:", String(goal.targetMinutes)) ?? "", 10);
              if (!isNaN(w) && !isNaN(m)) onUpdateGoal(w, m);
            }}
            style={{
              marginTop: 10, fontSize: 11, color: "#1D9E75", background: "none",
              border: "none", cursor: "pointer", padding: 0, textDecoration: "underline",
            }}
          >
            Edit goal
          </button>
        )}
      </div>
    </div>
  );
}