"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/lib/GameProvider";
import { ProgressChart } from "../../components/game/ProgressChart";
import { SoftProfileCard } from "../../components/game/SoftProfileCard";

export default function ProgressPage() {
  const { state } = useGame();

  return (
    <div style={{ minHeight: "100vh", background: "#EDE8DC", fontFamily: "'Trebuchet MS', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "#FAF9F3", borderBottom: "1.5px solid #E2DDD5",
        padding: "14px 24px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/dashboard" style={{ textDecoration: "none", fontSize: 20, color: "#888780" }}>←</Link>
        <span style={{ fontSize: 26 }}>🐻</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#1D9E75" }}>My progress</span>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px" }}>
        <ProgressChart state={state} />
        <div style={{ height: 20 }} />
        <SoftProfileCard state={state} />
      </div>
    </div>
  );
}