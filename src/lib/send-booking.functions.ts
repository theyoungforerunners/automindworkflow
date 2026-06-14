import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BookingSchema = z.object({
  nome_evento: z.string().trim().min(1).max(200),
  durata_evento: z.string().trim().min(1).max(50),
  data: z.string().trim().min(1).max(20),
  orario: z.string().trim().min(1).max(20),
  fuso_orario: z.string().trim().min(1).max(100),
  nome: z.string().trim().max(200).optional().default(""),
  email: z.string().trim().max(255).optional().default(""),
  telefono: z.string().trim().max(50).optional().default(""),
  campi_personalizzati: z.record(z.string(), z.string()).optional().default({}),
  prenotato_il: z.string().trim().min(1).max(50),
});

export const sendBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BookingSchema.parse(input))
  .handler(async ({ data }) => {
    const webhookUrl =
      "https://surfacing-tamer-sandpit.ngrok-free.dev/webhook-test/998be729-6052-4cf2-969a-815fba68ed25";
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`Booking webhook HTTP ${res.status}: ${body.slice(0, 500)}`);
      throw new Error(`Webhook fallito (HTTP ${res.status})`);
    }

    return { ok: true };
  });
