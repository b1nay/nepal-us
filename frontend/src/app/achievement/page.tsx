"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/lib/GameProvider";
import { AchievementsWall } from "@/components/game/AchievementBadge";

export default function AchievementsPage() {
  const { state, lastResult } = useGame();
  const newIds = lastResult?.newAchievements.map((a:any) => a.id) ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#EDE8DC", fontFamily: "'Trebuchet MS', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "#FAF9F3", borderBottom: "1.5px solid #E2DDD5",
        padding: "14px 24px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/dashboard" style={{ textDecoration: "none", fontSize: 20, color: "#888780" }}>←</Link>
        <span style={{ fontSize: 26 }}>🐻</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#1D9E75" }}>Achievements</span>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px" }}>
        <AchievementsWall achievements={state.achievements} newIds={newIds} />
      </div>
    </div>
  );
}