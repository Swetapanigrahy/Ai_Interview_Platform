import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/roles";
import { ArrowRight, Sparkles, Mic, MessageSquare, FileText, Gauge, Layers, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/voice-hero.jpg";

const features = [
  { icon: Mic,         title: "Real-time voice",      desc: "Talk like you would in a real interview. Sub-second response, lifelike tone." },
  { icon: MessageSquare, title: "Adaptive interviewer", desc: "Follow-up questions tailored to your answers, not a static script." },
  { icon: FileText,    title: "Live transcript",      desc: "Every word captured as you speak. Review, copy, or share later." },
  { icon: Gauge,       title: "Instant scoring",      desc: "Clarity, confidence, and depth scored across the whole conversation." },
  { icon: Layers,      title: "Any role",             desc: "Engineering, product, design, data, and more — six tracks ready today." },
  { icon: ShieldCheck, title: "Private by default",   desc: "Sessions live on your device until you choose to sync them." },
];

const steps = [
  { n: "01", title: "Choose your role",     desc: "Pick the track that matches the job you're after." },
  { n: "02", title: "Have a conversation",  desc: "Speak naturally. The interviewer listens, asks follow-ups, and keeps it real." },
  { n: "03", title: "Get the receipts",     desc: "Score, transcript, and feedback — all yours within seconds of finishing." },
];

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>VocaHire — Real-Time AI Voice Interview Platform</title>
        <meta name="description" content="Practice realistic, real-time mock interviews with VocaHire's AI voice interviewer. Live transcript, instant scoring, six role tracks." />
        <link rel="canonical" href="/" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Real-time AI voice interviewer
                <span className="ml-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-bold tracking-wide ring-1 ring-primary/30">NEW</span>
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
                Practice interviews with a voice that{" "}
                <span className="text-gradient">actually listens.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                VocaHire runs realistic, real-time mock interviews. Speak naturally, get a live transcript,
                and walk away with scoring and feedback you can actually use.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("/roles")}
                  className="rounded-full bg-gradient-brand text-primary-foreground font-semibold shadow-button hover:shadow-glow hover:opacity-95 transition-all px-6 h-12"
                >
                  Start free interview <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full border-border/60 bg-card/40 text-foreground font-semibold h-12 px-6 hover:bg-card"
                >
                  See how it works
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["#22d3ee", "#a78bfa", "#f472b6", "#facc15"].map((c, i) => (
                    <span
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">12,000+</span>{" "}
                  <span className="text-muted-foreground">interviews practiced this month</span>
                </div>
              </div>
            </div>

            {/* Right — neon waveform */}
            <div className="relative animate-float-slow">
              <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-card">
                <img
                  src={heroImg}
                  alt="Neon AI voice waveform visualization"
                  width={1280}
                  height={1280}
                  className="w-full h-auto"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl glass border border-border/60 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Live now</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">"Tell me about a project you're proud of…"</div>
                </div>
              </div>
              {/* glow */}
              <div className="absolute -inset-10 -z-10 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl">Built like the real thing.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to practice with confidence — none of the awkward silences.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur hover:border-primary/40 hover:bg-card transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand/20 ring-1 ring-primary/30 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl">Pick a track. Press start.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hand-crafted question banks for the roles people interview for most.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.slice(0, 6).map((r) => (
              <Link
                key={r.slug}
                to={`/interview/${r.slug}`}
                className="group rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur hover:border-primary/40 hover:bg-card transition-all"
              >
                <div className="text-3xl">{r.emoji}</div>
                <h3 className="mt-4 text-lg">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Start interview <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl">Three steps. Zero awkwardness.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop rehearsing alone in the mirror. Talk to something that talks back.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border/60 bg-card/50 p-7 backdrop-blur">
                <div className="text-4xl font-bold text-gradient">{s.n}</div>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur px-6 py-16 md:py-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "var(--gradient-bg)" }} />
            <h2 className="text-4xl md:text-5xl max-w-3xl mx-auto leading-tight">
              Your next interview is{" "}
              <span className="text-gradient">already over</span>{" "}
              — you just haven't done it yet.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Practice once. Walk in calm. Walk out hired.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/roles")}
              className="mt-8 rounded-full bg-gradient-brand text-primary-foreground font-semibold shadow-button hover:shadow-glow px-7 h-12"
            >
              Start your first interview <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
