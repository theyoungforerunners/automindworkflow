import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  azienda: z.string().trim().min(1).max(160),
  settore: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  messaggio: z.string().trim().max(2000).optional().default(""),
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY non configurata");
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const subject = `Nuova richiesta demo — ${data.azienda}`;
    const messaggio = data.messaggio?.trim() || "(nessun messaggio)";

    const html = `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;line-height:1.6">
        <h2 style="margin:0 0 16px">Nuova richiesta demo da AutoMind</h2>
        <p><strong>Nome:</strong> ${escapeHtml(data.nome)}</p>
        <p><strong>Azienda:</strong> ${escapeHtml(data.azienda)}</p>
        <p><strong>Settore:</strong> ${escapeHtml(data.settore)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
        <p><strong>Messaggio:</strong><br/>${escapeHtml(messaggio).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    const text = `Nuova richiesta demo da AutoMind

Nome: ${data.nome}
Azienda: ${data.azienda}
Settore: ${data.settore}
Email: ${data.email}

Messaggio:
${messaggio}
`;

    const { error } = await resend.emails.send({
      from: "AutoMind <onboarding@resend.dev>",
      to: ["automind.info.it@gmail.com"],
      replyTo: data.email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Invio email fallito");
    }

    return { ok: true };
  });
