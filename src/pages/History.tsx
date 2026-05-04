import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ROLES } from "@/lib/roles";

type SessionRow = {
  id: string;
  role: string;
  score: number | null;
  duration_seconds: number | null;
  created_at: string;
};

function roleTitle(slug: string) {
  return ROLES.find(r => r.slug === slug)?.title ?? slug;
}

function formatDuration(s: number | null) {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export default function History() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("interview_sessions")
        .select("id, role, score, duration_seconds, created_at")
        .order("created_at", { ascending: false });
      if (active) {
        if (!error && data) setSessions(data as SessionRow[]);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user]);

  return (
    <>
      <Helmet>
        <title>History — VocaHire</title>
        <meta name="description" content="Review your past VocaHire interview sessions." />
        <link rel="canonical" href="/history" />
      </Helmet>
      <section className="container mx-auto px-4 md:px-6 py-16">
        <h1 className="text-4xl md:text-5xl">Your history</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Sessions you complete will appear here.
        </p>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-12 text-center text-muted-foreground">
            Loading your sessions…
          </div>
        ) : sessions.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
            <div className="text-5xl">🗂️</div>
            <h2 className="mt-4 text-xl font-bold">No sessions yet</h2>
            <p className="mt-2 text-muted-foreground">Start your first interview and your transcript will land here.</p>
            <Button asChild className="mt-6 rounded-full bg-gradient-brand text-primary-foreground font-semibold shadow-button">
              <Link to="/roles">Start interview</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-3">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5">
                <div>
                  <div className="font-semibold">{roleTitle(s.role)}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div><span className="text-muted-foreground">Duration: </span>{formatDuration(s.duration_seconds)}</div>
                  <div><span className="text-muted-foreground">Score: </span>{s.score ?? "—"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
