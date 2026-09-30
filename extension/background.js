const TELLME_URL = "http://localhost:3000/";
const MAX_REDDIT_COMMENTS = 60;

const DEFAULT_STATE = {
  queue: [],
  index: 0,
  status: "idle",
  sourceTitle: "",
  sourceUrl: ""
};

async function readState() {
  const stored = await chrome.storage.local.get("tellmeReader");
  return { ...DEFAULT_STATE, ...(stored.tellmeReader || {}) };
}

async function writeState(state) {
  await chrome.storage.local.set({ tellmeReader: state });
  chrome.runtime.sendMessage({ type: "tellme-reader-updated", state }).catch(() => {});
}

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

async function getPagePayload(tabId, selectionOverride) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: (selectedText, maxRedditComments) => {
      const clean = (value) => (value || "")
        .replace(/\u00a0/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      const makeSegment = (kind, text, extra) => ({
        id: crypto.randomUUID(),
        kind,
        text: clean(text),
        ...(extra || {})
      });

      const isReddit =
        location.hostname === "reddit.com" ||
        location.hostname.endsWith(".reddit.com");

      const segments = [];

      if (isReddit) {
        const post =
          document.querySelector("shreddit-post") ||
          document.querySelector("[data-testid='post-container']") ||
          document.querySelector("article");

        const subreddit =
          clean(
            post?.querySelector(
              "a[href*='/r/'], [slot='subredditName'], [data-testid='subreddit-name']"
            )?.textContent
          ) ||
          clean(document.querySelector("a[href*='/r/']")?.textContent);

        const title =
          clean(post?.querySelector("h1[slot='title'], [slot='title'], h1")?.textContent) ||
          clean(document.querySelector("h1")?.textContent) ||
          clean(document.title);

        if (title) {
          segments.push(
            makeSegment("post-title", title, {
              label: "Post title",
              source: subreddit || "Reddit"
            })
          );
        }

        const bodyNode =
          post?.querySelector(
            "[slot='text-body'], [data-testid='post-content'], [data-click-id='text']"
          ) ||
          post?.querySelector("div[class*='RichText'], div[class*='md']");

        const body = clean(bodyNode?.innerText);
        if (body && body !== title) {
          segments.push(
            makeSegment("post-body", body, {
              label: "Post description",
              source: subreddit || "Reddit"
            })
          );
        }

        const commentNodes = Array.from(
          document.querySelectorAll("shreddit-comment")
        )
          .filter((node) => node instanceof HTMLElement)
          .slice(0, maxRedditComments);

        const seenNodes = new Set();

        const readComment = (node, depth) => {
          if (seenNodes.has(node)) return;
          seenNodes.add(node);

          const author =
            clean(node.getAttribute("author")) ||
            clean(
              node.querySelector(
                "[slot='authorName'], [data-testid='comment_author_link']"
              )?.textContent
            ) ||
            "Commenter";

          const body =
            clean(node.querySelector("[slot='comment']")?.innerText) ||
            clean(node.querySelector("[data-testid='comment']")?.innerText) ||
            clean(
              Array.from(node.querySelectorAll("p"))
                .map((p) => p.innerText)
                .join(" ")
            );

          if (body) {
            segments.push(
              makeSegment(depth === 0 ? "comment" : "reply", body, {
                label: depth === 0 ? "Comment" : "Reply",
                author,
                depth
              })
            );
          }

          node
            .querySelectorAll(":scope shreddit-comment, :scope .shreddit-comment")
            .forEach((reply) => readComment(reply, depth + 1));
        };

        commentNodes.forEach((node) => readComment(node, 0));

        const unique = [];
        const seenText = new Set();

        for (const segment of segments) {
          const normalized = segment.text.toLowerCase();
          if (!normalized || seenText.has(normalized)) continue;
          seenText.add(normalized);
          unique.push(segment);
        }

        return {
          contentType: "reddit-discussion",
          title: title || "Reddit discussion",
          url: location.href,
          selection: clean(selectedText || window.getSelection()?.toString() || ""),
          text: unique.map((segment) => {
            const author = segment.author ? segment.author + ": " : "";
            return author + segment.text;
          }).join("\n\n").slice(0, 120000),
          segments: unique.slice(0, maxRedditComments + 2)
        };
      }

      const title =
        clean(document.querySelector("main h1, article h1, h1")?.textContent) ||
        clean(document.title);

      const description = clean(
        document.querySelector("meta[name='description']")?.getAttribute("content") ||
        document.querySelector("main p, article p")?.textContent
      );

      const main =
        document.querySelector("article") ||
        document.querySelector("main") ||
        document.querySelector("[role='main']") ||
        document.body;

      const clone = main?.cloneNode(true);
      if (clone) {
        clone
          .querySelectorAll(
            "script, style, noscript, svg, nav, footer, header, aside, form, [aria-hidden='true']"
          )
          .forEach((node) => node.remove());
      }

      const text = clean(clone?.innerText || document.body?.innerText || "");
      const generic = [];

      if (title) {
        generic.push(makeSegment("page-title", title, { label: "Page title" }));
      }

      if (description && description !== title) {
        generic.push(
          makeSegment("description", description, { label: "Description" })
        );
      }

      text
        .split(/\n+/)
        .map(clean)
        .filter((line) => line.length > 30)
        .slice(0, 35)
        .forEach((line) => {
          if (line === title || line === description) return;
          generic.push(makeSegment("content", line, { label: "Page content" }));
        });

      return {
        contentType: "webpage",
        title: title || "Untitled page",
        url: location.href,
        selection: clean(selectedText || window.getSelection()?.toString() || ""),
        text: generic.map((segment) => segment.text).join("\n\n").slice(0, 120000),
        segments: generic
      };
    },
    args: [selectionOverride || "", MAX_REDDIT_COMMENTS]
  });

  return results?.[0]?.result || {
    contentType: "webpage",
    title: "Untitled page",
    url: "",
    selection: selectionOverride || "",
    text: "",
    segments: []
  };
}

async function ingest(payload) {
  const response = await fetch(TELLME_URL + "api/extension/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error("Tellme server rejected the page");

  const data = await response.json();
  if (!data.token) throw new Error("Tellme did not return a handoff token");
  return data.token;
}

async function speakCurrent() {
  const state = await readState();
  const current = state.queue[state.index];

  if (!current) {
    await chrome.tts.stop();
    await writeState({ ...state, status: "complete" });
    return;
  }

  chrome.tts.stop();

  await writeState({
    ...state,
    status: "reading"
  });

  // Chrome generates its own utterance ID for tts events. Do not pass a
  // custom utteranceId here: it is not a supported tts.speak option.
  chrome.tts.speak(current.text, {
    rate: 1.02,
    pitch: 1,
    enqueue: false
  });
}

async function startReader(payload) {
  const queue = (payload.segments || [])
    .filter((segment) => cleanText(segment.text))
    .map((segment) => ({
      text: cleanText(
        segment.author
          ? segment.author + " says. " + segment.text
          : segment.text
      ),
      label: segment.label || segment.kind || "Content",
      kind: segment.kind || "content",
      author: segment.author || "",
      depth: segment.depth || 0
    }));

  if (!queue.length && payload.text) {
    queue.push({
      text: cleanText(payload.text),
      label: "Page",
      kind: "content",
      depth: 0
    });
  }

  const state = {
    ...DEFAULT_STATE,
    queue,
    index: 0,
    status: queue.length ? "reading" : "empty",
    sourceTitle: payload.title || "",
    sourceUrl: payload.url || ""
  };

  await writeState(state);

  if (queue.length) await speakCurrent();
}

async function sendTabToTellme(tab, selectionOverride) {
  if (!tab?.id) throw new Error("No active tab");

  const payload = await getPagePayload(tab.id, selectionOverride || "");
  await startReader(payload);

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

  await chrome.tabs.create({
    url: TELLME_URL + "?" + query.toString()
  });

  return payload;
}

chrome.tts.onEvent.addListener(async (event) => {
  const state = await readState();

  if (event.type === "end" && state.status === "reading") {
    const nextIndex = state.index + 1;

    if (nextIndex >= state.queue.length) {
      await writeState({ ...state, status: "complete", utteranceId: "" });
      return;
    }

    await writeState({ ...state, index: nextIndex });
    await speakCurrent();
  }

  if (event.type === "error") {
    await writeState({ ...state, status: "error" });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (message?.type === "tellme-current-page") {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      });
      const payload = await sendTabToTellme(tab, "");
      sendResponse({ ok: true, payload });
      return;
    }

    if (message?.type === "tellme-reader-command") {
      const state = await readState();

      if (message.command === "pause") {
        chrome.tts.pause();
        await writeState({ ...state, status: "paused" });
      } else if (message.command === "resume") {
        chrome.tts.resume();
        await writeState({ ...state, status: "reading" });
      } else if (message.command === "stop") {
        chrome.tts.stop();
        await writeState({ ...state, status: "stopped" });
      } else if (message.command === "next") {
        chrome.tts.stop();

        if (state.index + 1 < state.queue.length) {
          await writeState({
            ...state,
            index: state.index + 1,
            status: "reading"
          });
          await speakCurrent();
        } else {
          await writeState({
            ...state,
            status: "complete"
          });
        }
      }

      sendResponse({ ok: true, state: await readState() });
      return;
    }

    if (message?.type === "tellme-reader-state") {
      sendResponse({ ok: true, state: await readState() });
      return;
    }

    sendResponse({ ok: false, error: "Unknown command" });
  })().catch((error) => {
    console.error("Tellme extension error:", error);
    sendResponse({
      ok: false,
      error: error?.message || "Extension error"
    });
  });

  return true;
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "send-page-to-tellme") return;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    await sendTabToTellme(tab, "");
  } catch (error) {
    console.error("Tellme shortcut error:", error);
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (info.menuItemId === "tellme-page") {
      await sendTabToTellme(tab, "");
    }

    if (info.menuItemId === "tellme-selection") {
      await sendTabToTellme(tab, info.selectionText || "");
    }
  } catch (error) {
    console.error("Tellme context-menu error:", error);
  }
});

function cleanText(value) {
  return (value || "").replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}