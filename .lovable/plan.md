## Problema individuato

Nel codice attuale ci sono due percorsi di invio diversi:

1. `Contact.tsx` chiama ancora un webhook dal browser, ma usa un URL diverso:
   `https://surfacing-tamer-sandpit.ngrok-free.app/webhook/conferma-form`

2. `send-contact.functions.ts` chiama dal server l'URL richiesto:
   `https://surfacing-tamer-sandpit.ngrok-free.dev`

Questo crea confusione e può impedire l'invio corretto: la chiamata dal browser può essere bloccata da CORS/ngrok, mentre l'unica chiamata affidabile deve essere quella server-side.

## Piano di correzione

1. Rimuovere completamente la `fetch` lato browser da `src/components/automind/Contact.tsx`.
2. Far sì che il submit chiami solo la server function `sendContactEmail`.
3. Mantenere nella server function la POST a:
   `https://surfacing-tamer-sandpit.ngrok-free.dev`
4. Inviare nel body JSON esattamente questi campi:

```json
{
  "nome": "...",
  "azienda": "...",
  "email": "...",
  "settore": "...",
  "messaggio": "..."
}
```

5. Migliorare la gestione errori: se il webhook ngrok/n8n risponde con errore o non è raggiungibile, il form mostrerà errore invece di successo.
6. Verificare la chiamata dopo la modifica controllando il comportamento del submit e/o i log server.

## Nota tecnica

La chiamata va fatta dal server perché ngrok/n8n spesso non espone header CORS corretti per richieste browser. Server-to-server evita CORS e permette davvero di consegnare il JSON al webhook.