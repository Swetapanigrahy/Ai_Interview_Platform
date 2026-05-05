// speech.ts — Fixed for mobile + desktop (Chrome, Edge, Safari, Android, iOS)

type SR = any;

const SpeechRecognitionCtor: any =
  (typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
  null;

export const speechSupported =
  !!SpeechRecognitionCtor &&
  typeof window !== "undefined" &&
  "speechSynthesis" in window;

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
    return {
      start: () => opts.onError?.("Speech recognition not supported"),
      stop: () => {},
    };
  }

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // Silence window: how long after last word before we treat it as "done speaking"
  const silenceMs = opts.silenceMs ?? (isMobile ? 1800 : 2000);

  // ── mutable state (fully reset on every .start()) ──────────────────────────
  let recog: SR = null;
  let finalBuffer = "";
  let interimBuffer = "";
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  let running = false;
  let committed = false; // true once onFinal has been fired for this turn

  // ── helpers ─────────────────────────────────────────────────────────────────
  function clearSilence() {
    if (silenceTimer !== null) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
  }

  function commitFinal() {
    // Only fire once per turn
    if (committed || !running) return;
    const text = (finalBuffer + interimBuffer).trim();
    if (!text) return; // nothing to commit yet — wait longer
    committed = true;
    running = false;
    clearSilence();
    try { recog?.stop(); } catch {}
    opts.onFinal(text);
  }

  function armSilence() {
    clearSilence();
    silenceTimer = setTimeout(commitFinal, silenceMs);
  }

  // ── build a fresh SpeechRecognition instance ─────────────────────────────────
  // BUG FIX: We NEVER reuse an old instance. Every .start() creates a new one.
  // Reusing left `committed=true` permanently, silencing every answer after Q1.
  function buildRecog(): SR {
    const r: SR = new SpeechRecognitionCtor();

    // continuous=true on desktop; iOS/Android ignore it so we auto-restart in onend
    r.continuous = !isMobile;
    // interimResults=true = words appear on screen AS you speak (not just after pause)
    r.interimResults = true;
    r.lang = "en-US";
    r.maxAlternatives = 1;

    r.onresult = (e: any) => {
      let newFinal = "";
      let newInterim = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          newFinal += res[0].transcript;
        } else {
          newInterim += res[0].transcript;
        }
      }

      if (newFinal) finalBuffer += newFinal + " ";
      interimBuffer = newInterim;

      const combined = (finalBuffer + interimBuffer).trim();
      if (combined) {
        // Show text immediately as user speaks
        opts.onPartial?.(combined);
        // Reset the silence countdown on every new word
        armSilence();
      }
    };

    r.onerror = (e: any) => {
      const err: string = e.error ?? "";
      // These are completely normal on mobile — never treat as fatal
      if (err === "no-speech" || err === "aborted") return;
      if (err === "not-allowed" || err === "service-not-allowed") {
        running = false;
        opts.onError?.("not-allowed");
        return;
      }
      // network / audio-capture etc — surface to caller
      opts.onError?.(err || "recognition error");
    };

    r.onend = () => {
      // BUG FIX: iOS Safari and many Android browsers stop after EVERY short
      // pause. Auto-restart keeps listening until the user has clearly finished.
      if (running && !committed) {
        setTimeout(() => {
          if (running && !committed) {
            try { recog?.start(); } catch {}
          }
        }, 100);
      }
    };

    return r;
  }

  // ── public API ───────────────────────────────────────────────────────────────
  return {
    start() {
      // Full state reset — critical so Q2, Q3... work the same as Q1
      finalBuffer = "";
      interimBuffer = "";
      committed = false;
      running = true;
      clearSilence();

      // Tear down any previous instance before creating a new one
      try { recog?.abort(); } catch {}
      recog = buildRecog();

      try {
        recog.start();
        // BUG FIX: Do NOT arm the silence timer here.
        // Old code did armSilence() on start(), meaning the timer fired
        // immediately with empty text and then locked committed=… wait, worse:
        // it tried commitFinal with empty text (returns early) but re-armed
        // each time, causing weird race conditions on low-end phones.
      } catch {
        opts.onError?.("Could not start microphone.");
      }
    },

    stop() {
      running = false;
      committed = true; // stop onend from restarting
      clearSilence();
      try { recog?.stop(); } catch {}
    },
  };
}

// ── Text-to-speech ────────────────────────────────────────────────────────────
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

  // Pick the best available voice
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find(
      (v) => /en-US/i.test(v.lang) && /Google|Natural|Samantha|Aria/i.test(v.name)
    ) ||
    voices.find((v) => /en-US/i.test(v.lang)) ||
    voices[0];
  if (preferred) u.voice = preferred;

  // BUG FIX: speechSynthesis.onend sometimes NEVER fires on Android/iOS Chrome,
  // freezing the interview permanently. A watchdog timer guarantees progress.
  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    clearTimeout(watchdog);
    onEnd?.();
  };

  // Estimate duration: ~130 wpm average + 3 s buffer
  const wordCount = text.trim().split(/\s+/).length;
  const watchdogMs = Math.max(5000, (wordCount / 130) * 60_000 + 3000);
  const watchdog = setTimeout(fire, watchdogMs);

  u.onend = fire;
  u.onerror = fire;

  window.speechSynthesis.speak(u);
}

export function cancelSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
