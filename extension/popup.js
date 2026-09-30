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
      ? "Story mode · title → post → comments → replies"
      : "Story mode · title → description → content";
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
const briefButton = document.getElementById("brief-btn");
const briefPanel = document.getElementById("brief-panel");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderBrief(brief) {
  const points = (brief.viewpoints || []).slice(0, 3)
    .map((x) => "<li>" + escapeHtml(x) + "</li>").join("");
  const topics = (brief.topics || []).slice(0, 5)
    .map((x) => "<span class=\"brief-topic\">" + escapeHtml(x) + "</span>").join("");
  const stats = brief.stats
    ? "<div class=\"brief-stats\"><span>" + brief.stats.comments + " comments</span><span>" + brief.stats.replies + " replies</span></div>"
    : "";

  briefPanel.hidden = false;
  briefPanel.innerHTML =
    "<div class=\"brief-head\"><div><p class=\"brief-kicker\">QUICK BRIEF</p><p class=\"brief-source\">" +
    escapeHtml(brief.title) +
    "</p></div><span class=\"edition\">TELLME</span></div>" +
    "<div class=\"brief-body\"><p class=\"brief-label\">What it is about</p>" +
    "<p class=\"brief-main\">" + escapeHtml(brief.about) + "</p>" +
    (points ? "<ul class=\"brief-list\">" + points + "</ul>" : "") +
    (topics ? "<div class=\"brief-topics\">" + topics + "</div>" : "") +
    stats + "</div>";
}

briefButton.addEventListener("click", () => {
  briefButton.disabled = true;
  briefButton.innerHTML = "<span>Analyzing…</span><span>•</span>";
  briefPanel.hidden = false;
  briefPanel.innerHTML = "<div class=\"brief-body\"><div class=\"brief-loading\"><i></i><span>Finding the useful parts</span></div></div>";

  chrome.runtime.sendMessage({ type: "tellme-brief" }, (response) => {
    briefButton.disabled = false;
    briefButton.innerHTML = "<span>Give me a brief</span><span>↗</span>";

    if (chrome.runtime.lastError || !response?.ok) {
      briefPanel.innerHTML = "<div class=\"brief-body\">Couldn't build the brief. Reload the page and try again.</div>";
      return;
    }

    renderBrief(response.brief);
  });
});
