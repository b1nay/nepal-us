// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReadingSession {
  id: string;
  date: string;           // ISO date string "2026-03-29"
  filename: string;
  wordsRead: number;
  completionPct: number;  // 0–100
  avgWpm: number;
  slowdownCount: number;  // times user slowed down
  rereadCount: number;    // times user went back
  durationSeconds: number;
  profileSignals: ProfileSignal[];
}

export type ProfileSignal =
  | "bdpq_slowdown"      // slowed on b/d/p/q words → dyslexia indicator
  | "line_loss"          // re-read line starts → tracking difficulty
  | "instruction_drop"  // dropped off mid-instruction → ADHD indicator
  | "fast_low_completion" // fast WPM but didn't finish → comprehension gap
  | "uniform_slowness";  // consistent low WPM → general difficulty

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: "reading" | "streak" | "speed" | "explorer" | "milestone";
}

export interface DailyGoal {
  targetWords: number;
  targetMinutes: number;
  wordsToday: number;
  minutesToday: number;
  lastUpdated: string; // ISO date
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  longestStreak: number;
  totalWordsRead: number;
  totalSessions: number;
  totalMinutes: number;
  sessions: ReadingSession[];
  achievements: Achievement[];
  dailyGoal: DailyGoal;
  profileSignalCounts: Record<ProfileSignal, number>;
  adaptations: AdaptationLog[];
}

export interface AdaptationLog {
  date: string;
  signal: ProfileSignal;
  action: string;  // human-readable: "Enabled bdpq highlighting"
  emoji: string;
}

// ─── XP & Level ───────────────────────────────────────────────────────────────

export const XP_PER_LEVEL = 200;

export function xpForSession(session: Omit<ReadingSession, "id" | "date" | "filename">): number {
  const wordXp       = Math.floor(session.wordsRead / 10);
  const completionXp = Math.floor(session.completionPct / 100 * 50);
  const speedBonus   = session.avgWpm > 100 ? 10 : session.avgWpm > 60 ? 5 : 0;
  return wordXp + completionXp + speedBonus;
}

export function levelFromXp(xp: number): { level: number; currentXp: number; xpToNext: number } {
  const level     = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentXp = xp % XP_PER_LEVEL;
  const xpToNext  = XP_PER_LEVEL - currentXp;
  return { level, currentXp, xpToNext };
}

export function levelTitle(level: number): string {
  const titles = [
    "", "Cub", "Explorer", "Reader", "Bookworm", "Scholar",
    "Thinker", "Wizard", "Champion", "Sage", "Legend",
  ];
  return titles[Math.min(level, titles.length - 1)] ?? "Legend";
}

// ─── Achievement definitions ──────────────────────────────────────────────────

export const ACHIEVEMENT_DEFS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  // Reading milestones
  { id: "first_read",     title: "First page!",       description: "Complete your first reading session",    emoji: "📖", xpReward: 30,  category: "milestone" },
  { id: "words_100",      title: "Word hunter",        description: "Read 100 words total",                   emoji: "🔍", xpReward: 20,  category: "reading"   },
  { id: "words_1000",     title: "Word explorer",      description: "Read 1,000 words total",                 emoji: "🗺️", xpReward: 50,  category: "reading"   },
  { id: "words_5000",     title: "Word adventurer",    description: "Read 5,000 words total",                 emoji: "⚔️", xpReward: 100, category: "reading"   },
  { id: "words_10000",    title: "Word champion",      description: "Read 10,000 words total",                emoji: "🏆", xpReward: 200, category: "reading"   },
  { id: "full_chapter",   title: "Full chapter!",      description: "Complete a session with 100%",           emoji: "✅", xpReward: 40,  category: "reading"   },
  { id: "sessions_5",     title: "Getting started",    description: "Complete 5 reading sessions",            emoji: "🌱", xpReward: 30,  category: "milestone" },
  { id: "sessions_20",    title: "On a roll",          description: "Complete 20 reading sessions",           emoji: "🎯", xpReward: 80,  category: "milestone" },
  // Streaks
  { id: "streak_3",       title: "3 days strong!",     description: "Read 3 days in a row",                   emoji: "🔥", xpReward: 30,  category: "streak"    },
  { id: "streak_7",       title: "Week warrior",       description: "Read 7 days in a row",                   emoji: "🌟", xpReward: 70,  category: "streak"    },
  { id: "streak_14",      title: "Two week hero",      description: "Read 14 days in a row",                  emoji: "💫", xpReward: 120, category: "streak"    },
  { id: "streak_30",      title: "Monthly master",     description: "Read 30 days in a row",                  emoji: "👑", xpReward: 250, category: "streak"    },
  // Speed
  { id: "wpm_60",         title: "Finding my pace",    description: "Reach 60 WPM in a session",              emoji: "🚶", xpReward: 20,  category: "speed"     },
  { id: "wpm_100",        title: "Speedy reader",      description: "Reach 100 WPM in a session",             emoji: "🚴", xpReward: 40,  category: "speed"     },
  { id: "wpm_150",        title: "Speed reader",       description: "Reach 150 WPM in a session",             emoji: "🏎️", xpReward: 80,  category: "speed"     },
  { id: "wpm_improved",   title: "Getting faster!",    description: "Improve WPM by 20% over last session",   emoji: "📈", xpReward: 50,  category: "speed"     },
  // Explorer
  { id: "goal_met",       title: "Goal getter",        description: "Hit your daily reading goal",            emoji: "🎯", xpReward: 30,  category: "explorer"  },
  { id: "goal_5x",        title: "Goal crusher",       description: "Hit your daily goal 5 times",            emoji: "💪", xpReward: 60,  category: "explorer"  },
  { id: "night_reader",   title: "Night owl",          description: "Complete a session after 9pm",           emoji: "🦉", xpReward: 20,  category: "explorer"  },
  { id: "long_session",   title: "Deep diver",         description: "Read for 30+ minutes in one session",    emoji: "🐋", xpReward: 60,  category: "explorer"  },
];

// ─── Default state ─────────────────────────────────────────────────────────────

function defaultState(): GameState {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: "",
    longestStreak: 0,
    totalWordsRead: 0,
    totalSessions: 0,
    totalMinutes: 0,
    sessions: [],
    achievements: ACHIEVEMENT_DEFS.map((a) => ({ ...a, unlocked: false })),
    dailyGoal: {
      targetWords: 500,
      targetMinutes: 15,
      wordsToday: 0,
      minutesToday: 0,
      lastUpdated: "",
    },
    profileSignalCounts: {
      bdpq_slowdown: 0,
      line_loss: 0,
      instruction_drop: 0,
      fast_low_completion: 0,
      uniform_slowness: 0,
    },
    adaptations: [],
  };
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "oso_game_state";

export function loadState(): GameState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as GameState;
    // Merge new achievement defs that didn't exist in stored state
    const existingIds = new Set(parsed.achievements.map((a) => a.id));
    const newAchievements = ACHIEVEMENT_DEFS
      .filter((a) => !existingIds.has(a.id))
      .map((a) => ({ ...a, unlocked: false }));
    parsed.achievements = [...parsed.achievements, ...newAchievements];
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Session submission ────────────────────────────────────────────────────────

export interface SessionResult {
  xpEarned: number;
  newAchievements: Achievement[];
  levelUp: boolean;
  newLevel: number;
  streakUpdated: boolean;
  newStreak: number;
  adaptationLogs: AdaptationLog[];
}

export function submitSession(
  prev: GameState,
  session: Omit<ReadingSession, "id" | "date">
): { next: GameState; result: SessionResult } {
  const state    = structuredClone(prev);
  const today    = new Date().toISOString().split("T")[0];
  const now      = new Date();
  const hour     = now.getHours();

  const fullSession: ReadingSession = {
    ...session,
    id: crypto.randomUUID(),
    date: today,
  };

  // ── XP ───────────────────────────────────────────────────────────────────
  const earned   = xpForSession(session);
  const prevLevel = levelFromXp(state.xp).level;
  state.xp       += earned;
  const newLevelInfo = levelFromXp(state.xp);
  const levelUp  = newLevelInfo.level > prevLevel;
  state.level    = newLevelInfo.level;

  // ── Totals ────────────────────────────────────────────────────────────────
  state.totalWordsRead += session.wordsRead;
  state.totalSessions  += 1;
  state.totalMinutes   += Math.floor(session.durationSeconds / 60);
  state.sessions        = [fullSession, ...state.sessions].slice(0, 200);

  // ── Streak ────────────────────────────────────────────────────────────────
  const lastDate     = state.lastActiveDate;
  const yesterday    = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let streakUpdated  = false;

  if (lastDate !== today) {
    if (lastDate === yesterday) {
      state.streak += 1;
    } else if (lastDate !== today) {
      state.streak = 1;
    }
    streakUpdated       = true;
    state.lastActiveDate = today;
    state.longestStreak  = Math.max(state.longestStreak, state.streak);
  }

  // ── Daily goal ────────────────────────────────────────────────────────────
  if (state.dailyGoal.lastUpdated !== today) {
    state.dailyGoal.wordsToday   = 0;
    state.dailyGoal.minutesToday = 0;
    state.dailyGoal.lastUpdated  = today;
  }
  state.dailyGoal.wordsToday   += session.wordsRead;
  state.dailyGoal.minutesToday += Math.floor(session.durationSeconds / 60);

  // ── Profile signal tracking ───────────────────────────────────────────────
  const adaptationLogs: AdaptationLog[] = [];
  for (const signal of session.profileSignals) {
    state.profileSignalCounts[signal] = (state.profileSignalCounts[signal] ?? 0) + 1;
    const count = state.profileSignalCounts[signal];

    // Trigger adaptation after 3 occurrences of same signal
    if (count === 3) {
      const log = signalToAdaptation(signal);
      if (log) {
        adaptationLogs.push({ ...log, date: today });
        state.adaptations = [{ ...log, date: today }, ...state.adaptations].slice(0, 50);
      }
    }
  }

  // ── Achievement checks ────────────────────────────────────────────────────
  const newAchievements: Achievement[] = [];

  const unlock = (id: string) => {
    const ach = state.achievements.find((a) => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked    = true;
      ach.unlockedAt  = today;
      state.xp       += ach.xpReward;
      state.level     = levelFromXp(state.xp).level;
      newAchievements.push(ach);
    }
  };

  if (state.totalSessions === 1)              unlock("first_read");
  if (state.totalWordsRead >= 100)            unlock("words_100");
  if (state.totalWordsRead >= 1000)           unlock("words_1000");
  if (state.totalWordsRead >= 5000)           unlock("words_5000");
  if (state.totalWordsRead >= 10000)          unlock("words_10000");
  if (session.completionPct === 100)          unlock("full_chapter");
  if (state.totalSessions >= 5)              unlock("sessions_5");
  if (state.totalSessions >= 20)             unlock("sessions_20");
  if (state.streak >= 3)                     unlock("streak_3");
  if (state.streak >= 7)                     unlock("streak_7");
  if (state.streak >= 14)                    unlock("streak_14");
  if (state.streak >= 30)                    unlock("streak_30");
  if (session.avgWpm >= 60)                  unlock("wpm_60");
  if (session.avgWpm >= 100)                 unlock("wpm_100");
  if (session.avgWpm >= 150)                 unlock("wpm_150");
  if (hour >= 21)                            unlock("night_reader");
  if (session.durationSeconds >= 1800)       unlock("long_session");

  // WPM improvement check
  const prevSessions = state.sessions.slice(1, 4);
  if (prevSessions.length > 0) {
    const prevAvgWpm = prevSessions.reduce((s, s2) => s + s2.avgWpm, 0) / prevSessions.length;
    if (session.avgWpm > prevAvgWpm * 1.2)   unlock("wpm_improved");
  }

  // Daily goal checks
  const goalMet = state.dailyGoal.wordsToday >= state.dailyGoal.targetWords
    || state.dailyGoal.minutesToday >= state.dailyGoal.targetMinutes;
  if (goalMet) {
    unlock("goal_met");
    const goalMetCount = state.sessions.filter((s) => {
      // approximate: sessions that were goal-completing
      return s.wordsRead >= state.dailyGoal.targetWords;
    }).length;
    if (goalMetCount >= 5) unlock("goal_5x");
  }

  saveState(state);

  return {
    next: state,
    result: {
      xpEarned: earned,
      newAchievements,
      levelUp,
      newLevel: state.level,
      streakUpdated,
      newStreak: state.streak,
      adaptationLogs,
    },
  };
}

// ─── Signal → adaptation mapping ─────────────────────────────────────────────

function signalToAdaptation(signal: ProfileSignal): Omit<AdaptationLog, "date"> | null {
  const map: Record<ProfileSignal, Omit<AdaptationLog, "date">> = {
    bdpq_slowdown:        { signal, action: "Enabled bdpq letter highlighting to reduce confusion", emoji: "🔤" },
    line_loss:            { signal, action: "Switched to focus mode — one line visible at a time",  emoji: "👁️" },
    instruction_drop:     { signal, action: "Reduced default reading speed for clearer pacing",      emoji: "🐢" },
    fast_low_completion:  { signal, action: "Added comprehension checkpoints every 5 paragraphs",   emoji: "✅" },
    uniform_slowness:     { signal, action: "Increased line spacing and letter tracking for comfort", emoji: "📐" },
  };
  return map[signal] ?? null;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function getTodaySessions(state: GameState): ReadingSession[] {
  const today = new Date().toISOString().split("T")[0];
  return state.sessions.filter((s) => s.date === today);
}

export function getWeeklyWpm(state: GameState): { date: string; wpm: number }[] {
  const days: { date: string; wpm: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    const daySessions = state.sessions.filter((s) => s.date === d);
    const avgWpm = daySessions.length
      ? Math.round(daySessions.reduce((s, s2) => s + s2.avgWpm, 0) / daySessions.length)
      : 0;
    days.push({ date: d, wpm: avgWpm });
  }
  return days;
}

export function getStreakCalendar(state: GameState): { date: string; active: boolean }[] {
  const days: { date: string; active: boolean }[] = [];
  const activeDates = new Set(state.sessions.map((s) => s.date));
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    days.push({ date: d, active: activeDates.has(d) });
  }
  return days;
}