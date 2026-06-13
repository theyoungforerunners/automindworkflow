import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Plus, Trash2, Check } from "lucide-react";
import {
  loadConfig,
  saveConfig,
  DEFAULT_CONFIG,
  DAYS,
  type BookingConfig,
  type CustomField,
  type DayKey,
} from "@/lib/booking-config";

export const Route = createFileRoute("/booking-cal-9x7k/admin")({
  head: () => ({
    meta: [
      { title: "Configurazione prenotazione" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const DURATION_OPTIONS = [15, 30, 45, 60, 90];
const BUFFER_OPTIONS = [0, 5, 10, 15, 30];

function AdminPage() {
  const [cfg, setCfg] = useState<BookingConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [customDuration, setCustomDuration] = useState(false);

  useEffect(() => {
    const c = loadConfig();
    setCfg(c);
    setCustomDuration(!DURATION_OPTIONS.includes(c.durationMinutes));
    setLoaded(true);
  }, []);

  const save = () => {
    saveConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!loaded) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Configurazione prenotazione</h1>
            <p className="text-sm text-muted-foreground">Personalizza la pagina di booking.</p>
          </div>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {saved ? <Check className="h-4 w-4" /> : null}
            {saved ? "Salvato" : "Salva configurazione"}
          </button>
        </div>

        <div className="space-y-4">
          <Section title="Dettagli evento" defaultOpen>
            <Field label="Nome dell'evento">
              <input
                className={inputCls}
                value={cfg.eventName}
                onChange={(e) => setCfg({ ...cfg, eventName: e.target.value })}
              />
            </Field>
            <Field label="Descrizione">
              <textarea
                className={inputCls}
                rows={3}
                value={cfg.eventDescription}
                onChange={(e) => setCfg({ ...cfg, eventDescription: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Durata">
                <select
                  className={inputCls}
                  value={customDuration ? "custom" : String(cfg.durationMinutes)}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setCustomDuration(true);
                    } else {
                      setCustomDuration(false);
                      setCfg({ ...cfg, durationMinutes: Number(e.target.value) });
                    }
                  }}
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} min
                    </option>
                  ))}
                  <option value="custom">Personalizzato</option>
                </select>
                {customDuration && (
                  <input
                    type="number"
                    min={5}
                    className={`${inputCls} mt-2`}
                    value={cfg.durationMinutes}
                    onChange={(e) =>
                      setCfg({ ...cfg, durationMinutes: Number(e.target.value) || 5 })
                    }
                  />
                )}
              </Field>
              <Field label="Pausa tra appuntamenti">
                <select
                  className={inputCls}
                  value={String(cfg.bufferMinutes)}
                  onChange={(e) => setCfg({ ...cfg, bufferMinutes: Number(e.target.value) })}
                >
                  {BUFFER_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b === 0 ? "Nessuna" : `${b} min`}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Disponibilità">
            <Field label="Fuso orario">
              <input
                className={inputCls}
                value={cfg.timezone}
                onChange={(e) => setCfg({ ...cfg, timezone: e.target.value })}
              />
            </Field>
            <div className="space-y-3">
              {DAYS.map(({ key, label }) => (
                <DayRow
                  key={key}
                  dayKey={key}
                  label={label}
                  cfg={cfg}
                  setCfg={setCfg}
                />
              ))}
            </div>
          </Section>

          <Section title="Modulo di prenotazione">
            <div className="space-y-3">
              {cfg.customFields.map((f, idx) => (
                <CustomFieldRow
                  key={f.id}
                  field={f}
                  onChange={(nf) => {
                    const copy = [...cfg.customFields];
                    copy[idx] = nf;
                    setCfg({ ...cfg, customFields: copy });
                  }}
                  onRemove={() => {
                    setCfg({
                      ...cfg,
                      customFields: cfg.customFields.filter((_, i) => i !== idx),
                    });
                  }}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCfg({
                  ...cfg,
                  customFields: [
                    ...cfg.customFields,
                    {
                      id: `f_${Date.now()}`,
                      label: "Nuova domanda",
                      type: "text",
                      required: false,
                    },
                  ],
                })
              }
              className="mt-3 inline-flex items-center gap-1 rounded-md border border-dashed border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <Plus className="h-4 w-4" /> Aggiungi campo
            </button>
          </Section>

          <Section title="Avanzate">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Preavviso minimo (ore)">
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={cfg.minNoticeHours}
                  onChange={(e) =>
                    setCfg({ ...cfg, minNoticeHours: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Max giorni in anticipo">
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={cfg.maxDaysAhead}
                  onChange={(e) =>
                    setCfg({ ...cfg, maxDaysAhead: Number(e.target.value) || 1 })
                  }
                />
              </Field>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="space-y-4 border-t border-border px-5 py-5">{children}</div>}
    </div>
  );
}

function DayRow({
  dayKey,
  label,
  cfg,
  setCfg,
}: {
  dayKey: DayKey;
  label: string;
  cfg: BookingConfig;
  setCfg: (c: BookingConfig) => void;
}) {
  const day = cfg.availability[dayKey];
  const update = (next: typeof day) =>
    setCfg({ ...cfg, availability: { ...cfg.availability, [dayKey]: next } });

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={day.enabled}
            onChange={(e) => update({ ...day, enabled: e.target.checked })}
            className="h-4 w-4 rounded border-input"
          />
          {label}
        </label>
        {day.enabled && (
          <button
            onClick={() =>
              update({ ...day, ranges: [...day.ranges, { start: "09:00", end: "17:00" }] })
            }
            className="text-xs text-primary hover:underline"
          >
            + Fascia
          </button>
        )}
      </div>
      {day.enabled && (
        <div className="mt-2 space-y-2">
          {day.ranges.length === 0 && (
            <div className="text-xs text-muted-foreground">Nessuna fascia oraria.</div>
          )}
          {day.ranges.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="time"
                value={r.start}
                onChange={(e) => {
                  const ranges = [...day.ranges];
                  ranges[i] = { ...r, start: e.target.value };
                  update({ ...day, ranges });
                }}
                className={`${inputCls} flex-1`}
              />
              <span className="text-muted-foreground">–</span>
              <input
                type="time"
                value={r.end}
                onChange={(e) => {
                  const ranges = [...day.ranges];
                  ranges[i] = { ...r, end: e.target.value };
                  update({ ...day, ranges });
                }}
                className={`${inputCls} flex-1`}
              />
              <button
                onClick={() =>
                  update({ ...day, ranges: day.ranges.filter((_, j) => j !== i) })
                }
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomFieldRow({
  field,
  onChange,
  onRemove,
}: {
  field: CustomField;
  onChange: (f: CustomField) => void;
  onRemove: () => void;
}) {
  const isCore = field.id === "name" || field.id === "email";
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_auto]">
        <input
          className={inputCls}
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          placeholder="Etichetta"
        />
        <select
          className={inputCls}
          value={field.type}
          disabled={isCore}
          onChange={(e) =>
            onChange({ ...field, type: e.target.value as CustomField["type"] })
          }
        >
          <option value="text">Testo</option>
          <option value="email">Email</option>
          <option value="tel">Telefono</option>
          <option value="textarea">Area testo</option>
        </select>
        <button
          onClick={onRemove}
          disabled={isCore}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <label className="mt-2 inline-flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={field.required}
          disabled={isCore}
          onChange={(e) => onChange({ ...field, required: e.target.checked })}
          className="h-3.5 w-3.5"
        />
        Obbligatorio
      </label>
    </div>
  );
}
