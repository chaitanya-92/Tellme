const titleEl = document.getElementById("page-title");
const metaEl = document.getElementById("page-meta");
const extraEl = document.getElementById("page-extra");
const button = document.getElementById("tellme-btn");
const status = document.getElementById("status");
const readerStateEl = document.getElementById("reader-state");
const segmentCountEl = document.getElementById("segment-count");
const readerDot = document.getElementById("reader-dot");
const pauseBtn = document.getElementById("pause-btn");
const nextBtn = document.getElementById("next-btn");
const stopBtn = document.getElementById("stop-btn");

async function getCurrentPagePreview() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error("No active tab");

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      title:
        document.querySelector("shreddit-post h1, [data-testid='post-container'] h1, article h1, main h1, h1")?.textContent?.trim() ||
        document.title ||
        "Untitled page",
      url: location.href,
      isReddit: location.hostname === "reddit.com" || location.hostname.endsWith(".reddit.com")
    })
  });

  return results?.[0]?.result || {
    title: tab.title || "Untitled page",
    url: tab.url || "",
    isReddit: false
  };
}

async function preview() {
  try {
    const payload = await getCurrentPagePreview();
    titleEl.textContent = payload.title || "Untitled page";
    metaEl.textContent = new URL(payload.url).hostname.replace(/^www\./, "") || "Current page";
    extraEl.textContent = payload.isReddit
      ? "Reddit mode · title → post → comments → replies"
      : "Web mode · title → description → content";
  } catch {
    titleEl.textContent = "This page cannot be inspected";
    metaEl.textContent = "Try another tab";
    extraEl.textContent = "";
  }
}

function renderReaderState(state) {
  if (!state) return;

  const labels = {
    idle: "READY",
    reading: "READING",
    paused: "PAUSED",
    stopped: "STOPPED",
    complete: "FINISHED",
    empty: "NO CONTENT",
    error: "ERROR"
  };

  readerStateEl.textContent = labels[state.status] || "READY";

  const total = state.queue?.length || 0;
  const current = Math.min((state.index || 0) + 1, total);

  segmentCountEl.textContent = total
    ? current + " / " + total + " passages"
    : "0 passages";

  readerDot.classList.toggle("active", state.status === "reading");
  pauseBtn.textContent = state.status === "paused" ? "Resume" : "Pause";
  pauseBtn.disabled = !["reading", "paused"].includes(state.status);
  nextBtn.disabled = !total || state.status === "complete";
  stopBtn.disabled = !["reading", "paused"].includes(state.status);
}

function sendReaderCommand(command) {
  chrome.runtime.sendMessage(
    { type: "tellme-reader-command", command },
    (response) => {
      if (chrome.runtime.lastError || !response?.ok) return;
      renderReaderState(response.state);
    }
  );
}

pauseBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "tellme-reader-state" }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) return;
    sendReaderCommand(response.state.status === "paused" ? "resume" : "pause");
  });
});

nextBtn.addEventListener("click", () => sendReaderCommand("next"));
stopBtn.addEventListener("click", () => sendReaderCommand("stop"));

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "tellme-reader-updated") {
    renderReaderState(message.state);
  }
});

button.addEventListener("click", () => {
  button.disabled = true;
  status.textContent = "Finding the useful parts…";

  chrome.runtime.sendMessage({ type: "tellme-current-page" }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      status.textContent = response?.error || "Couldn't read this page.";
      button.disabled = false;
      return;
    }

    const count = response.payload?.segments?.length || 0;
    status.textContent =
      "Reading " + count + " structured passages in order.";
    renderReaderState({
      status: "reading",
      index: 0,
      queue: new Array(count).fill(null)
    });

    window.setTimeout(() => window.close(), 700);
  });
});

chrome.runtime.sendMessage({ type: "tellme-reader-state" }, (response) => {
  if (!chrome.runtime.lastError && response?.ok) {
    renderReaderState(response.state);
  }
});

preview();