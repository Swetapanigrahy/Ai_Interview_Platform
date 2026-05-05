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
  silenceMs?: number;
}): Listener {
  if (!SpeechRecognitionCtor) {
    return { start: () => opts.onError?.("Speech recognition not supported"), stop: () => {} };
  }

  const isMobile = typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const silenceMs = opts.silenceMs ?? (isMobile ? 1800 : 2000);

  // FIX A: All mutable state lives here and is fully reset on every .start().
  let recog: SR = null;
  let finalBuffer = "";
  let silenceTimer: number | null = null;
  let running = false;
  let finalized = false;

  const clearSilence = () => {
    if (silenceTimer !== null) {
      window.clearTimeout(silenceTimer);
      silenceTimer = null;
    }
  };

  const armSilence = () => {
    clearSilence();
    silenceTimer = window.setTimeout(() => {
      const text = finalBuffer.trim();
      // FIX B: Only fire onFinal if there is actual text.
      // Old code called armSilence() on .start() BEFORE the user spoke,
      // so the timer fired with empty text, set finalized=true, and all
      // future results were silently discarded for every question after Q1.
      if (text.length > 0 && !finalized) {
        finalized = true;
        running = false;
        clearSilence();
        try { recog?.stop(); } catch {}
        opts.onFinal(text);
      }
    }, silenceMs);
  };

  const buildRecog = () => {
    const r: SR = new SpeechRecognitionCtor();
    r.continuous = !isMobile; // iOS Safari ignores this; we handle restarts in onend
    r.interimResults = true;  // KEY: shows text immediately as user speaks
    r.lang = "en-US";
    r.maxAlternatives = 1;

    r.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          finalBuffer += res[0].transcript + " ";
        } else {
          interim += res[0].transcript;
        }
      }
      // Show live partial text immediately as user speaks
      opts.onPartial?.((finalBuffer + interim).trim());
      // FIX C: Only arm silence timer when there is actual speech content
      if ((finalBuffer + interim).trim().length > 0) {
        armSilence();
      }
    };

    r.onerror = (e: any) => {
      // FIX D: no-speech and aborted are completely normal on mobile.
      // no-speech fires on every pause; aborted fires on manual .stop().
      // Neither should stop the session or show an error.
      if (e.error === "no-speech" || e.error === "aborted") return;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        running = false;
        opts.onError?.("not-allowed");
        return;
      }
      opts.onError?.(e.error || "recognition error");
    };

    r.onend = () => {
      // FIX E: Auto-restart — iOS Safari and many Android browsers stop the
      // recognizer after every short pause even with continuous=true.
      // We restart as long as the user hasn't explicitly ended the turn.
      if (running && !finalized) {
        window.setTimeout(() => {
          if (running && !finalized) {
            try { recog?.start(); } catch {}
          }
        }, 150);
      }
    };

    return r;
  };

  return {
    start: () => {
      // FIX F: Reset ALL state — especially finalized — on every new start.
      // Old code reused the same recognizer object across questions, so
      // finalized stayed true after Q1 and silently killed Q2, Q3, etc.
      finalBuffer = "";
      finalized = false;
      running = true;
      clearSilence();

      // Always create a fresh instance to avoid InvalidStateError on mobile
      try { recog?.abort(); } catch {}
      recog = buildRecog();

      try {
        recog.start();
        // FIX G: Do NOT call armSilence() here.
        // Old code armed a timer on .start() before the user spoke a single word,
        // causing it to fire immediately with empty text and freeze the interview.
      } catch {
        opts.onError?.("Could not start speech recognition.");
      }
    },

    stop: () => {
      running = false;
      finalized = true; // prevent onend from triggering a restart
      clearSilence();
      try { recog?.stop(); } catch {}
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

  // FIX H: On mobile, speechSynthesis can stall silently and never fire onend.
  // A watchdog timer ensures the interview always continues even if TTS hangs.
  let ended = false;
  const wordCount = text.trim().split(/\s+/).length;
  const estimatedMs = Math.max(5000, (wordCount / 130) * 60000 + 3000);
  const watchdog = window.setTimeout(() => {
    if (!ended) { ended = true; onEnd?.(); }
  }, estimatedMs);

  u.onend = () => {
    if (!ended) { ended = true; window.clearTimeout(watchdog); onEnd?.(); }
  };
  u.onerror = () => {
    if (!ended) { ended = true; window.clearTimeout(watchdog); onEnd?.(); }
  };

  window.speechSynthesis.speak(u);
}

export function cancelSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
