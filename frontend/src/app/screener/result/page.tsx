'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ArrowRight, BookOpen, RefreshCw } from 'lucide-react';

/* ─── Profile computation ─────────────────────────────── */
type ProfileKey = 'dyslexia' | 'adhd' | 'irlen' | 'apd' | 'dyscalculia';

interface ProfileResult {
  dominant: ProfileKey[];
  scores: Record<ProfileKey, number>;
  summary: string;
  strengths: string[];
  challenges: string[];
  config: ReaderConfig;
}

interface ReaderConfig {
  font: 'lexie' | 'opendyslexic' | 'system';
  theme: 'sage' | 'lavender' | 'amber' | 'pale-blue' | 'dark';
  bdpq: boolean;
  focusMode: boolean;
  lineSpacing: number;
  fontSize: number;
  mode: 'karaoke' | 'rsvp';
}

function computeProfile(answers: Record<string, unknown>): ProfileResult {
  const scores: Record<ProfileKey, number> = {
    dyslexia: 0,
    adhd: 0,
    irlen: 0,
    apd: 0,
    dyscalculia: 0,
  };

  // Letter reversal — wrong = dyslexia signal
  if (answers.letter_reversal && answers.letter_reversal !== 'b') scores.dyslexia += 2;

  // Symbol naming speed — low count = processing speed issue → dyslexia
  const symbols = typeof answers.symbol_naming === 'number' ? answers.symbol_naming : 5;
  if (symbols < 4) scores.dyslexia += 2;
  else if (symbols < 7) scores.dyslexia += 1;

  // Rating — visual stress
  const rating = typeof answers.cluttered_paragraph === 'number' ? answers.cluttered_paragraph : 3;
  if (rating <= 2) scores.irlen += 3;
  else if (rating === 3) scores.irlen += 1;

  // Attention counter — high = ADHD
  const drifts = typeof answers.attention_check === 'number' ? answers.attention_check : 0;
  if (drifts >= 4) scores.adhd += 3;
  else if (drifts >= 2) scores.adhd += 2;
  else if (drifts >= 1) scores.adhd += 1;

  // Number recall — wrong = dyscalculia signal
  const seqAnswer = typeof answers.number_recall === 'string' ? answers.number_recall : '';
  const normalised = seqAnswer.replace(/\s+/g, ' ').trim();
  if (normalised !== '7 3 8 1 5 4') scores.dyscalculia += 2;

  // Sound match — wrong = APD
  if (answers.sound_match && answers.sound_match !== 'phonetic') scores.apd += 2;

  const dominant: ProfileKey[] = (Object.entries(scores) as [ProfileKey, number][])
    .filter(([, v]) => v >= 2)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k);

  const config = buildConfig(dominant);
  const { summary, strengths, challenges } = buildNarrative(dominant, scores);

  return { dominant, scores, summary, strengths, challenges, config };
}

function buildConfig(dominant: ProfileKey[]): ReaderConfig {
  const config: ReaderConfig = {
    font: 'lexie',
    theme: 'sage',
    bdpq: false,
    focusMode: false,
    lineSpacing: 1.7,
    fontSize: 1,
    mode: 'karaoke',
  };

  if (dominant.includes('dyslexia')) {
    config.font = 'opendyslexic';
    config.bdpq = true;
    config.lineSpacing = 2;
  }
  if (dominant.includes('adhd')) {
    config.focusMode = true;
    config.mode = 'karaoke';
  }
  if (dominant.includes('irlen')) {
    config.theme = 'lavender';
    config.lineSpacing = Math.max(config.lineSpacing, 2);
  }
  if (dominant.includes('apd')) {
    config.mode = 'karaoke';
    config.fontSize = 1.15;
  }
  if (dominant.includes('dyscalculia')) {
    config.fontSize = Math.max(config.fontSize, 1.1);
  }

  return config;
}

function buildNarrative(dominant: ProfileKey[], scores: Record<ProfileKey, number>) {
  const labelMap: Record<ProfileKey, string> = {
    dyslexia: 'phonological processing',
    adhd: 'sustained attention',
    irlen: 'visual stress',
    apd: 'auditory processing',
    dyscalculia: 'number/symbol processing',
  };

  let summary = '';
  const challenges: string[] = [];
  const strengths: string[] = [];

  if (dominant.length === 0) {
    summary = 'Your reading profile shows no strong difficulty patterns. You may still benefit from personalised settings for comfort and speed.';
    strengths.push('Strong across all screener dimensions', 'Likely a fluent and adaptive reader');
  } else {
    const challenged = dominant.map(d => labelMap[d]);
    summary = `You show ${dominant.length > 1 ? 'patterns across' : 'a pattern in'} ${challenged.join(', ')}. Your reader has been auto-configured to reduce these friction points.`;
    dominant.forEach(d => {
      if (d === 'dyslexia') challenges.push('Letter reversal & word confusion', 'Line tracking difficulty');
      if (d === 'adhd') challenges.push('Sustained attention during reading', 'Focus anchoring');
      if (d === 'irlen') challenges.push('Visual stress from dense or bright text', 'Eye strain on white backgrounds');
      if (d === 'apd') challenges.push('Matching heard sounds to written words');
      if (d === 'dyscalculia') challenges.push('Number & symbol sequence recall');
    });
    const nonDominant = (Object.keys(scores) as ProfileKey[]).filter(k => !dominant.includes(k));
    nonDominant.slice(0, 2).forEach(d => strengths.push(`Relative strength in ${labelMap[d]}`));
    if (strengths.length === 0) strengths.push('Responsive to visual feedback', 'Likely benefits from pacing support');
  }

  return { summary, strengths, challenges };
}

const profileLabels: Record<ProfileKey, { label: string; color: string; bg: string; icon: string }> = {
  dyslexia:    { label: 'Dyslexia patterns detected',    color: 'var(--teal-active)',  bg: 'var(--sage)',       icon: '📝' },
  adhd:        { label: 'ADHD patterns detected',        color: 'var(--purple-deep)',  bg: 'var(--lavender)',   icon: '⚡' },
  irlen:       { label: 'Irlen Syndrome patterns',       color: '#B45309',             bg: 'var(--amber-warm)', icon: '👁️' },
  apd:         { label: 'APD patterns detected',         color: 'var(--crisis-text)',  bg: 'var(--crisis-bg)',  icon: '🔊' },
  dyscalculia: { label: 'Dyscalculia patterns detected', color: 'var(--success-text)', bg: 'var(--success-bg)', icon: '🔢' },
};

const configDescriptions: Record<string, string> = {
  'opendyslexic': 'OpenDyslexic font activated',
  'lexie': 'LexieReadable font activated',
  'system': 'System font',
  'sage': 'Sage mint background',
  'lavender': 'Lavender mist background',
  'amber': 'Warm amber background',
  'rsvp': 'RSVP mode (one word at a time)',
  'karaoke': 'Karaoke TTS with word highlight',
};

/* ─── Result Page ─────────────────────────────────────── */
export default function ScreenerResultPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('screener_answers');
    if (!raw) { router.push('/screener'); return; }
    try {
      const answers = JSON.parse(raw);
      const result = computeProfile(answers);
      setTimeout(() => {
        setProfile(result);
        setAnimating(false);
      }, 400);
    } catch {
      router.push('/screener');
    }
  }, [router]);

  const handleGoToStudio = () => {
    if (!profile) return;
    localStorage.setItem('reader_config', JSON.stringify(profile.config));
    router.push('/studio');
  };

  if (animating || !profile) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '1.5rem',
        background: 'var(--off-white)',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          border: '4px solid var(--sage)',
          borderTop: '4px solid var(--teal-active)',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--body)', fontWeight: 600 }}>Building your reading profile...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'var(--off-white)',
      padding: '3rem 1.5rem',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Disclaimer */}
        <div style={{
          background: 'var(--warning-bg)',
          border: '1px solid var(--amber-golden)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '2.5rem',
          fontSize: '0.85rem',
          color: 'var(--warning-text)',
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Important:</strong> This is not a clinical diagnosis. These results help personalise your reading experience only. Consult a qualified professional for formal assessment.
          </span>
        </div>

        {/* Profile Card */}
        <div className="animate-slide-up" style={{
          background: 'white',
          borderRadius: '24px',
          border: '1px solid var(--gray-warm)',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          marginBottom: '2rem',
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--heading)',
            padding: '2.5rem',
            color: 'white',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'var(--teal-active)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BookOpen size={24} color="white" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.08em' }}>YOUR READING PROFILE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
                  {profile.dominant.length === 0 ? 'Balanced Reader' : `${profile.dominant.length > 1 ? 'Mixed' : profileLabels[profile.dominant[0]]?.label.replace(' detected', '').replace(' patterns', '')} Profile`}
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, fontSize: '0.95rem' }}>
              {profile.summary}
            </p>
          </div>

          {/* Detected patterns */}
          {profile.dominant.length > 0 && (
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--off-white)' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--body)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                Patterns detected
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.dominant.map(key => {
                  const info = profileLabels[key];
                  return (
                    <div key={key} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: info.bg, color: info.color,
                      padding: '0.4rem 1rem', borderRadius: '9999px',
                      fontSize: '0.85rem', fontWeight: 700,
                    }}>
                      {info.icon} {info.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Challenges + Strengths */}
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderBottom: '1px solid var(--off-white)' }}>
            {profile.challenges.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--crisis-text)', marginBottom: '0.75rem' }}>
                  Areas of difficulty
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.challenges.map(c => (
                    <li key={c} style={{ fontSize: '0.875rem', color: 'var(--body)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--crisis-text)', marginTop: '2px' }}>●</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--success-text)', marginBottom: '0.75rem' }}>
                Relative strengths
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.strengths.map(s => (
                  <li key={s} style={{ fontSize: '0.875rem', color: 'var(--body)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <CheckCircle size={14} color="var(--success-text)" style={{ marginTop: '3px', flexShrink: 0 }} /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Auto-config */}
          <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--body)', marginBottom: '1rem' }}>
              Auto-configured reader settings
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                configDescriptions[profile.config.font],
                configDescriptions[profile.config.theme],
                configDescriptions[profile.config.mode],
                profile.config.bdpq && 'bdpq letter highlighting',
                profile.config.focusMode && 'Focus mode',
                profile.config.lineSpacing > 1.7 && 'Increased line spacing',
              ].filter(Boolean).map(item => (
                <span key={String(item)} style={{
                  background: 'var(--sage)',
                  color: 'var(--teal-active)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}>✓ {item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleGoToStudio}
            style={{
              flex: 1,
              padding: '1rem 2rem',
              background: 'var(--teal-active)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(29,158,117,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(29,158,117,0.45)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(29,158,117,0.35)';
            }}
          >
            Open Studio with my profile <ArrowRight size={20} />
          </button>
          <Link href="/screener" style={{
            padding: '1rem 1.5rem',
            border: '2px solid var(--gray-warm)',
            borderRadius: '12px',
            color: 'var(--body)',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal-soft)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-warm)'}
          >
            <RefreshCw size={16} /> Retake
          </Link>
        </div>
      </div>
    </div>
  );
}
