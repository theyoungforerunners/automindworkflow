import { useState, FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, CheckCircle2, Mail, Calendar, Loader2 } from "lucide-react";
import { SECTORS } from "./data";
import { sendContactEmail } from "@/lib/send-contact.functions";

// ⚠️  Sostituisci con il tuo vero link Calendly dopo averlo creato su calendly.com
const CALENDLY_URL = "https://calendly.com/automind/15min";
const CONTACT_EMAIL = "automind.info.it@gmail.com";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sendEmail = useServerFn(sendContactEmail);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    const nome = String(fd.get("nome") || "").trim();
    const azienda = String(fd.get("azienda") || "").trim();
    const settore = String(fd.get("settore") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const messaggio = String(fd.get("messaggio") || "").trim();
    if (!nome) errs.nome = "Campo obbligatorio";
    if (!azienda) errs.azienda = "Campo obbligatorio";
    if (!settore) errs.settore = "Seleziona un settore";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email non valida";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      await sendEmail({ data: { nome, azienda, settore, email, messaggio } });
      setSent(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Qualcosa è andato storto. Riprova o scrivici direttamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contatti" className="relative py-24 px-6 border-t border-border">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Richiedi una demo gratuita</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Scopri cosa possiamo <span className="text-gradient">automatizzare per te.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Compila il form — ti risponderemo entro 24 ore con una proposta su misura.
          </p>
        </div>

        {sent ? (
          <div className="reveal rounded-2xl border border-primary/40 bg-primary/5 p-10 text-center space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">Richiesta ricevuta!</h3>
              <p className="text-muted-foreground">
                Ti risponderemo all'indirizzo che hai indicato entro 24 ore.
              </p>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Preferisci fissare subito una call gratuita di 15 minuti?
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:glow-accent transition-shadow"
              >
                <Calendar className="h-4 w-4" /> Prenota una call gratuita
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="reveal rounded-2xl border border-border bg-surface p-8 space-y-5">
            <Field label="Nome e Cognome" name="nome" error={errors.nome} />
            <Field label="Nome Azienda" name="azienda" error={errors.azienda} />
            <div>
              <label className="block text-sm font-medium mb-2">Settore</label>
              <select
                name="settore"
                defaultValue=""
                className={`w-full rounded-lg bg-background border ${errors.settore ? "border-problem" : "border-border"} px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`}
              >
                <option value="" disabled>Seleziona il tuo settore</option>
                {SECTORS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              {errors.settore && <p className="text-xs text-problem mt-1.5">{errors.settore}</p>}
            </div>
            <Field label="Email aziendale" name="email" type="email" error={errors.email} />
            <div>
              <label className="block text-sm font-medium mb-2">
                Messaggio <span className="text-muted-foreground font-normal">(opzionale)</span>
              </label>
              <textarea
                name="messaggio"
                rows={4}
                placeholder="Descrivi brevemente il problema che vuoi risolvere"
                className="w-full rounded-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:glow-accent transition-shadow"
            >
              Invia richiesta <Send className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 pt-2">
              <Mail className="h-3 w-3" />
              Preferisci scrivere direttamente? →{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-foreground transition-colors">
                {CONTACT_EMAIL}
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        name={name}
        maxLength={255}
        className={`w-full rounded-lg bg-background border ${error ? "border-problem" : "border-border"} px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`}
      />
      {error && <p className="text-xs text-problem mt-1.5">{error}</p>}
    </div>
  );
}
