import { ArrowRight, Clock, Shield, Sparkles } from "lucide-react";

const stats = [
  { icon: Clock, value: "< 2 min", label: "Tempo medio di risposta AI" },
  { icon: Shield, value: "7 giorni", label: "Prova gratuita senza impegno" },
  { icon: Sparkles, value: "90%", label: "Del lavoro gestito dall'AI" },
];

export function ProofBanner() {
  return (
    <section className="relative py-20 px-6 border-t border-border overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 mb-16 reveal">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA card */}
        <div className="reveal rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5 p-10 md:p-14 text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Nessun rischio</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Prova AutoMind per <span className="text-gradient">7 giorni gratis.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Installiamo l'automazione nella tua azienda. Se non sei soddisfatto dopo una settimana,
            non paghi nulla. Nessun contratto, nessun impegno.
          </p>
          <a
            href="#contatti"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:glow-accent transition-shadow"
          >
            Inizia la prova gratuita <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Ti risponderemo entro 24 ore · Nessuna carta di credito richiesta
          </p>
        </div>
      </div>
    </section>
  );
}
