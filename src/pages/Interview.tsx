import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, PhoneOff, Loader2 } from "lucide-react";
import { getRole } from "@/lib/roles";
import { cancelSpeak, createRecognizer, speak, speechSupported, type Listener } from "@/lib/speech";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Turn = { role: "alex" | "you"; text: string; ts: number };
type Phase = "idle" | "alex-speaking" | "listening" | "thinking" | "ended";

export default function Interview() {
  const { role: roleSlug } = useParams<{ role: string }>();
  const role = roleSlug ? getRole(roleSlug) : null;

  if (!roleSlug) return <Navigate to="/roles" replace />;
  if (!role) {
    return (
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Role not found</h1>
        <p className="mt-2 text-muted-foreground">We don't have an interview track for "{roleSlug}".</p>
        <Button asChild className="mt-6"><Link to="/roles">Browse roles</Link></Button>
      </section>
    );
  }

  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [partial, setPartial] = useState("");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [followUpsThisQ, setFollowUpsThisQ] = useState(0);

  const recognizerRef = useRef<Listener | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const qIdxRef = useRef(0);
  const followUpsRef = useRef(0);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { qIdxRef.current = questionIdx; }, [questionIdx]);
  useEffect(() => { followUpsRef.current = followUpsThisQ; }, [followUpsThisQ]);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, partial]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => {
      cancelSpeak();
      recognizerRef.current?.stop();
    };
  }, []);

  const buildAlexReply = (userText: string): { text: string; advance: boolean } => {
    const wordCount = userText.trim().split(/\s+/).length;
    const tooShort = wordCount < 8;
    const maxFollowUps = 1;

    if (tooShort && followUpsRef.current < maxFollowUps) {
      const fu = role.followUps[Math.min(followUpsRef.current, role.followUps.length - 1)];
      return { text: fu, advance: false };
    }

    const nextIdx = qIdxRef.current + 1;
    if (nextIdx >= role.questions.length) {
      return {
        text: `Great — that was the last question. Thanks for the conversation. You did a solid job covering ${role.short.toLowerCase()} topics. Good luck out there!`,
        advance: true,
      };
    }
    const ack = ["Thanks for sharing.", "Great, thanks.", "Got it, thanks."][nextIdx % 3];
    return { text: `${ack} Next question — ${role.questions[nextIdx]}`, advance: true };
  };

  const startListening = () => {
    if (!speechSupported) {
      toast({
        title: "Voice not supported",
        description: "Please use Chrome, Edge, or Safari for hands-free voice mode.",
        variant: "destructive",
      });
      return;
    }
    setPartial("");
    setPhase("listening");
    if (!recognizerRef.current) {
      recognizerRef.current = createRecognizer({
        silenceMs: 2000,
        onPartial: (t) => setPartial(t),
        onFinal: (text) => handleCandidateFinal(text),
        onError: (err) => {
          if (err === "not-allowed" || err === "service-not-allowed") {
            toast({ title: "Microphone blocked", description: "Please allow mic access in your browser.", variant: "destructive" });
            setPhase("idle");
          }
        },
      });
    }
    recognizerRef.current.start();
  };

  const stopListening = () => {
    recognizerRef.current?.stop();
    setPartial("");
  };

  const alexSays = (text: string, after: () => void) => {
    setPhase("alex-speaking");
    setTurns(t => [...t, { role: "alex", text, ts: Date.now() }]);
    // Stop any active recognizer before TTS — mobile can't do both at once.
    recognizerRef.current?.stop();
    speak(text, () => {
      // Small delay helps mobile release the audio session before mic restart.
      window.setTimeout(after, 250);
    });
  };

  const handleCandidateFinal = (text: string) => {
    if (phaseRef.current === "ended") return;
    stopListening();
    setTurns(t => [...t, { role: "you", text, ts: Date.now() }]);
    setPhase("thinking");

    window.setTimeout(() => {
      const reply = buildAlexReply(text);
      const isLast = qIdxRef.current + 1 >= role.questions.length && reply.advance;

      if (reply.advance && !isLast) {
        setQuestionIdx(i => i + 1);
        setFollowUpsThisQ(0);
      } else if (!reply.advance) {
        setFollowUpsThisQ(n => n + 1);
      }

      alexSays(reply.text, () => {
        if (isLast) {
          setPhase("ended");
          return;
        }
        startListening();
      });
    }, 600);
  };

  const beginInterview = async () => {
    if (!speechSupported) {
      toast({
        title: "Voice not supported here",
        description: "Use Chrome, Edge, or Safari — the browser's speech APIs are required.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast({ title: "Microphone access required", variant: "destructive" });
      return;
    }
    setTurns([]);
    setQuestionIdx(0);
    setFollowUpsThisQ(0);
    qIdxRef.current = 0;
    followUpsRef.current = 0;

    const intro = `Hi, I'm Alex, your AI interviewer. Today we'll do a ${role.title.toLowerCase()} mock interview. ${role.questions[0]}`;
    alexSays(intro, () => startListening());
  };

  const endInterview = () => {
    cancelSpeak();
    stopListening();
    setPhase("ended");
  };

  const status = useMemo(() => {
    switch (phase) {
      case "idle": return "Ready to start";
      case "alex-speaking": return "Alex is speaking…";
      case "listening": return "Listening — speak naturally";
      case "thinking": return "Alex is thinking…";
      case "ended": return "Interview complete";
    }
  }, [phase]);

  return (
    <>
      <Helmet>
        <title>{role.title} Interview — VocaHire</title>
        <meta name="description" content={`Hands-free voice mock interview for ${role.title}. Practice with VocaHire's AI agent Alex.`} />
        <link rel="canonical" href={`/interview/${role.slug}`} />
      </Helmet>

      <section className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">
              <Link to="/roles" className="hover:text-foreground">Roles</Link> / {role.short}
            </div>
            <h1 className="mt-1 text-3xl md:text-4xl flex items-center gap-3">
              <span>{role.emoji}</span> {role.title} Interview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Question</div>
            <div className="text-2xl font-bold text-gradient">
              {Math.min(questionIdx + 1, role.questions.length)} / {role.questions.length}
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="mt-8 rounded-3xl border border-border/60 bg-card/50 backdrop-blur p-10 shadow-card">
          <div className="flex flex-col items-center gap-6">
            {/* Avatar / mic indicator */}
            <div className="relative">
              {phase === "listening" && (
                <span className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-ring" />
              )}
              <div className={cn(
                "relative flex h-32 w-32 items-center justify-center rounded-full transition-all",
                phase === "alex-speaking" ? "bg-gradient-brand shadow-glow" :
                phase === "listening" ? "bg-primary/15 ring-2 ring-primary" :
                phase === "thinking" ? "bg-secondary" :
                "bg-secondary"
              )}>
                {phase === "alex-speaking" ? (
                  <Volume2 className="h-12 w-12 text-primary-foreground" />
                ) : phase === "listening" ? (
                  <Mic className="h-12 w-12 text-primary" />
                ) : phase === "thinking" ? (
                  <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                ) : (
                  <MicOff className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{status}</div>
              {phase === "listening" && partial && (
                <div className="mt-3 text-base text-foreground italic max-w-xl">
                  "{partial}"
                </div>
              )}
            </div>

            {/* Single control: only Start (or End once running) */}
            {phase === "idle" && (
              <Button
                size="lg"
                className="rounded-full bg-gradient-brand text-primary-foreground font-semibold shadow-button hover:shadow-glow h-12 px-7"
                onClick={beginInterview}
              >
                <Mic className="mr-2 h-5 w-5" /> Start Interview
              </Button>
            )}

            {phase !== "idle" && phase !== "ended" && (
              <Button variant="outline" size="sm" onClick={endInterview} className="rounded-full">
                <PhoneOff className="mr-2 h-4 w-4" /> End interview
              </Button>
            )}

            {phase === "ended" && (
              <div className="flex gap-2">
                <Button onClick={beginInterview} className="rounded-full bg-gradient-brand text-primary-foreground font-semibold shadow-button">
                  Restart
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/roles">Try another role</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Live transcript</h2>
          <div
            ref={transcriptRef}
            className="max-h-[420px] overflow-y-auto rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-4 space-y-3"
          >
            {turns.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-10">
                Press <strong className="text-foreground">Start Interview</strong> — after that it's fully hands-free.
                Just speak naturally and pause when you're done.
              </div>
            )}
            {turns.map((t, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm leading-relaxed",
                  t.role === "alex"
                    ? "bg-primary/10 border border-primary/20 text-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                <div className="text-xs font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                  {t.role === "alex" ? "Alex" : "You"}
                </div>
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {!speechSupported && (
          <p className="mt-4 text-sm text-destructive">
            Heads up: your browser doesn't support the Web Speech API. Use Chrome, Edge, or Safari for the hands-free experience.
          </p>
        )}
      </section>
    </>
  );
}
