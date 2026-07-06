import { Link } from "@tanstack/react-router";

const LOGO = "https://res.cloudinary.com/snbrllpp/image/upload/f_auto,q_auto/vvisc_logo_six37g";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border/50 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex items-start gap-4">
          <img src={LOGO} alt="VVISC logo" className="h-14 w-14 rounded-full ring-2 ring-primary/40" />
          <div>
            <div className="font-display text-lg font-bold neon-text">CODE RUSH 1.0</div>
            <p className="mt-1 text-sm text-muted-foreground">Online Technical Quiz & Debugging Challenge</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-primary">Code. Compete. Conquer.</p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm uppercase tracking-widest text-primary">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Event</Link></li>
            <li><Link to="/rules" className="hover:text-primary">Rules</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm uppercase tracking-widest text-primary">Organised by</h4>
          <p className="text-sm text-muted-foreground">VVISC – IUCEE Student Council</p>
          <p className="text-sm text-muted-foreground">Vasireddy Venkatadri Institute of Technology (VVIT)</p>
        </div>
      </div>
      <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CODE RUSH 1.0 · VVISC – IUCEE Student Council · VVIT
      </div>
    </footer>
  );
}
