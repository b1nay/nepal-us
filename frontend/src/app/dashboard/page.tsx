"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/lib/GameProvider";
import { XPBar } from "../../components/game/XPBar";
import { StreakCard } from "../../components/game/StreakCard";
import { DailyGoalRing } from "@/components/game/DailyGoalring";
import { SessionFeedback } from "../../components/game/SessionFeedback";
import { levelFromXp, levelTitle } from "../../lib/gameStore";

export default function DashboardPage() {
  const { state, lastResult, clearResult, updateDailyGoal } = useGame();
  const { level } = levelFromXp(state.xp);
  const unlockedCount = state.achievements.filter((a:any) => a.unlocked).length;

  const navItems = [
    { href: "/studio",       emoji: "📖", label: "Reading studio", color: "#E1F5EE", border: "#9FE1CB",  text: "#04342C" },
    { href: "/progress",     emoji: "📈", label: "My progress",    color: "#EEEDFE", border: "#CECBF6",  text: "#26215C" },
    { href: "/achievements", emoji: "🏆", label: "Achievements",   color: "#FFF8ED", border: "#FAC775",  text: "#412402" },
    { href: "/profile",      emoji: "🧠", label: "Reading profile",color: "#EAF3DE", border: "#C0DD97",  text: "#173404" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#EDE8DC", fontFamily: "'Trebuchet MS', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "#FAF9F3", borderBottom: "1.5px solid #E2DDD5",
        padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>🐻</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#1D9E75", letterSpacing: -0.5 }}>oso</span>
        </div>
        <div style={{ fontSize: 13, color: "#888780" }}>
          Level {level} · {levelTitle(level)}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#2C2C2A", margin: "0 0 4px" }}>
            {state.totalSessions === 0 ? "Welcome to OSO! 🐻" : "Welcome back! 🌟"}
          </h1>
          <p style={{ fontSize: 14, color: "#888780", margin: 0 }}>
            {state.totalSessions === 0
              ? "Upload your first book to start your reading journey"
              : `You've read ${state.totalWordsRead.toLocaleString()} words total. Keep going!`}
          </p>
        </div>

        {/* XP Bar */}
        <div style={{
          background: "#FAF9F3", border: "1.5px solid #E2DDD5",
          borderRadius: 16, padding: "16px 18px", marginBottom: 14,
        }}>
          <XPBar xp={state.xp} animated />
        </div>

        {/* Streak + Goal */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <StreakCard state={state} />
          <DailyGoalRing goal={state.dailyGoal} onUpdateGoal={updateDailyGoal} />
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { emoji: "🏅", value: `${unlockedCount}/${state.achievements.length}`, label: "Badges" },
            { emoji: "📅", value: state.totalSessions,      label: "Sessions" },
            { emoji: "📖", value: state.totalWordsRead.toLocaleString(), label: "Words read" },
            { emoji: "⏱️", value: `${state.totalMinutes}m`,  label: "Time reading" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#FAF9F3", border: "1.5px solid #E2DDD5",
              borderRadius: 12, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>{s.emoji}</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#2C2C2A" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#888780" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: n.color, border: `1.5px solid ${n.border}`,
                borderRadius: 14, padding: "16px 14px",
                display: "flex", alignItems: "center", gap: 10,
                cursor: "pointer", transition: "transform 0.15s",
              }}>
                <span style={{ fontSize: 24 }}>{n.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: n.text }}>{n.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Post-session feedback modal */}
      {lastResult && (
        <SessionFeedback result={lastResult} totalXp={state.xp} onClose={clearResult} />
      )}
    </div>
  );
}