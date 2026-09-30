function loadVoices() {
  return window.speechSynthesis.getVoices().map((voice) => ({
    name: voice.name,
    lang: voice.lang,
    default: voice.default,
    localService: voice.localService
  }));
}

function findVoice(name) {
  if (!name) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.name === name) || null;
}

function speak(message, sendResponse) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message.text);
  const voice = findVoice(message.voiceName);

  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "en-US";
  utterance.rate = message.rate ?? 0.97;
  utterance.pitch = message.pitch ?? 1;

  utterance.onend = () => {
    chrome.runtime.sendMessage({ type: "tellme-speech-ended" }).catch(() => {});
    sendResponse?.({ ok: true });
  };

  utterance.onerror = (event) => {
    chrome.runtime.sendMessage({
      type: "tellme-speech-error",
      error: event.error || "speech error"
    }).catch(() => {});
    sendResponse?.({ ok: false, error: event.error || "speech error" });
  };

  window.speechSynthesis.speak(utterance);
  sendResponse?.({ ok: true });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "tellme-list-voices") {
    const voices = loadVoices();
    if (voices.length) {
      sendResponse({ ok: true, voices });
      return true;
    }

    const onVoices = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      sendResponse({ ok: true, voices: loadVoices() });
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoices, { once: true });
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      sendResponse({ ok: true, voices: loadVoices() });
    }, 1200);

    return true;
  }

  if (message?.type === "tellme-speak") {
    speak(message, sendResponse);
    return true;
  }

  if (message?.type === "tellme-pause") {
    window.speechSynthesis.pause();
    sendResponse({ ok: true });
    return false;
  }

  if (message?.type === "tellme-resume") {
    window.speechSynthesis.resume();
    sendResponse({ ok: true });
    return false;
  }

  if (message?.type === "tellme-stop") {
    window.speechSynthesis.cancel();
    sendResponse({ ok: true });
    return false;
  }

  return false;
});