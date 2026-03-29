"use client";

import React from "react";
import { GameState, getStreakCalendar } from "@/lib/gameStore";

interface StreakCardProps {
  state: GameState;
}

export function StreakCard({ state }: StreakCardProps) {
  const calendar = getStreakCalendar(state);
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  // Get day-of-week label for each calendar entry
  const entries = calendar.map((entry) => {
    const d = new Date(entry.date + "T12:00:00");
    return { ...entry, label: dayLabels[d.getDay()] };
  });

  const isOnFire = state.streak >= 3;

  return (
    <div style={{
      background: state.streak > 0 ? "linear-gradient(135deg, #FFF8ED, #FAEEDA)" : "#F1EFE8",
      border: `1.5px solid ${state.streak > 0 ? "#FAC775" : "#D3D1C7"}`,
      borderRadius: 16, padding: "18px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{isOnFire ? "🔥" : "🌱"}</span>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: state.streak > 0 ? "#854F0B" : "#888780", lineHeight: 1 }}>
            {state.streak}
          </div>
          <div style={{ fontSize: 12, color: "#888780", marginTop: 1 }}>
            {state.streak === 1 ? "day streak" : "day streak"}
          </div>
        </div>
        {state.longestStreak > 0 && (
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#888780" }}>best</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#854F0B" }}>{state.longestStreak} 🏅</div>
          </div>
        )}
      </div>

      {/* 7-day calendar dots */}
      <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
        {entries.map((entry, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: entry.active ? "#FAC775" : "#F1EFE8",
              border: entry.active ? "2px solid #854F0B" : "1.5px solid #D3D1C7",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>
              {entry.active ? "⭐" : ""}
            </div>
            <span style={{ fontSize: 10, color: "#888780", fontWeight: 600 }}>{entry.label}</span>
          </div>
        ))}
      </div>

      {state.streak === 0 && (
        <p style={{ fontSize: 12, color: "#888780", marginTop: 12, textAlign: "center" }}>
          Start reading today to begin your streak! 🌟
        </p>
      )}
    </div>
  );
}