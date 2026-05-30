import { Shield, Wallet, Settings2, Headphones } from "lucide-react";

const items = [
  { icon: Shield, title: "Zero rischi", desc: "Offriamo una settimana di prova gratuita. Paghi solo se sei soddisfatto." },
  { icon: Wallet, title: "Canone mensile fisso", desc: "Nessuna sorpresa. Un prezzo chiaro ogni mese, tutto incluso." },
  { icon: Settings2, title: "100% su misura", desc: "Ogni automazione è costruita per la tua azienda, non una soluzione generica." },
  { icon: Headphones, title: "Supporto continuo", desc: "Siamo disponibili per modifiche e ottimizzazioni. Non spariremo dopo la consegna." },
];

export function WhyUs() {
  return (
    <section id="settori" className="relative py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Perché AutoMind</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Trasparenti, <span className="text-gradient">su misura, presenti.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((it, i) => (
            <div key={i} className="reveal group rounded-2xl border border-border bg-surface p-7 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-5">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">{it.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
