import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lexie = localFont({
  src: [
    { path: '../../public/fonts/LexieReadable-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/LexieReadable-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-lexie',
});

const openDyslexic = localFont({
  src: [
    { path: '../../public/fonts/OpenDyslexic-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/OpenDyslexic-Italic.otf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/OpenDyslexic-Bold.otf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/OpenDyslexic-BoldItalic.otf', weight: '700', style: 'italic' },
  ],
  variable: '--font-open',
});

export const metadata: Metadata = {
  title: 'NeuroRead — Reading that works for your brain',
  description: 'A personalised reading platform for neurodivergent learners. Supports dyslexia, ADHD, Irlen Syndrome and more. No diagnosis required.',
  keywords: ['dyslexia reader', 'ADHD reading tool', 'neurodivergent', 'accessible reading', 'TTS karaoke'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lexie.variable} ${openDyslexic.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}