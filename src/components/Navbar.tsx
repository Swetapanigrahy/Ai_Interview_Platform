import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES } from "@/lib/roles";
import { useAuth, displayName } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/#features", label: "Features" },
  { to: "/#roles", label: "Roles", isRoles: true },
  { to: "/#how-it-works", label: "How it works" },
  { to: "/history", label: "History" },
];

function smoothScrollToHash(hash: string) {
  if (!hash) return;
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Smooth-scroll to hash anchors on the home page
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      setTimeout(() => smoothScrollToHash(location.hash), 50);
    }
  }, [location]);

  const handleHashNav = (to: string) => {
    setMobileOpen(false);
    if (to.startsWith("/#")) {
      const hash = to.slice(1);
      if (location.pathname === "/") {
        smoothScrollToHash(hash);
        window.history.replaceState(null, "", hash);
      } else {
        navigate("/" + hash);
      }
    } else {
      navigate(to);
    }
  };

  const linkClasses = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors px-1",
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Mic className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-foreground">
            Voca<span className="text-gradient">Hire</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l =>
            l.isRoles ? (
              <DropdownMenu key={l.to}>
                <DropdownMenuTrigger asChild>
                  <button className={linkClasses(false) + " inline-flex items-center gap-1"}>
                    {l.label}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-72 bg-popover border-border">
                  <DropdownMenuLabel className="text-muted-foreground">Choose a track</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ROLES.map(role => (
                    <DropdownMenuItem
                      key={role.slug}
                      onSelect={() => navigate(`/interview/${role.slug}`)}
                      className="cursor-pointer"
                    >
                      <span className="mr-3 text-base">{role.emoji}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.title}</span>
                        <span className="text-xs text-muted-foreground">{role.short}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : l.to.startsWith("/#") ? (
              <button key={l.to} className={linkClasses(false)} onClick={() => handleHashNav(l.to)}>
                {l.label}
              </button>
            ) : (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => linkClasses(isActive)}>
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground">
                  {displayName(user).split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuLabel className="text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/history")}>History</DropdownMenuItem>
                <DropdownMenuItem onSelect={async () => { await signOut(); navigate("/", { replace: true }); }}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              Sign in
            </Link>
          )}
          <Button
            onClick={() => navigate("/roles")}
            className="rounded-full bg-gradient-brand text-primary-foreground font-semibold shadow-button hover:opacity-95 hover:shadow-glow transition-all"
          >
            Start Interview
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-secondary"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navLinks.filter(l => !l.isRoles).map(l => (
              <button
                key={l.to}
                className="px-3 py-2 text-left text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={() => handleHashNav(l.to)}
              >
                {l.label}
              </button>
            ))}

            <div className="mt-3 mb-1 px-3 text-xs uppercase tracking-wider text-muted-foreground/70">Roles</div>
            {ROLES.map(role => (
              <button
                key={role.slug}
                onClick={() => { setMobileOpen(false); navigate(`/interview/${role.slug}`); }}
                className="flex items-center gap-3 px-3 py-2 text-left text-sm rounded-md hover:bg-secondary"
              >
                <span>{role.emoji}</span>
                <span>{role.title}</span>
              </button>
            ))}

            <div className="mt-4 flex gap-2">
              {user ? (
                <Button variant="outline" className="flex-1" onClick={async () => { await signOut(); setMobileOpen(false); navigate("/", { replace: true }); }}>
                  Sign out
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={() => { setMobileOpen(false); navigate("/sign-in"); }}>
                  Sign in
                </Button>
              )}
              <Button
                onClick={() => { setMobileOpen(false); navigate("/roles"); }}
                className="flex-1 rounded-full bg-gradient-brand text-primary-foreground font-semibold"
              >
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
