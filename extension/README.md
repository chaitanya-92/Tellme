# Tellme Browser Extension

The browser extension lives in the same repository as the Tellme web app so the product, extension, and future listening pipeline can evolve together.

## Current milestone

- Manifest V3 extension.
- Editorial Tellme popup UI.
- Captures the active page title, URL, selected text, and up to 120k characters of page text.
- Stores the captured source as `tellmeSource` in extension storage.
- Opens the Tellme web app with `?source=extension`.
- Adds a **Tellme this page** context-menu action.
- Adds Cmd/Ctrl + Shift + T shortcut.
- Uses the Chromium TTS engine to read a structured queue in order.
- On Reddit, reads post title → post description → comments → nested replies.
- Popup controls: pause/resume, next passage, and stop.

## Run locally

Start the web app:

`npm run dev`

Then open your Chromium-based browser's extensions page, enable Developer Mode, choose **Load unpacked**, and select this `extension/` directory.

Opera, Chrome, Edge, and other Chromium browsers can load the Manifest V3 build.

## Architecture

`popup.html` + `popup.css` + `popup.js` provide the compact UI.

`background.js` owns the context menu, keyboard shortcut, source capture, and handoff to the web app.

The next product layer is the real listening pipeline: clean article extraction, API handoff, summarization, streaming TTS, transcript state, and Ask Tellme.


## Narration rules

Tellme's reader is intentionally conversational rather than screen-reader-like:

- Emojis and common decorative emoji sequences are removed before narration.
- The title gets a short spoken introduction.
- The post description/body is introduced separately so the listener knows the context.
- The transition into comments explicitly introduces the discussion.
- People are never named aloud; comments use phrases such as “one person said,” “another person said,” and “someone replied to that.”
- Replies keep their position in the thread and are narrated as part of the surrounding conversation.
- A speaker voice is assigned to each distinct commenter internally, but the displayed username is not spoken.
- Different available English voices are rotated between commenters; the narrator voice is kept for title/context transitions.
- Long passages are split into smaller speech chunks so playback remains natural.
- The reader lives in an offscreen audio document, so switching tabs does not change the reading source.
