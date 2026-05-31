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

    const autoReplyHtml = `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;line-height:1.6">
        <p>Ciao ${escapeHtml(data.nome)},</p>
        <p>grazie per averci contattato. Abbiamo ricevuto la tua richiesta per <strong>${escapeHtml(data.azienda)}</strong> e ti risponderemo entro 24 ore con una proposta su misura.</p>
        <p>Nel frattempo, se vuoi fissare subito una call gratuita di 20 minuti, puoi prenotare direttamente qui:</p>
        <p style="margin:24px 0">
          <a href="https://calendly.com/automind-info-it/30min"
             style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600">
            Prenota una call gratuita
          </a>
        </p>
        <p>A presto,<br/>Il team AutoMind<br/>
          <a href="mailto:automind.info.it@gmail.com">automind.info.it@gmail.com</a>
        </p>
      </div>
    `;

    const autoReplyText = `Ciao ${data.nome},

grazie per averci contattato. Abbiamo ricevuto la tua richiesta per ${data.azienda} e ti risponderemo entro 24 ore con una proposta su misura.

Nel frattempo, se vuoi fissare subito una call gratuita di 20 minuti, puoi prenotare direttamente qui:
https://calendly.com/automind-info-it/30min

A presto,
Il team AutoMind
automind.info.it@gmail.com
`;

    const [internalRes, autoReplyRes] = await Promise.allSettled([
      resend.emails.send({
        from: "AutoMind <onboarding@resend.dev>",
        to: ["automind.info.it@gmail.com"],
        replyTo: data.email,
        subject,
        html,
        text,
      }),
      resend.emails.send({
        from: "AutoMind <onboarding@resend.dev>",
        to: [data.email],
        subject: "Abbiamo ricevuto la tua richiesta — AutoMind",
        html: autoReplyHtml,
        text: autoReplyText,
      }),
    ]);

    let internalOk = false;
    let autoReplyOk = false;

    if (internalRes.status === "fulfilled") {
      if (internalRes.value.error) {
        console.error("Resend internal email error:", internalRes.value.error);
      } else {
        internalOk = true;
      }
    } else {
      console.error("Resend internal email rejected:", internalRes.reason);
    }

    if (autoReplyRes.status === "fulfilled") {
      if (autoReplyRes.value.error) {
        console.error("Resend auto-reply email error:", autoReplyRes.value.error);
      } else {
        autoReplyOk = true;
      }
    } else {
      console.error("Resend auto-reply email rejected:", autoReplyRes.reason);
    }

    if (!internalOk && !autoReplyOk) {
      throw new Error("Invio email fallito");
    }

    return { ok: true, internalOk, autoReplyOk };
  });
