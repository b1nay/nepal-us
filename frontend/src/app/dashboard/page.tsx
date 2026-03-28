'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart2, TrendingUp, Clock, BookOpen, ArrowRight,
  Zap, Target, Award, Upload
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

/* ─── Mock data ───────────────────────────────────────── */
const wpmHistory = [
  { date: 'Mar 1',  wpm: 88,  session: 1 },
  { date: 'Mar 4',  wpm: 96,  session: 2 },
  { date: 'Mar 7',  wpm: 101, session: 3 },
  { date: 'Mar 10', wpm: 98,  session: 4 },
  { date: 'Mar 14', wpm: 112, session: 5 },
  { date: 'Mar 17', wpm: 119, session: 6 },
  { date: 'Mar 21', wpm: 124, session: 7 },
  { date: 'Mar 25', wpm: 131, session: 8 },
  { date: 'Mar 28', wpm: 138, session: 9 },
];

const recentSessions = [
  {
    id: 1, title: 'Biology Chapter 4', date: 'Today, 2:30 PM',
    duration: '18 min', wpm: 138, pages: 6,
    heatmap: [
      { level: 'fast' }, { level: 'moderate' }, { level: 'fast' },
      { level: 'slow' }, { level: 'moderate' }, { level: 'fast' },
    ],
  },
  {
    id: 2, title: 'History Essay', date: 'Yesterday, 4:15 PM',
    duration: '24 min', wpm: 124, pages: 8,
    heatmap: [
      { level: 'moderate' }, { level: 'fast' }, { level: 'moderate' },
      { level: 'slow' }, { level: 'slow' }, { level: 'moderate' },
      { level: 'fast' }, { level: 'moderate' },
    ],
  },
  {
    id: 3, title: 'Chemistry Notes', date: 'Mar 25, 10:00 AM',
    duration: '31 min', wpm: 119, pages: 12,
    heatmap: [
      { level: 'slow' }, { level: 'moderate' }, { level: 'moderate' },
      { level: 'fast' }, { level: 'moderate' }, { level: 'moderate' },
    ],
  },
];

const achievements = [
  { icon: '🎯', label: '9 Sessions Complete', color: 'var(--success-bg)', textColor: 'var(--success-text)' },
  { icon: '📈', label: '+57% WPM improvement', color: 'var(--sage)', textColor: 'var(--teal-active)' },
  { icon: '⚡', label: 'RSVP Mode Unlocked', color: 'var(--lavender)', textColor: 'var(--purple-deep)' },
  { icon: '🔥', label: '5-day streak', color: 'var(--amber-warm)', textColor: '#B45309' },
];

const heatmapColors: Record<string, string> = {
  fast: '#dcfce7',
  moderate: '#fef9c3',
  slow: '#fee2e2',
};

/* ─── Custom Tooltip ─────────────────────────────────── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white', border: '1px solid var(--gray-warm)',
        borderRadius: '10px', padding: '0.75rem 1rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--body)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--teal-active)' }}>
          {payload[0].value} WPM
        </div>
      </div>
    );
  }
  return null;
}

/* ─── Stat Card ──────────────────────────────────────── */
function StatCard({ icon, label, value, sub, bgColor, iconColor }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '18px',
      padding: '1.5rem',
      border: '1px solid var(--gray-warm)',
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
    }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem', color: iconColor,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--heading)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--body)', marginTop: '4px', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--body)', opacity: 0.6 }}>{sub}</div>
    </div>
  );
}

/* ─── Dashboard Page ─────────────────────────────────── */
export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<'week' | 'month' | 'all'>('all');

  const filteredData = wpmHistory.slice(
    selectedRange === 'week' ? -3 : selectedRange === 'month' ? -6 : 0
  );

  const latestWpm = wpmHistory[wpmHistory.length - 1].wpm;
  const firstWpm  = wpmHistory[0].wpm;
  const improvement = Math.round(((latestWpm - firstWpm) / firstWpm) * 100);

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'var(--off-white)',
      padding: '2.5rem 1.5rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '0.25rem' }}>
              Reading Dashboard
            </h1>
            <p style={{ color: 'var(--body)', fontSize: '1rem' }}>
              Your reading journey, tracked and visualised.
            </p>
          </div>
          <Link href="/studio" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '0.75rem 1.5rem',
            background: 'var(--teal-active)', color: 'white',
            borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(29,158,117,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
          >
            <Upload size={16} /> New Session
          </Link>
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          <StatCard
            icon={<Zap size={22} />}
            label="Current WPM"
            value={String(latestWpm)}
            sub="words per minute"
            bgColor="var(--sage)"
            iconColor="var(--teal-active)"
          />
          <StatCard
            icon={<TrendingUp size={22} />}
            label="Improvement"
            value={`+${improvement}%`}
            sub="since first session"
            bgColor="var(--success-bg)"
            iconColor="var(--success-text)"
          />
          <StatCard
            icon={<BookOpen size={22} />}
            label="Sessions"
            value="9"
            sub="total reading sessions"
            bgColor="var(--lavender)"
            iconColor="var(--purple-deep)"
          />
          <StatCard
            icon={<Clock size={22} />}
            label="Reading Time"
            value="2h 43m"
            sub="total time reading"
            bgColor="var(--amber-warm)"
            iconColor="#B45309"
          />
        </div>

        {/* WPM Chart + Achievements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '1.25rem',
          marginBottom: '2rem',
          alignItems: 'start',
        }}>
          {/* WPM Trend */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '1.75rem',
            border: '1px solid var(--gray-warm)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={18} color="var(--teal-active)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>WPM Trend</h3>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['week', 'month', 'all'] as const).map(r => (
                  <button key={r} onClick={() => setSelectedRange(r)} style={{
                    padding: '0.3rem 0.75rem', borderRadius: '8px',
                    border: `2px solid ${selectedRange === r ? 'var(--teal-active)' : 'var(--gray-warm)'}`,
                    background: selectedRange === r ? 'var(--sage)' : 'white',
                    color: selectedRange === r ? 'var(--teal-active)' : 'var(--body)',
                    fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                    textTransform: 'capitalize', transition: 'all 0.2s',
                  }}>
                    {r === 'all' ? 'All time' : r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={filteredData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--off-white)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--body)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--body)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="wpm"
                  stroke="var(--teal-active)" strokeWidth={3}
                  fill="url(#wpmGradient)"
                  dot={{ fill: 'var(--teal-active)', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: 'var(--teal-active)', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Achievements */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '1.75rem',
            border: '1px solid var(--gray-warm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <Award size={18} color="var(--amber-golden)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Achievements</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {achievements.map(a => (
                <div key={a.label} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '0.875rem 1rem',
                  background: a.color, borderRadius: '12px',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'}
                >
                  <span style={{ fontSize: '1.4rem' }}>{a.icon}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: a.textColor }}>
                    {a.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Profile hint */}
            <Link href="/screener" style={{
              display: 'block', marginTop: '1.25rem',
              padding: '0.875rem 1rem',
              background: 'var(--sage)', borderRadius: '12px',
              color: 'var(--teal-active)', fontWeight: 700, fontSize: '0.85rem',
              textDecoration: 'none', textAlign: 'center',
              border: '1px solid var(--teal-soft)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--teal-soft)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--sage)'}
            >
              <Target size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Retake screener to update profile
            </Link>
          </div>
        </div>

        {/* Recent Sessions */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '1.75rem',
          border: '1px solid var(--gray-warm)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--purple-deep)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Sessions</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentSessions.map(session => (
              <div key={session.id} style={{
                padding: '1.25rem',
                borderRadius: '16px',
                border: '1px solid var(--off-white)',
                background: 'var(--off-white)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.border = '1px solid var(--gray-warm)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.border = '1px solid var(--off-white)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--heading)', marginBottom: '4px' }}>
                      {session.title}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--body)' }}>📅 {session.date}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--body)' }}>⏱ {session.duration}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--teal-active)', fontWeight: 700 }}>⚡ {session.wpm} WPM avg</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--body)' }}>📄 {session.pages} pages</span>
                    </div>
                  </div>

                  <Link href="/studio" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '0.4rem 0.875rem',
                    background: 'var(--sage)', color: 'var(--teal-active)',
                    borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--teal-soft)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--sage)'}
                  >
                    Resume <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Mini heatmap */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--body)', fontWeight: 600, marginBottom: '6px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Paragraph heatmap
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {session.heatmap.map((seg, i) => (
                      <div key={i} style={{
                        width: '28px', height: '14px', borderRadius: '4px',
                        background: heatmapColors[seg.level],
                        border: '1px solid rgba(0,0,0,0.06)',
                        transition: 'transform 0.2s', cursor: 'default',
                      }}
                      title={seg.level}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.3)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
