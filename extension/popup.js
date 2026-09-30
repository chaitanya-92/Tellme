const titleEl = document.getElementById("page-title");
const metaEl = document.getElementById("page-meta");
const button = document.getElementById("tellme-btn");
const status = document.getElementById("status");

async function getCurrentPagePreview() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error("No active tab");

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      title: document.title || "Untitled page",
      url: location.href,
      selection: window.getSelection()?.toString().trim() || ""
    })
  });

  return results?.[0]?.result || {
    title: tab.title || "Untitled page",
    url: tab.url || "",
    selection: ""
  };
}

async function preview() {
  try {
    const payload = await getCurrentPagePreview();
    titleEl.textContent = payload.title || "Untitled page";
    metaEl.textContent = new URL(payload.url).hostname.replace(/^www\./, "") || "Current page";
  } catch {
    titleEl.textContent = "This page cannot be inspected";
    metaEl.textContent = "Try another tab";
  }
}

button.addEventListener("click", () => {
  button.disabled = true;
  status.textContent = "Preparing your listening desk…";

  chrome.runtime.sendMessage({ type: "tellme-current-page" }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      status.textContent = response?.error || "Couldn't read this page.";
      button.disabled = false;
      return;
    }

    status.textContent = "Page sent to Tellme.";
    window.setTimeout(() => window.close(), 500);
  });
});

preview();