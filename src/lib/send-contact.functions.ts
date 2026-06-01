import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  azienda: z.string().trim().min(1).max(160),
  settore: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  messaggio: z.string().trim().max(2000).optional().default(""),
});

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    const webhookUrl = "https://surfacing-tamer-sandpit.ngrok-free.dev/webhook-test/conferma-form";
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        nome: data.nome,
        azienda: data.azienda,
        email: data.email,
        settore: data.settore,
        messaggio: data.messaggio ?? "",
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`Webhook HTTP ${res.status}: ${body.slice(0, 500)}`);
      throw new Error(`Webhook fallito (HTTP ${res.status})`);
    }

    return { ok: true, webhookOk: true };
  });
