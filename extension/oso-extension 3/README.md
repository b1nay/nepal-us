# OSO – Dyslexia & ADHD Friendly Web Extension

OSO transforms social media into a calm, accessible experience built for dyslexic and ADHD minds.

---

## ✨ Features

| Feature | What it does |
|---|---|
| **OpenDyslexic Font** | Replaces all page text with Atkinson Hyperlegible (dyslexia-optimised) |
| **Letter Anchor** | Highlights `b d p q` in a warm color to prevent letter confusion |
| **Bento Layout** | Converts chaotic feeds into spaced, card-based grid layouts |
| **Pastel Theme** | Applies rotating soft pastel backgrounds to posts — reduces visual noise |
| **Reading Ease Slider** | Adjusts letter-spacing, line-height, and word-spacing |
| **Focus Mode** | Dims all posts except the one you hover over |
| **Reading Ruler** | A horizontal highlight bar that follows your cursor |
| **Reduce Animations** | Stops auto-playing videos and GIF animations |
| **Hide Distractions** | Removes ads, sidebars, Stories, and Sponsored content |

---

## 🚀 Installation (Developer Mode)

1. Download or clone this folder
2. Open Chrome → `chrome://extensions`
3. Enable **Developer Mode** (top right toggle)
4. Click **"Load unpacked"**
5. Select the `oso-extension` folder
6. OSO will appear in your extensions bar — pin it for easy access!

---

## 🌐 Supported Sites

- ✅ Facebook
- 🔜 Twitter / X
- 🔜 Instagram
- 🔜 Reddit
- 🔜 YouTube

---

## 🎨 Quick Presets

| Preset | Best for |
|---|---|
| 🎯 **Focus** | Deep reading, ADHD concentration mode |
| 🌸 **Calm** | General use — all features balanced |
| 📖 **Read** | Maximum reading comfort, larger spacing |

---

## 🛠 Architecture

```
oso-extension/
├── manifest.json       # Extension config (MV3)
├── popup.html          # Dashboard UI
├── popup.js            # Dashboard logic
├── content.js          # Page transformer (runs on target sites)
├── oso-styles.css      # Injected styles for target sites
├── background.js       # Service worker
└── icons/              # Extension icons
```

---

## 🔧 Customization

In **Settings** (gear icon in dashboard):
- Choose highlight color for b/d/p/q anchoring
- Set font size boost (up to +12px)
- Toggle individual accessibility features

---

## 📝 Notes

- The extension uses **Atkinson Hyperlegible** via Google Fonts as a stand-in for OpenDyslexic. To bundle the actual OpenDyslexic font, download it from [opendyslexic.org](https://opendyslexic.org) and place the `.woff2` files in `fonts/`.
- Facebook's DOM changes frequently. CSS selectors may need updating as Meta updates their UI.
- All settings are synced via `chrome.storage.sync` — they follow you across devices.

---

Made with ♥ for minds that work differently.
