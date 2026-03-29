"use client";

/**
 * useReadingSession
 *
 * Drop this into your BookReader component.
 * Call startSession() when playback begins.
 * Call endSession(stats) when playback stops or the user navigates away.
 * The hook submits to the game store and triggers the SessionFeedback modal.
 *
 * Usage in BookReader:
 *
 *   const { startSession, endSession } = useReadingSession();
 *
 *   // When play starts:
 *   startSession();
 *
 *   // When play stops or page unmounts:
 *   endSession({
 *     filename:        pdfData.filename,
 *     wordsRead:       wordIdx,
 *     completionPct:   Math.round((wordIdx / allWords.length) * 100),
 *     avgWpm:          currentWpm,
 *     slowdownCount:   slowdownEvents,   // track how many times user moved slider down
 *     rereadCount:     rereadEvents,     // track how many times user went back a page
 *     durationSeconds: elapsedSeconds,
 *     profileSignals:  detectedSignals,  // see ProfileSignal type
 *   });
 */

import { useRef, useCallback } from "react";
import { useGame } from "./GameProvider";
import { ProfileSignal } from "./gameStore";

interface SessionStats {
  filename: string;
  wordsRead: number;
  completionPct: number;
  avgWpm: number;
  slowdownCount: number;
  rereadCount: number;
  durationSeconds: number;
  profileSignals: ProfileSignal[];
}

export function useReadingSession() {
  const { recordSession } = useGame();
  const startTimeRef = useRef<number | null>(null);

  const startSession = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const endSession = useCallback(
    (stats: SessionStats) => {
      if (!stats.wordsRead || stats.wordsRead < 5) return; // ignore trivial sessions

      const durationSeconds = stats.durationSeconds > 0
        ? stats.durationSeconds
        : startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : 60;

      // Auto-detect profile signals from stats
      const signals: ProfileSignal[] = [...stats.profileSignals];

      if (stats.slowdownCount >= 3) {
        signals.push("bdpq_slowdown");
      }
      if (stats.rereadCount >= 3) {
        signals.push("line_loss");
      }
      if (stats.avgWpm > 120 && stats.completionPct < 50) {
        signals.push("fast_low_completion");
      }
      if (stats.avgWpm < 50 && stats.completionPct < 80) {
        signals.push("uniform_slowness");
      }

      recordSession({
        filename: stats.filename,
        wordsRead: stats.wordsRead,
        completionPct: stats.completionPct,
        avgWpm: stats.avgWpm,
        slowdownCount: stats.slowdownCount,
        rereadCount: stats.rereadCount,
        durationSeconds,
        profileSignals: [...new Set(signals)], // deduplicate
      });

      startTimeRef.current = null;
    },
    [recordSession]
  );

  return { startSession, endSession };
}