const MAX_REDDIT_COMMENTS = 1000;

const DEFAULT_STATE = {
  queue: [],
  index: 0,
  status: "idle",
  sourceTitle: "",
  sourceUrl: "",
  contentType: "",
  voiceName: ""
};

let offscreenCreating = null;

async function readState() {
  const stored = await chrome.storage.local.get("tellmeReader");
  return { ...DEFAULT_STATE, ...(stored.tellmeReader || {}) };
}

async function writeState(state) {
  await chrome.storage.local.set({ tellmeReader: state });

  const reading = state.status === "reading";
  await chrome.action.setBadgeText({ text: reading ? "▶" : "" });
  await chrome.action.setBadgeBackgroundColor({ color: "#9A3038" });

  chrome.runtime.sendMessage({ type: "tellme-reader-updated", state }).catch(() => {});
}

async function ensureOffscreen() {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");

  if (chrome.runtime.getContexts) {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [offscreenUrl]
    });

    if (contexts.length) return;
  }

  if (offscreenCreating) {
    await offscreenCreating;
    return;
  }

  offscreenCreating = chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Keep Tellme voice narration running while the user changes browser tabs."
  });

  try {
    await offscreenCreating;
  } finally {
    offscreenCreating = null;
  }
}

async function sendSpeech(message) {
  await ensureOffscreen();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!response?.ok) {
        reject(new Error(response?.error || "Speech engine error"));
        return;
      }

      resolve(response);
    });
  });
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

  chrome.storage.local.set({ tellmeReader: DEFAULT_STATE });
});

function stripEmoji(value) {
  return Array.from(value || "")
    .filter((char) => {
      const code = char.codePointAt(0) || 0;
      return !(
        (code >= 0x1f000 && code <= 0x1faff) ||
        (code >= 0x1fc00 && code <= 0x1ffff) ||
        (code >= 0x2600 && code <= 0x27bf) ||
        (code >= 0xfe00 && code <= 0xfe0f) ||
        code === 0x200d ||
        (code >= 0x1f3fb && code <= 0x1f3ff)
      );
    })
    .join("");
}

function cleanText(value) {
  return stripEmoji(value)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getPagePayload(tabId, selectionOverride = "") {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (selectedText, maxComments) => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const stripEmoji = (value) => Array.from(value || "")
        .filter((char) => {
          const code = char.codePointAt(0) || 0;
          return !(
            (code >= 0x1f000 && code <= 0x1faff) ||
            (code >= 0x1fc00 && code <= 0x1ffff) ||
            (code >= 0x2600 && code <= 0x27bf) ||
            (code >= 0xfe00 && code <= 0xfe0f) ||
            code === 0x200d ||
            (code >= 0x1f3fb && code <= 0x1f3ff)
          );
        })
        .join("");

      const clean = (value) => stripEmoji(value)
        .replace(/\u00a0/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      const makeSegment = (kind, text, extra = {}) => ({
        id: crypto.randomUUID(),
        kind,
        text: clean(text),
        ...extra
      });

      const isReddit =
        location.hostname === "reddit.com" ||
        location.hostname.endsWith(".reddit.com");

      if (isReddit) {
        const originalScroll = window.scrollY;

        const clickMoreButtons = async () => {
          for (let pass = 0; pass < 4; pass += 1) {
            const buttons = Array.from(document.querySelectorAll("button, a"))
              .filter((element) => {
                const text = clean(element.textContent).toLowerCase();
                const label = clean(element.getAttribute("aria-label")).toLowerCase();

                return (
                  /more replies|view more replies|load more comments|more comments|view more/.test(text) ||
                  /more replies|view more replies|load more comments|more comments|view more/.test(label)
                );
              })
              .slice(0, 80);

            if (!buttons.length) break;

            buttons.forEach((button) => {
              try { button.click(); } catch {}
            });

            await sleep(400);
          }
        };

        for (let pass = 0; pass < 10; pass += 1) {
          await clickMoreButtons();

          const before = document.documentElement.scrollHeight;
          window.scrollTo(0, Math.max(0, before - window.innerHeight - 140));
          await sleep(500);

          const after = document.documentElement.scrollHeight;
          if (after === before && window.scrollY >= Math.max(0, after - window.innerHeight - 220)) {
            break;
          }
        }

        window.scrollTo(0, document.documentElement.scrollHeight);
        await sleep(750);
        await clickMoreButtons();
        window.scrollTo(0, originalScroll);
        await sleep(300);

        const post =
          document.querySelector("shreddit-post") ||
          document.querySelector("[data-testid='post-container']") ||
          document.querySelector("article");

        const subreddit =
          clean(post?.querySelector(
            "a[href*='/r/'], [slot='subredditName'], [data-testid='subreddit-name']"
          )?.textContent) ||
          clean(document.querySelector("a[href*='/r/']")?.textContent);

        const title =
          clean(post?.querySelector("h1[slot='title'], [slot='title'], h1")?.textContent) ||
          clean(document.querySelector("h1")?.textContent) ||
          clean(document.title);

        const segments = [];

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

        const postBody = clean(bodyNode?.innerText);

        if (postBody && postBody !== title) {
          segments.push(
            makeSegment("post-body", postBody, {
              label: "Post description",
              source: subreddit || "Reddit"
            })
          );
        }

        const commentNodes = Array.from(
          document.querySelectorAll("shreddit-comment")
        ).filter((node) => node instanceof HTMLElement);

        const ordered = commentNodes
          .map((node, documentIndex) => {
            const author =
              clean(node.getAttribute("author")) ||
              clean(node.querySelector(
                "[slot='authorName'], [data-testid='comment_author_link'], a[href*='/user/']"
              )?.textContent) ||
              "Commenter";

            const body =
              clean(node.querySelector("[slot='comment']")?.innerText) ||
              clean(node.querySelector("[data-testid='comment']")?.innerText) ||
              clean(node.querySelector("[data-testid='comment-body']")?.innerText) ||
              clean(Array.from(node.querySelectorAll("p")).map((p) => p.innerText).join(" "));

            let depth = 0;
            let cursor = node.parentElement?.closest("shreddit-comment") || null;

            while (cursor) {
              depth += 1;
              cursor = cursor.parentElement?.closest("shreddit-comment") || null;
            }

            return { node, body, author, depth, documentIndex };
          })
          .filter((item) => {
            if (!item.body) return false;
            const lower = item.body.toLowerCase();
            return lower !== "[deleted]" && lower !== "[removed]";
          })
          .sort((a, b) => a.documentIndex - b.documentIndex);

        const seen = new Set();

        for (const item of ordered) {
          if (segments.length >= maxComments + 2) break;

          const normalized = item.body.toLowerCase().replace(/\s+/g, " ");
          if (seen.has(normalized)) continue;
          seen.add(normalized);

          segments.push(
            makeSegment(item.depth > 0 ? "reply" : "comment", item.body, {
              label: item.depth > 0 ? "Reply" : "Comment",
              author: item.author,
              depth: item.depth,
              source: subreddit || "Reddit"
            })
          );
        }

        return {
          contentType: "reddit-discussion",
          title: title || "Reddit discussion",
          url: location.href,
          selection: clean(selectedText || window.getSelection()?.toString() || ""),
          text: segments.map((segment) => {
            const author = segment.author ? segment.author + ": " : "";
            return author + segment.text;
          }).join("\n\n").slice(0, 180000),
          segments
        };
      }

      const title =
        clean(document.querySelector("main h1, article h1, h1")?.textContent) ||
        clean(document.title);

      const description = clean(
        document.querySelector("meta[name='description']")?.getAttribute("content") ||
        document.querySelector("main > p, article > p")?.textContent
      );

      const main =
        document.querySelector("article") ||
        document.querySelector("main") ||
        document.querySelector("[role='main']") ||
        document.body;

      const clone = main?.cloneNode(true);

      if (clone) {
        clone.querySelectorAll(
          "script, style, noscript, svg, nav, footer, header, aside, form, [aria-hidden='true']"
        ).forEach((node) => node.remove());
      }

      const text = clean(clone?.innerText || document.body?.innerText || "");
      const segments = [];

      if (title) {
        segments.push(makeSegment("page-title", title, {
          label: "Page title"
        }));
      }

      if (description && description !== title) {
        segments.push(makeSegment("description", description, {
          label: "Description"
        }));
      }

      text
        .split(/\n+/)
        .map(clean)
        .filter((line) => line.length > 30)
        .slice(0, 80)
        .forEach((line) => {
          if (line !== title && line !== description) {
            segments.push(makeSegment("content", line, {
              label: "Page content"
            }));
          }
        });

      return {
        contentType: "webpage",
        title: title || "Untitled page",
        url: location.href,
        selection: clean(selectedText || window.getSelection()?.toString() || ""),
        text: segments.map((segment) => segment.text).join("\n\n").slice(0, 180000),
        segments
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

async function getVoices() {
  await ensureOffscreen();
  const response = await sendSpeech({ type: "tellme-list-voices" });
  return Array.isArray(response.voices) ? response.voices : [];
}

async function chooseVoices() {
  const voices = await getVoices();
  const english = voices.filter((voice) => (voice.lang || "").toLowerCase().startsWith("en"));

  const pool = (english.length ? english : voices).filter(
    (voice, index, array) => array.findIndex((item) => item.name === voice.name) === index
  );

  const preferred = [
    "Samantha",
    "Ava",
    "Karen",
    "Daniel",
    "Alex",
    "Google US English",
    "Google UK English"
  ];

  const selected = [];

  for (const name of preferred) {
    const voice = pool.find((item) =>
      item.name?.toLowerCase().includes(name.toLowerCase())
    );

    if (voice && !selected.some((item) => item.name === voice.name)) {
      selected.push(voice);
    }
  }

  for (const voice of pool) {
    if (selected.length >= 4) break;
    if (!selected.some((item) => item.name === voice.name)) {
      selected.push(voice);
    }
  }

  return selected;
}

function speechChunks(text, maxLength = 1100) {
  const normalized = cleanText(text);
  if (normalized.length <= maxLength) return [normalized];

  const sentences = normalized.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if (!current) {
      current = sentence;
      continue;
    }

    if ((current + " " + sentence).length <= maxLength) {
      current += " " + sentence;
    } else {
      chunks.push(current);
      current = sentence;
    }
  }

  if (current) chunks.push(current);

  return chunks.length ? chunks : [normalized];
}

function buildStoryQueue(payload, voices) {
  const source = payload.segments || [];
  const queue = [];
  const authorVoiceMap = new Map();
  let nextVoiceIndex = 0;
  let commentCount = 0;

  const narratorVoice = voices[0]?.name || "";
  const commentVoices = voices.length > 1 ? voices : voices.length ? voices : [{ name: "" }];

  const assignCommentVoice = (author) => {
    const key = author || "anonymous";
    if (!authorVoiceMap.has(key)) {
      authorVoiceMap.set(key, commentVoices[nextVoiceIndex % commentVoices.length]?.name || narratorVoice);
      nextVoiceIndex += 1;
    }
    return authorVoiceMap.get(key) || narratorVoice;
  };

  const add = (text, options) => {
    speechChunks(text).forEach((chunk) => {
      queue.push({
        text: chunk,
        ...options
      });
    });
  };

  if (payload.contentType === "reddit-discussion") {
    const title = source.find((item) => item.kind === "post-title")?.text || payload.title;
    const body = source.find((item) => item.kind === "post-body")?.text || "";

    if (title) {
      add("Let's start with the title. " + title, {
        label: "Post title",
        kind: "post-title",
        voiceName: narratorVoice,
        rate: 0.94,
        pitch: 1
      });
    }

    if (body) {
      add("Here's what the post is about. " + body, {
        label: "Post description",
        kind: "post-body",
        voiceName: narratorVoice,
        rate: 0.96,
        pitch: 1
      });
    }

    const discussion = source.filter(
      (item) => item.kind === "comment" || item.kind === "reply"
    );

    if (discussion.length) {
      add(
        "Now, let's get into the comments. People started responding to the post, one thought at a time.",
        {
          label: "Discussion introduction",
          kind: "comment-intro",
          voiceName: narratorVoice,
          rate: 0.93,
          pitch: 1
        }
      );
    }

    let topLevelCount = 0;

    discussion.forEach((item) => {
      const voiceName = assignCommentVoice(item.author);
      const isReply = item.kind === "reply" || (item.depth || 0) > 0;

      let lead;
      if (!isReply) {
        topLevelCount += 1;
        lead = topLevelCount === 1
          ? "One person said"
          : "Another person said";
      } else if ((item.depth || 0) > 1) {
        lead = "Another reply followed";
      } else {
        lead = "Someone replied to that";
      }

      add(lead + ". " + item.text, {
        label: isReply ? "Reply" : "Comment",
        kind: isReply ? "reply" : "comment",
        author: "",
        depth: item.depth || 0,
        voiceName,
        rate: isReply ? 0.98 : 0.96,
        pitch: isReply ? 1.02 : 0.99
      });
    });

    if (discussion.length) {
      add("And that is where the conversation stands in this thread.", {
        label: "Discussion ending",
        kind: "closing",
        voiceName: narratorVoice,
        rate: 0.94,
        pitch: 1
      });
    }
  } else {
    source.forEach((item) => {
      const lead =
        item.kind === "page-title"
          ? "Let's start with the title. "
          : item.kind === "description"
            ? "Here's the description. "
            : "";

      add(lead + item.text, {
        label: item.label || "Content",
        kind: item.kind || "content",
        voiceName: narratorVoice,
        rate: 0.97,
        pitch: 1
      });
    });
  }

  return queue;
}

async function startReader(payload) {
  const voices = await chooseVoices();
  const queue = buildStoryQueue(payload, voices);

  const state = {
    ...DEFAULT_STATE,
    queue,
    index: 0,
    status: queue.length ? "reading" : "empty",
    sourceTitle: payload.title || "",
    sourceUrl: payload.url || "",
    contentType: payload.contentType || "webpage",
    voiceName: voices[0]?.name || ""
  };

  await writeState(state);

  if (queue.length) {
    await sendSpeech({
      type: "tellme-speak",
      text: queue[0].text,
      voiceName: queue[0].voiceName,
      rate: queue[0].rate,
      pitch: queue[0].pitch
    });
  }
}

async function sendTabToTellme(tab, selectionOverride = "") {
  if (!tab?.id) throw new Error("No active tab");

  const payload = await getPagePayload(tab.id, selectionOverride);
  await chrome.storage.local.set({ tellmeSource: payload });
  await startReader(payload);

  return payload;
}

async function speakQueueItem(index) {
  const state = await readState();
  const current = state.queue[index];

  if (!current) {
    await writeState({ ...state, status: "complete" });
    return;
  }

  await sendSpeech({
    type: "tellme-speak",
    text: current.text,
    voiceName: current.voiceName || state.voiceName,
    rate: current.rate ?? 0.97,
    pitch: current.pitch ?? 1
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (message?.type === "tellme-current-page") {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      });

      const payload = await sendTabToTellme(tab);
      sendResponse({ ok: true, payload });
      return;
    }

    if (message?.type === "tellme-reader-command") {
      const state = await readState();

      if (message.command === "pause") {
        await sendSpeech({ type: "tellme-pause" });
        await writeState({ ...state, status: "paused" });
      } else if (message.command === "resume") {
        await sendSpeech({ type: "tellme-resume" });
        await writeState({ ...state, status: "reading" });
      } else if (message.command === "stop") {
        await sendSpeech({ type: "tellme-stop" });
        await writeState({ ...state, status: "stopped" });
      } else if (message.command === "next") {
        const nextIndex = state.index + 1;

        if (nextIndex < state.queue.length) {
          await sendSpeech({ type: "tellme-stop" });
          await writeState({
            ...state,
            index: nextIndex,
            status: "reading"
          });
          await speakQueueItem(nextIndex);
        } else {
          await writeState({ ...state, status: "complete" });
        }
      }

      sendResponse({ ok: true, state: await readState() });
      return;
    }

    if (message?.type === "tellme-reader-state") {
      sendResponse({ ok: true, state: await readState() });
      return;
    }

    if (message?.type === "tellme-speech-ended") {
      const state = await readState();

      if (state.status !== "reading") {
        sendResponse({ ok: true });
        return;
      }

      const nextIndex = state.index + 1;

      if (nextIndex >= state.queue.length) {
        await writeState({ ...state, status: "complete" });
        sendResponse({ ok: true });
        return;
      }

      await writeState({ ...state, index: nextIndex });
      await speakQueueItem(nextIndex);

      sendResponse({ ok: true });
      return;
    }

    if (message?.type === "tellme-speech-error") {
      const state = await readState();
      await writeState({ ...state, status: "error" });
      sendResponse({ ok: true });
      return;
    }

    if (message?.type === "tellme-list-voices") {
      const response = await sendSpeech({ type: "tellme-list-voices" });
      sendResponse({ ok: true, voices: response.voices || [] });
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (info.menuItemId === "tellme-page") {
      await sendTabToTellme(tab);
    }

    if (info.menuItemId === "tellme-selection") {
      await sendTabToTellme(tab, info.selectionText || "");
    }
  } catch (error) {
    console.error("Tellme context-menu error:", error);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "send-page-to-tellme") return;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    await sendTabToTellme(tab);
  } catch (error) {
    console.error("Tellme shortcut error:", error);
  }
});