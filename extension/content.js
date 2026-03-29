let styleTag = null;
let interval = null;

const COLORS = {
  b: "#FFB3BA",
  d: "#BAE1FF",
  p: "#FFFFBA",
  q: "#E1BAFF",
  m: "#BAFFC9",
  w: "#FFD6A5",
};

let settings = {
  enabled: false,
  highlight: false,
  bgColor: "#E1F5EE",
  spacing: 1,
};

// Load initial state
chrome.storage.local.get(
  ["enabled", "highlight", "bgColor", "spacing"],
  (res) => {
    settings = { ...settings, ...res };
    applyAll();
  }
);

// Listen for updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "UPDATE_SETTINGS") {
    settings = msg.settings;
    applyAll();
  }
});

//
// 🔥 MAIN CONTROLLER (NO RELOAD EVER)
//
function applyAll() {
  clearInterval(interval);

  removeCSS();
  removeHighlights();

  if (!settings.enabled) return;

  applyCSS();

  if (settings.highlight) {
    runHighlight();
    interval = setInterval(runHighlight, 2000);
  }
}

//
// 🎨 CSS FORCE
//
function applyCSS() {
  styleTag = document.createElement("style");

  styleTag.innerHTML = `
    body {
      font-family: 'OpenDyslexic', Arial, sans-serif !important;
      letter-spacing: ${settings.spacing}px !important;
      line-height: 1.6 !important;
      background-color: ${settings.bgColor} !important;
    }

    * {
      font-family: 'OpenDyslexic', Arial, sans-serif !important;
      letter-spacing: ${settings.spacing}px !important;
    }

    .dyslexia-letter {
      padding: 1px 3px;
      border-radius: 4px;
      margin: 0 1px;
      font-weight: bold;
      display: inline-block;
    }
  `;

  document.head.appendChild(styleTag);
}

function removeCSS() {
  if (styleTag) {
    styleTag.remove();
    styleTag = null;
  }
}

//
// 🔤 HIGHLIGHT
//
function runHighlight() {
  const elements = document.querySelectorAll("div, span, p");

  elements.forEach((el) => {
    if (el.children.length > 0) return;
    if (el.querySelector(".dyslexia-letter")) return;

    let text = el.innerText;
    if (!text) return;
    if (!/[bdpqmw]/i.test(text)) return;

    const newHTML = text.replace(/[bdpqmw]/gi, (char) => {
      const color = COLORS[char.toLowerCase()];
      return `<span class="dyslexia-letter" style="background:${color}">${char}</span>`;
    });

    el.innerHTML = newHTML;
  });
}

//
// 🧹 CLEANUP
//
function removeHighlights() {
  document.querySelectorAll(".dyslexia-letter").forEach((el) => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.innerText), el);
  });
}