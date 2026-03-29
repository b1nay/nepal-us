"use client";

import React, { useEffect, useState } from "react";
import { SessionResult, levelTitle, levelFromXp, XP_PER_LEVEL } from "@/lib/gameStore";

interface SessionFeedbackProps {
  result: SessionResult;
  totalXp: number;
  onClose: () => void;
}

const ENCOURAGEMENT = [
  "Amazing work! 🌟",
  "You're doing great! 🐻",
  "Keep it up! 💪",
  "Fantastic session! ✨",
  "You're getting stronger! 🌱",
  "Every page counts! 📖",
  "So proud of you! 🎉",
];

export function SessionFeedback({ result, totalXp, onClose }: SessionFeedbackProps) {
  const [visible, setVisible] = useState(false);
  const [xpAnim, setXpAnim] = useState(0);
  const message = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
  const { level, currentXp } = levelFromXp(totalXp);

  useEffect(() => {
    // Slide in
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Animate XP counter
    let frame: number;
    let start: number | null = null;
    const duration = 700;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setXpAnim(Math.round(result.xpEarned * eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [result.xpEarned]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    // Backdrop
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(44,44,42,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={handleClose}>
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAF9F3", borderRadius: 24, padding: "32px 28px",
          maxWidth: 380, width: "100%",
          boxShadow: "0 16px 64px rgba(0,0,0,0.2)",
          transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
          opacity: visible ? 1 : 0,
          transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}>
            {result.levelUp ? "🎊" : "⭐"}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2C2C2A", margin: 0 }}>
            {result.levelUp ? `Level ${result.newLevel}! ${levelTitle(result.newLevel)}` : message}
          </h2>
          {result.levelUp && (
            <p style={{ fontSize: 14, color: "#1D9E75", marginTop: 4 }}>You levelled up! 🎉</p>
          )}
        </div>

        {/* XP earned */}
        <div style={{
          background: "linear-gradient(135deg, #E1F5EE, #9FE1CB20)",
          border: "1.5px solid #9FE1CB",
          borderRadius: 14, padding: "14px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 14, color: "#04342C", fontWeight: 600 }}>XP earned</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#1D9E75" }}>+{xpAnim}</span>
        </div>

        {/* XP progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "#888780" }}>Level {level}</span>
            <span style={{ fontSize: 12, color: "#888780" }}>{currentXp} / {XP_PER_LEVEL} XP</span>
          </div>
          <div style={{ height: 10, background: "#E1F5EE", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.round((currentXp / XP_PER_LEVEL) * 100)}%`,
              background: "linear-gradient(90deg, #1D9E75, #9FE1CB)",
              borderRadius: 99, transition: "width 0.8s ease",
            }} />
          </div>
        </div>

        {/* Streak */}
        {result.streakUpdated && result.newStreak > 0 && (
          <div style={{
            background: "#FFF8ED", border: "1.5px solid #FAC775",
            borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
          }}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#854F0B" }}>
              {result.newStreak} day streak!
            </span>
          </div>
        )}

        {/* New badges */}
        {result.newAchievements.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A", marginBottom: 8 }}>
              🏅 New badges unlocked!
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.newAchievements.map((ach) => (
                <div key={ach.id} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#EAF3DE", border: "1.5px solid #C0DD97",
                  borderRadius: 10, padding: "6px 10px",
                }}>
                  <span style={{ fontSize: 18 }}>{ach.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#173404" }}>{ach.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adaptation logs */}
        {result.adaptationLogs.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2A", marginBottom: 8 }}>
              🧠 OSO noticed something
            </div>
            {result.adaptationLogs.map((log, i) => (
              <div key={i} style={{
                background: "#EEEDFE", border: "1px solid #CECBF6",
                borderRadius: 10, padding: "8px 12px",
                fontSize: 12, color: "#26215C", marginBottom: 6,
                display: "flex", gap: 8, alignItems: "flex-start",
              }}>
                <span>{log.emoji}</span>
                <span>{log.action}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <button onClick={handleClose} style={{
          width: "100%", padding: "13px", borderRadius: 12,
          background: "#1D9E75", color: "#fff", border: "none",
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          transition: "background 0.15s",
        }}>
          Keep reading! 📖
        </button>
      </div>
    </div>
  );
}