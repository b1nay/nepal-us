// ─── State ───────────────────────────────────────────────────────────────────
const DEFAULTS = {
  enabled: true,
  font: true,
  letters: true,
  layout: true,
  pastel: true,
  ease: 60,
  hideDistract: true,
  focusMode: false,
  ruler: false,
  reduceAnim: true,
  highlightColor: '#FFD700',
  fontSizeBoost: 0,
  activePreset: 'calm'
};

let state = { ...DEFAULTS };

const SUPPORTED_SITES = {
  'facebook.com': 'Facebook',
  'twitter.com':  'Twitter / X',
  'x.com':        'Twitter / X',
  'instagram.com':'Instagram',
  'reddit.com':   'Reddit',
  'youtube.com':  'YouTube'
};

// ─── Presets ─────────────────────────────────────────────────────────────────
const PRESETS = {
  focus: { font: true,  letters: false, layout: true,  pastel: false, ease: 40, hideDistract: true,  focusMode: true  },
  calm:  { font: true,  letters: true,  layout: true,  pastel: true,  ease: 60, hideDistract: true,  focusMode: false },
  read:  { font: true,  letters: true,  layout: false, pastel: true,  ease: 80, hideDistract: false, focusMode: false }
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  detectSite();
  syncUI();
  bindEvents();
});

async function loadState() {
  return new Promise(resolve => {
    chrome.storage.sync.get(DEFAULTS, (saved) => {
      state = { ...DEFAULTS, ...saved };
      resolve();
    });
  });
}

function saveState() {
  chrome.storage.sync.set(state);
  sendToContent();
}

// ─── Site Detection ───────────────────────────────────────────────────────────
function detectSite() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    const url = tabs[0].url || '';
    const hostname = new URL(url).hostname.replace('www.', '');

    const siteName = Object.entries(SUPPORTED_SITES).find(([k]) => hostname.includes(k));
    const nameEl = document.getElementById('site-name');
    const dotEl  = document.getElementById('site-dot');
    const tagEl  = document.getElementById('site-tag');

    if (siteName) {
      nameEl.textContent = siteName[1];
      dotEl.className = 'site-dot';
      tagEl.textContent = 'Supported';
      tagEl.className = 'site-tag';
    } else {
      nameEl.textContent = hostname || 'Unknown page';
      dotEl.className = 'site-dot inactive';
      tagEl.textContent = 'Not supported';
      tagEl.className = 'site-tag unsupported';
    }
  });
}

// ─── Sync UI to state ────────────────────────────────────────────────────────
function syncUI() {
  setToggle('global-toggle', state.enabled);
  setToggle('toggle-font',    state.font);
  setToggle('toggle-letters', state.letters);
  setToggle('toggle-layout',  state.layout);
  setToggle('toggle-pastel',  state.pastel);
  setToggle('toggle-hide',    state.hideDistract);
  setToggle('toggle-focus',   state.focusMode);
  setToggle('toggle-ruler',   state.ruler);
  setToggle('toggle-anim',    state.reduceAnim);

  const slider = document.getElementById('ease-slider');
  slider.value = state.ease;
  document.getElementById('ease-val').textContent = state.ease + '%';
  updateSliderBg(slider);

  document.getElementById('fs-val').textContent = state.fontSizeBoost + 'px';

  // highlight color swatches
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.color === state.highlightColor);
  });

  // preset buttons
  document.querySelectorAll('.preset-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.preset === state.activePreset);
  });

  // card active borders
  ['font','letters','layout','pastel'].forEach(key => {
    document.getElementById('card-' + key)?.classList.toggle('active', state[key]);
  });
}

function setToggle(id, val) {
  const el = document.getElementById(id);
  if (el) el.checked = val;
}

// ─── Events ──────────────────────────────────────────────────────────────────
function bindEvents() {
  document.getElementById('global-toggle').addEventListener('change', e => {
    state.enabled = e.target.checked;
    saveState();
  });

  ['font','letters','layout','pastel'].forEach(key => {
    document.getElementById('toggle-' + key).addEventListener('change', e => {
      state[key] = e.target.checked;
      document.getElementById('card-' + key)?.classList.toggle('active', e.target.checked);
      saveState();
    });
  });

  document.getElementById('toggle-hide').addEventListener('change', e => {
    state.hideDistract = e.target.checked; saveState();
  });
  document.getElementById('toggle-focus').addEventListener('change', e => {
    state.focusMode = e.target.checked; saveState();
  });
  document.getElementById('toggle-ruler').addEventListener('change', e => {
    state.ruler = e.target.checked; saveState();
  });
  document.getElementById('toggle-anim').addEventListener('change', e => {
    state.reduceAnim = e.target.checked; saveState();
  });

  const slider = document.getElementById('ease-slider');
  slider.addEventListener('input', e => {
    state.ease = parseInt(e.target.value);
    document.getElementById('ease-val').textContent = state.ease + '%';
    updateSliderBg(e.target);
    saveState();
  });
}

function updateSliderBg(slider) {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--ink) 0%, var(--ink) ${pct}%, #ddd ${pct}%)`;
}

// ─── Presets ─────────────────────────────────────────────────────────────────
function applyPreset(name) {
  const p = PRESETS[name];
  if (!p) return;
  Object.assign(state, p, { activePreset: name });
  syncUI();
  saveState();
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function openSettings() {
  document.getElementById('settings-panel').classList.add('open');
}
function closeSettings() {
  document.getElementById('settings-panel').classList.remove('open');
}

// ─── Color Picker ────────────────────────────────────────────────────────────
function selectColor(el) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  state.highlightColor = el.dataset.color;
  saveState();
}

// ─── Font Size ────────────────────────────────────────────────────────────────
function changeFontSize(delta) {
  state.fontSizeBoost = Math.max(-4, Math.min(12, state.fontSizeBoost + delta));
  document.getElementById('fs-val').textContent = state.fontSizeBoost + 'px';
  saveState();
}

// ─── Send settings to content script ─────────────────────────────────────────
function sendToContent() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, { type: 'OSO_UPDATE', state }).catch(() => {});
  });
}
