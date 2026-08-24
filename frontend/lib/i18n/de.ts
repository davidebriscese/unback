import type { Dictionary } from "./en";

export const de: Dictionary = {
  meta: {
    title: "Unback - Kostenloser KI-Hintergrundentferner",
    description:
      "Entferne den Hintergrund aus jedem Bild in Sekunden. Kostenlos, Open Source, ohne Anmeldung - deine Bilder werden im Speicher verarbeitet und nie gespeichert.",
    ogAlt: "Unback - kostenloser Hintergrundentferner",
  },

  header: {
    github: "Auf GitHub einen Stern geben",
    theme: "Dunkelmodus umschalten",
    skipToTool: "Direkt zum Tool springen",
  },

  hero: {
    badge: "Kostenlos · Open Source · Ohne Anmeldung",
    titleLead: "Entferne Bildhintergründe",
    titleAccent: "in Sekunden",
    subtitle:
      "Lade ein Foto hoch und erhalte ein transparentes PNG. Keine Anmeldung, kein Wasserzeichen, keine Credits - und kein Bild wird jemals gespeichert.",
  },

  tool: {
    dropTitle: "Zieh ein Bild hierher",
    dropHint: "oder klicke, um eines auszuwählen, oder füge ein mit",
    pasteKey: "Ctrl+V",
    dropFormats: "JPG, PNG oder WebP - max. {mb}MB",
    samplesLabel: "Kein Bild zur Hand? Probier eins von diesen:",
    samples: {
      portrait: "Porträtfoto",
      product: "Produktfoto",
      animal: "Tierfoto",
    },
    processing: "Hintergrund wird entfernt…",
    before: "Vorher",
    after: "Nachher",
    compareHint: "Zieh den Regler zum Vergleichen",
    compareLabel: "Vorher-Nachher-Vergleich",
    bgLabel: "Hintergrund",
    bgTransparent: "Transparent",
    bgWhite: "Weiß",
    bgBlack: "Schwarz",
    bgCustom: "Eigene Farbe",
    download: "PNG herunterladen",
    preparing: "Wird vorbereitet…",
    reset: "Neues Bild",
    ready: "Hintergrund entfernt - bereit zum Herunterladen.",
    resultAlt: "Bild mit entferntem Hintergrund",
    originalAlt: "Originalbild",
    errors: {
      notImage: "Diese Datei ist kein Bild. Verwende JPG, PNG oder WebP.",
      tooLarge: "Bild zu groß - das Limit ist {mb}MB.",
      badImage: "Das Bild konnte nicht gelesen werden - es ist möglicherweise beschädigt.",
      tooManyPixels: "Das Bild hat zu viele Pixel. Versuch es mit einer kleineren Version.",
      busy: "Der Server ist gerade ausgelastet. Versuch es gleich noch einmal.",
      busyRetry: "Der Server ist gerade ausgelastet. Versuch es in etwa {s}s noch einmal.",
      dailyLimit:
        "Du hast das heutige Fair-Use-Limit erreicht. Versuch es morgen wieder - oder betreib deine eigene Instanz, das ist kostenlos.",
      network: "Der Server ist nicht erreichbar. Prüfe, ob das Backend läuft.",
      unknown: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
    },
  },

  features: {
    title: "Warum Unback?",
    items: [
      {
        title: "Wirklich kostenlos",
        body: "Keine Credits, keine Wasserzeichen, kein Konto. Nutze es, so oft du es brauchst.",
      },
      {
        title: "Wirklich privat",
        body: "Bilder werden im Speicher verarbeitet und nie auf die Festplatte geschrieben - nie gespeichert, nie weitergegeben, nie für Training verwendet.",
      },
      {
        title: "Open Source und selbst hostbar",
        body: "MIT-lizenzierter Code auf GitHub. Betreib es auf eigener Hardware mit einem einzigen Docker-Image.",
      },
    ],
  },

  api: {
    title: "Nutze es aus deinem Code",
    body: "Der Endpoint hinter dieser Seite ist eine einfache HTTP-API: Bild senden, transparentes PNG zurückbekommen. Kein Schlüssel, keine Anmeldung - nur faire Nutzungslimits.",
    docsLink: "API-Referenz",
    githubLink: "Quellcode auf GitHub",
    copy: "Kopieren",
    copied: "Kopiert",
  },

  faq: {
    title: "Häufige Fragen",
    items: [
      {
        question: "Ist es wirklich kostenlos?",
        answer:
          "Ja. Unback ist Open Source unter der MIT-Lizenz, und diese Instanz ist kostenlos nutzbar - mit fairen Limits, die sie für alle schnell halten.",
      },
      {
        question: "Was passiert mit meinen Bildern?",
        answer:
          "Sie werden im Speicher verarbeitet und verworfen, sobald du dein PNG erhältst - nie auf die Festplatte geschrieben, nie geloggt, nie für Training verwendet.",
      },
      {
        question: "Wie funktioniert es?",
        answer:
          "Ein neuronales Netz (ISNet) läuft auf dem Server über ONNX Runtime und berechnet eine Alphamaske pro Pixel. Vergleichen, Umfärben und Herunterladen passieren komplett in deinem Browser.",
      },
      {
        question: "Kann ich es selbst hosten?",
        answer:
          "Ja - es wird als einzelnes Docker-Image ausgeliefert, das diese Seite und die API zugleich bereitstellt. In der README auf GitHub findest du den Schnellstart mit einem einzigen Befehl.",
      },
    ],
  },

  footer: {
    tagline: "Kostenlose Open-Source-Hintergrundentfernung.",
    privacy: "Bilder werden im Speicher verarbeitet und nie gespeichert.",
    privacyPolicy: "Datenschutz",
    model: "Modell",
    license: "MIT-Lizenz",
    language: "Sprache",
  },

  notFound: {
    title: "Seite nicht gefunden",
    body: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    home: "Zurück zu Unback",
  },

  privacy: {
    title: "Datenschutz",
    metaDescription:
      "Wie Unback mit deinen Bildern und Daten umgeht: Verarbeitung im Speicher, keine Speicherung, kein Konto nötig.",
    updated: "Zuletzt aktualisiert: 2026-08-24",
    intro:
      "Unback ist so gebaut, dass es fast nichts gibt, worüber man eine Datenschutzerklärung schreiben müsste. Diese Seite erklärt in einfachen Worten, was mit deinen Bildern passiert und welche wenigen Daten der Dienst berührt.",
    sections: [
      {
        heading: "Deine Bilder",
        body: "Bilder werden über eine verschlüsselte Verbindung hochgeladen, vollständig im Speicher des Servers verarbeitet und verworfen, sobald dein Ergebnis zurückkommt. Sie werden nie auf die Festplatte geschrieben, nie gesichert, nie für Training verwendet und nie von jemandem angesehen.",
      },
      {
        heading: "Was der Server protokolliert",
        body: "Anfragen hinterlassen eine übliche technische Spur: Bildabmessungen, Verarbeitungszeit und Antwortstatus. Server-Logs können deine IP-Adresse enthalten, die nur zum Betrieb und Schutz des Dienstes verwendet wird. Bildinhalte werden nie protokolliert.",
      },
      {
        heading: "Rate-Limiting",
        body: "Damit der Dienst für alle kostenlos und schnell bleibt, wird deine IP-Adresse im Speicher des Servers gehalten, um Fair-Use-Limits durchzusetzen. Diese Zähler werden nie auf die Festplatte geschrieben und verschwinden beim Neustart des Dienstes.",
      },
      {
        heading: "Cookies und lokaler Speicher",
        body: "Google Analytics setzt einige Cookies, damit ein wiederkehrender Besuch nicht als neuer gezählt wird. Davon abgesehen hält der lokale Speicher deines Browsers genau einen Wert - deine Wahl zwischen hellem und dunklem Theme - und der verlässt dein Gerät nie.",
      },
      {
        heading: "Analytics",
        body: "Diese Instanz nutzt Google Analytics 4, um zu messen, wie stark das Werkzeug tatsächlich genutzt wird: Seitenaufrufe sowie anonyme Ereignisse - ein Bild ausgewählt, ein Hintergrund entfernt, ein Ergebnis heruntergeladen - und wie lange die Verarbeitung gedauert hat. Deine Bilder, ihre Dateinamen und ihre Inhalte sind nie Teil davon. Google erhält deine IP-Adresse, um daraus einen ungefähren Standort abzuleiten, und gibt an, sie nicht zu speichern. Jeder Content-Blocker oder Googles eigenes Opt-out-Add-on hält dich vollständig heraus.",
      },
      {
        heading: "Selbst gehostete Instanzen",
        body: "Diese Erklärung gilt für die offizielle Instanz auf unback.app. Unback ist Open Source, und selbst gehostete Kopien werden von ihren Betreibern eigenständig verwaltet - sie messen überhaupt nichts, solange ihr Betreiber Analytics nicht mit einer eigenen Property einschaltet.",
      },
      {
        heading: "Fragen",
        body: "Eröffne ein Issue auf GitHub - das Projekt wird offen entwickelt, und das gilt auch für diese Erklärung: Jede Änderung daran ist in der Historie des Repositorys sichtbar.",
      },
    ],
  },
};
