import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ROLES } from "@/lib/roles";
import { ArrowRight } from "lucide-react";

export default function Roles() {
  return (
    <>
      <Helmet>
        <title>Roles — VocaHire</title>
        <meta name="description" content="Choose a role and start a hands-free AI mock interview." />
        <link rel="canonical" href="/roles" />
      </Helmet>
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl">Pick a track. Press start.</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Hand-crafted question banks for the roles people interview for most.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map(r => (
            <Link
              key={r.slug}
              to={`/interview/${r.slug}`}
              className="group rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur hover:border-primary/40 hover:bg-card transition-all"
            >
              <div className="text-3xl">{r.emoji}</div>
              <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Start interview <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
