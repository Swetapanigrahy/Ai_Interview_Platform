// Browser-native speech: SpeechRecognition (STT) + speechSynthesis (TTS).
// Works in Chrome / Edge / Safari (latest). Firefox: limited.

type SR = any;
const SpeechRecognitionCtor: any =
  (typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
  null;

export const speechSupported = !!SpeechRecognitionCtor &&
  typeof window !== "undefined" && "speechSynthesis" in window;

export type Listener = {
  start: () => void;
  stop: () => void;
};

export function createRecognizer(opts: {
  onPartial?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (err: string) => void;
  silenceMs?: number; // declare end-of-turn after this much silence
}): Listener {
  if (!SpeechRecognitionCtor) {
    return { start: () => opts.onError?.("Speech recognition not supported"), stop: () => {} };
  }
  const isMobile = typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const recog: SR = new SpeechRecognitionCtor();
  // Mobile browsers (especially iOS Safari) don't support continuous mode reliably.
  recog.continuous = !isMobile;
  recog.interimResults = true;
  recog.lang = "en-US";

  let finalBuffer = "";
  let silenceTimer: number | null = null;
  let running = false;
  let finalized = false;
  const silenceMs = opts.silenceMs ?? (isMobile ? 1500 : 2000);

  const clearSilence = () => {
    if (silenceTimer) { window.clearTimeout(silenceTimer); silenceTimer = null; }
  };
  const armSilence = () => {
    clearSilence();
    silenceTimer = window.setTimeout(() => {
      const text = finalBuffer.trim();
      if (text.length > 0 && !finalized) {
        finalized = true;
        finalBuffer = "";
        running = false;
        try { recog.stop(); } catch {}
        opts.onFinal(text);
      }
    }, silenceMs);
  };

  recog.onresult = (e: any) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalBuffer += r[0].transcript + " ";
      else interim += r[0].transcript;
    }
    opts.onPartial?.((finalBuffer + interim).trim());
    armSilence();
  };
  recog.onerror = (e: any) => {
    if (e.error === "no-speech") {
      // On mobile, no-speech fires often; let onend restart.
      return;
    }
    if (e.error !== "aborted") {
      opts.onError?.(e.error || "recognition error");
    }
  };
  recog.onend = () => {
    if (running && !finalized) {
      // auto-restart if turn hasn't ended (needed on mobile non-continuous mode)
      try { recog.start(); } catch {}
    }
  };

  return {
    start: () => {
      finalBuffer = "";
      finalized = false;
      running = true;
      try { recog.start(); armSilence(); } catch {}
    },
    stop: () => {
      running = false;
      clearSilence();
      try { recog.stop(); } catch {}
    },
  };
}

export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  u.pitch = 1;
  u.lang = "en-US";
  // prefer a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find(v => /en-US/i.test(v.lang) && /Google|Natural|Samantha|Aria/i.test(v.name)) ||
    voices.find(v => /en-US/i.test(v.lang)) ||
    voices[0];
  if (preferred) u.voice = preferred;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

export function cancelSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
