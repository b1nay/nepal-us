"use client";

import React, { useEffect, useRef, useState } from "react";
import { Achievement } from "../../lib/gameStore";

// ─── Single badge ─────────────────────────────────────────────────────────────

interface BadgeProps {
  achievement: Achievement;
  isNew?: boolean;
}

const CATEGORY_COLORS: Record<Achievement["category"], { bg: string; border: string; text: string }> = {
  reading:   { bg: "#E1F5EE", border: "#9FE1CB",  text: "#04342C" },
  streak:    { bg: "#FFF8ED", border: "#FAC775",   text: "#412402" },
  speed:     { bg: "#EEEDFE", border: "#CECBF6",   text: "#26215C" },
  explorer:  { bg: "#FBEAF0", border: "#F4C0D1",   text: "#4B1528" },
  milestone: { bg: "#EAF3DE", border: "#C0DD97",   text: "#173404" },
};

export function AchievementBadge({ achievement, isNew }: BadgeProps) {
  const [pop, setPop] = useState(isNew ?? false);
  const colors = CATEGORY_COLORS[achievement.category];

  useEffect(() => {
    if (isNew) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 600);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      padding: "14px 10px", borderRadius: 14,
      background: achievement.unlocked ? colors.bg : "#F1EFE8",
      border: `1.5px solid ${achievement.unlocked ? colors.border : "#D3D1C7"}`,
      opacity: achievement.unlocked ? 1 : 0.5,
      filter: achievement.unlocked ? "none" : "grayscale(1)",
      transform: pop ? "scale(1.08)" : "scale(1)",
      transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      cursor: "default",
      minWidth: 90,
    }}
      title={`${achievement.description}${achievement.unlockedAt ? `\nUnlocked: ${achievement.unlockedAt}` : ""}`}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{achievement.emoji}</span>
      <span style={{
        fontSize: 11, fontWeight: 700, color: achievement.unlocked ? colors.text : "#888780",
        textAlign: "center", lineHeight: 1.3,
      }}>
        {achievement.title}
      </span>
      {achievement.unlocked && (
        <span style={{
          fontSize: 10, background: colors.border, color: colors.text,
          borderRadius: 99, padding: "1px 7px", fontWeight: 600,
        }}>
          +{achievement.xpReward} XP
        </span>
      )}
      {!achievement.unlocked && (
        <span style={{ fontSize: 16 }}>🔒</span>
      )}
    </div>
  );
}

// ─── Wall ─────────────────────────────────────────────────────────────────────

interface WallProps {
  achievements: Achievement[];
  newIds?: string[];
}

const CATEGORIES: Achievement["category"][] = ["milestone", "reading", "streak", "speed", "explorer"];
const CATEGORY_LABELS: Record<Achievement["category"], string> = {
  milestone: "🏁 Milestones",
  reading:   "📖 Reading",
  streak:    "🔥 Streaks",
  speed:     "⚡ Speed",
  explorer:  "🗺️ Explorer",
};

export function AchievementsWall({ achievements, newIds = [] }: WallProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      {/* Summary */}
      <div style={{
        background: "linear-gradient(135deg, #E1F5EE, #EEEDFE)",
        borderRadius: 14, padding: "14px 18px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <span style={{ fontSize: 32 }}>🏆</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#2C2C2A" }}>
            {unlockedCount} / {achievements.length}
          </div>
          <div style={{ fontSize: 12, color: "#5F5E5A" }}>badges collected</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div style={{ height: 8, width: 120, background: "#D3D1C7", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.round((unlockedCount / achievements.length) * 100)}%`,
              background: "linear-gradient(90deg, #1D9E75, #534AB7)",
              borderRadius: 99,
            }} />
          </div>
          <div style={{ fontSize: 11, color: "#888780", marginTop: 3, textAlign: "right" }}>
            {Math.round((unlockedCount / achievements.length) * 100)}% complete
          </div>
        </div>
      </div>

      {/* By category */}
      {CATEGORIES.map((cat) => {
        const group = achievements.filter((a) => a.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A", marginBottom: 12 }}>
              {CATEGORY_LABELS[cat]}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {group.map((ach) => (
                <AchievementBadge key={ach.id} achievement={ach} isNew={newIds.includes(ach.id)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}