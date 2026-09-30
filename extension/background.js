const TELLME_URL = "http://localhost:3000/";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tellme-page",
    title: "Tellme this page",
    contexts: ["page", "selection"]
  });
});

async function getPagePayload(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => ({
      title: document.title || "",
      url: location.href,
      selection: window.getSelection()?.toString().trim() || "",
      text: document.body?.innerText?.slice(0, 120000) || ""
    })
  });

  return results?.[0]?.result || { title: "", url: "", selection: "", text: "" };
}

async function sendTabToTellme(tab) {
  if (!tab?.id) return;

  try {
    const payload = await getPagePayload(tab.id);
    await chrome.storage.local.set({ tellmeSource: payload });

    const query = new URLSearchParams({
      source: "extension",
      title: payload.title,
      url: payload.url
    });

    await chrome.tabs.create({ url: TELLME_URL + "?" + query.toString() });
  } catch (error) {
    console.error("Tellme extension error:", error);
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "send-page-to-tellme") return;
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  await sendTabToTellme(tab);
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "tellme-page") return;
  await sendTabToTellme(tab);
});