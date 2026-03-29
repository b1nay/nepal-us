// ─── OSO Floating Sidebar ─────────────────────────────────────────────────────
// Injected into the page as a shadow DOM so it never conflicts with site styles

(function () {
  'use strict';

  const SIDEBAR_ID = 'oso-floating-sidebar-host';

  // Don't inject twice
  if (document.getElementById(SIDEBAR_ID)) return;

  // ─── Create Shadow Host ───────────────────────────────────────────────────
  const host = document.createElement('div');
  host.id = SIDEBAR_ID;
  host.style.cssText = `
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 2147483647;
    font-family: sans-serif;
  `;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // ─── Styles ───────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');

    :host { all: initial; }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --peach:    #FFD6C0;
      --mint:     #C8F0DC;
      --lavender: #DDD4F8;
      --sky:      #C2E8FF;
      --butter:   #FFF3C0;
      --ink:      #2A2133;
      --ink-soft: #6B5F7A;
      --white:    #FEFCFF;
    }

    /* ─── Tab (always visible) ─── */
    #oso-tab {
      position: absolute;
      right: 0; top: 50%;
      transform: translateY(-50%);
      width: 36px; height: 80px;
      background: var(--ink, #2A2133);
      border-radius: 10px 0 0 10px;
      cursor: pointer;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 4px;
      transition: width 0.2s;
      box-shadow: -4px 0 20px rgba(0,0,0,0.15);
    }

    #oso-tab:hover { width: 40px; }

    .tab-logo {
      font-family: 'Nunito', sans-serif;
      font-weight: 900; font-size: 11px;
      color: #FEFCFF;
      letter-spacing: -0.5px;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
    }

    .tab-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #C8F0DC;
    }

    /* ─── Panel ─── */
    #oso-panel {
      position: absolute;
      right: 36px; top: 50%;
      transform: translateY(-50%) translateX(20px);
      width: 260px;
      background: var(--lavender, #DDD4F8);
      border-radius: 20px 0 0 20px;
      box-shadow: -8px 0 40px rgba(42,33,51,0.18);
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s, transform 0.3s cubic-bezier(0.34,1.4,0.64,1);
    }

    #oso-panel.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(-50%) translateX(0);
    }

    /* Noise texture */
    #oso-panel::before {
      content: '';
      position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 0;
    }

    /* ─── Panel Header ─── */
    .panel-header {
      background: #FEFCFF;
      padding: 14px 16px 12px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 2px solid rgba(42,33,51,0.06);
      position: relative; z-index: 1;
    }

    .panel-logo {
      display: flex; align-items: center; gap: 8px;
    }

    .logo-mark {
      width: 28px; height: 28px;
      background: var(--ink, #2A2133);
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Nunito', sans-serif;
      font-weight: 900; font-size: 13px;
      color: #FEFCFF;
    }

    .logo-text {
      font-family: 'Nunito', sans-serif;
      font-weight: 900; font-size: 17px;
      color: var(--ink, #2A2133);
      letter-spacing: -0.5px;
    }

    .logo-sub {
      font-family: 'Nunito', sans-serif;
      font-size: 9px; font-weight: 700;
      color: var(--ink-soft, #6B5F7A);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* Global toggle */
    .g-toggle { display: flex; align-items: center; gap: 6px; }
    .g-label {
      font-family: 'Nunito', sans-serif;
      font-size: 10px; font-weight: 800;
      color: var(--ink-soft, #6B5F7A);
      text-transform: uppercase; letter-spacing: 0.5px;
    }

    /* ─── Toggle switch ─── */
    .toggle { position: relative; width: 40px; height: 22px; cursor: pointer; flex-shrink: 0; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-track {
      position: absolute; inset: 0;
      background: #D5D0DC; border-radius: 11px;
      transition: background 0.2s;
    }
    .toggle-thumb {
      position: absolute; top: 2.5px; left: 2.5px;
      width: 17px; height: 17px;
      background: white; border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 0.2s;
    }
    .toggle input:checked ~ .toggle-track { background: var(--ink, #2A2133); }
    .toggle input:checked ~ .toggle-thumb { transform: translateX(18px); }

    /* ─── Panel Body ─── */
    .panel-body {
      padding: 12px;
      position: relative; z-index: 1;
      display: flex; flex-direction: column; gap: 8px;
    }

    /* ─── Feature Row ─── */
    .feature-row {
      background: rgba(255,255,255,0.72);
      border-radius: 14px;
      padding: 11px 13px;
      display: flex; align-items: center; gap: 10px;
      border: 1.5px solid rgba(255,255,255,0.9);
      backdrop-filter: blur(8px);
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
    }

    .feature-row:hover {
      transform: translateX(-2px);
      box-shadow: -4px 4px 16px rgba(42,33,51,0.09);
    }

    .feature-row.active { border-color: var(--ink, #2A2133); }

    .row-icon { font-size: 20px; flex-shrink: 0; }

    .row-info { flex: 1; }
    .row-name {
      font-family: 'Nunito', sans-serif;
      font-size: 12px; font-weight: 800;
      color: var(--ink, #2A2133);
    }
    .row-desc {
      font-family: 'Nunito', sans-serif;
      font-size: 10px; font-weight: 500;
      color: var(--ink-soft, #6B5F7A);
      margin-top: 1px;
    }

    /* card accent colors */
    .row-font    { background: linear-gradient(135deg, #fff8f5, #ffe8dc); }
    .row-letters { background: linear-gradient(135deg, #f5fff9, #dcffe8); }
    .row-layout  { background: linear-gradient(135deg, #f8f5ff, #e8dcff); }
    .row-pastel  { background: linear-gradient(135deg, #f5f9ff, #dcecff); }

    /* ─── Ease Slider ─── */
    .ease-card {
      background: rgba(255,255,255,0.72);
      border-radius: 14px;
      padding: 11px 13px;
      border: 1.5px solid rgba(255,255,255,0.9);
      backdrop-filter: blur(8px);
    }

    .ease-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 8px;
    }

    .ease-label {
      font-family: 'Nunito', sans-serif;
      font-size: 11px; font-weight: 800;
      color: var(--ink, #2A2133);
    }

    .ease-val {
      font-family: monospace;
      font-size: 11px;
      color: var(--ink-soft, #6B5F7A);
      background: #FFF3C0;
      padding: 1px 7px;
      border-radius: 5px;
    }

    input[type=range] {
      width: 100%; -webkit-appearance: none;
      height: 5px; border-radius: 3px;
      background: linear-gradient(to right, #2A2133 60%, #ddd 60%);
      outline: none;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 15px; height: 15px;
      background: #2A2133; border-radius: 50%;
      border: 2.5px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      cursor: pointer;
    }

    /* ─── Presets ─── */
    .presets-row {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;
    }

    .preset-btn {
      background: rgba(255,255,255,0.72);
      border: 1.5px solid rgba(255,255,255,0.9);
      border-radius: 11px; padding: 8px 4px;
      text-align: center; cursor: pointer;
      font-family: 'Nunito', sans-serif;
      transition: transform 0.15s;
      backdrop-filter: blur(8px);
    }

    .preset-btn:hover { transform: scale(1.05); }

    .preset-btn.active {
      border-color: var(--ink, #2A2133);
      background: var(--ink, #2A2133);
    }

    .preset-btn.active .preset-name { color: white; }

    .preset-emoji { font-size: 16px; display: block; margin-bottom: 3px; }
    .preset-name {
      font-size: 9px; font-weight: 800;
      color: var(--ink, #2A2133);
      text-transform: uppercase; letter-spacing: 0.4px;
    }

    /* ─── Footer ─── */
    .panel-footer {
      padding: 8px 12px 12px;
      display: flex; justify-content: center;
      position: relative; z-index: 1;
    }

    .open-popup-btn {
      font-family: 'Nunito', sans-serif;
      font-size: 10px; font-weight: 800;
      color: var(--ink-soft, #6B5F7A);
      background: rgba(255,255,255,0.6);
      border: 1.5px solid rgba(255,255,255,0.9);
      border-radius: 8px;
      padding: 5px 14px;
      cursor: pointer;
      text-transform: uppercase; letter-spacing: 0.5px;
      transition: background 0.15s;
    }

    .open-popup-btn:hover {
      background: rgba(255,255,255,0.9);
    }

    /* ─── Animations ─── */
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .panel-body .feature-row { animation: slideIn 0.25s ease both; }
    .feature-row:nth-child(1) { animation-delay: 0.04s; }
    .feature-row:nth-child(2) { animation-delay: 0.08s; }
    .feature-row:nth-child(3) { animation-delay: 0.12s; }
    .feature-row:nth-child(4) { animation-delay: 0.16s; }
  `;
  shadow.appendChild(style);

  // ─── HTML ─────────────────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.innerHTML = `
    <!-- Tab -->
    <div id="oso-tab">
      <span class="tab-logo">OSO</span>
      <div class="tab-dot"></div>
    </div>

    <!-- Panel -->
    <div id="oso-panel">

      <div class="panel-header">
        <div class="panel-logo">
          <div class="logo-mark">O</div>
          <div>
            <div class="logo-text">OSO</div>
            <div class="logo-sub">Accessible</div>
          </div>
        </div>
        <div class="g-toggle">
          <span class="g-label">On</span>
          <label class="toggle">
            <input type="checkbox" id="sb-global" checked>
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </label>
        </div>
      </div>

      <div class="panel-body">

        <div class="feature-row row-font active" id="sb-card-font">
          <span class="row-icon">𝐀</span>
          <div class="row-info">
            <div class="row-name">OpenDyslexic Font</div>
            <div class="row-desc">Dyslexia-friendly typeface</div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="sb-font" checked>
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </label>
        </div>

        <div class="feature-row row-letters active" id="sb-card-letters">
          <span class="row-icon">🔤</span>
          <div class="row-info">
            <div class="row-name">Letter Anchor</div>
            <div class="row-desc">Highlights b d p q</div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="sb-letters" checked>
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </label>
        </div>

        <div class="feature-row row-layout active" id="sb-card-layout">
          <span class="row-icon">⊞</span>
          <div class="row-info">
            <div class="row-name">Bento Layout</div>
            <div class="row-desc">Card grid feed</div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="sb-layout" checked>
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </label>
        </div>

        <div class="feature-row row-pastel active" id="sb-card-pastel">
          <span class="row-icon">🎨</span>
          <div class="row-info">
            <div class="row-name">Pastel Theme</div>
            <div class="row-desc">Soft calming colors</div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="sb-pastel" checked>
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </label>
        </div>

        <!-- Ease Slider -->
        <div class="ease-card">
          <div class="ease-header">
            <span class="ease-label">Reading Ease</span>
            <span class="ease-val" id="sb-ease-val">60%</span>
          </div>
          <input type="range" id="sb-ease" min="0" max="100" value="60">
        </div>

        <!-- Presets -->
        <div class="presets-row">
          <button class="preset-btn" data-preset="focus" id="sb-preset-focus">
            <span class="preset-emoji">🎯</span>
            <span class="preset-name">Focus</span>
          </button>
          <button class="preset-btn active" data-preset="calm" id="sb-preset-calm">
            <span class="preset-emoji">🌸</span>
            <span class="preset-name">Calm</span>
          </button>
          <button class="preset-btn" data-preset="read" id="sb-preset-read">
            <span class="preset-emoji">📖</span>
            <span class="preset-name">Read</span>
          </button>
        </div>

      </div>

      <div class="panel-footer">
        <button class="open-popup-btn" id="sb-open-popup">⚙ Full Settings</button>
      </div>

    </div>
  `;
  shadow.appendChild(panel);

  // ─── Logic ────────────────────────────────────────────────────────────────
  const PRESETS = {
    focus: { font: true,  letters: false, layout: true,  pastel: false, ease: 40 },
    calm:  { font: true,  letters: true,  layout: true,  pastel: true,  ease: 60 },
    read:  { font: true,  letters: true,  layout: false, pastel: true,  ease: 80 }
  };

  let panelOpen = false;
  let sidebarState = {};

  // Load state
  chrome.storage.sync.get(null, (saved) => {
    sidebarState = saved || {};
    syncSidebar();
  });

  // Tab click → toggle panel
  shadow.getElementById('oso-tab').addEventListener('click', () => {
    panelOpen = !panelOpen;
    shadow.getElementById('oso-panel').classList.toggle('open', panelOpen);
  });

  // Global toggle
  shadow.getElementById('sb-global').addEventListener('change', e => {
    sidebarState.enabled = e.target.checked;
    save();
  });

  // Feature toggles
  ['font','letters','layout','pastel'].forEach(key => {
    shadow.getElementById('sb-' + key).addEventListener('change', e => {
      sidebarState[key] = e.target.checked;
      shadow.getElementById('sb-card-' + key)?.classList.toggle('active', e.target.checked);
      save();
    });
  });

  // Ease slider
  const easeSlider = shadow.getElementById('sb-ease');
  easeSlider.addEventListener('input', e => {
    sidebarState.ease = parseInt(e.target.value);
    shadow.getElementById('sb-ease-val').textContent = sidebarState.ease + '%';
    updateSliderBg(easeSlider);
    save();
  });

  // Presets
  ['focus','calm','read'].forEach(name => {
    shadow.getElementById('sb-preset-' + name).addEventListener('click', () => {
      Object.assign(sidebarState, PRESETS[name], { activePreset: name });
      syncSidebar();
      save();
    });
  });

  // Open full popup button — just opens the extension popup
  shadow.getElementById('sb-open-popup').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OSO_OPEN_POPUP' });
  });

  // Listen for state changes from popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'OSO_UPDATE') {
      sidebarState = { ...sidebarState, ...msg.state };
      syncSidebar();
    }
  });

  function syncSidebar() {
    setCheck('sb-global',  sidebarState.enabled  ?? true);
    setCheck('sb-font',    sidebarState.font      ?? true);
    setCheck('sb-letters', sidebarState.letters   ?? true);
    setCheck('sb-layout',  sidebarState.layout    ?? true);
    setCheck('sb-pastel',  sidebarState.pastel    ?? true);

    const ease = sidebarState.ease ?? 60;
    easeSlider.value = ease;
    shadow.getElementById('sb-ease-val').textContent = ease + '%';
    updateSliderBg(easeSlider);

    ['font','letters','layout','pastel'].forEach(key => {
      shadow.getElementById('sb-card-' + key)
        ?.classList.toggle('active', sidebarState[key] ?? true);
    });

    // Preset active state
    ['focus','calm','read'].forEach(name => {
      shadow.getElementById('sb-preset-' + name)
        ?.classList.toggle('active', sidebarState.activePreset === name);
    });
  }

  function setCheck(id, val) {
    const el = shadow.getElementById(id);
    if (el) el.checked = val;
  }

  function updateSliderBg(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background =
      `linear-gradient(to right, #2A2133 0%, #2A2133 ${pct}%, #ddd ${pct}%)`;
  }

  function save() {
    chrome.storage.sync.set(sidebarState);
    // Notify content.js on the same page
    document.dispatchEvent(new CustomEvent('OSO_SIDEBAR_UPDATE', { detail: sidebarState }));
  }

})();
