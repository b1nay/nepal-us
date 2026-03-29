// ─── OSO Content Script ───────────────────────────────────────────────────────
// Runs on Facebook (and future supported sites) to transform the UI

(function () {
  'use strict';

  const OSO_CLASS = 'oso-active';
  let state = null;
  let observer = null;
  let rulerEl = null;

  // ─── Bootstrap ─────────────────────────────────────────────────────────────
  chrome.storage.sync.get(null, (saved) => {
    state = saved;
    if (state.enabled) applyAll();
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'OSO_UPDATE') {
      state = msg.state;
      applyAll();
    }
  });

  // Also listen for same-page sidebar updates (fastest path)
  document.addEventListener('OSO_SIDEBAR_UPDATE', (e) => {
    state = { ...state, ...e.detail };
    applyAll();
  });

  // ─── Main Apply ────────────────────────────────────────────────────────────
  function applyAll() {
    if (!state || !state.enabled) {
      removeAll();
      return;
    }

    document.documentElement.classList.add(OSO_CLASS);

    applyFont();
    applyLetterHighlight();
    applyLayout();
    applyPastel();
    applyReadingEase();
    applyHideDistract();
    applyFocusMode();
    applyRuler();
    applyReduceAnim();
    applyFontSize();

    // Watch for dynamic content (FB loads posts dynamically)
    startObserver();
  }

  function removeAll() {
    document.documentElement.classList.remove(OSO_CLASS);
    document.documentElement.classList.remove('oso-font');
    document.documentElement.classList.remove('oso-letters');
    document.documentElement.classList.remove('oso-layout');
    document.documentElement.classList.remove('oso-pastel');
    document.documentElement.classList.remove('oso-hide-distract');
    document.documentElement.classList.remove('oso-focus');
    document.documentElement.classList.remove('oso-reduce-anim');
    removeRuler();
    if (observer) { observer.disconnect(); observer = null; }
  }

  // ─── Font ───────────────────────────────────────────────────────────────────
  function applyFont() {
    if (state.font) {
      document.documentElement.classList.add('oso-font');
      injectFontFace();
    } else {
      document.documentElement.classList.remove('oso-font');
    }
  }

  function injectFontFace() {
    if (document.getElementById('oso-font-face')) return;
    const fontUrl = chrome.runtime.getURL('fonts/OpenDyslexic-Regular.otf');
    const style = document.createElement('style');
    style.id = 'oso-font-face';
    style.textContent = `
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('${fontUrl}') format('opentype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
  }

  // ─── Letter Highlighting (b d p q) ──────────────────────────────────────────
  function applyLetterHighlight() {
    if (state.letters) {
      document.documentElement.classList.add('oso-letters');
      highlightConfusableLetters(document.body);
    } else {
      document.documentElement.classList.remove('oso-letters');
      unhighlightLetters(document.body);
    }
  }

  function highlightConfusableLetters(root) {
    if (!root) return;
    const color = state.highlightColor || '#FFD700';
    const walker = document.createTreeWalker(
      root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (['SCRIPT','STYLE','NOSCRIPT','INPUT','TEXTAREA'].includes(parent.tagName))
            return NodeFilter.FILTER_REJECT;
          if (parent.classList.contains('oso-letter-wrap'))
            return NodeFilter.FILTER_REJECT;
          if (/[bdpq]/i.test(node.textContent))
            return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(textNode => {
      const frag = document.createDocumentFragment();
      const parts = textNode.textContent.split(/([bdpqBDPQ])/);
      parts.forEach(part => {
        if (/^[bdpqBDPQ]$/.test(part)) {
          const span = document.createElement('span');
          span.className = 'oso-letter-wrap';
          span.style.cssText = `
            background: ${color};
            border-radius: 3px;
            padding: 0 1px;
            font-weight: bold;
          `;
          span.textContent = part;
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  function unhighlightLetters(root) {
    root?.querySelectorAll('.oso-letter-wrap').forEach(el => {
      el.replaceWith(document.createTextNode(el.textContent));
    });
  }

  // ─── Bento Layout ───────────────────────────────────────────────────────────
  function applyLayout() {
    if (state.layout) {
      document.documentElement.classList.add('oso-layout');
    } else {
      document.documentElement.classList.remove('oso-layout');
    }
  }

  // ─── Pastel Theme ───────────────────────────────────────────────────────────
  function applyPastel() {
    if (state.pastel) {
      document.documentElement.classList.add('oso-pastel');
    } else {
      document.documentElement.classList.remove('oso-pastel');
    }
  }

  // ─── Reading Ease ────────────────────────────────────────────────────────────
  function applyReadingEase() {
    removeStyle('oso-ease-style');
    if (!state.enabled) return;
    const pct = (state.ease || 60) / 100;
    const letterSpacing = (pct * 0.12).toFixed(3) + 'em';
    const lineHeight    = (1.4 + pct * 0.8).toFixed(2);
    const wordSpacing   = (pct * 0.15).toFixed(3) + 'em';
    injectStyle('oso-ease-style', `
      .oso-active * {
        letter-spacing: ${letterSpacing} !important;
        line-height: ${lineHeight} !important;
        word-spacing: ${wordSpacing} !important;
      }
    `);
  }

  // ─── Hide Distracting Elements ───────────────────────────────────────────────
  function applyHideDistract() {
    if (state.hideDistract) {
      document.documentElement.classList.add('oso-hide-distract');
    } else {
      document.documentElement.classList.remove('oso-hide-distract');
    }
  }

  // ─── Focus Mode ─────────────────────────────────────────────────────────────
  function applyFocusMode() {
    if (state.focusMode) {
      document.documentElement.classList.add('oso-focus');
    } else {
      document.documentElement.classList.remove('oso-focus');
    }
  }

  // ─── Reading Ruler ───────────────────────────────────────────────────────────
  function applyRuler() {
    if (state.ruler) {
      if (!rulerEl) {
        rulerEl = document.createElement('div');
        rulerEl.id = 'oso-ruler';
        rulerEl.style.cssText = `
          position: fixed;
          left: 0; right: 0;
          height: 32px;
          background: rgba(255,215,0,0.15);
          border-top: 2px solid rgba(255,215,0,0.5);
          border-bottom: 2px solid rgba(255,215,0,0.5);
          pointer-events: none;
          z-index: 999999;
          transition: top 0.05s;
        `;
        document.body.appendChild(rulerEl);
        document.addEventListener('mousemove', moveRuler);
      }
    } else {
      removeRuler();
    }
  }

  function moveRuler(e) {
    if (rulerEl) {
      rulerEl.style.top = (e.clientY - 16) + 'px';
    }
  }

  function removeRuler() {
    if (rulerEl) {
      document.removeEventListener('mousemove', moveRuler);
      rulerEl.remove();
      rulerEl = null;
    }
  }

  // ─── Reduce Animations ───────────────────────────────────────────────────────
  function applyReduceAnim() {
    if (state.reduceAnim) {
      document.documentElement.classList.add('oso-reduce-anim');
    } else {
      document.documentElement.classList.remove('oso-reduce-anim');
    }
  }

  // ─── Font Size Boost ─────────────────────────────────────────────────────────
  function applyFontSize() {
    removeStyle('oso-fontsize-style');
    if (!state.fontSizeBoost) return;
    injectStyle('oso-fontsize-style', `
      .oso-active, .oso-active * {
        font-size: calc(1em + ${state.fontSizeBoost}px) !important;
      }
    `);
  }

  // ─── Dynamic Content Observer ─────────────────────────────────────────────
  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      if (!state?.enabled || !state?.letters) return;
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) highlightConfusableLetters(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function injectStyle(id, css) {
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function removeStyle(id) {
    document.getElementById(id)?.remove();
  }

})();
