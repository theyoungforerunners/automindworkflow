import { Sparkles } from "lucide-react";

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
            <p className="text-sm text-muted-foreground">AutoMind — Automazioni AI per PMI italiane.</p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#contatti" className="hover:text-foreground transition-colors">Contatti</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          © 2025 AutoMind. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
