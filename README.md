# OSO – Neurodivergent Reader Platform

A **full diagnostic-to-intervention pipeline** for neurodivergent learners combining a personalized reading platform, browser extension, and AI diagnostics.

```
Diagnose → Profile → Personalised Reader → Track Progress
```

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Browser Extension Setup](#browser-extension-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Dependencies & Tools](#dependencies--tools)
- [Key Features](#key-features)
- [Team & Roles](#team--roles)

---

## 🎯 Project Overview

OSO is a **non-diagnostic screener** that transforms how neurodivergent learners (particularly those with dyslexia, ADHD, visual stress, and auditory processing disorders) interact with digital text.

### The Pipeline

| Phase | Component | Purpose |
|-------|-----------|---------|
| **Diagnosis** | Web Screener | Validated self-assessment based on EDS, Conners Rating Scale, CTOPP-2 |
| **Profiling** | Assessment Results | Generate personalized reading profile (not a diagnosis) |
| **Intervention** | Reading Platform | Auto-configure reader with optimal accessibility settings |
| **Tracking** | Session Analytics | Measure WPM, heatmaps, and reading fluency over time |

### What Users Get

- **Personalized Reader** with configurable modes (RSVP, Karaoke, Heatmap)
- **Dyslexia-Optimized Features**: OpenDyslexic font, bdpq highlighting, bionic reading
- **ADHD Modes**: Focus mode, speed control, karaoke TTS with sync
- **Visual Stress Relief**: Pastel overlays, high contrast, custom line spacing
- **Browser Extension**: Transform social media into calm, neurodivergent-friendly spaces

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js + React)                    │
│  • Reading Dashboard    • Screener UI    • Progress Tracking    │
│  • Page Flip Interface  • Session Manager                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP / REST API
┌──────────────────────┴──────────────────────────────────────────┐
│               Backend API (FastAPI + Python)                    │
│  • PDF Processing (PyMuPDF + Tesseract OCR)                     │
│  • Session Metrics & Heatmaps                                   │
│  • Screener Logic & Profile Generation                          │
│  • Reader Configuration                                         │
└─────────────────────────────────────────────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────────────────────┐
│         Browser Extension (Manifest V2 + JavaScript)            │
│  • Social Media Transformation                                  │
│  • OpenDyslexic Font Injection                                  │
│  • Pastel Themes & Focus Modes                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **npm or yarn** (for frontend)
- **Tesseract OCR** (optional, for scanned PDF support)
- **Google Chrome** (for extension)

### One-Command Setup (macOS/Linux)

```bash
# 1. Clone and navigate
cd /Users/binayak/Desktop/nepal-us

# 2. Backend setup
cd backend
python3.11 -m venv env
source env/bin/activate
pip install -r requirements.txt

# 3. Frontend setup (in another terminal)
cd frontend
npm install

# 4. Run both (in separate terminals)
# Terminal 1 - Backend
cd backend && source env/bin/activate && uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev

# 5. Load extension
# Chrome → chrome://extensions → Enable Developer Mode → Load unpacked → select `extension/oso-extension 3`
```

---

## 🔧 Backend Setup

### Installation

```bash
cd backend
python3.11 -m venv env

# macOS/Linux
source env/bin/activate

# Windows
env\Scripts\activate

pip install -r requirements.txt
```

### Install Tesseract (Optional - for OCR)

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**Windows:**
Download from: https://github.com/UB-Mannheim/tesseract/wiki

### Run Backend

```bash
# Development (with auto-reload)
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Backend Environment Variables

Create a `.env` file in the `backend/` directory (optional):

```env
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=northeurope
```

---

## 🎨 Frontend Setup

### Installation

```bash
cd frontend
npm install
# or
yarn install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   ├── dashboard/page.tsx       # User dashboard
│   │   ├── achievement/page.tsx    # Achievements page
│   │   ├── progress/page.tsx        # Progress tracking
│   │   ├── reading-studio/page.tsx # Main reader interface
│   │   └── tracer/page.tsx          # Analytics/heatmap view
│   ├── components/
│   │   ├── LibraryRack.tsx          # Book library display
│   │   ├── Navbar.tsx               # Navigation component
│   │   ├── game/
│   │   │   ├── AchievementBadge.tsx
│   │   │   ├── DailyGoalring.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── SessionFeedback.tsx
│   │   │   ├── SoftProfileCard.tsx
│   │   │   ├── StreakCard.tsx
│   │   │   └── XPBar.tsx
│   ├── context/                     # React contexts
│   └── lib/
│       ├── GameProvider.tsx         # Game state provider
│       ├── gameStore.ts             # Game state management
│       ├── storage.ts               # Local storage utilities
│       └── useReadingSession.ts    # Reading session hook
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🧩 Browser Extension Setup

### Installation (Developer Mode)

1. Navigate to the extension folder:
   ```bash
   cd extension/oso-extension\ 3
   ```

2. Open Chrome: `chrome://extensions`

3. Enable **Developer Mode** (top-right toggle)

4. Click **"Load unpacked"**

5. Select the `oso-extension 3` folder

6. Pin OSO to your extensions bar

### Supported Sites

- ✅ Facebook
- 🔜 Twitter / X
- 🔜 Instagram
- 🔜 Reddit
- 🔜 YouTube

### Extension Features

| Feature | Purpose |
|---------|---------|
| **OpenDyslexic Font** | Atkinson Hyperlegible font replaces all text |
| **Letter Anchor (bdpq)** | Color highlights prevent letter confusion |
| **Bento Layout** | Converts feeds to spaced, card-based grids |
| **Pastel Theme** | Soft backgrounds reduce visual noise |
| **Reading Ease Slider** | Adjusts spacing and line-height |
| **Focus Mode** | Dims all posts except hovered one |
| **Reading Ruler** | Horizontal highlight bar follows cursor |
| **Reduce Animations** | Disables auto-play videos and GIFs |
| **Hide Distractions** | Removes ads, sidebars, stories |

### Extension Architecture

```
manifest.json           # Chrome extension manifest (v2)
├── popup.html/js      # Extension popup UI
├── background.js      # Background service worker
├── content.js         # DOM injection & event listeners
├── sidebar.js         # Reading ruler & focus mode
├── oso-styles.css     # Content script styles
└── icons/             # Extension icons (16, 32, 48, 128px)
```

---

## 📂 Project Structure

```
nepal-us/
├── README.md                          # This file
├── project-description.md             # Original project specification
├── backend/
│   ├── main.py                        # FastAPI app + routes
│   ├── requirements.txt                # Python dependencies
│   ├── neuro-read-94636a7fba90.json   # Firebase/Google Cloud credentials
│   ├── README.md                      # Backend-specific docs
│   └── env/                           # Virtual environment (git-ignored)
├── frontend/
│   ├── package.json                   # npm dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── next.config.ts                 # Next.js config
│   ├── tailwind.config.ts             # Tailwind CSS config
│   ├── eslint.config.mjs              # ESLint config
│   ├── src/
│   │   ├── app/                      # Next.js App Router pages
│   │   ├── components/               # Reusable React components
│   │   ├── context/                  # React Context files
│   │   └── lib/                      # Utilities & hooks
│   ├── public/                        # Static assets
│   ├── README.md                      # Frontend-specific docs
│   └── AGENTS.md                      # LLM agent guidelines
└── extension/
    └── oso-extension 3/
        ├── manifest.json              # Chrome extension manifest
        ├── popup.html/js              # Popup UI
        ├── background.js              # Event handlers
        ├── content.js                 # DOM manipulation
        ├── sidebar.js                 # Additional UI
        ├── oso-styles.css             # Styles
        ├── icons/                     # Extension icons
        └── README.md                  # Extension docs
```

---

## 🔌 API Endpoints

### Health Check

```bash
GET /health
```

Response: `{"status": "ok"}`

### PDF Processing

```bash
POST /process-pdf
```

**Parameters:**
- `file` (FormData): PDF file to process
- `ocr_if_scanned` (query, optional): Force OCR on scanned PDFs (default: false)
- `max_pages` (query, optional): Limit pages to process (default: all)

**Example:**
```bash
curl -X POST "http://localhost:8000/process-pdf?ocr_if_scanned=true" \
  -F "file=@book.pdf"
```

**Response:**
```json
{
  "filename": "book.pdf",
  "page_count": 5,
  "scanned_pages": [1, 2],
  "data": [
    {
      "page": 1,
      "content": "Chapter 1 text...",
      "source": "pdf_text" | "ocr"
    }
  ]
}
```

### Screener Questions

```bash
GET /screener/questions
```

Returns non-diagnostic screening prompts for:
- Dyslexia (letter reversal, rapid naming, phonological awareness)
- ADHD (focus, attention span, impulsivity)
- Visual stress (visual comfort, crowding sensitivity)
- Auditory processing (sound discrimination)

**Response:**
```json
[
  {
    "id": "dyslexia_bdpq",
    "category": "dyslexia",
    "question": "Do you sometimes confuse letters like b/d, p/q?",
    "scale": "1-5 Likert"
  }
]
```

### Screener Submission

```bash
POST /screener/submit
Content-Type: application/json
```

**Body:**
```json
{
  "answers": [
    {"id": "dyslexia_bdpq", "score": 5},
    {"id": "adhd_focus", "score": 4},
    {"id": "irlen_visual", "score": 2}
  ]
}
```

**Response:**
```json
{
  "profile": "dyslexia_dominant",
  "scores": {
    "dyslexia": 78,
    "adhd": 65,
    "irlen_visual_stress": 35,
    "apd_auditory": 20
  },
  "recommendations": [
    "OpenDyslexic font",
    "bdpq highlighting",
    "Bionic reading mode",
    "Karaoke TTS"
  ],
  "reader_config": {
    "font_family": "OpenDyslexic",
    "highlight_bdpq": true,
    "bionic_reading": true,
    "tts_enabled": true,
    "focus_mode": true,
    "line_height": 1.8
  }
}
```

### Reader Configuration

```bash
GET /reader/config?dyslexia=70&adhd=40&irlen=20
```

**Query Parameters (0-100 scores):**
- `dyslexia` (optional)
- `adhd` (optional)
- `irlen` (optional, visual stress)
- `apd` (optional, auditory processing)

**Response:**
```json
{
  "display": {
    "font_family": "OpenDyslexic",
    "font_size": 18,
    "line_height": 1.8,
    "letter_spacing": 2,
    "word_spacing": 1.5,
    "color_scheme": "cream"
  },
  "reading_modes": {
    "rsvp": {
      "enabled": true,
      "default_wpm": 150,
      "min_wpm": 50,
      "max_wpm": 400
    },
    "karaoke": {
      "enabled": true,
      "tts_enabled": true,
      "highlight_sync": true
    },
    "heatmap": {
      "enabled": true,
      "show_per_paragraph": true
    }
  },
  "accessibility": {
    "highlight_bdpq": true,
    "focus_mode": true,
    "reading_ruler": true,
    "pastel_background": "cream"
  }
}
```

### Session Metrics

```bash
POST /sessions/metrics
Content-Type: application/json
```

**Body:**
```json
{
  "paragraphs": [
    {
      "paragraph_id": "p1",
      "word_count": 120,
      "duration_ms": 60000
    },
    {
      "paragraph_id": "p2",
      "word_count": 90,
      "duration_ms": 90000
    }
  ]
}
```

**Response:**
```json
{
  "overall_wpm": 186.67,
  "average_wpm": 160,
  "variance": 12.5,
  "heatmap": [
    {
      "paragraph_id": "p1",
      "wpm": 120,
      "fluency": "fluent",
      "color": "green"
    },
    {
      "paragraph_id": "p2",
      "wpm": 60,
      "fluency": "slow",
      "color": "red"
    }
  ]
}
```

---

## 📦 Dependencies & Tools

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **FastAPI** | 0.110.0 | Web framework |
| **Uvicorn** | Latest | ASGI server |
| **PyMuPDF (fitz)** | Latest | PDF text extraction |
| **Tesseract/Pytesseract** | Latest | OCR for scanned PDFs |
| **Pillow** | 10.3.0 | Image processing |
| **pdf2image** | 1.17.0 | PDF to image conversion |
| **python-dotenv** | 0.9.9 | Environment variables |
| **CORS Middleware** | Built-in | Cross-origin support |

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **Next.js** | 16.2.1 | React framework |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Styling |
| **Axios** | ^1.14.0 | HTTP client |
| **Framer Motion** | ^12.38.0 | Animations |
| **Lucide React** | ^1.7.0 | Icon library |
| **React Icons** | ^5.6.0 | Icon library |
| **React PageFlip** | ^2.0.3 | Page flip effect |
| **Classnames** | ^2.5.1 | Dynamic CSS classes |

### Extension Dependencies

| Tool | Purpose |
|------|---------|
| **Manifest V2** | Chrome extension configuration |
| **Content Scripts** | DOM injection and manipulation |
| **CSS Injection** | Dynamic style application |
| **localStorage API** | User preference persistence |

### Server & Deployment Tools

| Tool | Usage |
|------|-------|
| **Uvicorn** | Backend ASGI server |
| **Node/npm** | Frontend package management |
| **Vercel** (optional) | Frontend deployment |
| **Heroku/Railway** (optional) | Backend deployment |

---

## ✨ Key Features

### 1. **Diagnostic Screener**
- Non-diagnostic, validated questionnaire
- Covers: Dyslexia, ADHD, Visual Stress (Irlen), APD
- Generates personalized reading profile

### 2. **Reading Modes**

**RSVP (Rapid Serial Visual Presentation)**
- Words flash one-at-a-time at center
- Eliminates line-tracking difficulty
- Adjustable WPM (50–400)
- Perfect for severe dyslexia

**Karaoke TTS**
- Full page visible with word-by-word highlight
- Text-to-speech synced with highlight
- Supports Web Speech API and Azure cognitive services
- Velocity logging per word

**Heatmap**
- Post-session visualization
- Red (slow/struggled) → Yellow (moderate) → Green (fluent)
- Identifies struggling areas

### 3. **Accessibility**

| Feature | Benefit |
|---------|---------|
| **OpenDyslexic Font** | Reduces letter confusion |
| **bdpq Highlighting** | Consistent color for confusion letters |
| **Pastel Themes** | Reduces visual stress |
| **Line Height/Spacing** | Configurable for visual comfort |
| **Focus Mode** | Hide distractions, show one paragraph |
| **Reading Ruler** | Horizontal guide for tracking |
| **Dark Mode** | For light sensitivity |

### 4. **Progress Tracking**
- Session metrics (WPM, fluency)
- Reading journey visualization
- Achievement & streak badges
- Daily goal tracking

### 5. **Browser Extension**
- Transform social media into calm, neurodivergent-friendly spaces
- Font substitution
- Layout simplification
- Animation control
- Distraction removal

---

## 👥 Team & Roles

| Role | Responsibility | Notes |
|------|-----------------|-------|
| **Product Lead** | Project vision, user research, accessibility compliance | Ensures non-diagnostic framing |
| **Backend Engineer** | FastAPI API, PDF processing, screener logic, database integration | Python/FastAPI stack |
| **Frontend Engineer** | React/Next.js UI, reading interface, dashboard, state management | TypeScript, Tailwind CSS |
| **Extension Developer** | Chrome extension, social media integration, DOM manipulation | JavaScript, Manifest V2 |
| **ML/AI Engineer** | Screener validation, reading profile optimization, progress prediction | Optional: advanced analytics |
| **Designer/UX** | Accessibility design, pastel themes, user testing with neurodivergent users | Critical for compliance |
| **QA/Testing** | Cross-browser testing, accessibility audits (WCAG 2.1), performance testing | NVDA/JAWS testing |
| **DevOps/Infra** | Deployment, monitoring, scaling, data privacy/compliance | HIPAA/GDPR considerations |

---

## 🔒 Privacy & Legal

- **Non-diagnostic**: Platform screens, not diagnoses
- **Data Privacy**: No health records stored; only reading metrics
- **GDPR/CCPA**: Honor user privacy requests
- **Accessibility**: WCAG 2.1 AA compliance target
- **Credentials**: Use `.env` files for sensitive keys (never commit)

---

## 🐛 Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'fitz'"**
```bash
pip install PyMuPDF
```

**"Tesseract is not installed"** (OCR errors)
```bash
# macOS
brew install tesseract

# Ubuntu
sudo apt-get install tesseract-ocr
```

**CORS errors**
- Backend CORS middleware configured for `*`
- If issues persist, check backend is running on `localhost:8000`

### Frontend Issues

**"Cannot find module '@tailwindcss/postcss'"**
```bash
npm install
```

**Port 3000 already in use**
```bash
npm run dev -- -p 3001
```

### Extension Issues

**Extension not loading**
1. Verify `chrome://extensions` → Developer Mode is ON
2. Check manifest.json syntax
3. Reload extension (circular arrow icon)

**Content scripts not injecting**
1. Verify site is in `permissions` list
2. Refresh page after loading extension
3. Check browser console for errors

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Chrome Extension Guide](https://developer.chrome.com/docs/extensions/)
- [OpenDyslexic Font](https://opendyslexic.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📝 License

[Add your license information here]

---

## 📞 Support

For issues or questions:
- Check existing documentation in [project-description.md](project-description.md)
- Review backend [backend/README.md](backend/README.md)
- Check frontend [frontend/README.md](frontend/README.md)
- Open an issue with details about your setup

---

**Last Updated:** March 2026  
**Status:** Active Development
