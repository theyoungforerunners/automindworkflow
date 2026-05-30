export type Sector = {
  id: string;
  label: string;
  items: { problem: { title: string; desc: string }; solution: { title: string; desc: string } }[];
};

export const SECTORS: Sector[] = [
  {
    id: "medici",
    label: "Studi medici e dentistici",
    items: [
      {
        problem: { title: "Rispondere sempre alle stesse email", desc: "Il titolare perde 1-2 ore al giorno a rispondere a domande ripetitive su orari, prezzi, disponibilità." },
        solution: { title: "Risponditore AI automatico", desc: "Ogni email viene letta e riceve una risposta personalizzata entro 2 minuti. Il medico supervisiona solo i casi complessi." },
      },
      {
        problem: { title: "Gestire gli appuntamenti manualmente", desc: "La segreteria riceve chiamate tutto il giorno per prenotare. Spesso ci sono buchi o doppie prenotazioni." },
        solution: { title: "Bot prenotazioni automatico", desc: "Il sistema mostra gli slot disponibili, fa scegliere il paziente e crea l'appuntamento in autonomia." },
      },
    ],
  },
  {
    id: "immobiliari",
    label: "Agenzie immobiliari",
    items: [
      {
        problem: { title: "Perdere clienti perché non vengono richiamati in tempo", desc: "Un cliente chiede informazioni su un immobile ma l'agente è impegnato. Lo richiama 3 giorni dopo. Il cliente ha già trovato altro." },
        solution: { title: "Follow-up automatico via email/WhatsApp", desc: "Entro 5 minuti dalla richiesta il cliente riceve informazioni e orari di contatto. Il tasso di conversione aumenta del 30-60%." },
      },
      {
        problem: { title: "Rispondere sempre alle stesse domande sugli immobili", desc: "Prezzi, metrature, disponibilità, zone. Sempre le stesse richieste via email." },
        solution: { title: "Assistente AI per le richieste", desc: "Il sistema risponde automaticamente alle domande frequenti con le informazioni aggiornate dal gestionale." },
      },
    ],
  },
  {
    id: "professionisti",
    label: "Commercialisti e avvocati",
    items: [
      {
        problem: { title: "Report e documenti periodici fatti a mano", desc: "Ogni settimana le stesse elaborazioni su Excel. 2-3 ore di lavoro ripetitivo." },
        solution: { title: "Report AI automatico", desc: "Il sistema legge i dati, li analizza con AI e invia il report già formattato ogni lunedì mattina via email." },
      },
      {
        problem: { title: "Clienti che chiedono sempre le stesse informazioni", desc: "Scadenze, pratiche in corso, documenti necessari. Sempre le stesse email." },
        solution: { title: "Risponditore AI per domande frequenti", desc: "Il sistema risponde in automatico alle domande standard, liberando ore ogni settimana." },
      },
    ],
  },
  {
    id: "artigiani",
    label: "Artigiani e impiantisti",
    items: [
      {
        problem: { title: "Perdere richieste di preventivo perché non si risponde in tempo", desc: "Il telefono squilla mentre si è al lavoro. Il cliente non richiama." },
        solution: { title: "Risposta automatica ai contatti", desc: "Ogni richiesta via email o form riceve risposta immediata con tempi stimati e richiesta di dettagli. Zero clienti persi." },
      },
      {
        problem: { title: "Nessun sistema di follow-up sui preventivi inviati", desc: "Si manda il preventivo e poi non si sa più nulla. Il cliente non risponde e non viene mai ricontattato." },
        solution: { title: "Follow-up automatico sui preventivi", desc: "Il sistema manda un reminder automatico dopo 3 e 7 giorni dal preventivo non confermato." },
      },
    ],
  },
  {
    id: "ristoranti",
    label: "Ristoranti e bar",
    items: [
      {
        problem: { title: "Non rispondere alle recensioni Google", desc: "Decine di recensioni senza risposta. I nuovi clienti leggono e percepiscono disinteresse." },
        solution: { title: "Monitor recensioni + bozza di risposta AI", desc: "Ogni nuova recensione viene rilevata e il titolare riceve una bozza di risposta pronta da approvare con un clic." },
      },
      {
        problem: { title: "Comunicare con i clienti in modo costante", desc: "Si vorrebbe mandare promozioni e novità ma non c'è mai tempo." },
        solution: { title: "Newsletter mensile automatica", desc: "L'AI genera il contenuto della newsletter ogni mese e la invia alla lista clienti in automatico." },
      },
    ],
  },
  {
    id: "formazione",
    label: "Centri formativi e palestre",
    items: [
      {
        problem: { title: "Gestire iscrizioni e rinnovi manualmente", desc: "Email e messaggi per ogni iscrizione, ogni rinnovo, ogni scadenza abbonamento." },
        solution: { title: "Automazione iscrizioni e reminder", desc: "Il sistema invia automaticamente conferme, reminder di scadenza e proposte di rinnovo senza intervento umano." },
      },
      {
        problem: { title: "Comunicare le novità ai clienti", desc: "Nuovi corsi, orari cambiati, promozioni. Non c'è un sistema strutturato." },
        solution: { title: "Comunicazioni automatiche personalizzate", desc: "Email e messaggi automatici inviati al segmento giusto di clienti al momento giusto." },
      },
    ],
  },
];
