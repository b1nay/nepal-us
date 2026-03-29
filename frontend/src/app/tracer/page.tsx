"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHONETIC_MAP: Record<string, string> = {
  A: "ah", B: "buh", C: "kuh", D: "duh", E: "eh" // Add more as needed
};

export default function LearnPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("B");
  const [isComplete, setIsComplete] = useState(false);

  // Setup Canvas with a "Sand" texture feel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 40;
    ctx.strokeStyle = '#d4a373'; // Sand color
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    playPhonetic(currentLetter);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      // Basic heuristic: if they've drawn enough, mark as complete
      // In a real hackathon, you'd use pixel matching or AI to verify the shape
      setIsComplete(true);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const playPhonetic = (letter: string) => {
    const utterance = new SpeechSynthesisUtterance(PHONETIC_MAP[letter]);
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const reset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fefae0] p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#606c38] mb-2">Trace the Sound</h1>
        <p className="text-[#283618] opacity-80">Feel the letter, hear the sound.</p>
      </div>

      <div className="relative group">
        {/* The Visual Guide (The "Target" Letter) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[300px] font-black opacity-10 select-none text-[#bc6c25]">
            {currentLetter}
          </span>
        </div>

        {/* The Interaction Layer */}
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          className="bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-[#dda15e] cursor-crosshair shadow-xl"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-[#606c38]/90 rounded-3xl text-white text-3xl font-bold"
            >
              <div className="text-center">
                <p>Amazing Job!</p>
                <button 
                  onClick={reset}
                  className="mt-4 px-6 py-2 bg-[#dda15e] rounded-full text-lg hover:bg-[#bc6c25] transition"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-4">
        {['A', 'B', 'C', 'D'].map((l) => (
          <button
            key={l}
            onClick={() => { setCurrentLetter(l); reset(); }}
            className={`w-16 h-16 rounded-2xl text-2xl font-bold transition-all ${
              currentLetter === l ? 'bg-[#bc6c25] text-white scale-110' : 'bg-white text-[#283618] border-2 border-[#dda15e]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}