"use client";

import React, {
  createContext, useContext, useState,
  useCallback, useEffect, useRef,
} from "react";
import {
  GameState, ReadingSession, SessionResult,
  loadState, saveState, submitSession,
} from "./gameStore";

interface GameContextValue {
  state: GameState;
  lastResult: SessionResult | null;
  clearResult: () => void;
  recordSession: (session: Omit<ReadingSession, "id" | "date">) => SessionResult;
  updateDailyGoal: (targetWords: number, targetMinutes: number) => void;
  resetState: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => loadState());
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  const recordSession = useCallback(
    (session: Omit<ReadingSession, "id" | "date">) => {
      const { next, result } = submitSession(state, session);
      setState(next);
      setLastResult(result);
      return result;
    },
    [state]
  );

  const clearResult = useCallback(() => setLastResult(null), []);

  const updateDailyGoal = useCallback(
    (targetWords: number, targetMinutes: number) => {
      setState((prev) => {
        const next = {
          ...prev,
          dailyGoal: { ...prev.dailyGoal, targetWords, targetMinutes },
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const resetState = useCallback(() => {
    localStorage.removeItem("oso_game_state");
    setState(loadState());
    setLastResult(null);
  }, []);

  return (
    <GameContext.Provider value={{ state, lastResult, clearResult, recordSession, updateDailyGoal, resetState }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}