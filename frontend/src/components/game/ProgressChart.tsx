"use client";

import React, { useMemo } from "react";
import { GameState, getWeeklyWpm } from "@/lib/gameStore";

interface ProgressChartProps {
  state: GameState;
}

export function ProgressChart({ state }: ProgressChartProps) {
  const weekData = getWeeklyWpm(state);
  const maxWpm   = Math.max(...weekData.map((d) => d.wpm), 10);
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const recent = state.sessions.slice(0, 5);

  return (
    <div>
      {/* WPM chart */}
      <div style={{
        background: "#FAF9F3", border: "1.5px solid #E2DDD5",
        borderRadius: 16, padding: "18px 20px", marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A", marginBottom: 16 }}>
          📈 Reading speed — last 7 days
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
          {weekData.map((d, i) => {
            const h = d.wpm > 0 ? Math.max(8, Math.round((d.wpm / maxWpm) * 72)) : 4;
            const date = new Date(d.date + "T12:00:00");
            const label = dayLabels[date.getDay()];
            const isToday = d.date === new Date().toISOString().split("T")[0];
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {d.wpm > 0 && (
                  <span style={{ fontSize: 9, color: "#888780" }}>{d.wpm}</span>
                )}
                <div style={{ width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div style={{
                    width: "70%", height: h,
                    background: isToday
                      ? "linear-gradient(180deg, #1D9E75, #9FE1CB)"
                      : d.wpm > 0 ? "#9FE1CB" : "#E2DDD5",
                    borderRadius: "4px 4px 2px 2px",
                    transition: "height 0.4s ease",
                  }} />
                </div>
                <span style={{ fontSize: 9, color: isToday ? "#1D9E75" : "#888780", fontWeight: isToday ? 700 : 400 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Total words",   value: state.totalWordsRead.toLocaleString(), emoji: "📖" },
          { label: "Sessions",      value: state.totalSessions,                   emoji: "📅" },
          { label: "Minutes read",  value: state.totalMinutes,                    emoji: "⏱️" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#F1EFE8", borderRadius: 12, padding: "12px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2C2C2A" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#888780" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent sessions */}
      {recent.length > 0 && (
        <div style={{
          background: "#FAF9F3", border: "1.5px solid #E2DDD5",
          borderRadius: 16, padding: "16px 18px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A", marginBottom: 12 }}>
            🕐 Recent sessions
          </div>
          {recent.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 0",
              borderBottom: i < recent.length - 1 ? "1px solid #F1EFE8" : "none",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "#E1F5EE", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, flexShrink: 0,
              }}>
                📄
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#2C2C2A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.filename}
                </div>
                <div style={{ fontSize: 11, color: "#888780" }}>
                  {s.wordsRead.toLocaleString()} words · {s.avgWpm} wpm · {Math.floor(s.durationSeconds / 60)}m
                </div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#1D9E75",
                background: "#E1F5EE", borderRadius: 8, padding: "3px 8px",
                flexShrink: 0,
              }}>
                {s.completionPct}%
              </div>
            </div>
          ))}
        </div>
      )}

      {recent.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 16px", color: "#888780" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📚</div>
          <p style={{ fontSize: 14 }}>No sessions yet — start reading to see your progress!</p>
        </div>
      )}
    </div>
  );
}