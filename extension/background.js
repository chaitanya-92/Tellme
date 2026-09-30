const TELLME_URL = "http://localhost:3000/";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll().then(() => {
    chrome.contextMenus.create({
      id: "tellme-page",
      title: "Tellme this page",
      contexts: ["page"]
    });

    chrome.contextMenus.create({
      id: "tellme-selection",
      title: "Tellme this selection",
      contexts: ["selection"]
    });
  });
});

async function getPagePayload(tabId, selectionOverride = "") {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: (selectedText) => {
      const clean = (value) =>
        (value || "")
          .replace(/\u00a0/g, " ")
          .replace(/[ \t]+/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

      const source = document.querySelector("article, [role='main'], main") || document.body;
      const clone = source?.cloneNode(true);

      if (clone) {
        clone.querySelectorAll("script, style, noscript, svg, nav, footer, header, aside, form, [aria-hidden='true']")
          .forEach((node) => node.remove());
      }

      const rawText = clean(clone?.innerText || document.body?.innerText || "");
      const title = clean(document.title) || "Untitled page";
      const selection = clean(selectedText || window.getSelection()?.toString() || "");

      return {
        title: title.slice(0, 500),
        url: location.href.slice(0, 2000),
        selection: selection.slice(0, 20000),
        text: rawText.slice(0, 120000)
      };
    },
    args: [selectionOverride]
  });

  return results?.[0]?.result || {
    title: "Untitled page",
    url: "",
    selection: selectionOverride,
    text: ""
  };
}

async function ingest(payload) {
  const response = await fetch(TELLME_URL + "api/extension/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Tellme server rejected the page");
  }

  const data = await response.json();
  if (!data.token) throw new Error("Tellme did not return a handoff token");
  return data.token;
}

async function sendTabToTellme(tab, selectionOverride = "") {
  if (!tab?.id) throw new Error("No active tab");

  const payload = await getPagePayload(tab.id, selectionOverride);
  const token = await ingest(payload);

  await chrome.storage.local.set({
    tellmeSource: payload,
    tellmeLastToken: token
  });

  const query = new URLSearchParams({
    source: "extension",
    token,
    title: payload.title,
    url: payload.url
  });

  await chrome.tabs.create({ url: TELLME_URL + "?" + query.toString() });
  return payload;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "tellme-current-page") return;

  (async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const payload = await sendTabToTellme(tab);
    sendResponse({ ok: true, payload });
  })().catch((error) => {
    console.error("Tellme extension error:", error);
    sendResponse({ ok: false, error: error?.message || "Couldn't send page" });
  });

  return true;
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "send-page-to-tellme") return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    await sendTabToTellme(tab);
  } catch (error) {
    console.error("Tellme shortcut error:", error);
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (info.menuItemId === "tellme-page") await sendTabToTellme(tab);
    if (info.menuItemId === "tellme-selection") {
      await sendTabToTellme(tab, info.selectionText || "");
    }
  } catch (error) {
    console.error("Tellme context-menu error:", error);
  }
});