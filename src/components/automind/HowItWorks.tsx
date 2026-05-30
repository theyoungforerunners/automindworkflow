import { Search, Wrench, Zap } from "lucide-react";

const steps = [
  { icon: Search, title: "Analizziamo il tuo problema", desc: "Una call gratuita di 15 minuti per capire quali processi ti rubano più tempo." },
  { icon: Wrench, title: "Costruiamo l'automazione", desc: "Progettiamo e configuriamo il sistema su misura per la tua azienda. Tu non devi fare nulla." },
  { icon: Zap, title: "Il sistema lavora per te", desc: "Una volta attivo, l'automazione gira in autonomia. Noi monitoriamo e ottimizziamo." },
];

export function HowItWorks() {
  return (
    <section id="come-funziona" className="relative py-24 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Come funziona</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Tre passi. <span className="text-gradient">Zero stress.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <div key={i} className="reveal rounded-2xl border border-border bg-surface p-8 relative">
              <div className="absolute -top-4 -right-4 font-display text-7xl font-bold text-primary/10 select-none">0{i + 1}</div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
