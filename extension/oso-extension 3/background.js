// OSO Background Service Worker
// Handles install, settings migration, and cross-tab state relay

// Open popup when sidebar requests it
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'OSO_OPEN_POPUP') {
    chrome.browserAction.openPopup
      ? chrome.browserAction.openPopup()
      : chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
  }
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Set defaults on first install
    chrome.storage.sync.set({
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
    });
    console.log('[OSO] Installed & defaults set.');
  }
});

// Relay storage changes to all active tabs
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  const newState = {};
  for (const [key, { newValue }] of Object.entries(changes)) {
    newState[key] = newValue;
  }

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (!tab.id) return;
      chrome.tabs.sendMessage(tab.id, { type: 'OSO_UPDATE', state: newState }).catch(() => {});
    });
  });
});
