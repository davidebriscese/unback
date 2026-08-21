import type { Dictionary } from "./en";

export const it: Dictionary = {
  meta: {
    title: "Unback — Rimuovi lo sfondo dalle immagini, gratis",
    description:
      "Rimuovi lo sfondo da qualsiasi immagine in pochi secondi. Gratis, open source, senza registrazione: le immagini sono elaborate in memoria e mai salvate.",
    ogAlt: "Unback — rimozione sfondo gratuita",
  },

  header: {
    github: "Metti una stella su GitHub",
    theme: "Attiva o disattiva il tema scuro",
    skipToTool: "Vai direttamente allo strumento",
  },

  hero: {
    badge: "Gratis · Open source · Senza registrazione",
    titleLead: "Rimuovi lo sfondo",
    titleAccent: "in un istante",
    subtitle:
      "Carica una foto e ottieni un PNG trasparente. Nessuna registrazione, nessuna filigrana, nessun credito da comprare — e nessuna immagine salvata.",
  },

  tool: {
    dropTitle: "Trascina qui un'immagine",
    dropHint: "oppure clicca per sceglierla, o incolla con",
    pasteKey: "Ctrl+V",
    dropFormats: "JPG, PNG o WebP — max {mb}MB",
    samplesLabel: "Niente immagini sottomano? Prova una di queste:",
    samples: {
      portrait: "Ritratto",
      product: "Foto di prodotto",
      animal: "Foto di animale",
    },
    processing: "Rimozione dello sfondo…",
    before: "Prima",
    after: "Dopo",
    compareHint: "Trascina il cursore per confrontare",
    compareLabel: "Confronto prima e dopo",
    bgLabel: "Sfondo",
    bgTransparent: "Trasparente",
    bgWhite: "Bianco",
    bgBlack: "Nero",
    bgCustom: "Colore personalizzato",
    download: "Scarica PNG",
    preparing: "Preparazione…",
    reset: "Nuova immagine",
    ready: "Sfondo rimosso: il file è pronto da scaricare.",
    resultAlt: "Immagine senza sfondo",
    originalAlt: "Immagine originale",
    errors: {
      notImage: "Il file non è un'immagine. Usa JPG, PNG o WebP.",
      tooLarge: "Immagine troppo grande: il limite è {mb}MB.",
      badImage: "Impossibile leggere l'immagine: potrebbe essere danneggiata.",
      tooManyPixels: "L'immagine ha troppi pixel. Prova con una versione più piccola.",
      busy: "Il server è occupato in questo momento. Riprova tra qualche istante.",
      busyRetry: "Il server è occupato in questo momento. Riprova tra circa {s}s.",
      dailyLimit:
        "Hai raggiunto il limite di utilizzo di oggi. Riprova domani, oppure installa la tua istanza: è gratis.",
      network: "Server non raggiungibile. Controlla che il backend sia avviato.",
      unknown: "Qualcosa è andato storto. Riprova.",
    },
  },

  features: {
    title: "Perché Unback?",
    items: [
      {
        title: "Gratis davvero",
        body: "Niente crediti, niente filigrane, niente account. Usalo quanto ti serve.",
      },
      {
        title: "Privato davvero",
        body: "Le immagini sono elaborate in memoria e mai scritte su disco. Niente archivi, niente tracciamenti, niente condivisioni.",
      },
      {
        title: "Open source e self-hosted",
        body: "Codice su GitHub con licenza MIT. Eseguilo sul tuo hardware con una singola immagine Docker.",
      },
    ],
  },

  api: {
    title: "Usalo dal tuo codice",
    body: "L'endpoint che alimenta questa pagina è una semplice API HTTP: invii un'immagine, ricevi un PNG trasparente. Nessuna chiave, nessuna registrazione, solo limiti di utilizzo equi.",
    docsLink: "Documentazione API",
    githubLink: "Codice su GitHub",
    copy: "Copia",
    copied: "Copiato",
  },

  faq: {
    title: "Domande frequenti",
    items: [
      {
        question: "È davvero gratis?",
        answer:
          "Sì. Unback è open source con licenza MIT e questa istanza è gratuita, con limiti d'uso equi che la mantengono veloce per tutti.",
      },
      {
        question: "Che fine fanno le mie immagini?",
        answer:
          "Vengono elaborate in memoria e scartate appena ricevi il PNG: mai scritte su disco, mai registrate nei log, mai usate per addestrare nulla.",
      },
      {
        question: "Come funziona?",
        answer:
          "Una rete neurale (ISNet) gira sul server tramite ONNX Runtime e stima una maschera alfa per ogni pixel. Confronto, colore di sfondo e download avvengono nel tuo browser.",
      },
      {
        question: "Posso installarlo io?",
        answer:
          "Sì: è distribuito come singola immagine Docker che serve sia questa pagina sia l'API. Nel README su GitHub trovi l'avvio rapido con un solo comando.",
      },
    ],
  },

  footer: {
    tagline: "Rimozione dello sfondo gratuita e open source.",
    privacy: "Le immagini sono elaborate in memoria e mai salvate.",
    privacyPolicy: "Privacy",
    model: "Modello",
    license: "Licenza MIT",
    language: "Lingua",
  },

  notFound: {
    title: "Pagina non trovata",
    body: "La pagina che cerchi non esiste o è stata spostata.",
    home: "Torna a Unback",
  },

  privacy: {
    title: "Privacy",
    metaDescription:
      "Come Unback tratta le tue immagini e i tuoi dati: elaborazione in memoria, nessun salvataggio, nessun account richiesto.",
    updated: "Ultimo aggiornamento: 2026-08-21",
    intro:
      "Unback è costruito in modo che non ci sia quasi nulla su cui scrivere una privacy policy. Questa pagina spiega, in parole semplici, che fine fanno le tue immagini e quali pochi dati tocca il servizio.",
    sections: [
      {
        heading: "Le tue immagini",
        body: "Le immagini viaggiano su una connessione cifrata, vengono elaborate interamente nella memoria del server e scartate nell'istante in cui ricevi il risultato. Non vengono mai scritte su disco, mai salvate in backup, mai usate per addestrare nulla e mai viste da nessuno.",
      },
      {
        heading: "Cosa registra il server",
        body: "Le richieste lasciano una normale traccia tecnica: dimensioni dell'immagine, tempo di elaborazione e stato della risposta. I log del server possono includere il tuo indirizzo IP, usato solo per far funzionare e proteggere il servizio. Il contenuto delle immagini non viene mai registrato.",
      },
      {
        heading: "Limiti di utilizzo",
        body: "Per mantenere il servizio gratuito e veloce per tutti, il tuo indirizzo IP è tenuto nella memoria del server per applicare i limiti di fair use. Questi contatori non vengono mai scritti su disco e spariscono al riavvio del servizio.",
      },
      {
        heading: "Cookie e archiviazione locale",
        body: "Unback non imposta cookie. La memoria locale del browser conserva un solo valore — la tua preferenza per il tema chiaro o scuro — che non lascia mai il tuo dispositivo.",
      },
      {
        heading: "Analytics",
        body: "Questa istanza non utilizza analytics di terze parti.",
      },
      {
        heading: "Istanze self-hosted",
        body: "Questa policy riguarda l'istanza ufficiale su unback.app. Unback è open source e le copie self-hosted sono gestite in autonomia dai rispettivi proprietari.",
      },
      {
        heading: "Domande",
        body: "Apri una issue su GitHub: il progetto è sviluppato alla luce del sole, e lo è anche questa policy — ogni modifica è visibile nella cronologia del repository.",
      },
    ],
  },
};
