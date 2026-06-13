export type CustomField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
};

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type TimeRange = { start: string; end: string };

export type DayAvailability = {
  enabled: boolean;
  ranges: TimeRange[];
};

export type BookingConfig = {
  eventName: string;
  eventDescription: string;
  durationMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  maxDaysAhead: number;
  timezone: string;
  availability: Record<DayKey, DayAvailability>;
  customFields: CustomField[];
};

export const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Lun" },
  { key: "tue", label: "Mar" },
  { key: "wed", label: "Mer" },
  { key: "thu", label: "Gio" },
  { key: "fri", label: "Ven" },
  { key: "sat", label: "Sab" },
  { key: "sun", label: "Dom" },
];

// Date.getDay(): 0=Sun..6=Sat → DayKey
export const dayKeyFromDate = (d: Date): DayKey => {
  const map: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[d.getDay()];
};

export const DEFAULT_CONFIG: BookingConfig = {
  eventName: "Incontro conoscitivo",
  eventDescription: "Una breve call per capire come possiamo aiutarti.",
  durationMinutes: 30,
  bufferMinutes: 0,
  minNoticeHours: 2,
  maxDaysAhead: 30,
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Europe/Rome",
  availability: {
    mon: { enabled: true, ranges: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
    tue: { enabled: true, ranges: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
    wed: { enabled: true, ranges: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
    thu: { enabled: true, ranges: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
    fri: { enabled: true, ranges: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
    sat: { enabled: false, ranges: [] },
    sun: { enabled: false, ranges: [] },
  },
  customFields: [
    { id: "name", label: "Nome completo", type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    { id: "phone", label: "Telefono", type: "tel", required: false },
  ],
};

const STORAGE_KEY = "booking-cal-9x7k:config";

export function loadConfig(): BookingConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(cfg: BookingConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function generateSlots(date: Date, cfg: BookingConfig): string[] {
  const key = dayKeyFromDate(date);
  const day = cfg.availability[key];
  if (!day?.enabled) return [];
  const step = cfg.durationMinutes + cfg.bufferMinutes;
  const slots: string[] = [];
  const now = new Date();
  const minTime = new Date(now.getTime() + cfg.minNoticeHours * 3600 * 1000);
  for (const r of day.ranges) {
    const [sh, sm] = r.start.split(":").map(Number);
    const [eh, em] = r.end.split(":").map(Number);
    let cur = new Date(date);
    cur.setHours(sh, sm, 0, 0);
    const end = new Date(date);
    end.setHours(eh, em, 0, 0);
    while (cur.getTime() + cfg.durationMinutes * 60000 <= end.getTime()) {
      if (cur.getTime() >= minTime.getTime()) {
        slots.push(`${String(cur.getHours()).padStart(2, "0")}:${String(cur.getMinutes()).padStart(2, "0")}`);
      }
      cur = new Date(cur.getTime() + step * 60000);
    }
  }
  return slots;
}
