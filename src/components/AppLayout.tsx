import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Mic } from "lucide-react";
import { Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6 py-6 text-sm">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
              <Mic className="h-3.5 w-3.5 text-primary-foreground" />
            </span>
            <span>Voca<span className="text-gradient">Hire</span></span>
          </Link>
          <p className="text-muted-foreground">© {new Date().getFullYear()} VocaHire. Practice. Perform. Get hired.</p>
          <div className="flex gap-6 text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
