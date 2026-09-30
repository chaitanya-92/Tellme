# Tellme — Chrome Web Store Listing

## Store name

Tellme — Web, Spoken

## Short description

Turn webpages, Reddit posts, comments and replies into spoken stories, with a quick brief when you need the gist.

## Category

Productivity

## Language

English

## Detailed description

Tellme turns the page you are already reading into something you can listen to.

Open a webpage or Reddit discussion and Tellme gives you a floating reader directly on the page. Choose **Listen to post** to hear the useful parts in order, or choose **Give me a brief** to generate a concise brief and start speaking it immediately.

For Reddit discussions, Tellme separates the post from the conversation, introduces the discussion naturally, understands comment/reply nesting, avoids reading usernames aloud, and can use different available browser voices for different commenters.

Tellme also expands common internet shorthand while speaking, such as CFBR, IDK, IMO, TL;DR, OP, TIL, ELI5, AMA, AITA, NTA and similar abbreviations.

### Features

- Floating reader available across normal web pages
- Listen to webpages and Reddit discussions without leaving the current tab
- Quick brief that starts speaking immediately
- Natural story-style narration for posts, comments and replies
- Different voices for distinct commenters when available
- Common web and Reddit shorthand expanded for spoken clarity
- Pause, resume, next and stop controls
- Keeps narration running while you switch tabs
- No account required

### Privacy

Tellme processes page text for reading and local brief generation. Reader state and captured source metadata are stored in Chrome's local extension storage. The current extension does not send webpage content to an analytics or advertising service.

Privacy policy:
https://github.com/chaitanya-92/Tellme/blob/main/PRIVACY.md

## Single purpose statement

Tellme's single purpose is to convert webpage content into accessible spoken narration and a concise spoken brief.

## Permission justifications

### activeTab

Used to inspect the currently active webpage after the user starts a reading or brief action.

### scripting

Used to extract readable page content, including Reddit posts, comments and replies, from the active tab.

### storage

Used to persist reader state and captured source information locally so narration can continue while the user changes tabs.

### contextMenus

Used to provide "Tellme this page" and "Tellme this selection" context-menu actions.

### offscreen

Used to keep browser speech playback running when the extension popup is closed or the user switches tabs.

### <all_urls>

The floating Tellme reader is intentionally available on normal HTTP and HTTPS webpages, rather than being restricted to one website.

## Suggested distribution

Use **Unlisted** for the initial launch if you want anyone with the Chrome Web Store URL to install Tellme without making it searchable in the store. Use **Public** when you are ready for normal store discovery.

## Store assets

Required/important listing assets should show the actual Tellme UI:
- 128x128 store icon
- At least one 1280x800 or 640x400 screenshot
- Small promotional tile if requested by the dashboard
- Optional marquee tile and YouTube demo

Keep screenshots focused on the actual floating Tellme experience and current functionality.
