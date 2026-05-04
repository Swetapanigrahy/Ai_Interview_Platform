import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Mic } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach(i => { fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      await signUp(parsed.data.name, parsed.data.email, parsed.data.password);
      toast({ title: "Account created!", description: "Welcome to VocaHire." });
      navigate("/roles", { replace: true });
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign up — VocaHire</title>
        <meta name="description" content="Create your free VocaHire account and start practicing voice interviews with our AI agent." />
        <link rel="canonical" href="/sign-up" />
      </Helmet>
      <section className="container mx-auto max-w-md px-4 py-20">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="mt-5 text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start practicing voice interviews in under a minute.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-card">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name" autoComplete="name" required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email" type="email" autoComplete="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password" type="password" autoComplete="new-password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>
          <Button type="submit" className="w-full rounded-full bg-gradient-brand text-primary-foreground font-semibold shadow-button hover:shadow-glow h-11" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </section>
    </>
  );
}
