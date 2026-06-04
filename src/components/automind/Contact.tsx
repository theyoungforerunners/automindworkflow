import { useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Send, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { SECTORS } from "./data";
import { sendContactEmail } from "@/lib/send-contact.functions";

const CONTACT_EMAIL = "automind.info.it@gmail.com";

export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sendEmail = useServerFn(sendContactEmail);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const errs: Record<string, string> = {};
    const nome = String(fd.get("nome") || "").trim();
    const azienda = String(fd.get("azienda") || "").trim();
    const settore = String(fd.get("settore") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const telefono = String(fd.get("telefono") || "").trim();
    const fonte = String(fd.get("fonte") || "").trim();
    const messaggio = String(fd.get("messaggio") || "").trim();
    if (!nome) errs.nome = "Campo obbligatorio";
    if (!azienda) errs.azienda = "Campo obbligatorio";
    if (!settore) errs.settore = "Seleziona un settore";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email non valida";
    if (telefono && !/^[0-9+\s-]+$/.test(telefono)) errs.telefono = "Numero non valido";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      await sendEmail({ data: { nome, azienda, settore, email, telefono, fonte, messaggio } });

      toast.success("Messaggio inviato con successo! Ti risponderemo entro 24 ore.", {
        icon: <CheckCircle2 className="h-5 w-5" />,
        duration: 5000,
      });
      form.reset();
      setErrors({});
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
            <Field
              label={<>Numero di telefono <span className="text-muted-foreground font-normal">(opzionale)</span></>}
              name="telefono"
              type="tel"
              placeholder="Es. +39 333 123 4567"
              error={errors.telefono}
            />
            <div>
              <label className="block text-sm font-medium mb-2">
                Come ci hai trovato? <span className="text-muted-foreground font-normal">(opzionale)</span>
              </label>
              <select
                name="fonte"
                defaultValue=""
                className="w-full rounded-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="" disabled>— Seleziona —</option>
                <option value="Google">Google</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Passaparola">Passaparola</option>
                <option value="Ai">Ai</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
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
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:glow-accent transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>Invio in corso... <Loader2 className="h-4 w-4 animate-spin" /></>
              ) : (
                <>Invia richiesta <Send className="h-4 w-4" /></>
              )}
            </button>
            {submitError && (
              <p className="text-center text-sm text-problem -mt-2">{submitError}</p>
            )}
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 pt-2">
              <Mail className="h-3 w-3" />
              Preferisci scrivere direttamente?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-foreground transition-colors">
                {CONTACT_EMAIL}
              </a>
            </p>
          </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder, error }: { label: ReactNode; name: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        maxLength={255}
        className={`w-full rounded-lg bg-background border ${error ? "border-problem" : "border-border"} px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`}
      />
      {error && <p className="text-xs text-problem mt-1.5">{error}</p>}
    </div>
  );
}
