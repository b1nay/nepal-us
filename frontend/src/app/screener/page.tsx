'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';

/* ─── Types ───────────────────────────────────────────── */
type Answer = string | number | string[];

/* ─── Screener Questions ─────────────────────────────── */
const screenerSteps = [
  {
    id: 'letter_reversal',
    category: 'Dyslexia',
    title: 'Letter Recognition',
    subtitle: 'Which letter is the correct lowercase "b"?',
    desc: 'Look carefully at each option. Choose the one that is the standard letter "b".',
    type: 'choice' as const,
    options: [
      { label: 'd', value: 'd', style: { transform: 'scaleX(-1)' } },
      { label: 'b', value: 'b', style: {} },
      { label: 'p', value: 'p', style: {} },
      { label: 'q', value: 'q', style: {} },
    ],
    correct: 'b',
    timed: false,
  },
  {
    id: 'symbol_naming',
    category: 'Processing Speed',
    title: 'Symbol Speed',
    subtitle: 'Name the shapes you see as fast as you can',
    desc: 'Count how many different shapes you can identify in 10 seconds. Press Start when ready.',
    type: 'timed_count' as const,
    symbols: ['●', '■', '▲', '★', '◆', '●', '■', '▲', '★', '◆', '▲', '●', '◆', '■', '★'],
    timed: true,
    duration: 10,
  },
  {
    id: 'cluttered_paragraph',
    category: 'Visual Stress',
    title: 'Dense Text Reading',
    subtitle: 'Read this paragraph and rate how you feel',
    desc: 'Read the text below. Afterwards, rate your visual comfort.',
    type: 'rating' as const,
    text: 'The fundamental principles of cognitive neuroscience demonstrate that individual differences in reading acquisition reflect variations in phonological awareness, rapid automatized naming, processing speed, and working memory capacity. Students exhibiting persistent decoding difficulties frequently present with overlapping profiles encompassing orthographic processing deficits alongside phonological loop constraints.',
    ratingQuestion: 'How visually comfortable was reading that?',
    ratingLabels: ['Very strained', 'Somewhat strained', 'Neutral', 'Comfortable', 'Very comfortable'],
    timed: false,
  },
  {
    id: 'attention_check',
    category: 'ADHD',
    title: 'Attention Tracking',
    subtitle: 'Read and count how many times your focus drifted',
    desc: 'Read the passage below. Tap the counter each time your mind wanders.',
    type: 'counter' as const,
    text: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar. This process takes place in the chloroplasts, specifically using chlorophyll, which gives plants their green colour. The light-dependent reactions occur in the thylakoid membranes while the Calvin cycle takes place in the stroma.',
    timed: false,
  },
  {
    id: 'number_recall',
    category: 'Dyscalculia',
    title: 'Number Sequence Memory',
    subtitle: 'Memorise this sequence, then type it back',
    desc: 'A 6-digit sequence will appear for 3 seconds. Type it back from memory.',
    type: 'memory' as const,
    sequence: '7 3 8 1 5 4',
    timed: true,
    duration: 3,
  },
  {
    id: 'sound_match',
    category: 'APD',
    title: 'Sound-to-Text',
    subtitle: 'Which written word matches this description?',
    desc: 'Read the phonetic description and identify the matching word.',
    type: 'choice' as const,
    prompt: 'A word that sounds like "fuh-NET-ik" and relates to sounds of language',
    options: [
      { label: 'Phonetic', value: 'phonetic', style: {} },
      { label: 'Phantom', value: 'phantom', style: {} },
      { label: 'Kinetic', value: 'kinetic', style: {} },
      { label: 'Forensic', value: 'forensic', style: {} },
    ],
    correct: 'phonetic',
    timed: false,
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Dyslexia':         { bg: 'var(--sage)',       text: 'var(--teal-active)',  border: 'var(--teal-soft)' },
  'Processing Speed': { bg: 'var(--lavender)',    text: 'var(--purple-deep)',  border: 'var(--purple-soft)' },
  'Visual Stress':    { bg: 'var(--amber-warm)',  text: '#B45309',             border: 'var(--amber-golden)' },
  'ADHD':             { bg: 'var(--crisis-bg)',   text: 'var(--crisis-text)',  border: '#F9A8C9' },
  'Dyscalculia':      { bg: 'var(--success-bg)',  text: 'var(--success-text)', border: '#A7D77A' },
  'APD':              { bg: 'var(--purple-soft)', text: 'var(--purple-deep)',  border: 'var(--purple-soft)' },
};

/* ─── Sub-components ─────────────────────────────────── */
function ChoiceQuestion({ step, onAnswer, answer }: { step: typeof screenerSteps[0], onAnswer: (v: string) => void, answer: Answer }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '440px' }}>
      {step.options!.map(opt => {
        const selected = answer === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              border: selected ? '3px solid var(--teal-active)' : '2px solid var(--gray-warm)',
              background: selected ? 'var(--sage)' : 'white',
              fontSize: '2.5rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: 'var(--heading)',
              boxShadow: selected ? '0 4px 16px rgba(29,158,117,0.2)' : 'none',
              ...(opt.style || {}),
            }}
            onMouseEnter={e => {
              if (!selected) (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal-soft)';
            }}
            onMouseLeave={e => {
              if (!selected) (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-warm)';
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function RatingQuestion({ step, onAnswer, answer }: { step: typeof screenerSteps[0], onAnswer: (v: number) => void, answer: Answer }) {
  return (
    <div style={{ width: '100%', maxWidth: '540px' }}>
      <div style={{
        background: 'var(--off-white)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        color: 'var(--body)',
        border: '1px solid var(--gray-warm)',
        fontFamily: 'var(--font-lexie), serif',
      }}>
        {step.text}
      </div>
      <p style={{ fontWeight: 600, color: 'var(--heading)', marginBottom: '1rem', fontSize: '0.95rem' }}>{step.ratingQuestion}</p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        {step.ratingLabels!.map((label, i) => {
          const val = i + 1;
          const selected = answer === val;
          return (
            <button
              key={i}
              onClick={() => onAnswer(val)}
              title={label}
              style={{
                flex: 1,
                padding: '0.75rem 0.25rem',
                borderRadius: '12px',
                border: selected ? '2px solid var(--teal-active)' : '2px solid var(--gray-warm)',
                background: selected ? 'var(--sage)' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.75rem',
                color: selected ? 'var(--teal-active)' : 'var(--body)',
                fontWeight: selected ? 700 : 400,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                {['😖', '😕', '😐', '🙂', '😊'][i]}
              </div>
              {val}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--body)', marginTop: '0.5rem', opacity: 0.7 }}>
        <span>{step.ratingLabels![0]}</span>
        <span>{step.ratingLabels![4]}</span>
      </div>
    </div>
  );
}

function CounterQuestion({ step, onAnswer, answer }: { step: typeof screenerSteps[0], onAnswer: (v: number) => void, answer: Answer }) {
  const count = typeof answer === 'number' ? answer : 0;
  return (
    <div style={{ width: '100%', maxWidth: '540px' }}>
      <div style={{
        background: 'var(--off-white)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        fontSize: '0.95rem',
        lineHeight: 1.75,
        color: 'var(--body)',
        border: '1px solid var(--gray-warm)',
      }}>
        {step.text}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--heading)' }}>Times my focus drifted:</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => onAnswer(Math.max(0, count - 1))}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '2px solid var(--gray-warm)', background: 'white',
              fontSize: '1.5rem', cursor: 'pointer', fontWeight: 700,
              color: 'var(--heading)', transition: 'all 0.2s',
            }}
          >−</button>
          <div style={{
            fontSize: '4rem', fontWeight: 800, color: 'var(--heading)',
            minWidth: '80px', textAlign: 'center', lineHeight: 1,
          }}>{count}</div>
          <button
            onClick={() => onAnswer(count + 1)}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '2px solid var(--teal-active)', background: 'var(--sage)',
              fontSize: '1.5rem', cursor: 'pointer', fontWeight: 700,
              color: 'var(--teal-active)', transition: 'all 0.2s',
            }}
          >+</button>
        </div>
      </div>
    </div>
  );
}

function MemoryQuestion({ step, onAnswer, answer }: { step: typeof screenerSteps[0], onAnswer: (v: string) => void, answer: Answer }) {
  const [phase, setPhase] = useState<'ready' | 'show' | 'input'>('ready');
  const [timeLeft, setTimeLeft] = useState(step.duration || 3);

  const start = useCallback(() => {
    setPhase('show');
    setTimeLeft(step.duration || 3);
  }, [step.duration]);

  useEffect(() => {
    if (phase === 'show') {
      if (timeLeft <= 0) { setPhase('input'); return; }
      const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, timeLeft]);

  return (
    <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
      {phase === 'ready' && (
        <button
          onClick={start}
          style={{
            padding: '1rem 2.5rem',
            background: 'var(--teal-active)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Clock size={18} /> Show me the sequence
        </button>
      )}

      {phase === 'show' && (
        <div>
          <div style={{
            fontSize: '3.5rem', fontWeight: 800, color: 'var(--heading)',
            letterSpacing: '0.25em', marginBottom: '1rem',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {step.sequence}
          </div>
          <div style={{ color: 'var(--body)', fontSize: '0.9rem' }}>
            Memorise it... <span style={{ fontWeight: 700, color: 'var(--crisis-text)' }}>{timeLeft}s</span>
          </div>
        </div>
      )}

      {phase === 'input' && (
        <div>
          <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--heading)' }}>Type the sequence you saw:</p>
          <input
            type="text"
            value={typeof answer === 'string' ? answer : ''}
            onChange={e => onAnswer(e.target.value)}
            placeholder="e.g. 7 3 8 1 5 4"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '2px solid var(--gray-warm)',
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.2em',
              outline: 'none',
              fontWeight: 700,
              color: 'var(--heading)',
              background: 'white',
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--teal-active)')}
            onBlur={e => (e.target.style.borderColor = 'var(--gray-warm)')}
          />
        </div>
      )}
    </div>
  );
}

function TimedSymbols({ step, onAnswer, answer }: { step: typeof screenerSteps[0], onAnswer: (v: number) => void, answer: Answer }) {
  const [phase, setPhase] = useState<'ready' | 'active' | 'done'>('ready');
  const [timeLeft, setTimeLeft] = useState(step.duration || 10);
  const [count, setCount] = useState(typeof answer === 'number' ? answer : 0);

  const start = useCallback(() => {
    setPhase('active');
    setTimeLeft(step.duration || 10);
    setCount(0);
  }, [step.duration]);

  useEffect(() => {
    if (phase === 'active') {
      if (timeLeft <= 0) { setPhase('done'); onAnswer(count); return; }
      const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, timeLeft, count, onAnswer]);

  return (
    <div style={{ width: '100%', maxWidth: '540px', textAlign: 'center' }}>
      {phase === 'ready' && (
        <button onClick={start} style={{
          padding: '1rem 2.5rem', background: 'var(--teal-active)', color: 'white',
          border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
        }}>
          Start Timer
        </button>
      )}

      {phase === 'active' && (
        <div>
          <div style={{
            fontSize: '0.9rem', fontWeight: 700, color: 'var(--crisis-text)',
            marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <Clock size={16} /> {timeLeft}s remaining
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            justifyContent: 'center', fontSize: '2rem',
            marginBottom: '1.5rem', lineHeight: 1,
          }}>
            {step.symbols!.map((s, i) => (
              <span key={i} style={{ cursor: 'default' }}>{s}</span>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--body)' }}>
            Count how many different shapes you can identify
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '1rem', color: 'var(--success-text)' }}>
            <CheckCircle size={20} /> Time&apos;s up! How many did you count?
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <button onClick={() => { setCount(p => Math.max(0, p - 1)); onAnswer(Math.max(0, count - 1)); }}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--gray-warm)', background: 'white', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 700 }}>−</button>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--heading)', minWidth: '80px' }}>{count}</div>
            <button onClick={() => { setCount(p => p + 1); onAnswer(count + 1); }}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--teal-active)', background: 'var(--sage)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 700, color: 'var(--teal-active)' }}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Screener Page ─────────────────────────────── */
export default function ScreenerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [transitioning, setTransitioning] = useState(false);

  const step = screenerSteps[currentStep];
  const progress = ((currentStep) / screenerSteps.length) * 100;
  const catColor = categoryColors[step.category] || categoryColors['Dyslexia'];
  const currentAnswer = answers[step.id];
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== '' && currentAnswer !== null;

  const handleAnswer = (value: Answer) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
  };

  const handleNext = () => {
    if (!hasAnswer) return;
    setTransitioning(true);
    setTimeout(() => {
      if (currentStep < screenerSteps.length - 1) {
        setCurrentStep(p => p + 1);
      } else {
        // Store answers and navigate to result
        localStorage.setItem('screener_answers', JSON.stringify(answers));
        router.push('/screener/result');
      }
      setTransitioning(false);
    }, 300);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'var(--off-white)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Progress bar */}
      <div style={{ height: '4px', background: 'var(--gray-warm)' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--teal-active), var(--purple-deep))',
          transition: 'width 0.5s ease',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* Step counter */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--gray-warm)',
        background: 'white',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {screenerSteps.map((s, i) => (
            <div key={i} style={{
              width: i <= currentStep ? '28px' : '8px',
              height: '8px',
              borderRadius: '9999px',
              background: i < currentStep
                ? 'var(--teal-active)'
                : i === currentStep
                  ? 'var(--purple-deep)'
                  : 'var(--gray-warm)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--body)', fontWeight: 500 }}>
          {currentStep + 1} of {screenerSteps.length}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: 'var(--warning-bg)',
        borderBottom: '1px solid var(--amber-golden)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8rem',
        color: 'var(--warning-text)',
      }}>
        <AlertCircle size={14} />
        <span><strong>Note:</strong> This is not a clinical diagnosis. It helps personalise your reading experience.</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}>
        <div
          style={{
            width: '100%',
            maxWidth: '640px',
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Category badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: catColor.bg,
            color: catColor.text,
            border: `1px solid ${catColor.border}`,
            borderRadius: '9999px',
            padding: '0.3rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            marginBottom: '1.5rem',
          }}>
            {step.category}
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--heading)' }}>
            {step.title}
          </h1>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--body)', marginBottom: '0.5rem' }}>
            {step.subtitle}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--body)', opacity: 0.75, marginBottom: '2.5rem', lineHeight: 1.65 }}>
            {step.desc}
          </p>

          {/* Question component */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            {step.type === 'choice' && (
              <ChoiceQuestion step={step} onAnswer={v => handleAnswer(v)} answer={currentAnswer} />
            )}
            {step.type === 'rating' && (
              <RatingQuestion step={step} onAnswer={v => handleAnswer(v)} answer={currentAnswer} />
            )}
            {step.type === 'counter' && (
              <CounterQuestion step={step} onAnswer={v => handleAnswer(v)} answer={currentAnswer} />
            )}
            {step.type === 'memory' && (
              <MemoryQuestion step={step} onAnswer={v => handleAnswer(v)} answer={currentAnswer} />
            )}
            {step.type === 'timed_count' && (
              <TimedSymbols step={step} onAnswer={v => handleAnswer(v)} answer={currentAnswer} />
            )}
          </div>

          {/* Next button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.9rem 2.25rem',
                background: hasAnswer ? 'var(--teal-active)' : 'var(--gray-warm)',
                color: hasAnswer ? 'white' : 'var(--body)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: hasAnswer ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                boxShadow: hasAnswer ? '0 4px 16px rgba(29,158,117,0.3)' : 'none',
              }}
            >
              {currentStep < screenerSteps.length - 1 ? 'Next' : 'See my profile'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
