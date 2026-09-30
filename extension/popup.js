const titleEl = document.getElementById("page-title");
const metaEl = document.getElementById("page-meta");
const button = document.getElementById("tellme-btn");
const status = document.getElementById("status");

async function getCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error("No active tab");

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      title: document.title || "Untitled page",
      url: location.href,
      selection: window.getSelection()?.toString().trim() || "",
      text: document.body?.innerText?.slice(0, 120000) || ""
    })
  });

  return {
    tab,
    payload: results?.[0]?.result || {
      title: tab.title || "Untitled page",
      url: tab.url || "",
      selection: "",
      text: ""
    }
  };
}

async function preview() {
  try {
    const { payload } = await getCurrentPage();
    titleEl.textContent = payload.title || "Untitled page";
    metaEl.textContent = new URL(payload.url).hostname.replace(/^www\\./, "") || "Current page";
  } catch {
    titleEl.textContent = "This page cannot be inspected";
    metaEl.textContent = "Try another tab";
  }
}

button.addEventListener("click", async () => {
  button.disabled = true;
  status.textContent = "Preparing page…";

  try {
    const { payload } = await getCurrentPage();

    await chrome.storage.local.set({ tellmeSource: payload });

    const query = new URLSearchParams({
      source: "extension",
      title: payload.title,
      url: payload.url
    });

    await chrome.tabs.create({
      url: "http://localhost:3000/?" + query.toString()
    });

    status.textContent = "Page sent to Tellme.";
    window.setTimeout(() => window.close(), 450);
  } catch (error) {
    console.error(error);
    status.textContent = "Couldn't read this page.";
    button.disabled = false;
  }
});

preview();