import { Sparkles, Mail } from "lucide-react";

const CONTACT_EMAIL = "automind.info.it@gmail.com";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold mb-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              Auto<span className="text-gradient">Mind</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">AutoMind — Automazioni AI per PMI italiane.</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-3 w-3" /> {CONTACT_EMAIL}
            </a>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#contatti" className="hover:text-foreground transition-colors">Contatti</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} AutoMind. Tutti i diritti riservati.
          <span className="mx-2">·</span>
          P.IVA in fase di registrazione
        </div>
      </div>
    </footer>
  );
}
