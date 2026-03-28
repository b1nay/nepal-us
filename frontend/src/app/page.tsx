'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Brain, Zap, BookOpen, BarChart2, Upload, Headphones,
  ChevronRight, Star, Shield, CheckCircle, ArrowRight,
  Eye, Volume2, Focus, Palette, Type
} from 'lucide-react';

/* ─── Reusable helpers ────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Hero Section ────────────────────────────────────── */
function HeroSection() {
  return (
    <section style={{
      background: 'var(--sage)',
      minHeight: 'calc(100vh - 68px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5rem 2rem 4rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative blobs */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(159,225,203,0.4) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(206,203,246,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: '860px', textAlign: 'center' }}>
        {/* Badge */}
        <div className="animate-slide-down" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(29,158,117,0.12)',
          border: '1px solid rgba(29,158,117,0.3)',
          borderRadius: '9999px',
          padding: '0.4rem 1rem',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--teal-active)',
        }}>
          <Shield size={14} /> No diagnosis required
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up" style={{
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          color: 'var(--heading)',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
        }}>
          Reading that works for{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--teal-active), var(--purple-deep))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            your brain
          </span>
        </h1>

        {/* Sub */}
        <p className="animate-slide-up delay-200" style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: 'var(--body)',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '620px',
          margin: '0 auto 2.5rem',
        }}>
          Upload any textbook or open any webpage. NeuroRead adapts
          the experience to how you actually read — not how you&apos;re expected to.
        </p>

        {/* CTAs */}
        <div className="animate-slide-up delay-300" style={{
          display: 'flex', gap: '1rem', justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: '1.25rem',
        }}>
          <Link href="/screener" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '0.9rem 2rem',
            background: 'var(--heading)',
            color: 'white',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(44,44,42,0.25)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(44,44,42,0.35)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(44,44,42,0.25)';
          }}>
            Take the free screener <ChevronRight size={18} />
          </Link>
          <Link href="#how-it-works" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '0.9rem 2rem',
            background: 'rgba(255,255,255,0.7)',
            border: '2px solid rgba(44,44,42,0.15)',
            color: 'var(--heading)',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'white';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.7)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}>
            See how it works
          </Link>
        </div>

        <p className="animate-fade-in delay-500" style={{
          fontSize: '0.85rem', color: 'var(--body)', opacity: 0.75,
        }}>
          Free forever for individual use · No referral · No label
        </p>
      </div>

      {/* Social proof strip */}
      <div className="animate-slide-up delay-600" style={{
        position: 'absolute', bottom: '0', left: '0', right: '0',
        borderTop: '1px solid rgba(159,225,203,0.5)',
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(8px)',
        padding: '1rem 2rem',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: '2rem',
        }}>
          {[
            '• Supports dyslexia, ADHD, Irlen syndrome & more',
            '• Works on any PDF or webpage',
            '• Backed by reading science',
            '• Used in 120+ schools',
          ].map(t => (
            <span key={t} style={{ fontSize: '0.875rem', color: 'var(--body)', fontWeight: 500 }}>
              <span style={{ color: 'var(--teal-active)' }}>●</span> {t.slice(2)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ────────────────────────────────────── */
const steps = [
  {
    num: '01',
    icon: Brain,
    title: 'Take the Screener',
    desc: 'A 5-minute validated self-assessment. Not a diagnosis — a reading profile that reveals how your brain processes text.',
    color: 'var(--teal-active)',
    bg: 'var(--sage)',
  },
  {
    num: '02',
    icon: Zap,
    title: 'Your Profile is Generated',
    desc: 'Dyslexia, ADHD, Irlen Syndrome patterns are detected and mapped into a personalised reading configuration.',
    color: 'var(--purple-deep)',
    bg: 'var(--lavender)',
  },
  {
    num: '03',
    icon: BookOpen,
    title: 'Read with Your Settings',
    desc: 'Upload a PDF or open any webpage. TTS karaoke, RSVP mode, font switches, and overlays activate automatically.',
    color: '#B45309',
    bg: 'var(--amber-warm)',
  },
  {
    num: '04',
    icon: BarChart2,
    title: 'Track Your Progress',
    desc: 'A reading heatmap and WPM trend dashboard shows exactly where you improve — paragraph by paragraph.',
    color: 'var(--teal-active)',
    bg: 'var(--success-bg)',
  },
];

function HowItWorks() {
  const { ref, visible } = useInView();
  return (
    <section id="how-it-works" ref={ref} style={{
      background: 'var(--off-white)',
      padding: '7rem 2rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--sage)',
            color: 'var(--teal-active)',
            borderRadius: '9999px',
            padding: '0.3rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>The Pipeline</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Diagnose → Profile → Read → Track
          </h2>
          <p style={{ color: 'var(--body)', maxWidth: '520px', margin: '0 auto', fontSize: '1.05rem' }}>
            A diagnostic-to-intervention pipeline that meets you where you are.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={visible ? `animate-slide-up delay-${(i + 1) * 100}` : ''}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid var(--gray-warm)',
                transition: 'all 0.3s ease',
                opacity: visible ? 1 : 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = step.color;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-warm)';
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: step.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <step.icon size={26} color={step.color} strokeWidth={2} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: step.color, marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                STEP {step.num}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--heading)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--body)', lineHeight: 1.65 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features Grid ───────────────────────────────────── */
const features = [
  {
    icon: Headphones,
    title: 'Karaoke TTS',
    desc: "Web Speech API syncs word-level highlights to real-time speech. Each word glows as it's spoken.",
    bg: 'var(--sage)', iconColor: 'var(--teal-active)',
    tag: 'Core Feature',
  },
  {
    icon: Eye,
    title: 'RSVP Mode',
    desc: 'Rapid Serial Visual Presentation flashes one word at a time in the centre of the screen — eliminating line-tracking entirely.',
    bg: 'var(--lavender)', iconColor: 'var(--purple-deep)',
    tag: 'For Dyslexia',
  },
  {
    icon: Type,
    title: 'bdpq Highlighting',
    desc: 'b → Blue · d → Red · p → Purple · q → Green. Consistent colour mapping builds muscle memory over time.',
    bg: 'var(--amber-warm)', iconColor: '#B45309',
    tag: 'Dyslexia Aid',
  },
  {
    icon: Palette,
    title: 'Pastel Themes',
    desc: 'Clinically informed overlays — sage mint, pale blue, soft peach, and dark mode — to reduce visual stress.',
    bg: 'var(--crisis-bg)', iconColor: 'var(--crisis-text)',
    tag: 'Irlen Syndrome',
  },
  {
    icon: Focus,
    title: 'Focus Mode',
    desc: 'Hides everything except the current line. Keeps attention anchored for readers with ADHD.',
    bg: 'var(--success-bg)', iconColor: 'var(--success-text)',
    tag: 'ADHD',
  },
  {
    icon: BarChart2,
    title: 'Reading Heatmap',
    desc: 'Post-session overlay colours each paragraph red, yellow, or green based on your reading velocity.',
    bg: 'var(--purple-soft)', iconColor: 'var(--purple-deep)',
    tag: 'Analytics',
  },
];

function FeaturesSection() {
  const { ref, visible } = useInView();
  return (
    <section id="features" ref={ref} style={{ padding: '7rem 2rem', background: 'white' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--lavender)',
            color: 'var(--purple-deep)',
            borderRadius: '9999px',
            padding: '0.3rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>Features</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Built for the way <span style={{ color: 'var(--teal-active)' }}>some brains</span> actually read
          </h2>
          <p style={{ color: 'var(--body)', maxWidth: '520px', margin: '0 auto', fontSize: '1.05rem' }}>
            Every feature was designed around a specific cognitive challenge — not bolted on as an afterthought.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={visible ? `animate-scale-in delay-${(i + 1) * 100}` : ''}
              style={{
                background: f.bg,
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                opacity: visible ? 1 : 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 35px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <f.icon size={24} color={f.iconColor} strokeWidth={2} />
                </div>
                <span style={{
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.7rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: f.iconColor,
                  letterSpacing: '0.04em',
                }}>
                  {f.tag}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--heading)' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--body)', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Disabilities Supported ──────────────────────────── */
const disabilities = [
  { name: 'Dyslexia', challenge: 'Letter/word confusion, line tracking', features: ['OpenDyslexic font', 'bdpq highlight', 'RSVP', 'Karaoke TTS'], color: 'var(--teal-active)', bg: 'var(--sage)' },
  { name: 'ADHD', challenge: 'Sustained attention', features: ['Focus mode', 'Karaoke anchor', 'Speed control'], color: 'var(--purple-deep)', bg: 'var(--lavender)' },
  { name: 'Irlen Syndrome', challenge: 'Visual stress from white pages', features: ['Pastel overlays', 'Dark mode', 'High contrast'], color: '#B45309', bg: 'var(--amber-warm)' },
  { name: 'APD', challenge: 'Misprocesses heard content', features: ['Visual-first mode', 'Large word highlights'], color: 'var(--crisis-text)', bg: 'var(--crisis-bg)' },
  { name: 'Dyscalculia', challenge: 'Number/symbol confusion', features: ['Screener detection', 'Future module'], color: 'var(--success-text)', bg: 'var(--success-bg)' },
  { name: 'Working Memory', challenge: 'Loses sentence context', features: ['Chunked TTS', 'Slowed playback'], color: '#6B4F00', bg: '#FFF8E7' },
];

function DisabilitiesSection() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref} style={{ padding: '7rem 2rem', background: 'var(--off-white)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--sage)',
            color: 'var(--teal-active)',
            borderRadius: '9999px',
            padding: '0.3rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>Who It Helps</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Coverage across the neurodivergent spectrum
          </h2>
          <p style={{ color: 'var(--body)', maxWidth: '520px', margin: '0 auto' }}>
            Not everyone shares the same cognitive profile. NeuroRead adapts to yours.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {disabilities.map((d, i) => (
            <div
              key={d.name}
              className={visible ? `animate-slide-up delay-${(i % 3 + 1) * 100}` : ''}
              style={{
                background: 'white',
                borderRadius: '18px',
                padding: '1.75rem',
                border: '1px solid var(--gray-warm)',
                borderLeft: `4px solid ${d.color}`,
                transition: 'all 0.3s ease',
                opacity: visible ? 1 : 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'inline-block',
                background: d.bg,
                color: d.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}>
                {d.name}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--body)', marginBottom: '1rem', fontStyle: 'italic' }}>
                {d.challenge}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {d.features.map(f => (
                  <span key={f} style={{
                    background: d.bg,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: d.color,
                  }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─────────────────────────────────────────── */
const plans = [
  {
    name: 'Extension',
    price: 'Free',
    period: 'forever',
    desc: 'Bring NeuroRead to any webpage with one click.',
    features: ['Any webpage', 'Word TTS highlight', 'OpenDyslexic font', 'Basic speed control'],
    cta: 'Install extension',
    href: '#',
    highlight: false,
    bg: 'white',
  },
  {
    name: 'Individual',
    price: '$9',
    period: '/ month',
    desc: 'Private. No referral. No label. Full features.',
    features: ['Everything in Extension', 'PDF upload + reader', 'Screener + profile', 'Session heatmap', 'WPM dashboard'],
    cta: 'Start free trial',
    href: '/screener',
    highlight: true,
    bg: 'var(--heading)',
  },
  {
    name: 'Schools',
    price: '$49',
    period: '/ month',
    desc: 'Teacher dashboard, student profiles, bulk upload.',
    features: ['Everything in Individual', 'Teacher dashboard', 'Student profiles', 'Bulk PDF upload', 'Progress reports'],
    cta: 'Contact us',
    href: '#',
    highlight: false,
    bg: 'white',
  },
];

function PricingSection() {
  const { ref, visible } = useInView();
  return (
    <section id="pricing" ref={ref} style={{ padding: '7rem 2rem', background: 'white' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--amber-warm)',
            color: '#B45309',
            borderRadius: '9999px',
            padding: '0.3rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>Pricing</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: 'var(--body)', fontSize: '1.05rem' }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          alignItems: 'start',
        }}>
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={visible ? `animate-scale-in delay-${(i + 1) * 100}` : ''}
              style={{
                background: plan.bg,
                borderRadius: '24px',
                padding: '2.25rem',
                border: plan.highlight ? 'none' : '1px solid var(--gray-warm)',
                boxShadow: plan.highlight ? '0 20px 60px rgba(44,44,42,0.25)' : 'none',
                transform: plan.highlight ? 'scale(1.04)' : 'scale(1)',
                opacity: visible ? 1 : 0,
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: plan.highlight ? 'rgba(255,255,255,0.65)' : 'var(--body)', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                {plan.name.toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 800, color: plan.highlight ? 'white' : 'var(--heading)' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: '0.9rem', color: plan.highlight ? 'rgba(255,255,255,0.65)' : 'var(--body)' }}>
                  {plan.period}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: plan.highlight ? 'rgba(255,255,255,0.8)' : 'var(--body)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                {plan.desc}
              </p>

              <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: plan.highlight ? 'rgba(255,255,255,0.9)' : 'var(--body)' }}>
                    <CheckCircle size={16} color={plan.highlight ? 'var(--teal-soft)' : 'var(--teal-active)'} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.9rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: plan.highlight ? 'var(--teal-active)' : 'var(--sage)',
                  color: plan.highlight ? 'white' : 'var(--teal-active)',
                  border: plan.highlight ? 'none' : '1px solid var(--teal-soft)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {plan.cta} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Quote Banner ────────────────────────────────────── */
function QuoteBanner() {
  return (
    <section style={{
      background: 'var(--heading)',
      padding: '5rem 2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '1.5rem' }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} fill="var(--amber-golden)" color="var(--amber-golden)" />
          ))}
        </div>
        <blockquote style={{
          fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
          fontWeight: 700,
          color: 'white',
          lineHeight: 1.35,
          marginBottom: '1.5rem',
          letterSpacing: '-0.01em',
        }}>
          &ldquo;Your brain works differently,{' '}
          <span style={{ color: 'var(--teal-soft)' }}>not deficiently.</span>&rdquo;
        </blockquote>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
          The tool works invisibly — which is exactly what a student in a stigma-heavy environment needs.
        </p>
      </div>
    </section>
  );
}

/* ─── Final CTA ───────────────────────────────────────── */
function CTASection() {
  return (
    <section style={{
      background: 'var(--sage)',
      padding: '7rem 2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{
          width: '72px', height: '72px',
          background: 'var(--teal-active)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 8px 24px rgba(29,158,117,0.35)',
        }}>
          <Upload size={32} color="white" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to read on your terms?
        </h2>
        <p style={{ color: 'var(--body)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.65 }}>
          Take the 5-minute screener. Get your reading profile. Start reading with tools that actually work for how your brain processes text.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/screener" style={{
            padding: '1rem 2.5rem',
            background: 'var(--teal-active)',
            color: 'white',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1.05rem',
            textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(29,158,117,0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(29,158,117,0.5)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(29,158,117,0.4)';
          }}>
            Take the free screener
          </Link>
          <Link href="/studio" style={{
            padding: '1rem 2.5rem',
            background: 'white',
            color: 'var(--heading)',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1.05rem',
            textDecoration: 'none',
            border: '2px solid var(--gray-warm)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal-soft)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-warm)';
          }}>
            Open the Studio
          </Link>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--body)', opacity: 0.7 }}>
          ⚠️ This is not a clinical diagnosis tool. It personalises your reading experience.
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      background: 'var(--heading)',
      color: 'rgba(255,255,255,0.6)',
      padding: '3rem 2rem',
      fontSize: '0.875rem',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white', marginBottom: '0.25rem' }}>
            neuro<span style={{ color: 'var(--teal-soft)' }}>read</span>
          </div>
          <div>Built for the way some brains actually read.</div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {['Screener', 'Studio', 'Dashboard', 'For Schools', 'Privacy'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
          © 2025 NeuroRead · Not a medical service
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <DisabilitiesSection />
      <QuoteBanner />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
}