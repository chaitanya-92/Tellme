(() => {
  if (window.top !== window) return;
  if (document.getElementById("__tellme_floating_ui")) return;

  const host = document.createElement("div");
  host.id = "__tellme_floating_ui";
  host.style.cssText =
    "all:initial;position:fixed;right:22px;bottom:22px;z-index:2147483647;";
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "closed" });

  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; }
    .shell {
      font-family: Georgia, "Times New Roman", serif;
      color: #4b2e2b;
      -webkit-font-smoothing: antialiased;
    }
    .card {
      width: 270px;
      border: 1px solid rgba(75,46,43,.19);
      border-radius: 17px;
      background: rgba(255,248,240,.97);
      box-shadow: 0 18px 52px rgba(59,36,33,.18), 0 4px 14px rgba(59,36,33,.09);
      overflow: hidden;
      backdrop-filter: blur(14px);
      transition: transform .22s ease, box-shadow .22s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 23px 62px rgba(59,36,33,.20), 0 5px 17px rgba(59,36,33,.10);
    }
    .top {
      display:flex;
      align-items:center;
      gap:9px;
      min-height:56px;
      padding:10px 12px;
      border-bottom:1px dashed rgba(75,46,43,.18);
    }
    .mark {
      width:29px;
      height:29px;
      flex:0 0 29px;
      display:grid;
      place-items:center;
      border:1px solid rgba(75,46,43,.18);
      border-radius:50%;
      background:#f1e2ca;
      font-size:13px;
    }
    .title-wrap { min-width:0; flex:1; }
    .name { font-size:13px; line-height:1; font-weight:700; }
    .state-line {
      display:flex;
      align-items:center;
      gap:6px;
      margin-top:5px;
      font:600 8px/1.2 Arial,sans-serif;
      letter-spacing:.13em;
      text-transform:uppercase;
      color:#8d755f;
    }
    .dot {
      width:7px;
      height:7px;
      flex:0 0 7px;
      border-radius:50%;
      background:#c9ad91;
    }
    .dot.live,.dot.working {
      background:#9a3038;
      box-shadow:0 0 0 4px rgba(154,48,56,.08);
      animation:pulse 1.1s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,100%{opacity:.5;transform:scale(.86)}
      50%{opacity:1;transform:scale(1.06)}
    }
    .status-tag {
      align-self:flex-start;
      margin-top:1px;
      padding:4px 6px;
      border:1px solid rgba(75,46,43,.12);
      border-radius:999px;
      font:700 7px/1 Arial,sans-serif;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:#8d755f;
    }
    .status-tag.live,.status-tag.working {
      color:#9a3038;
      border-color:rgba(154,48,56,.2);
    }
    .body { padding:12px; }
    .source {
      margin-bottom:10px;
      font:500 10px/1.4 Arial,sans-serif;
      color:#7e6d5d;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .actions {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:7px;
    }
    button {
      appearance:none;
      border:0;
      cursor:pointer;
      font-family:Arial,sans-serif;
    }
    .action {
      min-height:39px;
      padding:7px 8px;
      border:1px solid rgba(75,46,43,.18);
      border-radius:10px;
      background:#fff8f0;
      color:#4b2e2b;
      font-size:8px;
      font-weight:800;
      letter-spacing:.06em;
      text-transform:uppercase;
      transition:background .15s ease,transform .15s ease,opacity .15s ease;
    }
    .action:hover { background:#f1e5d5; transform:translateY(-1px); }
    .action.primary { background:#4b2e2b; color:#fff8f0; border-color:#4b2e2b; }
    .action.primary:hover { background:#3b2421; }
    .action:disabled { opacity:.5; cursor:default; transform:none; }
    .controls {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:6px;
      margin-top:8px;
    }
    .control {
      min-height:30px;
      border:1px solid rgba(75,46,43,.14);
      border-radius:9px;
      background:#f8f1e7;
      color:#6e5b4c;
      font-size:8px;
      font-weight:800;
      letter-spacing:.07em;
      text-transform:uppercase;
    }
    .control:hover { background:#f0e5d8; }
    .control:disabled { opacity:.4; cursor:default; }
    .brief {
      margin-top:10px;
      border-top:1px dashed rgba(75,46,43,.17);
      padding-top:10px;
    }
    .brief[hidden] { display:none; }
    .loading {
      display:flex;
      align-items:center;
      gap:7px;
      font:700 8px/1 Arial,sans-serif;
      letter-spacing:.08em;
      text-transform:uppercase;
      color:#8d755f;
    }
    .loading i {
      width:7px;
      height:7px;
      border-radius:50%;
      background:#9a3038;
      animation:pulse 1.1s ease-in-out infinite;
    }
    .error {
      margin-top:8px;
      font:500 9px/1.45 Arial,sans-serif;
      color:#7a1f2a;
    }
    .mini {
      margin-top:9px;
      padding-top:8px;
      border-top:1px dashed rgba(75,46,43,.12);
      font:500 8px/1.35 Arial,sans-serif;
      color:#9a8a79;
    }
    .toggle {
      width:26px;
      height:26px;
      border-radius:8px;
      background:transparent;
      color:#6e5b4c;
      font-size:17px;
      line-height:1;
    }
    .toggle:hover { background:rgba(75,46,43,.07); }
  `;
  shadow.appendChild(style);

  const shell = document.createElement("div");
  shell.className = "shell";
  shell.innerHTML = `
    <section class="card" aria-label="Tellme floating reader">
      <div class="top">
        <div class="mark">T</div>
        <div class="title-wrap">
          <div class="name">Tellme</div>
          <div class="state-line">
            <span class="dot" id="dot"></span>
            <span id="state-text">Ready</span>
          </div>
        </div>
        <span class="status-tag" id="status-tag">IDLE</span>
        <button class="toggle" id="toggle" aria-label="Hide Tellme">−</button>
      </div>

      <div class="body" id="body">
        <div class="source" id="source">Current tab</div>

        <div class="actions">
          <button class="action primary" id="listen">Listen to post</button>
          <button class="action" id="brief">Give me a brief</button>
        </div>

        <div class="controls">
          <button class="control" id="pause">Pause</button>
          <button class="control" id="next">Next</button>
          <button class="control" id="stop">Stop</button>
        </div>

        <div class="brief" id="brief-box" hidden></div>
        <div class="mini">Stays on this tab while Tellme works in the background.</div>
      </div>
    </section>
  `;
  shadow.appendChild(shell);

  const $ = (id) => shadow.getElementById(id);

  const stateText = $("state-text");
  const statusTag = $("status-tag");
  const dot = $("dot");
  const source = $("source");
  const listen = $("listen");
  const brief = $("brief");
  const pause = $("pause");
  const next = $("next");
  const stop = $("stop");
  const briefBox = $("brief-box");
  const body = $("body");
  const toggle = $("toggle");

  let hidden = false;
  let busy = false;

  const labels = {
    idle: ["Ready", "IDLE"],
    analyzing: ["Analyzing this page", "WORKING"],
    reading: ["Listening to this page", "LIVE"],
    paused: ["Paused", "PAUSED"],
    stopped: ["Stopped", "STOPPED"],
    complete: ["Finished", "DONE"],
    empty: ["Nothing to read", "IDLE"],
    error: ["Needs attention", "ERROR"]
  };

  function send(type, extra = {}) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, ...extra }, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ ok:false, error:chrome.runtime.lastError.message });
          return;
        }
        resolve(response || { ok:false });
      });
    });
  }

  function renderState(state) {
    if (!state) return;
    const [label, tag] = labels[state.status] || labels.idle;

    stateText.textContent = label;
    statusTag.textContent = tag;
    statusTag.className = "status-tag " + (state.status || "idle");
    dot.className = "dot " + (state.status || "");

    source.textContent = state.sourceTitle || "Current tab";

    const total = state.queue?.length || 0;
    const current = total ? Math.min((state.index || 0) + 1, total) : 0;

    if (state.status === "reading" && total) {
      source.textContent =
        (state.sourceTitle || "Current tab") + " · " + current + "/" + total;
    }

    pause.textContent = state.status === "paused" ? "Resume" : "Pause";
    pause.disabled = !["reading", "paused"].includes(state.status);
    next.disabled = !total || state.status === "complete";
    stop.disabled = !["reading", "paused", "analyzing"].includes(state.status);

    if (state.status === "analyzing") {
      listen.disabled = true;
      brief.disabled = true;
    } else if (!busy) {
      listen.disabled = false;
      brief.disabled = false;
    }
  }

  listen.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    listen.disabled = true;
    brief.disabled = true;
    listen.textContent = "Starting…";

    const response = await send("tellme-current-page");

    busy = false;
    listen.textContent = "Listen to post";

    if (!response.ok) {
      stateText.textContent = "Couldn't read this page";
      statusTag.textContent = "ERROR";
      statusTag.className = "status-tag error";
      listen.disabled = false;
      brief.disabled = false;
      return;
    }

    renderState(response.state || {
      status:"reading",
      index:0,
      queue:response.payload?.segments || []
    });
  });

  brief.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    listen.disabled = true;
    brief.disabled = true;
    brief.textContent = "Analyzing…";
    briefBox.hidden = false;
    briefBox.innerHTML = '<div class="loading"><i></i><span>Finding the useful parts and starting playback…</span></div>';

    const response = await send("tellme-brief");

    busy = false;
    brief.textContent = "Give me a brief";

    if (!response.ok) {
      briefBox.innerHTML = '<div class="error">Couldn\'t build the brief on this page.</div>';
      listen.disabled = false;
      brief.disabled = false;
      return;
    }

    briefBox.innerHTML = '<div class="mini">Brief ready — speaking now.</div>';
    renderState(response.state);
  });

  pause.addEventListener("click", async () => {
    const current = await send("tellme-reader-state");
    if (!current.ok) return;
    const command = current.state.status === "paused" ? "resume" : "pause";
    const response = await send("tellme-reader-command", { command });
    if (response.ok) renderState(response.state);
  });

  next.addEventListener("click", async () => {
    const response = await send("tellme-reader-command", { command:"next" });
    if (response.ok) renderState(response.state);
  });

  stop.addEventListener("click", async () => {
    const response = await send("tellme-reader-command", { command:"stop" });
    if (response.ok) renderState(response.state);
  });

  toggle.addEventListener("click", () => {
    hidden = !hidden;
    body.hidden = hidden;
    toggle.textContent = hidden ? "+" : "−";
    toggle.setAttribute("aria-label", hidden ? "Show Tellme" : "Hide Tellme");
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "tellme-reader-updated") {
      renderState(message.state);
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.tellmeReader?.newValue) {
      renderState(changes.tellmeReader.newValue);
    }
  });

  send("tellme-reader-state").then((response) => {
    if (response.ok) renderState(response.state);
  });
})();
