import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoUrl from "@/assets/automind-logo.svg";

const links = [
  { href: "#servizi", label: "Servizi" },
  { href: "#come-funziona", label: "Come funziona" },
  { href: "#settori", label: "Settori" },
  { href: "#contatti", label: "Contatti" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <img src={logoUrl} alt="AutoMind" className="h-11 w-11" />
          Auto<span className="text-gradient">Mind</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="#contatti"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:glow-accent transition-shadow"
          >
            Richiedi una demo gratuita
          </a>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
              {l.label}
            </a>
          ))}
          <a
            href="#contatti"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Richiedi una demo gratuita
          </a>
        </div>
      )}
    </header>
  );
}
