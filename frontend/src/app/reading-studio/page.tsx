
// "use client";

// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { motion } from "framer-motion";
// import { 
//   ChevronLeft, 
//   ChevronRight, 
//   Bookmark, 
//   BookOpen, 
//   Upload, 
//   RotateCcw,
//   Play,
//   Pause,
//   Zap
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface PageData {
//   page: number;
//   content: string;
// }

// interface PDFResponse {
//   filename: string;
//   page_count: number;
//   is_ocr_processed: boolean;
//   data: PageData[];
// }

// interface Settings {
//   font: string;
//   fontSize: number;
//   lineHeight: number;
//   alignment: "left" | "justify";
//   theme: Theme;
//   pageStyle: "blank" | "ruled";
//   bdpqmwOn: boolean;
//   playbackOn: boolean;
//   playbackWpm: number;
// }

// type Theme = "cream" | "mint" | "lavender" | "amber" | "dark";

// interface SavedBook {
//   id: string;
//   filename: string;
//   pdfData: PDFResponse;
//   lastSpread: number;
//   timestamp: number;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const STORAGE_KEY = "oso_library_v1";

// const BOOK_COLORS = ["#1D9E75", "#534AB7", "#D97706", "#DB2777", "#2563EB", "#059669"];

// const FONTS = [
//   { label: "Lexie",     value: "'Trebuchet MS', sans-serif" },
//   { label: "Atkinson",  value: "'Gill Sans', 'Gill Sans MT', sans-serif" },
//   { label: "Serif",     value: "Georgia, serif" },
//   { label: "Mono",      value: "'Courier New', monospace" },
// ];

// const THEMES: Record<Theme, { bg: string; paper: string; text: string; rule: string; name: string }> = {
//   cream:    { bg: "#EDE8DC", paper: "#FAF9F3", text: "#2C2C2A", rule: "#E2DDD5", name: "Cream"    },
//   mint:     { bg: "#C8EBE0", paper: "#E1F5EE", text: "#04342C", rule: "#B8DFD2", name: "Mint"     },
//   lavender: { bg: "#D5D3F5", paper: "#EEEDFE", text: "#26215C", rule: "#C8C5EE", name: "Lavender" },
//   amber:    { bg: "#F0D9A8", paper: "#FAEEDA", text: "#412402", rule: "#E8CFA0", name: "Amber"    },
//   dark:     { bg: "#1A1A18", paper: "#2C2C2A", text: "#F1EFE8", rule: "#3A3A38", name: "Dark"     },
// };

// const LETTER_STYLE: Record<string, { bg: string; color: string }> = {
//   b: { bg: "#B5D4F4", color: "#0C447C" },
//   d: { bg: "#FAC775", color: "#412402" },
//   p: { bg: "#CECBF6", color: "#26215C" },
//   q: { bg: "#9FE1CB", color: "#04342C" },
//   m: { bg: "#F4C0D1", color: "#4B1528" },
//   w: { bg: "#C0DD97", color: "#173404" },
// };

// const PLAYBACK_BG = "rgba(29, 158, 117, 0.25)";
// const PAGE_PAD_TOP = 36;
// const PAGE_PAD_SIDE = 40;
// const PAGE_PAD_BOTTOM = 28;
// const BOOK_SPINE = 3;

// const DEFAULT_SETTINGS: Settings = {
//   font: FONTS[0].value,
//   fontSize: 18,
//   lineHeight: 2.2,
//   alignment: "left",
//   theme: "cream",
//   pageStyle: "blank",
//   bdpqmwOn: false,
//   playbackOn: false,
//   playbackWpm: 180,
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function tokenize(text: string): string[] {
//   return text.split(/(\s+)/).filter(Boolean);
// }

// function applyBdpqmw(word: string): React.ReactNode[] {
//   const nodes: React.ReactNode[] = [];
//   for (let i = 0; i < word.length; i++) {
//     const ch = word[i];
//     const style = LETTER_STYLE[ch.toLowerCase()];
//     if (style && "bdpqmw".includes(ch.toLowerCase())) {
//       nodes.push(
//         <span key={i} style={{ background: style.bg, color: style.color, borderRadius: 3, padding: "0 2px", fontWeight: 600, display: "inline-block", lineHeight: "inherit" }}>
//           {ch}
//         </span>
//       );
//     } else {
//       nodes.push(ch);
//     }
//   }
//   return nodes;
// }

// const getBookColor = (name: string) => {
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return BOOK_COLORS[Math.abs(hash) % BOOK_COLORS.length];
// };

// // ─── Taskbar ──────────────────────────────────────────────────────────────────

// const Taskbar: React.FC<{ 
//   settings: Settings; 
//   onChange: (s: Partial<Settings>) => void; 
//   filename: string; 
//   onReset: () => void;
//   currentSpread: number;
//   totalSpreads: number;
//   onPageChange: (p: number) => void;
// }> = ({ settings, onChange, filename, onReset, currentSpread, totalSpreads, onPageChange }) => {
//   const t = THEMES[settings.theme];
//   const Divider = () => <div style={{ width: 1, height: 24, background: t.rule, margin: "0 2px", flexShrink: 0 }} />;
  
//   const Btn: React.FC<{ title: string; active?: boolean; onClick: () => void; children: React.ReactNode; accent?: string }> = ({ title, active, onClick, children, accent = "#1D9E75" }) => (
//     <button title={title} onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "5px 8px", borderRadius: 6, border: active ? `1.5px solid ${accent}` : "1px solid transparent", background: active ? `${accent}20` : "transparent", color: active ? accent : t.text, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.12s", whiteSpace: "nowrap" }}>
//       {children}
//     </button>
//   );

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 14px", background: t.paper, borderBottom: `1px solid ${t.rule}`, flexWrap: "wrap", userSelect: "none", flexShrink: 0, zIndex: 100 }}>
//       <span style={{ fontSize: 12, color: t.text, opacity: 0.55, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📄 {filename}</span>
//       <Divider />
      
//       <select value={settings.font} onChange={(e) => onChange({ font: e.target.value })} style={{ fontSize: 12, padding: "4px 6px", borderRadius: 6, border: `1px solid ${t.rule}`, background: t.paper, color: t.text, cursor: "pointer" }}>
//         {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
//       </select>

//       <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <Btn title="Decrease Font" onClick={() => onChange({ fontSize: Math.max(12, settings.fontSize - 1) })}>A-</Btn>
//         <span style={{ fontSize: 12, minWidth: 22, textAlign: "center", color: t.text }}>{settings.fontSize}</span>
//         <Btn title="Increase Font" onClick={() => onChange({ fontSize: Math.min(36, settings.fontSize + 1) })}>A+</Btn>
//       </div>

//       <Divider />
//       <Btn title="Spacing" onClick={() => onChange({ lineHeight: settings.lineHeight >= 2.8 ? 1.6 : parseFloat((settings.lineHeight + 0.3).toFixed(1)) })}>
//         <span>{settings.lineHeight.toFixed(1)}×</span>
//       </Btn>

//       <Divider />
//       {(Object.keys(THEMES) as Theme[]).map((key) => (
//         <div key={key} onClick={() => onChange({ theme: key })} style={{ width: 17, height: 17, borderRadius: "50%", background: THEMES[key].paper, cursor: "pointer", border: settings.theme === key ? "2px solid #1D9E75" : `1px solid ${t.rule}` }} />
//       ))}

//       <Divider />
//       <Btn title="BDPQMW Highlight" active={settings.bdpqmwOn} onClick={() => onChange({ bdpqmwOn: !settings.bdpqmwOn })} accent="#534AB7">bdpqmw</Btn>
      
//       <Divider />
//       {/* Playback Controls */}
//       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//         <Btn title={settings.playbackOn ? "Pause" : "Auto Play"} active={settings.playbackOn} onClick={() => onChange({ playbackOn: !settings.playbackOn })}>
//           {settings.playbackOn ? <Pause size={14} /> : <Play size={14} />}
//         </Btn>
//         <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px" }}>
//           <Zap size={12} color={t.text} style={{ opacity: 0.5 }} />
//           <input 
//             type="range" min="60" max="400" step="10" 
//             value={settings.playbackWpm} 
//             onChange={(e) => onChange({ playbackWpm: parseInt(e.target.value) })}
//             style={{ width: 60, cursor: "pointer", accentColor: "#1D9E75" }}
//           />
//           <span style={{ fontSize: 10, minWidth: 40, color: t.text, opacity: 0.6 }}>{settings.playbackWpm} WPM</span>
//         </div>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
//         <Btn title="Previous" onClick={() => onPageChange(Math.max(0, currentSpread - 2))}>
//           <ChevronLeft size={16} />
//         </Btn>
//         <span style={{ fontSize: 11, fontWeight: 600, color: t.text, opacity: 0.7, padding: "0 4px" }}>
//           {currentSpread + 1} / {totalSpreads}
//         </span>
//         <Btn title="Next" onClick={() => onPageChange(Math.min(totalSpreads - 1, currentSpread + 2))}>
//           <ChevronRight size={16} />
//         </Btn>
//         <Divider />
//         <Btn title="Reset" onClick={onReset}><RotateCcw size={14} /></Btn>
//       </div>
//     </div>
//   );
// };

// // ─── Main Component ──────────────────────────────────────────────────────────

// export default function BookReader() {
//   const [pdfData, setPdfData] = useState<PDFResponse | null>(null);
//   const [currentBookId, setCurrentBookId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
//   const [virtualPages, setVirtualPages] = useState<number[]>([]);
//   const [currentSpread, setCurrentSpread] = useState(0);
//   const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false);
//   const [library, setLibrary] = useState<SavedBook[]>([]);
//   const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);

//   const bookRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const playbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   useEffect(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) setLibrary(JSON.parse(saved));
//   }, []);

//   const allWords = useMemo(() => {
//     if (!pdfData) return [];
//     return tokenize(pdfData.data.map((p) => p.content).join("\n\n"));
//   }, [pdfData]);

//   // Handle Playback Logic
//   useEffect(() => {
//     if (settings.playbackOn) {
//       const spreadStart = virtualPages[currentSpread] || 0;
//       const spreadEnd = virtualPages[currentSpread + 2] || allWords.length;
      
//       if (activeWordIdx === null || activeWordIdx < spreadStart || activeWordIdx >= spreadEnd) {
//         setActiveWordIdx(spreadStart);
//       }

//       const msPerWord = (60 / settings.playbackWpm) * 1000;
      
//       playbackRef.current = setInterval(() => {
//         setActiveWordIdx(prev => {
//           if (prev === null) return spreadStart;
//           const next = prev + 1;
          
//           // Move to next spread if current one ends
//           if (next >= spreadEnd) {
//             if (currentSpread + 2 < virtualPages.length) {
//               setCurrentSpread(curr => curr + 2);
//               return next;
//             } else {
//               setSettings(s => ({ ...s, playbackOn: false }));
//               return prev;
//             }
//           }
          
//           // Skip whitespace tokens for timing
//           if (/^\s+$/.test(allWords[next])) return next + 1;
//           return next;
//         });
//       }, msPerWord);
//     } else {
//       if (playbackRef.current) clearInterval(playbackRef.current);
//       setActiveWordIdx(null);
//     }
//     return () => { if (playbackRef.current) clearInterval(playbackRef.current); };
//   }, [settings.playbackOn, settings.playbackWpm, currentSpread, virtualPages, allWords]);

//   const paginate = useCallback(() => {
//     if (allWords.length === 0 || !contentRef.current) return;
//     const r = contentRef.current.getBoundingClientRect();
//     const pageW = Math.floor(r.width);
//     const pageH = Math.floor(r.height);
//     if (pageW <= 20 || pageH <= 20) return;

//     const ruler = document.createElement("div");
//     ruler.style.cssText = `position:fixed;top:-9999px;width:${pageW}px;font-size:${settings.fontSize}px;font-family:${settings.font};line-height:${settings.lineHeight};text-align:${settings.alignment};word-break:break-word;white-space:pre-wrap;visibility:hidden;`;
//     document.body.appendChild(ruler);

//     const pages: number[] = [0];
//     let acc = "";
//     for (let i = 0; i < allWords.length; i++) {
//       const candidate = acc + allWords[i];
//       ruler.textContent = candidate;
//       if (ruler.scrollHeight > pageH && acc.length > 0) {
//         pages.push(i);
//         acc = allWords[i];
//       } else {
//         acc = candidate;
//       }
//     }
//     document.body.removeChild(ruler);
//     setVirtualPages(pages);
//   }, [allWords, settings.fontSize, settings.font, settings.lineHeight, settings.alignment]);

//   useEffect(() => { paginate(); }, [paginate]);

//   const handleFile = async (file: File) => {
//     setLoading(true); setError(null);
//     const form = new FormData();
//     form.append("file", file);
//     try {
//       const res = await fetch("http://localhost:8000/process-pdf", { method: "POST", body: form });
//       const json: PDFResponse = await res.json();
//       const newId = crypto.randomUUID();
//       const newBook: SavedBook = { id: newId, filename: file.name, pdfData: json, lastSpread: 0, timestamp: Date.now() };
//       const updatedLibrary = [newBook, ...library.filter(b => b.filename !== file.name)].slice(0, 10);
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLibrary));
//       setLibrary(updatedLibrary);
//       setPdfData(json);
//       setCurrentBookId(newId);
//       setCurrentSpread(0);
//     } catch (e) { setError("FastAPI connection error."); }
//     finally { setLoading(false); }
//   };

//   const handleBookmark = () => {
//     if (!currentBookId) return;
//     setIsBookmarkAnimating(true);
//     const updated = library.map(b => b.id === currentBookId ? { ...b, lastSpread: currentSpread, timestamp: Date.now() } : b);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//     setLibrary(updated);
//     setTimeout(() => setIsBookmarkAnimating(false), 1500);
//   };

//   const theme = THEMES[settings.theme];
//   const lRange = [virtualPages[currentSpread] || 0, virtualPages[currentSpread + 1] || allWords.length];
//   const rRange = [virtualPages[currentSpread + 1] || allWords.length, virtualPages[currentSpread + 2] || allWords.length];

//   if (!pdfData) return (
//     <div style={S.uploadRoot}>
//       <div style={S.uploadCard}>
//         {/* <div style={{ fontSize: 40, marginBottom: 8 }}>🐻</div> */}
//         {/* <h1 style={S.uploadTitle}>oso</h1> */}
//         {/* <p style={S.uploadSub}>Reading without barriers</p> */}
//         <div style={S.dropzone} onClick={() => !loading && document.getElementById("pdf-up")?.click()}>
//           <input id="pdf-up" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
//           {loading ? <div style={S.spinner} /> : (
//             <>
//               <Upload size={32} color="#1D9E75" style={{ marginBottom: 12 }} />
//               <p style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>Drop or click to upload PDF</p>
//             </>
//           )}
//         </div>
//         {library.length > 0 && (
//           <div style={{ marginTop: 40, textAlign: "left" }}>
//             <p style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Library Rack</p>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 16 }}>
//               {library.map(book => {
//                 const bookColor = getBookColor(book.filename);
//                 return (
//                   <div key={book.id} onClick={() => { setPdfData(book.pdfData); setCurrentBookId(book.id); setCurrentSpread(book.lastSpread); }} style={S.libraryItem}>
//                     <div style={{ ...S.bookIcon, backgroundColor: `${bookColor}15`, color: bookColor }}>
//                       <BookOpen size={20} />
//                     </div>
//                     <span style={S.libraryText}>{book.filename}</span>
//                     <p style={{ fontSize: 10, color: "#888780", marginTop: 4 }}>Last: Page {book.lastSpread + 1}</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: theme.bg }}>
//       <Taskbar 
//         settings={settings} 
//         onChange={(s) => setSettings(p => ({ ...p, ...s }))} 
//         filename={pdfData.filename} 
//         onReset={() => setPdfData(null)} 
//         currentSpread={currentSpread}
//         totalSpreads={virtualPages.length}
//         onPageChange={setCurrentSpread}
//       />
      
//       <div ref={bookRef} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px" }}>
//         <div style={{ display: "flex", position: "relative", width: "100%", maxWidth: 1100, height: "100%", maxHeight: 760, background: theme.paper, boxShadow: "0 12px 56px rgba(0,0,0,0.2)", borderRadius: 4, overflow: "hidden" }}>
//           {/* Left Page */}
//           <div style={{ flex: 1, padding: `${PAGE_PAD_TOP}px ${PAGE_PAD_SIDE}px`, borderRight: `1px solid ${theme.rule}`, position: "relative" }}>
//              <div ref={contentRef} style={{ height: "100%", overflow: "hidden" }}>
//                 <p style={{ margin: 0, fontSize: settings.fontSize, fontFamily: settings.font, lineHeight: settings.lineHeight, textAlign: settings.alignment, color: theme.text }}>
//                   {allWords.slice(lRange[0], lRange[1]).map((w, i) => {
//                     const globalIdx = lRange[0] + i;
//                     const isActive = activeWordIdx === globalIdx;
//                     return (
//                       <span key={i} style={{ backgroundColor: isActive ? PLAYBACK_BG : "transparent", borderRadius: 4, padding: isActive ? "0 2px" : 0 }}>
//                         {settings.bdpqmwOn ? applyBdpqmw(w) : w}
//                       </span>
//                     );
//                   })}
//                 </p>
//              </div>
//              <div style={{ position: "absolute", bottom: 12, left: PAGE_PAD_SIDE, fontSize: 11, color: theme.text, opacity: 0.3 }}>{currentSpread + 1}</div>
//           </div>
//           <div style={{ width: BOOK_SPINE, background: theme.rule }} />
//           {/* Right Page */}
//           <div style={{ flex: 1, padding: `${PAGE_PAD_TOP}px ${PAGE_PAD_SIDE}px`, position: "relative" }}>
//             <div style={{ position: "absolute", top: 0, right: 30, zIndex: 10, cursor: "pointer" }} onClick={handleBookmark}>
//               <motion.div
//                 initial={{ y: -5 }}
//                 animate={isBookmarkAnimating ? { y: 680 } : { y: -5 }}
//                 transition={{ duration: 1.2, ease: "easeInOut" }}
//                 style={{ width: 26, height: 40, background: "#1D9E75", clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
//               >
//                 <Bookmark size={12} color="white" />
//               </motion.div>
//             </div>
//             <div style={{ height: "100%", overflow: "hidden" }}>
//                 <p style={{ margin: 0, fontSize: settings.fontSize, fontFamily: settings.font, lineHeight: settings.lineHeight, textAlign: settings.alignment, color: theme.text }}>
//                   {allWords.slice(rRange[0], rRange[1]).map((w, i) => {
//                     const globalIdx = rRange[0] + i;
//                     const isActive = activeWordIdx === globalIdx;
//                     return (
//                       <span key={i} style={{ backgroundColor: isActive ? PLAYBACK_BG : "transparent", borderRadius: 4, padding: isActive ? "0 2px" : 0 }}>
//                         {settings.bdpqmwOn ? applyBdpqmw(w) : w}
//                       </span>
//                     );
//                   })}
//                 </p>
//             </div>
//             <div style={{ position: "absolute", bottom: 12, right: PAGE_PAD_SIDE, fontSize: 11, color: theme.text, opacity: 0.3 }}>{currentSpread + 2}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const S: Record<string, React.CSSProperties> = {
//   uploadRoot: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE8DC", padding: 24 },
//   uploadCard: { background: "#FAF9F3", borderRadius: 24, padding: "48px 40px", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" },
//   uploadTitle: { fontSize: 32, fontWeight: 700, color: "#1D9E75", margin: 0 },
//   uploadSub: { fontSize: 14, color: "#5F5E5A", marginBottom: 32 },
//   dropzone: { border: "2px dashed #D3D1C7", borderRadius: 16, padding: "40px", cursor: "pointer", transition: "all 0.2s", marginBottom: 20 },
//   libraryItem: { display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", background: "#fff", borderRadius: 16, border: "1px solid #E2E1D8", cursor: "pointer", transition: "transform 0.15s" },
//   bookIcon: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 },
//   libraryText: { fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", textAlign: "center" },
//   spinner: { width: 24, height: 24, border: "3px solid #E1F5EE", borderTopColor: "#1D9E75", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }
// };


"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookOpen, 
  Upload, 
  RotateCcw,
  Play,
  Pause,
  Zap,
  AlignJustify,
  Type
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageData {
  page: number;
  content: string;
}

interface PDFResponse {
  filename: string;
  page_count: number;
  is_ocr_processed: boolean;
  data: PageData[];
}

interface Settings {
  font: string;
  fontSize: number;
  lineHeight: number;
  alignment: "left" | "justify";
  theme: Theme;
  pageStyle: "blank" | "ruled";
  bdpqmwOn: boolean;
  playbackOn: boolean;
  playbackWpm: number;
}

type Theme = "cream" | "mint" | "lavender" | "amber" | "dark";

interface SavedBook {
  id: string;
  filename: string;
  pdfData: PDFResponse;
  lastSpread: number;
  timestamp: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "oso_library_v1";
const BOOK_COLORS = ["#1D9E75", "#534AB7", "#D97706", "#DB2777", "#2563EB", "#059669"];

const FONTS = [
  { label: "Lexie",     value: "'Trebuchet MS', sans-serif" },
  { label: "Atkinson",  value: "'Gill Sans', 'Gill Sans MT', sans-serif" },
  { label: "Serif",     value: "Georgia, serif" },
  { label: "Mono",      value: "'Courier New', monospace" },
];

const THEMES: Record<Theme, { bg: string; paper: string; text: string; rule: string; name: string }> = {
  cream:    { bg: "#EDE8DC", paper: "#FAF9F3", text: "#2C2C2A", rule: "#E2DDD5", name: "Cream"    },
  mint:     { bg: "#C8EBE0", paper: "#E1F5EE", text: "#04342C", rule: "#B8DFD2", name: "Mint"     },
  lavender: { bg: "#D5D3F5", paper: "#EEEDFE", text: "#26215C", rule: "#C8C5EE", name: "Lavender" },
  amber:    { bg: "#F0D9A8", paper: "#FAEEDA", text: "#412402", rule: "#E8CFA0", name: "Amber"    },
  dark:     { bg: "#1A1A18", paper: "#2C2C2A", text: "#F1EFE8", rule: "#3A3A38", name: "Dark"     },
};

const LETTER_STYLE: Record<string, { bg: string; color: string }> = {
  b: { bg: "#B5D4F4", color: "#0C447C" },
  d: { bg: "#FAC775", color: "#412402" },
  p: { bg: "#CECBF6", color: "#26215C" },
  q: { bg: "#9FE1CB", color: "#04342C" },
  m: { bg: "#F4C0D1", color: "#4B1528" },
  w: { bg: "#C0DD97", color: "#173404" },
};

const PLAYBACK_BG = "rgba(29, 158, 117, 0.25)";
const PAGE_PAD_TOP = 36;
const PAGE_PAD_SIDE = 40;
const PAGE_PAD_BOTTOM = 28;
const BOOK_SPINE = 3;

const DEFAULT_SETTINGS: Settings = {
  font: FONTS[0].value,
  fontSize: 18,
  lineHeight: 2.2,
  alignment: "left",
  theme: "cream",
  pageStyle: "blank",
  bdpqmwOn: false,
  playbackOn: false,
  playbackWpm: 180,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean);
}

function applyBdpqmw(word: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const style = LETTER_STYLE[ch.toLowerCase()];
    if (style && "bdpqmw".includes(ch.toLowerCase())) {
      nodes.push(
        <span key={i} style={{ background: style.bg, color: style.color, borderRadius: 3, padding: "0 2px", fontWeight: 600, display: "inline-block", lineHeight: "inherit" }}>
          {ch}
        </span>
      );
    } else {
      nodes.push(ch);
    }
  }
  return nodes;
}

const getBookColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BOOK_COLORS[Math.abs(hash) % BOOK_COLORS.length];
};

// ─── Taskbar ──────────────────────────────────────────────────────────────────

const Taskbar: React.FC<{ 
  settings: Settings; 
  onChange: (s: Partial<Settings>) => void; 
  filename: string; 
  onReset: () => void;
  currentSpread: number;
  totalSpreads: number;
  onPageChange: (p: number) => void;
}> = ({ settings, onChange, filename, onReset, currentSpread, totalSpreads, onPageChange }) => {
  const t = THEMES[settings.theme];
  const Divider = () => <div style={{ width: 1, height: 24, background: t.rule, margin: "0 2px", flexShrink: 0 }} />;
  
  const Btn: React.FC<{ title: string; active?: boolean; onClick: () => void; children: React.ReactNode; accent?: string }> = ({ title, active, onClick, children, accent = "#1D9E75" }) => (
    <button title={title} onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "5px 8px", borderRadius: 6, border: active ? `1.5px solid ${accent}` : "1px solid transparent", background: active ? `${accent}20` : "transparent", color: active ? accent : t.text, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.12s", whiteSpace: "nowrap" }}>
      {children}
    </button>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 14px", background: t.paper, borderBottom: `1px solid ${t.rule}`, flexWrap: "wrap", userSelect: "none", flexShrink: 0, zIndex: 100 }}>
      <span style={{ fontSize: 12, color: t.text, opacity: 0.55, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📄 {filename}</span>
      <Divider />
      
      <select value={settings.font} onChange={(e) => onChange({ font: e.target.value })} style={{ fontSize: 12, padding: "4px 6px", borderRadius: 6, border: `1px solid ${t.rule}`, background: t.paper, color: t.text, cursor: "pointer" }}>
        {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>

      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Btn title="Decrease Font" onClick={() => onChange({ fontSize: Math.max(12, settings.fontSize - 1) })}>A-</Btn>
        <span style={{ fontSize: 12, minWidth: 22, textAlign: "center", color: t.text }}>{settings.fontSize}</span>
        <Btn title="Increase Font" onClick={() => onChange({ fontSize: Math.min(36, settings.fontSize + 1) })}>A+</Btn>
      </div>

      <Divider />
      <Btn title="Ruler Lines" active={settings.pageStyle === "ruled"} onClick={() => onChange({ pageStyle: settings.pageStyle === "ruled" ? "blank" : "ruled" })}>
        <AlignJustify size={14} />
      </Btn>

      <Divider />
      {(Object.keys(THEMES) as Theme[]).map((key) => (
        <div key={key} onClick={() => onChange({ theme: key })} style={{ width: 17, height: 17, borderRadius: "50%", background: THEMES[key].paper, cursor: "pointer", border: settings.theme === key ? "2px solid #1D9E75" : `1px solid ${t.rule}` }} />
      ))}

      <Divider />
      <Btn title="BDPQMW Highlight" active={settings.bdpqmwOn} onClick={() => onChange({ bdpqmwOn: !settings.bdpqmwOn })} accent="#534AB7">bdpqmw</Btn>
      
      <Divider />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Btn title={settings.playbackOn ? "Pause" : "Auto Play"} active={settings.playbackOn} onClick={() => onChange({ playbackOn: !settings.playbackOn })}>
          {settings.playbackOn ? <Pause size={14} /> : <Play size={14} />}
        </Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={12} color={t.text} style={{ opacity: 0.5 }} />
          <input type="range" min="60" max="400" step="10" value={settings.playbackWpm} onChange={(e) => onChange({ playbackWpm: parseInt(e.target.value) })} style={{ width: 50, cursor: "pointer", accentColor: "#1D9E75" }} />
          <span style={{ fontSize: 10, color: t.text, opacity: 0.6 }}>{settings.playbackWpm}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
        <Btn title="Prev" onClick={() => onPageChange(Math.max(0, currentSpread - 2))}><ChevronLeft size={16} /></Btn>
        <span style={{ fontSize: 11, fontWeight: 600, color: t.text, opacity: 0.7 }}>{currentSpread + 1} / {totalSpreads}</span>
        <Btn title="Next" onClick={() => onPageChange(Math.min(totalSpreads - 1, currentSpread + 2))}><ChevronRight size={16} /></Btn>
        <Divider />
        <Btn title="Reset" onClick={onReset}><RotateCcw size={14} /></Btn>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BookReader() {
  const [pdfData, setPdfData] = useState<PDFResponse | null>(null);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [virtualPages, setVirtualPages] = useState<number[]>([]);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false);
  const [library, setLibrary] = useState<SavedBook[]>([]);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLibrary(JSON.parse(saved));
  }, []);

  const allWords = useMemo(() => {
    if (!pdfData) return [];
    return tokenize(pdfData.data.map((p) => p.content).join("\n\n"));
  }, [pdfData]);

  // Playback Logic
  useEffect(() => {
    if (settings.playbackOn) {
      const spreadStart = virtualPages[currentSpread] || 0;
      const spreadEnd = virtualPages[currentSpread + 2] || allWords.length;
      if (activeWordIdx === null || activeWordIdx < spreadStart || activeWordIdx >= spreadEnd) setActiveWordIdx(spreadStart);
      
      playbackRef.current = setInterval(() => {
        setActiveWordIdx(prev => {
          if (prev === null) return spreadStart;
          const next = prev + 1;
          if (next >= spreadEnd) {
            if (currentSpread + 2 < virtualPages.length) { setCurrentSpread(c => c + 2); return next; }
            setSettings(s => ({ ...s, playbackOn: false })); return prev;
          }
          return /^\s+$/.test(allWords[next]) ? next + 1 : next;
        });
      }, (60 / settings.playbackWpm) * 1000);
    } else {
      if (playbackRef.current) clearInterval(playbackRef.current);
      setActiveWordIdx(null);
    }
    return () => { if (playbackRef.current) clearInterval(playbackRef.current); };
  }, [settings.playbackOn, settings.playbackWpm, currentSpread, virtualPages, allWords]);

  // Pagination
  const paginate = useCallback(() => {
    if (allWords.length === 0 || !contentRef.current) return;
    const r = contentRef.current.getBoundingClientRect();
    const pageW = Math.floor(r.width);
    const pageH = Math.floor(r.height);
    if (pageW <= 20 || pageH <= 20) return;

    const ruler = document.createElement("div");
    ruler.style.cssText = `position:fixed;top:-9999px;width:${pageW}px;font-size:${settings.fontSize}px;font-family:${settings.font};line-height:${settings.lineHeight};text-align:${settings.alignment};word-break:break-word;white-space:pre-wrap;visibility:hidden;`;
    document.body.appendChild(ruler);

    const pages: number[] = [0];
    let acc = "";
    for (let i = 0; i < allWords.length; i++) {
      const candidate = acc + allWords[i];
      ruler.textContent = candidate;
      if (ruler.scrollHeight > pageH && acc.length > 0) {
        pages.push(i); acc = allWords[i];
      } else acc = candidate;
    }
    document.body.removeChild(ruler);
    setVirtualPages(pages);
  }, [allWords, settings.fontSize, settings.font, settings.lineHeight, settings.alignment]);

  useEffect(() => { paginate(); }, [paginate]);

  const handleFile = async (file: File) => {
    setLoading(true);
    const form = new FormData(); form.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/process-pdf", { method: "POST", body: form });
      const json: PDFResponse = await res.json();
      const newId = crypto.randomUUID();
      const newBook: SavedBook = { id: newId, filename: file.name, pdfData: json, lastSpread: 0, timestamp: Date.now() };
      const updated = [newBook, ...library.filter(b => b.filename !== file.name)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setLibrary(updated); setPdfData(json); setCurrentBookId(newId); setCurrentSpread(0);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleBookmark = () => {
    if (!currentBookId) return;
    setIsBookmarkAnimating(true);
    const updated = library.map(b => b.id === currentBookId ? { ...b, lastSpread: currentSpread, timestamp: Date.now() } : b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLibrary(updated);
    setTimeout(() => setIsBookmarkAnimating(false), 1500);
  };

  const theme = THEMES[settings.theme];
  const lRange = [virtualPages[currentSpread] || 0, virtualPages[currentSpread + 1] || allWords.length];
  const rRange = [virtualPages[currentSpread + 1] || allWords.length, virtualPages[currentSpread + 2] || allWords.length];

  if (!pdfData) return (
    <div style={S.uploadRoot}>
      <div style={S.uploadCard}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🐻</div>
        <h1 style={S.uploadTitle}>oso</h1>
        <p style={S.uploadSub}>Reading without barriers</p>
        <div style={S.dropzone} onClick={() => !loading && document.getElementById("pdf-up")?.click()}>
          <input id="pdf-up" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          {loading ? <div style={S.spinner} /> : (
            <><Upload size={32} color="#1D9E75" style={{ marginBottom: 12 }} /><p style={{ fontSize: 14, fontWeight: 500 }}>Click to upload PDF</p></>
          )}
        </div>
        {library.length > 0 && (
          <div style={{ marginTop: 40, textAlign: "left" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", marginBottom: 16 }}>Library Rack</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 16 }}>
              {library.map(book => {
                const color = getBookColor(book.filename);
                return (
                  <div key={book.id} onClick={() => { setPdfData(book.pdfData); setCurrentBookId(book.id); setCurrentSpread(book.lastSpread); }} style={S.libraryItem}>
                    <div style={{ ...S.bookIcon, backgroundColor: `${color}15`, color }}><BookOpen size={20} /></div>
                    <span style={S.libraryText}>{book.filename}</span>
                    <p style={{ fontSize: 10, color: "#888780", marginTop: 4 }}>Last: Page {book.lastSpread + 1}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const RulerLines = () => (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, 
      backgroundImage: `linear-gradient(${theme.rule} 1px, transparent 1px)`, 
      backgroundSize: `100% ${settings.lineHeight * settings.fontSize}px`,
      backgroundPosition: `0 ${PAGE_PAD_TOP + 4}px`, opacity: 0.6
    }} />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: theme.bg }}>
      <Taskbar settings={settings} onChange={(s) => setSettings(p => ({ ...p, ...s }))} filename={pdfData.filename} onReset={() => setPdfData(null)} currentSpread={currentSpread} totalSpreads={virtualPages.length} onPageChange={setCurrentSpread} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px" }}>
        <div style={{ display: "flex", position: "relative", width: "100%", maxWidth: 1100, height: "100%", maxHeight: 760, background: theme.paper, boxShadow: "0 12px 56px rgba(0,0,0,0.2)", borderRadius: 4, overflow: "hidden" }}>
          
          {/* Left Page */}
          <div style={{ flex: 1, padding: `${PAGE_PAD_TOP}px ${PAGE_PAD_SIDE}px`, borderRight: `1px solid ${theme.rule}`, position: "relative" }}>
             {settings.pageStyle === "ruled" && <RulerLines />}
             <div ref={contentRef} style={{ height: "100%", overflow: "hidden", position: "relative", zIndex: 1 }}>
                <p style={{ margin: 0, fontSize: settings.fontSize, fontFamily: settings.font, lineHeight: settings.lineHeight, textAlign: settings.alignment, color: theme.text }}>
                  {allWords.slice(lRange[0], lRange[1]).map((w, i) => {
                    const active = activeWordIdx === lRange[0] + i;
                    return <span key={i} style={{ backgroundColor: active ? PLAYBACK_BG : "transparent", borderRadius: 4 }}>{settings.bdpqmwOn ? applyBdpqmw(w) : w}</span>;
                  })}
                </p>
             </div>
             <div style={{ position: "absolute", bottom: 12, left: PAGE_PAD_SIDE, fontSize: 11, color: theme.text, opacity: 0.3 }}>{currentSpread + 1}</div>
          </div>

          <div style={{ width: BOOK_SPINE, background: theme.rule }} />

          {/* Right Page */}
          <div style={{ flex: 1, padding: `${PAGE_PAD_TOP}px ${PAGE_PAD_SIDE}px`, position: "relative" }}>
            {settings.pageStyle === "ruled" && <RulerLines />}
            <div style={{ position: "absolute", top: 0, right: 30, zIndex: 10, cursor: "pointer" }} onClick={handleBookmark}>
              <motion.div initial={{ y: -5 }} animate={isBookmarkAnimating ? { y: 680 } : { y: -5 }} transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ width: 26, height: 40, background: "#1D9E75", clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                <Bookmark size={12} color="white" />
              </motion.div>
            </div>
            <div style={{ height: "100%", overflow: "hidden", position: "relative", zIndex: 1 }}>
                <p style={{ margin: 0, fontSize: settings.fontSize, fontFamily: settings.font, lineHeight: settings.lineHeight, textAlign: settings.alignment, color: theme.text }}>
                  {allWords.slice(rRange[0], rRange[1]).map((w, i) => {
                    const active = activeWordIdx === rRange[0] + i;
                    return <span key={i} style={{ backgroundColor: active ? PLAYBACK_BG : "transparent", borderRadius: 4 }}>{settings.bdpqmwOn ? applyBdpqmw(w) : w}</span>;
                  })}
                </p>
            </div>
            <div style={{ position: "absolute", bottom: 12, right: PAGE_PAD_SIDE, fontSize: 11, color: theme.text, opacity: 0.3 }}>{currentSpread + 2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  uploadRoot: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE8DC", padding: 24 },
  uploadCard: { background: "#FAF9F3", borderRadius: 24, padding: "48px 40px", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" },
  uploadTitle: { fontSize: 32, fontWeight: 700, color: "#1D9E75", margin: 0 },
  uploadSub: { fontSize: 14, color: "#5F5E5A", marginBottom: 32 },
  dropzone: { border: "2px dashed #D3D1C7", borderRadius: 16, padding: "40px", cursor: "pointer", transition: "all 0.2s", marginBottom: 20 },
  libraryItem: { display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", background: "#fff", borderRadius: 16, border: "1px solid #E2E1D8", cursor: "pointer" },
  bookIcon: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  libraryText: { fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", textAlign: "center" },
  spinner: { width: 24, height: 24, border: "3px solid #E1F5EE", borderTopColor: "#1D9E75", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }
};