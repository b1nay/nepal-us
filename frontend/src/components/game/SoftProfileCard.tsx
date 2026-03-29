"use client";

import React from "react";
import { GameState, ProfileSignal } from "@/lib/gameStore";

const SIGNAL_LABELS: Record<ProfileSignal, { label: string; emoji: string; color: string }> = {
  bdpq_slowdown:        { label: "Letter confusion (b/d/p/q)",       emoji: "🔤", color: "#EEEDFE" },
  line_loss:            { label: "Line tracking difficulty",          emoji: "👁️", color: "#E1F5EE" },
  instruction_drop:     { label: "Following complex instructions",    emoji: "📋", color: "#FFF8ED" },
  fast_low_completion:  { label: "Fast reading, low comprehension",   emoji: "⚡", color: "#FBEAF0" },
  uniform_slowness:     { label: "Consistent slow reading pace",      emoji: "🐢", color: "#EAF3DE" },
};

interface SoftProfileCardProps {
  state: GameState;
}

export function SoftProfileCard({ state }: SoftProfileCardProps) {
  const signals = state.profileSignalCounts;
  const adaptations = state.adaptations.slice(0, 6);
  const hasAnySignals = Object.values(signals).some((v) => v > 0);

  return (
    <div>
      {/* Reading profile signals */}
      <div style={{
        background: "#FAF9F3", border: "1.5px solid #E2DDD5",
        borderRadius: 16, padding: "16px 18px", marginBottom: 14,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A", marginBottom: 4 }}>
          🧠 Your reading profile
        </div>
        <p style={{ fontSize: 12, color: "#888780", marginBottom: 14, lineHeight: 1.5 }}>
          OSO tracks patterns as you read — not to label you, but to quietly adapt your experience.
        </p>

        {!hasAnySignals ? (
          <p style={{ fontSize: 13, color: "#888780", textAlign: "center", padding: "12px 0" }}>
            Complete a few sessions and OSO will start learning your reading style 🌱
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(Object.entries(signals) as [ProfileSignal, number][])
              .filter(([, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([signal, count]) => {
                const info = SIGNAL_LABELS[signal];
                const barW = Math.min(100, count * 10);
                return (
                  <div key={signal}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#2C2C2A" }}>
                        {info.emoji} {info.label}
                      </span>
                      <span style={{ fontSize: 11, color: "#888780" }}>{count}×</span>
                    </div>
                    <div style={{ height: 6, background: "#F1EFE8", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${barW}%`,
                        background: "#534AB7", borderRadius: 99,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}
      </div>

      {/* Adaptation log */}
      {adaptations.length > 0 && (
        <div style={{
          background: "#FAF9F3", border: "1.5px solid #E2DDD5",
          borderRadius: 16, padding: "16px 18px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A", marginBottom: 12 }}>
            ✨ What OSO adapted for you
          </div>
          {adaptations.map((log, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              padding: "8px 0",
              borderBottom: i < adaptations.length - 1 ? "1px solid #F1EFE8" : "none",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{log.emoji}</span>
              <div>
                <div style={{ fontSize: 12, color: "#2C2C2A", lineHeight: 1.4 }}>{log.action}</div>
                <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>{log.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}