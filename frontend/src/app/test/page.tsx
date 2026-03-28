"use client"
import React, { useState, useRef, ChangeEvent } from 'react';

// Types for your FastAPI response
interface PageData { page: number; content: string; }
interface ProcessedResponse { filename: string; page_count: number; data: PageData[]; }

const ReadingStudio = () => {
  const [result, setResult] = useState<ProcessedResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // TYPOGRAPHY CONTROLS (From your UI Reference)
  const [config, setConfig] = useState({
    fontSize: 16,
    fontFamily: 'Lexend', // Supports OpenDyslexic or Lexend
    letterSpacing: 0,
    lineHeight: 1.5,
    wordSpacing: 0,
    alignment: 'left' as 'left' | 'center' | 'right' | 'justify',
  });

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('http://localhost:8000/process-pdf', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EDE9] p-8 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#3D3D3D]">Reading Studio</h1>
        <p className="text-sm text-[#7D7D7D]">Upload, paste, or type — then customise your reading experience.</p>
      </header>

      <div className="flex gap-6 max-w-[1600px] mx-auto">
        {/* MAIN EDITOR AREA: Simulating the "Book" */}
        <main className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Editor</span>
            <div className="flex gap-2">
               <label className="cursor-pointer p-2 hover:bg-slate-200 rounded-lg transition">
                 <input type="file" className="hidden" onChange={uploadFile} />
                 <span className="text-lg">📤</span>
               </label>
               <button className="p-2 hover:bg-slate-200 rounded-lg">📖</button>
            </div>
          </div>

          <div className="p-12 overflow-y-auto flex-1">
            {!result ? (
              <div className="h-full flex items-center justify-center text-slate-300 italic">
                {loading ? "Processing your book..." : "Start typing or paste your text here..."}
              </div>
            ) : (
              <div className="space-y-16 max-w-2xl mx-auto">
                {result.data.map((page) => (
                  <article
                    key={page.page}
                    style={{
                      fontSize: `${config.fontSize}px`,
                      fontFamily: config.fontFamily === 'Lexend' ? 'Lexend, sans-serif' : 'OpenDyslexic, sans-serif',
                      letterSpacing: `${config.letterSpacing}em`,
                      lineHeight: config.lineHeight,
                      wordSpacing: `${config.wordSpacing}em`,
                      textAlign: config.alignment
                    }}
                  >
                    <div className="mb-4 border-b pb-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      Page {page.page}
                    </div>
                    <p className="whitespace-pre-wrap text-slate-800">
                      {page.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* TYPOGRAPHY SIDEBAR */}
        <aside className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
          <div className="flex justify-between border-b pb-2 mb-2">
            <button className="text-[10px] font-bold uppercase text-slate-400">Audio</button>
            <button className="text-[10px] font-bold uppercase text-blue-600 border-b-2 border-blue-600">Type</button>
            <button className="text-[10px] font-bold uppercase text-slate-400">Display</button>
          </div>

          <section>
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
              <span>📏</span> Typography
            </h3>

            {/* Font Size */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500 font-medium">Font Size</span>
                <span className="text-slate-800 font-bold">{config.fontSize}px</span>
              </div>
              <input type="range" min="12" max="48" value={config.fontSize} onChange={(e) => setConfig({...config, fontSize: Number(e.target.value)})} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800" />
            </div>

            {/* Font Family */}
            <div className="mb-6">
              <span className="text-xs text-slate-500 font-medium block mb-2">Font Family</span>
              <select 
                value={config.fontFamily}
                onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Lexend">Lexend</option>
                <option value="OpenDyslexic">OpenDyslexic</option>
              </select>
            </div>

            {/* Spacing Controls */}
            <div className="space-y-4">
              {[
                { label: 'Letter Spacing', key: 'letterSpacing', max: 0.5, step: 0.01, unit: 'em' },
                { label: 'Line Height', key: 'lineHeight', min: 1, max: 3, step: 0.1, unit: '' },
                { label: 'Word Spacing', key: 'wordSpacing', max: 0.5, step: 0.01, unit: 'em' },
              ].map((ctrl) => (
                <div key={ctrl.key}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500 font-medium">{ctrl.label}</span>
                    <span className="text-slate-800 font-bold">{(config as any)[ctrl.key]}{ctrl.unit}</span>
                  </div>
                  <input 
                    type="range" 
                    min={ctrl.min || 0} 
                    max={ctrl.max} 
                    step={ctrl.step}
                    value={(config as any)[ctrl.key]} 
                    onChange={(e) => setConfig({...config, [ctrl.key]: Number(e.target.value)})} 
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800" 
                  />
                </div>
              ))}
            </div>

            {/* Alignment */}
            <div className="mt-6">
              <span className="text-xs text-slate-500 font-medium block mb-2">Alignment</span>
              <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-lg">
                {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => setConfig({...config, alignment: align})}
                    className={`p-2 text-xs rounded-md transition ${config.alignment === align ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-400'}`}
                  >
                    {align.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ReadingStudio;