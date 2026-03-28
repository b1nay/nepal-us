'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';

const navLinks = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(241, 239, 232, 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(211, 209, 199, 0.5)' : '1px solid transparent',
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--teal-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BookOpen size={20} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--heading)' }}>
              neuro<span style={{ color: 'var(--teal-active)' }}>read</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: 'var(--body)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal-active)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--body)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/screener"
              style={{
                padding: '0.5rem 1.25rem',
                border: '2px solid var(--heading)',
                borderRadius: '9999px',
                color: 'var(--heading)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'none',
              }}
              className="md:block"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--heading)';
                (e.currentTarget as HTMLElement).style.color = 'white';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--heading)';
              }}
            >
              Start free
            </Link>
            <Link
              href="/studio"
              style={{
                padding: '0.5rem 1.25rem',
                background: 'var(--teal-active)',
                borderRadius: '9999px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 12px rgba(29,158,117,0.35)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(29,158,117,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(29,158,117,0.35)';
              }}
            >
              Open Studio
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: 'var(--heading)',
              }}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(241, 239, 232, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--gray-warm)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: 'var(--body)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--gray-warm)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/screener"
              style={{
                display: 'block',
                marginTop: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--teal-active)',
                borderRadius: '9999px',
                color: 'white',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
              }}
              onClick={() => setMobileOpen(false)}
            >
              Take the free screener
            </Link>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div style={{ height: '68px' }} />
    </>
  );
}