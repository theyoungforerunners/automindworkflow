import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SECTORS } from "./data";

export function Sectors() {
  const [active, setActive] = useState(SECTORS[0].id);
  const current = SECTORS.find((s) => s.id === active)!;

  return (
    <section id="servizi" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Cosa possiamo fare per te</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Soluzioni concrete per il <span className="text-gradient">tuo settore</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Seleziona la tua categoria e scopri quali processi possiamo automatizzare oggi stesso.
          </p>
        </div>

        <div className="reveal flex flex-wrap justify-center gap-2 mb-12">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                active === s.id
                  ? "bg-primary text-primary-foreground glow-accent"
                  : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-elevated border border-border"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div key={active} className="grid md:grid-cols-2 gap-6">
          {current.items.map((it, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface/60 p-1 [animation:fade-slide_0.4s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="grid sm:grid-cols-2 gap-1 h-full">
                <div className="rounded-xl bg-surface p-6 flex flex-col">
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-problem/15 px-3 py-1 text-xs font-semibold text-problem mb-4">
                    <AlertCircle className="h-3 w-3" /> Problema
                  </span>
                  <h3 className="font-display text-lg font-semibold mb-2">{it.problem.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{it.problem.desc}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-6 flex flex-col">
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-4">
                    <CheckCircle2 className="h-3 w-3" /> Soluzione AutoMind
                  </span>
                  <h3 className="font-display text-lg font-semibold mb-2">{it.solution.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{it.solution.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
