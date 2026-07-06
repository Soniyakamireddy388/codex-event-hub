import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LOGO = "https://res.cloudinary.com/snbrllpp/image/upload/f_auto,q_auto/vvisc_logo_six37g";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Event" },
  { to: "/rules", label: "Rules" },
  { to: "/deployment", label: "Deploy" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={LOGO} alt="VVISC logo" className="h-10 w-10 shrink-0 rounded-full ring-2 ring-primary/40" />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-sm font-bold tracking-widest neon-text sm:text-base">CODE RUSH 1.0</div>
            <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">VVISC · VVIT</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary neon-text" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="ml-2 rounded-md border border-primary/60 bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground neon-border"
          >
            Login
          </Link>
        </nav>

        <button
          className="rounded-md border border-border p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-primary" }}
                className="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-md border border-primary/60 bg-primary/10 px-3 py-2 text-center text-sm font-bold uppercase tracking-wider text-primary"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
