// Browser-native speech: SpeechRecognition (STT) + speechSynthesis (TTS).
// Mobile-aware: iOS Safari uses non-continuous mode + auto-restart.

type SR = any;
const SpeechRecognitionCtor: any =
  (typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
  null;

export const speechSupported = !!SpeechRecognitionCtor &&
  typeof window !== "undefined" && "speechSynthesis" in window;

export const isIOS = typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod/i.test(navigator.userAgent);
export const isAndroid = typeof navigator !== "undefined" &&
  /Android/i.test(navigator.userAgent);
export const isMobile = isIOS || isAndroid ||
  (typeof navigator !== "undefined" && /Mobile/i.test(navigator.userAgent));

export const isSecureContextOk = typeof window === "undefined"
  ? true
  : window.isSecureContext || window.location.hostname === "localhost";

export type RecognizerError =
  | "not-allowed"
  | "no-speech"
  | "network"
  | "audio-capture"
  | "service-not-allowed"
  | "aborted"
  | string;

export type Listener = {
  start: () => void;
  stop: () => void;
};

/**
 * Request mic permission. MUST be called from a user gesture handler on mobile.
 */
export async function requestMicPermission(): Promise<{ ok: boolean; error?: string }> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return { ok: false, error: "Microphone API not available in this browser." };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Release immediately — SpeechRecognition will open its own stream.
    stream.getTracks().forEach(t => t.stop());
    return { ok: true };
  } catch (err: any) {
    const name = err?.name || "";
    if (name === "NotAllowedError" || name === "SecurityError") {
      return { ok: false, error: "Permission denied. Please allow microphone access in your browser settings." };
    }
    if (name === "NotFoundError") return { ok: false, error: "No microphone found on this device." };
    if (name === "NotReadableError") return { ok: false, error: "Microphone is in use by another app." };
    return { ok: false, error: err?.message || "Could not access microphone." };
  }
}

export function createRecognizer(opts: {
  onPartial?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (err: RecognizerError) => void;
  silenceMs?: number;
}): Listener {
  if (!SpeechRecognitionCtor) {
    return { start: () => opts.onError?.("not-supported"), stop: () => {} };
  }

  const recog: SR = new SpeechRecognitionCtor();
  // iOS Safari: must be non-continuous and we manually restart in onend.
  // Android Chrome: continuous + interim works well for longer answers.
  recog.continuous = !isIOS;
  recog.interimResults = !isIOS;
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
    const code = e?.error || "unknown";
    if (code === "no-speech") {
      // Common on mobile during pauses — let onend restart.
      opts.onError?.("no-speech");
      return;
    }
    if (code === "aborted") return;
    opts.onError?.(code);
  };

  recog.onend = () => {
    // iOS auto-stops after each utterance; restart while turn is still active.
    if (running && !finalized) {
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
