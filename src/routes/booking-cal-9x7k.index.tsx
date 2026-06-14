import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Check, ArrowLeft } from "lucide-react";
import {
  loadConfig,
  generateSlots,
  dayKeyFromDate,
  type BookingConfig,
  type CustomField,
} from "@/lib/booking-config";
import { sendBooking } from "@/lib/send-booking.functions";

export const Route = createFileRoute("/booking-cal-9x7k/")({
  head: () => ({
    meta: [
      { title: "Prenota un appuntamento" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GuestPage,
});

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function GuestPage() {
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [viewMonth, setViewMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const maxDate = useMemo(() => {
    if (!config) return new Date();
    const d = new Date(today);
    d.setDate(d.getDate() + config.maxDaysAhead);
    return d;
  }, [config, today]);

  const monthDays = useMemo(() => {
    const first = startOfMonth(viewMonth);
    // Monday-first offset
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth]);

  const isAvailableDay = (date: Date) => {
    if (!config) return false;
    if (date < today) return false;
    if (date > maxDate) return false;
    const day = config.availability[dayKeyFromDate(date)];
    if (!day?.enabled || day.ranges.length === 0) return false;
    return generateSlots(date, config).length > 0;
  };

  const slots = useMemo(() => {
    if (!config || !selectedDate) return [];
    return generateSlots(selectedDate, config);
  }, [config, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError(null);

    const customFields: Record<string, string> = {};
    let nome = "";
    let email = "";
    let telefono = "";
    for (const f of config.customFields) {
      const v = formValues[f.id] ?? "";
      if (f.id === "name") nome = v;
      else if (f.id === "email") email = v;
      else if (f.id === "phone") telefono = v;
      else customFields[f.label] = v;
    }

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    const payload = {
      nome_evento: config.eventName,
      durata_evento: `${config.durationMinutes} min`,
      data: `${yyyy}-${mm}-${dd}`,
      orario: selectedTime,
      fuso_orario: config.timezone,
      nome,
      email,
      telefono,
      campi_personalizzati: customFields,
      prenotato_il: new Date().toISOString(),
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setFormValues({});
    setError(null);
    setStep(1);
  };

  if (!config) {
    return <div className="min-h-screen bg-background" />;
  }

  const monthName = viewMonth.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  const canGoPrev = startOfMonth(new Date()) < viewMonth;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-16">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
            {/* Sidebar */}
            <aside className="border-b border-border bg-muted/30 p-6 md:border-b-0 md:border-r">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prenotazione
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">{config.eventName}</h1>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{config.durationMinutes} min</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {config.eventDescription}
              </p>
              {selectedDate && step >= 2 && (
                <div className="mt-6 flex items-start gap-2 text-sm">
                  <CalendarIcon className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium capitalize">
                      {selectedDate.toLocaleDateString("it-IT", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    {selectedTime && (
                      <div className="text-muted-foreground">
                        {selectedTime} ({config.timezone})
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>

            {/* Main panel */}
            <main className="p-6 md:p-8">
              <div key={step} className="animate-in fade-in slide-in-from-right-2 duration-300">
                {step === 1 && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Scegli una data</h2>
                      <div className="flex items-center gap-1">
                        <button
                          aria-label="Mese precedente"
                          disabled={!canGoPrev}
                          onClick={() =>
                            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
                          }
                          className="rounded-md p-2 transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="min-w-[140px] text-center text-sm font-medium capitalize">
                          {monthName}
                        </div>
                        <button
                          aria-label="Mese successivo"
                          onClick={() =>
                            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
                          }
                          className="rounded-md p-2 transition-colors hover:bg-accent"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
                      {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((d) => (
                        <div key={d} className="py-2">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-1">
                      {monthDays.map((d, i) => {
                        if (!d) return <div key={i} />;
                        const avail = isAvailableDay(d);
                        const isPast = d < today || d > maxDate;
                        return (
                          <button
                            key={i}
                            disabled={!avail}
                            onClick={() => {
                              setSelectedDate(d);
                              setSelectedTime(null);
                              setStep(2);
                            }}
                            className={[
                              "relative mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm transition-all",
                              avail
                                ? "bg-primary font-semibold text-primary-foreground hover:scale-110 hover:shadow-md"
                                : isPast
                                  ? "cursor-not-allowed text-muted-foreground/40"
                                  : "cursor-not-allowed text-muted-foreground/60",
                            ].join(" ")}
                          >
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && selectedDate && (
                  <div>
                    <button
                      onClick={() => setStep(1)}
                      className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" /> Indietro
                    </button>
                    <h2 className="text-lg font-semibold capitalize">
                      {selectedDate.toLocaleDateString("it-IT", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Seleziona un orario disponibile
                    </p>
                    <div className="mt-4 grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                      {slots.length === 0 && (
                        <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                          Nessun orario disponibile.
                        </div>
                      )}
                      {slots.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedTime(s)}
                          className={[
                            "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                            selectedTime === s
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary hover:text-primary",
                          ].join(" ")}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {selectedTime && (
                      <button
                        onClick={() => setStep(3)}
                        className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                      >
                        Conferma orario →
                      </button>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <button
                      onClick={() => setStep(2)}
                      className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" /> Indietro
                    </button>
                    <h2 className="text-lg font-semibold">I tuoi dati</h2>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      {config.customFields.map((f) => (
                        <FieldInput
                          key={f.id}
                          field={f}
                          value={formValues[f.id] ?? ""}
                          onChange={(v) => setFormValues((p) => ({ ...p, [f.id]: v }))}
                        />
                      ))}
                      {error && (
                        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                          Errore nell'invio: {error}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                      >
                        {submitting ? "Invio..." : "Conferma prenotazione"}
                      </button>
                    </form>
                  </div>
                )}

                {step === 4 && selectedDate && selectedTime && (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 animate-in zoom-in-50 items-center justify-center rounded-full bg-green-100 duration-500">
                      <Check className="h-8 w-8 text-green-600 animate-in fade-in duration-700" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold">La tua riunione è confermata!</h2>
                    <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-lg border border-border bg-muted/30 p-4 text-left text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Evento</span>
                        <span className="font-medium">{config.eventName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-medium capitalize">
                          {selectedDate.toLocaleDateString("it-IT", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Orario</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durata</span>
                        <span className="font-medium">{config.durationMinutes} min</span>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="mt-6 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent"
                    >
                      Prenota un altro orario
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: CustomField;
  value: string;
  onChange: (v: string) => void;
}) {
  const common =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">
        {field.label}
        {field.required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={common}
        />
      ) : (
        <input
          type={field.type}
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      )}
    </div>
  );
}
