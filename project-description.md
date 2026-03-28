# Neurodivergent Reader Platform
### A Diagnostic-to-Intervention Pipeline for Neurodivergent Learners

---

## What This Becomes

Not just a reader. A **full diagnostic-to-intervention pipeline** for neurodivergent learners. That's a meaningfully different product from anything currently on the market at this scope.

```
Diagnose → Profile → Personalised Reader → Track Progress
```

---

## The Walkthrough

### Step 1 — Diagnosis (Screener)

This is the most important and most dangerous part of the entire product.

**What the platform can do:**
A screener — not a clinical diagnosis. The platform is not a medical service and cannot claim to diagnose. What it provides is a **validated self-assessment screener** based on established tools like:

- EDS (Dyslexia Screener)
- Conners Rating Scale (ADHD)
- CTOPP-2 patterns (phonological awareness)

Present it as *"understand how you read"* — not *"find out if you have dyslexia."* That framing also removes the stigma barrier immediately.

**What the screener tests:**

| Test | What It Catches |
|---|---|
| Letter reversal recognition | Dyslexia |
| Rapid symbol naming speed | Dyslexia, Processing disorders |
| Reading a cluttered paragraph | Irlen Syndrome, Visual stress |
| Attention during a timed read | ADHD |
| Number sequence recall | Dyscalculia |
| Sound-to-text matching | APD |

**Output:** Not a diagnosis label. A **reading profile** — e.g. *"You show strong visual stress patterns and moderate phonological difficulty"* — which then configures the reader automatically.

---

### Step 2 — Personalised Reader Configuration

Based on screener output, the platform auto-sets:

| Profile Detected | Auto-configured Settings |
|---|---|
| Dyslexia dominant | OpenDyslexic font, bdpq highlight, bionic reading, karaoke TTS |
| ADHD dominant | Karaoke TTS, focus mode (hides everything except current line), speed controller |
| Irlen Syndrome | Pastel overlay, high contrast mode, increased line spacing |
| APD | Visual-first mode, larger word highlights, reduced TTS reliance |
| Mixed profile | Combination of above, user can fine-tune |

> Students can always override manually. The screener removes the configuration burden upfront.

---

### Step 3 — Reader Features

#### Letter Per Second Presentation (RSVP)
**Rapid Serial Visual Presentation** — words or letters flash one at a time in a fixed central position. Eliminates line-tracking difficulty entirely. Slider controls the flash rate.

#### Word Per Second with Tracking
Standard karaoke mode with velocity logging per word. Slider controls TTS rate and highlight speed in sync.

**Mode comparison:**

| Mode | Best For | Mechanism |
|---|---|---|
| Letter/second (RSVP) | Severe dyslexia, line tracking issues | One word at a time, centre screen |
| Word/second Karaoke | Mild dyslexia, ADHD, general use | Full page visible, word highlighted |

#### Heatmap
Post-session overlay showing reading performance per paragraph:
- 🔴 Red — slow / struggled
- 🟡 Yellow — moderate
- 🟢 Green — fluent

Works across both RSVP and Karaoke modes since timestamps are tracked either way.

#### Karaoke TTS + Word Highlight
Core mechanic. Built on Web Speech API (`SpeechSynthesis` + `onboundary` events) with span-level DOM highlighting synced to speech in real time.

#### Pastel Background UI
Clinically informed colour themes to reduce visual stress:

| Colour | Best For |
|---|---|
| Cream / soft yellow | Most universally effective |
| Pale blue | Common Irlen Syndrome preference |
| Soft peach | High contrast without harshness |
| Dark mode | Severe light sensitivity |

#### bdpq Highlighting
Colour-code the four confusion letters **consistently throughout the entire text:**

- **b** → Blue
- **d** → Red
- **p** → Purple
- **q** → Green

Consistent colour mapping builds muscle memory over time.

---

## Full Product Flow

```
Landing → Screener (5 mins)
        ↓
Reading Profile Generated
        ↓
Upload PDF / Open Extension on any webpage
        ↓
Reader auto-configured for your profile
        ↓
Choose mode: RSVP or Karaoke
        ↓
Read with TTS + Highlight + Speed Control
        ↓
Session ends → Heatmap generated
        ↓
Dashboard: velocity trend, improvement over time
        ↓
Profile refines itself with each session
```

---

## Learning Tracker — What the Data Builds Into

| Data Point | Source | Insight |
|---|---|---|
| WPM per paragraph | Word timestamps | Where text is too hard |
| Pause clusters | Event gaps | Confusion hotspots |
| Re-listen frequency | Replay events | Vocabulary gaps |
| Speed slider usage | Controller events | Cognitive load curve |
| Session completion | Last word index | Engagement / fatigue |
| Cross-session WPM trend | Historical data | Measurable improvement over time |

Over multiple sessions this becomes a **student reading profile** — actionable for teachers (B2B) and motivating for students (B2C).

---

## Browser Extension

**Purpose:** Bring the same reading layer to *any* webpage, article, or online content — school portals, Wikipedia, news articles, online assignments — without uploading anything.

**Features:**
- Activate on any webpage with one click
- Word-level TTS highlight playback
- Font swap to OpenDyslexic injected via content script
- Letter spacing / background overlay controls
- bdpq highlight mode
- Speed controller (WPM slider)
- Syncs settings with main platform account if logged in

**Tech:** Chrome Extension (Manifest V3) — also covers Edge. Firefox port post-hackathon.

**Funnel role:** The extension is the **free acquisition layer** — students discover it for free on any webpage, then upgrade to the full platform for PDF uploads and deep tracking.

---

## Cognitive Disabilities Covered

| Disability | Core Challenge | Features That Help |
|---|---|---|
| Dyslexia | Letter/word confusion, line tracking | OpenDyslexic font, bdpq highlight, RSVP, karaoke TTS |
| ADHD | Sustained attention | Focus mode, karaoke anchor, speed control |
| Irlen Syndrome | Visual stress from white pages | Pastel overlays, dark mode |
| Auditory Processing Disorder (APD) | Misprocesses heard content | Visual-first mode, large word highlights |
| Dyscalculia | Number/symbol confusion | Screener detection, future module |
| Working Memory Deficits | Loses sentence context | Chunked TTS, slowed playback |
| Hyperlexia | Reads fast, comprehends little | Velocity + quiz discrepancy flag |

---

## Business Model

| Layer | Customer | Hook |
|---|---|---|
| Platform subscription | Schools, tutoring centers (B2B) | Teacher dashboard, student profiles, bulk upload |
| Individual subscription | Students, parents (B2C) | Private, no diagnosis needed, instant access |
| Extension | Freemium acquisition | Free with limits, unlocks full features with account |

---

## Problem Statement Fit

### Statement 1 — Burnout & Career Pressure
Dyslexic students spend **3–4× longer** on the same reading tasks as their peers. That's a direct, compounding source of academic burnout. The speed controller and karaoke reader reduce that friction. The heatmap shows students *where* they struggle — removing the anxiety of not knowing why studying feels hard.

> *"Your brain works differently, not deficiently."*

### Statement 2 — Stigma in Conservative Communities
No diagnosis required. No teacher referral. No label shared with anyone. A student privately uploads their textbook or activates the extension — and reads on their own terms. In households where seeking a dyslexia diagnosis carries shame, this is the only realistic path to getting support.

> *"The tool works invisibly — which is exactly what a student in a stigma-heavy environment needs."*

---

## Hackathon Demo Path

```
1. Open a real textbook PDF → upload it live
2. Show raw PDF vs transformed HTML reader side by side
3. Hit play — karaoke highlighting kicks in
4. Slow the speed slider down live
5. End the session → show the reading heatmap
6. Switch to browser extension → open Wikipedia
7. One click → same experience on a live webpage
```

---

## Build Priority

### Hackathon (Ship These)
- PDF upload + text extraction (PyMuPDF / pdfplumber)
- Word-wrapped HTML renderer
- TTS playback with word-level highlight
- Speed controller (rate slider)
- OpenDyslexic font toggle
- Letter spacing / line height controls
- bdpq confusion highlights
- Pastel background theme switcher
- WPM calculation per paragraph
- Post-session heatmap
- Basic screener (dyslexia + ADHD profiles only)

### Post-Hackathon (Defer)
- OCR for scanned PDFs
- Syllable colour-banding
- Multi-user / teacher accounts
- Firefox extension port
- Full analytics dashboard
- FERPA / GDPR compliance layer
- Mobile app
- Remaining disability profiles (APD, Irlen, Dyscalculia)

---

## Key Constraints to Watch

- **Screener framing:** Always present as *"This is not a clinical diagnosis. It helps personalise your reading experience."*
- **Web Speech API:** `onboundary` event reliability varies across browsers. Test on Chrome specifically. Have an ElevenLabs fallback ready.
- **PDF text extraction order:** Not guaranteed on multi-column layouts. Test 3–4 real textbook PDFs before demo day and pick one that extracts cleanly.
- **RSVP mode:** Add a photosensitivity warning before enabling. Default to a gentle starting speed.
- **Extension scope:** Lightweight, client-side only. No backend call needed for core features.

---

*Built for the way some brains actually read.*
