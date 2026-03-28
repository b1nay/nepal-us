'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, Play, Pause, Square, Settings,
  ChevronLeft, ChevronRight, Volume2, VolumeX,
  Type, Eye, Focus, Palette, Zap, BarChart2,
  SkipBack, BookOpen, X, AlertTriangle
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────── */
interface PageData { page: number; content: string; }
interface WordTiming { wordIndex: number; paragraphIndex: number; timestamp: number; }
interface ParagraphStat { wpm: number; level: 'fast' | 'moderate' | 'slow'; }

interface ReaderConfig {
  font: 'lexie' | 'opendyslexic' | 'system';
  theme: 'sage' | 'lavender' | 'amber' | 'pale-blue' | 'dark';
  bdpq: boolean;
  focusMode: boolean;
  lineSpacing: number;
  fontSize: number;
  mode: 'karaoke' | 'rsvp';
}

const defaultConfig: ReaderConfig = {
  font: 'lexie',
  theme: 'sage',
  bdpq: false,
  focusMode: false,
  lineSpacing: 1.7,
  fontSize: 1,
  mode: 'karaoke',
};

const themes = {
  sage:       { bg: '#E1F5EE', text: '#2C2C2A', label: 'Sage Mint' },
  lavender:   { bg: '#EEEDFE', text: '#2C2C2A', label: 'Lavender' },
  amber:      { bg: '#FAEEDA', text: '#2C2C2A', label: 'Warm Amber' },
  'pale-blue':{ bg: '#E8F4FD', text: '#2C2C2A', label: 'Pale Blue' },
  dark:       { bg: '#1a1a1a', text: '#e5e7eb', label: 'Dark Mode' },
};

/* ─── Helpers ─────────────────────────────────────────── */
function applyBdpq(text: string): string {
  return text
    .replace(/\b(b)(?=[aeiou\s,.])/gi, (m, b) => b === 'b' ? `<span class="letter-b">${b}</span>` : `<span class="letter-b">${b}</span>`)
    .replace(/(?<![a-z])(b)(?=[a-z])/gi, m => `<span class="letter-b">${m}</span>`)
    .replace(/(?<![a-z])(d)(?=[a-z])/gi, m => `<span class="letter-d">${m}</span>`)
    .replace(/(?<![a-z])(p)(?=[a-z])/gi, m => `<span class="letter-p">${m}</span>`)
    .replace(/(?<![a-z])(q)(?=[a-z])/gi, m => `<span class="letter-q">${m}</span>`);
}

function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter(w => w.trim().length > 0);
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

/* ─── Upload Zone ─────────────────────────────────────── */
function UploadZone({ onUpload }: { onUpload: (pages: PageData[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) { setError('Please upload a PDF file.'); return; }
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('http://localhost:8000/process-pdf', { method: 'POST', body: form });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onUpload(data.data as PageData[]);
    } catch (e) {
      setError('Could not process PDF. Make sure the backend is running on port 8000.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [onUpload]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? 'var(--teal-active)' : 'var(--gray-warm)'}`,
        borderRadius: '20px',
        padding: '4rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? 'var(--sage)' : 'white',
        transition: 'all 0.3s ease',
        userSelect: 'none',
      }}
    >
      <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {loading ? (
        <div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '4px solid var(--sage)', borderTop: '4px solid var(--teal-active)',
            animation: 'spin 1s linear infinite', margin: '0 auto 1rem',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: 600, color: 'var(--teal-active)' }}>Processing PDF...</p>
        </div>
      ) : (
        <>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Upload size={28} color="var(--teal-active)" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.5rem' }}>
            Upload your PDF
          </h3>
          <p style={{ color: 'var(--body)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Drag & drop or click to browse
          </p>
          <span style={{
            background: 'var(--sage)', color: 'var(--teal-active)',
            padding: '0.4rem 1.25rem', borderRadius: '9999px',
            fontSize: '0.85rem', fontWeight: 600,
          }}>
            Select PDF
          </span>
          {error && (
            <div style={{
              background: 'var(--crisis-bg)', color: 'var(--crisis-text)',
              padding: '0.75rem 1rem', borderRadius: '10px', marginTop: '1.5rem',
              fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <AlertTriangle size={16} /> {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Settings Panel ─────────────────────────────────── */
function SettingsPanel({ config, onChange }: { config: ReaderConfig; onChange: (c: ReaderConfig) => void }) {
  const set = <K extends keyof ReaderConfig>(key: K, val: ReaderConfig[K]) =>
    onChange({ ...config, [key]: val });

  const Toggle = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--body)', fontWeight: 500 }}>{label}</span>
      <button
        onClick={onToggle}
        style={{
          width: '44px', height: '24px', borderRadius: '9999px',
          background: value ? 'var(--teal-active)' : 'var(--gray-warm)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: '2px',
          left: value ? '22px' : '2px',
          width: '20px', height: '20px',
          borderRadius: '50%', background: 'white',
          transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
      {/* Mode */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--body)', display: 'block', marginBottom: '0.75rem' }}>
          Reading Mode
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {(['karaoke', 'rsvp'] as const).map(m => (
            <button key={m} onClick={() => set('mode', m)} style={{
              padding: '0.75rem 0.5rem',
              borderRadius: '10px',
              border: `2px solid ${config.mode === m ? 'var(--teal-active)' : 'var(--gray-warm)'}`,
              background: config.mode === m ? 'var(--sage)' : 'white',
              color: config.mode === m ? 'var(--teal-active)' : 'var(--body)',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}>
              {m === 'karaoke' ? <Volume2 size={18} /> : <Zap size={18} />}
              {m === 'karaoke' ? 'Karaoke' : 'RSVP'}
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--body)', display: 'block', marginBottom: '0.75rem' }}>
          Font
        </label>
        {(['lexie', 'opendyslexic', 'system'] as const).map(f => (
          <button key={f} onClick={() => set('font', f)} style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '4px',
            border: `2px solid ${config.font === f ? 'var(--teal-active)' : 'transparent'}`,
            background: config.font === f ? 'var(--sage)' : 'transparent',
            color: config.font === f ? 'var(--teal-active)' : 'var(--body)',
            fontWeight: config.font === f ? 700 : 400,
            cursor: 'pointer', fontSize: '0.875rem',
            fontFamily: f === 'opendyslexic' ? 'var(--font-open)' : f === 'lexie' ? 'var(--font-lexie)' : 'system-ui',
          }}>
            {f === 'lexie' ? 'LexieReadable' : f === 'opendyslexic' ? 'OpenDyslexic' : 'System Default'}
          </button>
        ))}
      </div>

      {/* Theme */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--body)', display: 'block', marginBottom: '0.75rem' }}>
          Background Theme
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(Object.entries(themes) as [ReaderConfig['theme'], { bg: string; label: string }][]).map(([key, t]) => (
            <button key={key} onClick={() => set('theme', key)} title={t.label} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: t.bg, cursor: 'pointer',
              border: config.theme === key ? '3px solid var(--teal-active)' : '2px solid var(--gray-warm)',
              boxShadow: config.theme === key ? '0 0 0 2px white, 0 0 0 4px var(--teal-active)' : 'none',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--body)', display: 'block', marginBottom: '0.5rem' }}>
          Font Size: {Math.round(config.fontSize * 100)}%
        </label>
        <input type="range" min={0.8} max={1.6} step={0.05} value={config.fontSize}
          onChange={e => set('fontSize', parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--teal-active)' }} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--body)', display: 'block', marginBottom: '0.5rem' }}>
          Line Spacing: {config.lineSpacing.toFixed(1)}
        </label>
        <input type="range" min={1.4} max={3} step={0.1} value={config.lineSpacing}
          onChange={e => set('lineSpacing', parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--teal-active)' }} />
      </div>

      {/* Toggles */}
      <Toggle label="bdpq highlighting" value={config.bdpq} onToggle={() => set('bdpq', !config.bdpq)} />
      <Toggle label="Focus mode (ADHD)" value={config.focusMode} onToggle={() => set('focusMode', !config.focusMode)} />
    </div>
  );
}

/* ─── RSVP Warning Modal ─────────────────────────────── */
function RSVPWarningModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '2.5rem',
        maxWidth: '440px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          <AlertTriangle size={24} color="var(--warning-text)" />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem' }}>Photosensitivity Warning</h2>
        <p style={{ color: 'var(--body)', lineHeight: 1.65, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          RSVP mode flashes words rapidly on screen. This may not be suitable for people with photosensitive epilepsy or motion sensitivity. We start at a slow speed — but please proceed with caution.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '0.875rem', background: 'var(--teal-active)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
          }}>I understand, continue</button>
          <button onClick={onCancel} style={{
            padding: '0.875rem 1.25rem', border: '2px solid var(--gray-warm)',
            background: 'white', borderRadius: '10px',
            cursor: 'pointer', fontWeight: 600, color: 'var(--body)',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Heatmap ─────────────────────────────────────────── */
function ReadingHeatmap({ stats, paragraphs, onClose }: {
  stats: ParagraphStat[];
  paragraphs: string[];
  onClose: () => void;
}) {
  const colorMap = { fast: '#dcfce7', moderate: '#fef9c3', slow: '#fee2e2' };
  const textMap  = { fast: '#166534', moderate: '#854d0e', slow: '#991b1b' };
  const labelMap = { fast: '🟢 Fluent', moderate: '🟡 Moderate', slow: '🔴 Struggled' };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 100, overflowY: 'auto', padding: '2rem 1rem',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', maxWidth: '760px',
        margin: '0 auto', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          padding: '1.75rem 2rem',
          borderBottom: '1px solid var(--off-white)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart2 size={22} color="var(--teal-active)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Reading Heatmap</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--body)', padding: '4px',
          }}><X size={22} /></button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', borderBottom: '1px solid var(--off-white)', flexWrap: 'wrap' }}>
          {(['fast', 'moderate', 'slow'] as const).map(l => (
            <div key={l} style={{
              background: colorMap[l], color: textMap[l],
              padding: '0.3rem 0.8rem', borderRadius: '8px',
              fontSize: '0.8rem', fontWeight: 700,
            }}>{labelMap[l]}</div>
          ))}
        </div>

        <div style={{ padding: '2rem', maxHeight: '65vh', overflowY: 'auto' }}>
          {paragraphs.map((p, i) => {
            const stat = stats[i] || { wpm: 0, level: 'moderate' as const };
            return (
              <div key={i} style={{
                background: colorMap[stat.level],
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '0.75rem',
                borderLeft: `4px solid ${textMap[stat.level]}`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '0.75rem', right: '1rem',
                  background: 'rgba(255,255,255,0.8)',
                  padding: '0.2rem 0.6rem', borderRadius: '9999px',
                  fontSize: '0.75rem', fontWeight: 700, color: textMap[stat.level],
                }}>
                  {stat.wpm > 0 ? `~${stat.wpm} WPM` : 'No data'}
                </div>
                <p style={{
                  color: textMap[stat.level], fontSize: '0.9rem',
                  lineHeight: 1.65, paddingRight: '80px',
                }}>
                  {p.length > 200 ? p.slice(0, 200) + '…' : p}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Studio Page ─────────────────────────────────────── */
export default function StudioPage() {
  const [pages, setPages]                   = useState<PageData[]>([]);
  const [currentPage, setCurrentPage]       = useState(0);
  const [config, setConfig]                 = useState<ReaderConfig>(defaultConfig);
  const [settingsOpen, setSettingsOpen]     = useState(true);
  const [playing, setPlaying]               = useState(false);
  const [activeWordIdx, setActiveWordIdx]   = useState(-1);
  const [rsvpWordIdx, setRsvpWordIdx]       = useState(0);
  const [wpm, setWpm]                       = useState(150);
  const [sessionTime, setSessionTime]       = useState(0);
  const [wordTimings, setWordTimings]       = useState<WordTiming[]>([]);
  const [heatmapStats, setHeatmapStats]     = useState<ParagraphStat[]>([]);
  const [showHeatmap, setShowHeatmap]       = useState(false);
  const [showRSVPWarning, setShowRSVPWarning] = useState(false);
  const [pendingPlay, setPendingPlay]       = useState(false);
  const [muted, setMuted]                   = useState(false);

  const speechRef  = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef   = useRef<NodeJS.Timeout | null>(null);
  const rsvpRef    = useRef<NodeJS.Timeout | null>(null);
  const timingRef  = useRef<WordTiming[]>([]);

  // Load saved config from screener
  useEffect(() => {
    const saved = localStorage.getItem('reader_config');
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  // Session timer
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => setSessionTime(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const pageText = pages[currentPage]?.content || '';
  const paragraphs = pageText.split(/\n{2,}/).filter(p => p.trim().length > 20);
  const allWords   = pageText.split(/\s+/).filter(Boolean);

  /* Karaoke TTS */
  const startKaraoke = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(pageText);
    utt.rate  = wpm / 150;
    utt.lang  = 'en-US';

    let wordCount = 0;
    utt.onboundary = (e) => {
      if (e.name === 'word') {
        setActiveWordIdx(wordCount);
        const now = Date.now();
        // Estimate paragraph index
        let charsSoFar = 0;
        let paraIdx = 0;
        for (let i = 0; i < paragraphs.length; i++) {
          charsSoFar += paragraphs[i].length + 2;
          if (e.charIndex < charsSoFar) { paraIdx = i; break; }
        }
        timingRef.current.push({ wordIndex: wordCount, paragraphIndex: paraIdx, timestamp: now });
        wordCount++;
      }
    };
    utt.onend = () => { setPlaying(false); setActiveWordIdx(-1); setWordTimings(timingRef.current); };
    speechRef.current = utt;
    if (!muted) window.speechSynthesis.speak(utt);
    setPlaying(true);
  }, [pageText, wpm, muted, paragraphs]);

  /* RSVP */
  const startRSVP = useCallback(() => {
    if (rsvpRef.current) clearInterval(rsvpRef.current);
    const interval = Math.round(60000 / wpm);
    let idx = rsvpWordIdx;
    rsvpRef.current = setInterval(() => {
      if (idx >= allWords.length) {
        clearInterval(rsvpRef.current!);
        setPlaying(false);
        return;
      }
      setRsvpWordIdx(idx);
      idx++;
    }, interval);
    setPlaying(true);
  }, [wpm, rsvpWordIdx, allWords.length]);

  const stopPlayback = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (rsvpRef.current) clearInterval(rsvpRef.current);
    setPlaying(false);
    setActiveWordIdx(-1);
    setWordTimings(timingRef.current);
  }, []);

  const handlePlay = () => {
    if (playing) { stopPlayback(); return; }
    if (config.mode === 'rsvp' && !playing) {
      setShowRSVPWarning(true);
      setPendingPlay(true);
      return;
    }
    if (config.mode === 'karaoke') startKaraoke();
    else startRSVP();
  };

  // Generate heatmap stats
  const generateHeatmap = () => {
    const stats: ParagraphStat[] = paragraphs.map((para, pIdx) => {
      const timings = timingRef.current.filter(t => t.paragraphIndex === pIdx);
      if (timings.length < 2) return { wpm: 0, level: 'moderate' as const };
      const duration = (timings[timings.length - 1].timestamp - timings[0].timestamp) / 1000 / 60;
      const calcWpm = duration > 0 ? Math.round(timings.length / duration) : 0;
      const level = calcWpm > 130 ? 'fast' : calcWpm > 80 ? 'moderate' : 'slow';
      return { wpm: calcWpm, level };
    });
    setHeatmapStats(stats);
    setShowHeatmap(true);
  };

  const fontMap = {
    lexie: 'var(--font-lexie)',
    opendyslexic: 'var(--font-open)',
    system: 'system-ui',
  };
  const theme = themes[config.theme];

  /* Word renderer for karaoke */
  const renderKaraokeText = () => {
    let wordIdx = 0;
    return paragraphs.map((para, pIdx) => {
      const words = splitWords(para);
      const rendered = words.map(word => {
        const idx = wordIdx++;
        const isActive = idx === activeWordIdx;
        let display = word;
        if (config.bdpq) {
          // Simple character highlight
          display = word; // will use CSS class approach per-char
        }
        return (
          <span key={idx} data-word-idx={idx} className={`word-span${isActive ? ' active' : ''}`}>
            {config.bdpq ? renderBdpqWord(word) : word}{' '}
          </span>
        );
      });

      // Focus mode: dim non-active paragraphs
      const paraHasActive = config.focusMode
        ? words.some((_, i) => {
            const base = paragraphs.slice(0, pIdx).reduce((acc, p) => acc + splitWords(p).length, 0);
            return base + i === activeWordIdx;
          })
        : true;

      return (
        <p key={pIdx} style={{
          marginBottom: `${config.lineSpacing}rem`,
          lineHeight: config.lineSpacing,
          opacity: config.focusMode && !paraHasActive && activeWordIdx >= 0 ? 0.2 : 1,
          transition: 'opacity 0.3s',
        }}>
          {rendered}
        </p>
      );
    });
  };

  const renderBdpqWord = (word: string) => {
    return word.split('').map((char, i) => {
      const c = char.toLowerCase();
      const cls = c === 'b' ? 'letter-b' : c === 'd' ? 'letter-d' : c === 'p' ? 'letter-p' : c === 'q' ? 'letter-q' : '';
      return cls ? <span key={i} className={cls}>{char}</span> : char;
    });
  };

  /* ── Render ── */
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden', background: 'var(--off-white)' }}>

      {/* Settings Sidebar */}
      <div style={{
        width: settingsOpen ? '280px' : '0',
        minWidth: settingsOpen ? '280px' : '0',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        background: 'white',
        borderRight: '1px solid var(--gray-warm)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--off-white)',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: 700, fontSize: '0.95rem', color: 'var(--heading)',
        }}>
          <Settings size={18} color="var(--teal-active)" /> Settings
        </div>
        <SettingsPanel config={config} onChange={setConfig} />
      </div>

      {/* Main Reader */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{
          height: '60px', background: 'white',
          borderBottom: '1px solid var(--gray-warm)',
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '0 1.25rem',
        }}>
          <button onClick={() => setSettingsOpen(o => !o)} style={{
            padding: '8px', borderRadius: '8px', border: 'none',
            background: settingsOpen ? 'var(--sage)' : 'transparent',
            cursor: 'pointer', color: 'var(--teal-active)',
            transition: 'all 0.2s',
          }}>
            <Settings size={18} />
          </button>

          <div style={{ flex: 1 }} />

          {/* WPM Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--body)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {wpm} WPM
            </span>
            <input type="range" min={60} max={400} step={10} value={wpm}
              onChange={e => setWpm(parseInt(e.target.value))}
              style={{ width: '120px', accentColor: 'var(--teal-active)' }} />
          </div>

          {/* Controls */}
          <button onClick={() => { setRsvpWordIdx(0); setActiveWordIdx(-1); timingRef.current = []; }} style={{
            padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--gray-warm)',
            background: 'white', cursor: 'pointer', color: 'var(--body)',
          }}>
            <SkipBack size={16} />
          </button>

          <button onClick={handlePlay} style={{
            padding: '8px 20px', borderRadius: '10px',
            background: playing ? 'var(--crisis-bg)' : 'var(--teal-active)',
            border: 'none', cursor: 'pointer',
            color: playing ? 'var(--crisis-text)' : 'white',
            fontWeight: 700, fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: playing ? 'none' : '0 2px 12px rgba(29,158,117,0.35)',
          }}>
            {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>

          <button onClick={stopPlayback} style={{
            padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--gray-warm)',
            background: 'white', cursor: 'pointer', color: 'var(--body)',
          }}>
            <Square size={16} />
          </button>

          <button onClick={() => setMuted(m => !m)} style={{
            padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--gray-warm)',
            background: 'white', cursor: 'pointer', color: muted ? 'var(--crisis-text)' : 'var(--body)',
          }}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {wordTimings.length > 0 && (
            <button onClick={generateHeatmap} style={{
              padding: '6px 12px', borderRadius: '8px',
              border: '1px solid var(--teal-soft)',
              background: 'var(--sage)', cursor: 'pointer',
              color: 'var(--teal-active)', fontWeight: 600,
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <BarChart2 size={14} /> Heatmap
            </button>
          )}

          <div style={{
            background: 'var(--off-white)', padding: '4px 10px', borderRadius: '8px',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--body)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            ⏱ {formatTime(sessionTime)}
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {pages.length === 0 ? (
            /* Upload screen */
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', padding: '2rem',
            }}>
              <div style={{ maxWidth: '500px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '18px',
                    background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}>
                    <BookOpen size={32} color="var(--teal-active)" />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>NeuroRead Studio</h2>
                  <p style={{ color: 'var(--body)', fontSize: '0.95rem' }}>
                    Upload a PDF to begin your personalised reading session.
                  </p>
                </div>
                <UploadZone onUpload={setPages} />
              </div>
            </div>
          ) : config.mode === 'rsvp' ? (
            /* RSVP View */
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: theme.bg, padding: '2rem',
            }}>
              <div style={{
                width: '3px', height: '60px',
                background: 'var(--teal-active)', borderRadius: '2px',
                marginBottom: '1.5rem', opacity: 0.5,
              }} />
              <div style={{
                fontSize: `${config.fontSize * 3.5}rem`,
                fontWeight: 800,
                color: theme.text,
                fontFamily: fontMap[config.font],
                minWidth: '300px', textAlign: 'center',
                lineHeight: 1.2,
                minHeight: '1.3em',
              }}>
                {allWords[rsvpWordIdx] || ''}
              </div>
              <div style={{
                width: '3px', height: '60px',
                background: 'var(--teal-active)', borderRadius: '2px',
                marginTop: '1.5rem', opacity: 0.5,
              }} />
              <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--body)', opacity: 0.6 }}>
                {rsvpWordIdx + 1} / {allWords.length} words
              </div>
            </div>
          ) : (
            /* Karaoke View */
            <div style={{
              background: theme.bg,
              minHeight: '100%',
              padding: '3rem',
            }}>
              <div style={{
                maxWidth: '720px',
                margin: '0 auto',
                fontFamily: fontMap[config.font],
                fontSize: `${config.fontSize}rem`,
                color: theme.text,
                lineHeight: config.lineSpacing,
              }}>
                {renderKaraokeText()}
              </div>
            </div>
          )}
        </div>

        {/* Page navigation */}
        {pages.length > 1 && (
          <div style={{
            height: '48px', background: 'white',
            borderTop: '1px solid var(--gray-warm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
          }}>
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              style={{
                padding: '4px 12px', borderRadius: '8px',
                border: '1px solid var(--gray-warm)', background: 'white',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 0 ? 0.4 : 1, color: 'var(--body)',
                display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem',
              }}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--body)', fontWeight: 600 }}>
              Page {currentPage + 1} of {pages.length}
            </span>
            <button onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
              disabled={currentPage === pages.length - 1}
              style={{
                padding: '4px 12px', borderRadius: '8px',
                border: '1px solid var(--gray-warm)', background: 'white',
                cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === pages.length - 1 ? 0.4 : 1, color: 'var(--body)',
                display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem',
              }}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* RSVP Warning */}
      {showRSVPWarning && (
        <RSVPWarningModal
          onConfirm={() => {
            setShowRSVPWarning(false);
            if (pendingPlay) { startRSVP(); setPendingPlay(false); }
          }}
          onCancel={() => {
            setShowRSVPWarning(false);
            setPendingPlay(false);
            setConfig(c => ({ ...c, mode: 'karaoke' }));
          }}
        />
      )}

      {/* Heatmap modal */}
      {showHeatmap && (
        <ReadingHeatmap
          stats={heatmapStats}
          paragraphs={paragraphs}
          onClose={() => setShowHeatmap(false)}
        />
      )}
    </div>
  );
}
