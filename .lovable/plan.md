## Obiettivo
Far arrivare i dati del form di contatto al webhook n8n su `https://surfacing-tamer-sandpit.ngrok-free.dev` in modo affidabile.

## Causa del problema attuale
La chiamata `fetch` è eseguita dal browser dentro `Contact.tsx`. Il browser applica le regole CORS: prima del POST manda una preflight `OPTIONS` al dominio ngrok, e n8n/ngrok non risponde con `Access-Control-Allow-Origin`, quindi il POST viene bloccato. In più, ngrok-free mostra una pagina di warning ai browser senza un header dedicato. Risultato: la richiesta non arriva mai a n8n, ma l'utente vede "Inviato con successo" perché l'errore è solo loggato in console.

## Soluzione
Spostare la chiamata al webhook **dentro la server function** `sendContactEmail` (`src/lib/send-contact.functions.ts`), che gira sul server. Server → server non ha CORS e non riceve la warning page di ngrok.

## Modifiche

### `src/lib/send-contact.functions.ts`
Dopo l'invio delle due email (mantenendole identiche), aggiungere una terza chiamata indipendente:
- `fetch("https://surfacing-tamer-sandpit.ngrok-free.dev", { method: "POST", headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" }, body: JSON.stringify({ nome, azienda, email, settore, messaggio }) })`
- Eseguita in `Promise.allSettled` insieme alle email così un fallimento non blocca le altre.
- Loggare `console.error` con status code + body in caso di risposta non-OK, per rendere debuggabile da `stack_modern--server-function-logs`.

### `src/components/automind/Contact.tsx`
- Rimuovere la `fetch` lato client al webhook (resta solo `sendEmail(...)`).
- Eliminare il `Promise.all` ora superfluo.

## Verifica
1. Compilare il form dal preview.
2. Controllare i log della server function (`stack_modern--server-function-logs`) per confermare lo status della POST al webhook.
3. Verificare in n8n che l'esecuzione parta.

## Nota
Se per qualsiasi motivo serve assolutamente chiamare il webhook dal browser, l'unica alternativa sarebbe configurare CORS sul nodo Webhook di n8n (header `Access-Control-Allow-Origin: *` + risposta a OPTIONS). Lato server è più robusto e nasconde l'URL ngrok dal bundle client.