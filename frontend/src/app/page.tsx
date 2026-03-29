"use client"
import React, { useState } from 'react';
import { Settings, Eye, Volume2, Type, Layout, BookOpen, CheckCircle2 } from 'lucide-react';

const OSOApp = () => {
  const [activeTab, setActiveTab] = useState('reader');

  // OSO Brand Palette (Derived from image)
  const colors = {
    mint: '#e6f4f1',
    lavender: '#f0f0ff',
    sand: '#f5f5ed',
    deepPurple: '#6366f1',
    textDark: '#1a1a1b',
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-200" style={{ backgroundColor: colors.mint }}>
      {/* Navigation Header */}
      {/* <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold italic">O</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">OSO <span className="font-light text-gray-400">| Sensory Optimizer</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <button className="hover:text-indigo-600">Library</button>
          <button className="hover:text-indigo-600">Personalize</button>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition">Get Started</button>
        </div>
      </nav> */}

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
        <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-widest border border-indigo-100">
          Open Source Accessibility
        </span>
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          Learning that works for <br /> <span className="text-emerald-500">your brain</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          OSO adapts content to your unique sensory needs. Reduce glare, increase focus, and optimize typography for Dyslexia and ADHD.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
            Try the Free Demo
          </button>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition">
            See Features
          </button>
        </div>
      </header>

      {/* Feature Grid: Cognitive Tools */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Built around neurodivergent needs</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Type className="text-emerald-500" />}
              title="Dyslexic-Friendly Fonts"
              desc="Optimized spacing and specialized typefaces like OpenDyslexic to prevent letter rotation."
              bgColor={colors.mint}
            />
            <FeatureCard 
              icon={<Eye className="text-indigo-500" />}
              title="Focus Ruler"
              desc="A horizontal guide that highlights one line at a time to prevent skipping or losing place."
              bgColor={colors.lavender}
            />
            <FeatureCard 
              icon={<Volume2 className="text-orange-400" />}
              title="Multimodal Sync"
              desc="Highlight words in real-time as they are read aloud by high-quality AI voices."
              bgColor={colors.sand}
            />
          </div>
        </div>
      </section>

      {/* Interactive Mockup Section */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.lavender }}>
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-50">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex gap-4">
               <Settings size={18} className="text-gray-400" />
               <Layout size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="p-12 text-center">
            <p className="text-2xl md:text-3xl leading-relaxed text-slate-800">
              <span className="font-bold border-b-4 border-emerald-300">The</span> brain <span className="font-bold border-b-4 border-emerald-300">doesn't</span> process <span className="font-bold border-b-4 border-emerald-300">every</span> written <span className="font-bold border-b-4 border-emerald-300">language</span> thing <span className="font-bold border-b-4 border-emerald-300">symbol</span> to <span className="font-bold border-b-4 border-emerald-300">sound.</span>
            </p>
            <div className="mt-8 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-2/3"></div>
            </div>
            <p className="mt-4 text-xs font-bold text-indigo-500 uppercase tracking-widest">Progress: 66%</p>
          </div>
        </div>
      </section>

      {/* Pricing / Access */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Same experience. Anywhere.</h2>
            <p className="text-slate-400 text-lg mb-8">Install OSO on your browser, tablet, or phone. Your sensory preferences sync automatically.</p>
            <ul className="space-y-4">
              {['Browser Extension', 'iOS & Android App', 'PDF Optimizer'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="mb-6">
              <span className="text-emerald-400 font-mono">Status: Ready to deploy</span>
            </div>
            <p className="text-xl italic text-slate-300">"OSO changed how I approach my university readings. No more headaches or re-reading paragraphs 10 times."</p>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500"></div>
              <div>
                <p className="font-bold">Alex Rivera</p>
                <p className="text-sm text-slate-500">Neurodiverse Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, bgColor }: any) => (
  <div className="p-8 rounded-2xl transition-all hover:shadow-md border border-transparent hover:border-gray-100" style={{ backgroundColor: bgColor }}>
    <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default OSOApp;