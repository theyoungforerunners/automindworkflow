import { Quote, Star } from "lucide-react";

// ✏️  Sostituisci questi dati con le vere testimonianze dei tuoi clienti quando le ottieni
const testimonials = [
  {
    quote: "Da quando usiamo AutoMind, non perdiamo più una richiesta di preventivo. Il sistema risponde subito e i clienti sono molto più soddisfatti.",
    name: "Marco R.",
    role: "Idraulico — Treviso",
    stars: 5,
    placeholder: true,
  },
  {
    quote: "La gestione delle prenotazioni era un incubo. Ora il sistema fa tutto da solo e io mi concentro sui pazienti.",
    name: "Dott.ssa Elena B.",
    role: "Studio Dentistico — Padova",
    stars: 5,
    placeholder: true,
  },
  {
    quote: "Report settimanali che mi prendevano 3 ore ora arrivano in automatico ogni lunedì mattina. Servizio eccellente.",
    name: "Giorgio M.",
    role: "Commercialista — Vicenza",
    stars: 5,
    placeholder: true,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Cosa dicono i clienti</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Risultati <span className="text-gradient">concreti.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            PMI italiane che hanno automatizzato i loro processi con AutoMind.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="reveal rounded-2xl border border-border bg-surface p-7 flex flex-col gap-5 hover:border-primary/30 transition-colors"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative flex-1">
                <Quote className="h-6 w-6 text-primary/20 absolute -top-1 -left-1" />
                <p className="text-sm text-muted-foreground leading-relaxed pl-5 italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-display text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
