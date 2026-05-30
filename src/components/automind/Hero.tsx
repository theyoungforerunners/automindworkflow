import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid [animation:grid-pan_40s_linear_infinite] opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-40 right-0 h-[300px] w-[400px] rounded-full bg-secondary/20 blur-[100px]" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-xs text-muted-foreground mb-8 reveal">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Automazioni AI per PMI italiane
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] reveal">
          Automatizziamo il lavoro<br />
          ripetitivo della tua azienda.{" "}
          <span className="text-gradient">Con l'AI.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto reveal">
          AutoMind costruisce sistemi automatici su misura che rispondono alle email,
          gestiscono prenotazioni e seguono i tuoi clienti — senza che tu debba fare nulla.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center reveal">
          <a
            href="#come-funziona"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold hover:bg-surface-elevated transition-colors"
          >
            <Play className="h-4 w-4" /> Scopri come funziona
          </a>
          <a
            href="#contatti"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:glow-accent transition-shadow"
          >
            Richiedi una demo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
