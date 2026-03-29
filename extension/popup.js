const toggle = document.getElementById("toggle");
const highlightToggle = document.getElementById("highlightToggle");
const bgColor = document.getElementById("bgColor");
const spacing = document.getElementById("spacing");

chrome.storage.local.get(
  ["enabled", "highlight", "bgColor", "spacing"],
  (res) => {
    toggle.checked = res.enabled || false;
    highlightToggle.checked = res.highlight || false;
    bgColor.value = res.bgColor || "#E1F5EE";
    spacing.value = res.spacing || 1;
  }
);

function update() {
  const settings = {
    enabled: toggle.checked,
    highlight: highlightToggle.checked,
    bgColor: bgColor.value,
    spacing: spacing.value,
  };

  chrome.storage.local.set(settings);

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, {
      type: "UPDATE_SETTINGS",
      settings,
    });
  });
}

toggle.addEventListener("change", update);
highlightToggle.addEventListener("change", update);
bgColor.addEventListener("input", update);
spacing.addEventListener("input", update);