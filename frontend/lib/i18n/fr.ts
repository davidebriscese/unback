import type { Dictionary } from "./en";

export const fr: Dictionary = {
  meta: {
    title: "Unback - Suppression d'arrière-plan gratuite par IA",
    description:
      "Supprimez l'arrière-plan d'une image en quelques secondes. Gratuit, open source, sans inscription : vos images sont traitées en mémoire, jamais conservées.",
    ogAlt: "Unback - suppression d'arrière-plan gratuite",
  },

  header: {
    github: "Mettre une étoile sur GitHub",
    theme: "Activer ou désactiver le mode sombre",
    skipToTool: "Aller directement à l'outil",
  },

  hero: {
    badge: "Gratuit · Open source · Sans inscription",
    titleLead: "Supprimez l'arrière-plan de vos images",
    titleAccent: "en quelques secondes",
    subtitle:
      "Importez une photo, récupérez un PNG transparent. Sans inscription, sans filigrane, sans crédits - et aucune image n'est conservée.",
  },

  tool: {
    dropTitle: "Déposez une image ici",
    dropHint: "ou cliquez pour en choisir une, ou collez avec",
    pasteKey: "Ctrl+V",
    dropFormats: "JPG, PNG ou WebP - jusqu'à {mb} Mo",
    samplesLabel: "Pas d'image sous la main ? Essayez l'une de celles-ci :",
    samples: {
      portrait: "Portrait",
      product: "Photo de produit",
      animal: "Photo d'animal",
    },
    processing: "Suppression de l'arrière-plan…",
    before: "Avant",
    after: "Après",
    compareHint: "Faites glisser le curseur pour comparer",
    compareLabel: "Comparaison avant-après",
    bgLabel: "Arrière-plan",
    bgTransparent: "Transparent",
    bgWhite: "Blanc",
    bgBlack: "Noir",
    bgCustom: "Couleur personnalisée",
    download: "Télécharger le PNG",
    preparing: "Préparation…",
    reset: "Nouvelle image",
    ready: "Arrière-plan supprimé - prêt à télécharger.",
    resultAlt: "Image sans arrière-plan",
    originalAlt: "Image d'origine",
    errors: {
      notImage: "Ce fichier n'est pas une image. Utilisez un JPG, PNG ou WebP.",
      tooLarge: "Image trop volumineuse - la limite est de {mb} Mo.",
      badImage: "Impossible de lire cette image - elle est peut-être corrompue.",
      tooManyPixels: "Cette image compte trop de pixels. Essayez une version plus petite.",
      busy: "Le serveur est occupé pour le moment. Réessayez dans un instant.",
      busyRetry: "Le serveur est occupé pour le moment. Réessayez dans environ {s} s.",
      dailyLimit:
        "Vous avez atteint la limite d'utilisation du jour. Réessayez demain, ou hébergez votre propre instance - c'est gratuit.",
      network: "Impossible de joindre le serveur. Vérifiez que le backend est bien lancé.",
      unknown: "Une erreur s'est produite. Veuillez réessayer.",
    },
  },

  features: {
    title: "Pourquoi Unback ?",
    items: [
      {
        title: "Vraiment gratuit",
        body: "Pas de crédits, pas de filigrane, pas de compte. Utilisez-le autant que nécessaire.",
      },
      {
        title: "Vraiment privé",
        body: "Les images sont traitées en mémoire et jamais écrites sur disque : jamais stockées, jamais partagées, jamais utilisées pour entraîner quoi que ce soit.",
      },
      {
        title: "Open source et auto-hébergeable",
        body: "Code sous licence MIT sur GitHub. Faites-le tourner sur votre propre matériel avec une seule image Docker.",
      },
    ],
  },

  api: {
    title: "Utilisez-le depuis votre code",
    body: "L'endpoint derrière cette page est une simple API HTTP : vous envoyez une image, vous recevez un PNG transparent. Pas de clé, pas d'inscription - seulement des limites d'usage équitables.",
    docsLink: "Référence de l'API",
    githubLink: "Code source sur GitHub",
    copy: "Copier",
    copied: "Copié",
  },

  faq: {
    title: "Questions fréquentes",
    items: [
      {
        question: "Est-ce vraiment gratuit ?",
        answer:
          "Oui. Unback est open source sous licence MIT, et cette instance est gratuite, avec des limites d'usage équitables qui la gardent rapide pour tout le monde.",
      },
      {
        question: "Que deviennent mes images ?",
        answer:
          "Elles sont traitées en mémoire et supprimées dès que votre PNG vous est renvoyé : jamais écrites sur disque, jamais journalisées, jamais utilisées pour entraîner quoi que ce soit.",
      },
      {
        question: "Comment ça marche ?",
        answer:
          "Un réseau de neurones (ISNet) tourne sur le serveur via ONNX Runtime et prédit un masque alpha pixel par pixel. La comparaison, la couleur de fond et le téléchargement se font dans votre navigateur.",
      },
      {
        question: "Puis-je l'héberger moi-même ?",
        answer:
          "Oui - il est distribué sous forme d'une seule image Docker qui sert à la fois cette page et l'API. Le README sur GitHub propose un démarrage rapide en une commande.",
      },
    ],
  },

  footer: {
    tagline: "Suppression d'arrière-plan gratuite et open source.",
    privacy: "Les images sont traitées en mémoire et jamais conservées.",
    privacyPolicy: "Confidentialité",
    model: "Modèle",
    license: "Licence MIT",
    language: "Langue",
  },

  notFound: {
    title: "Page introuvable",
    body: "La page que vous cherchez n'existe pas ou a été déplacée.",
    home: "Retour à Unback",
  },

  privacy: {
    title: "Confidentialité",
    metaDescription:
      "Comment Unback traite vos images et vos données : traitement en mémoire, aucun stockage, aucun compte requis.",
    updated: "Dernière mise à jour : 2026-08-24",
    intro:
      "Unback est conçu pour qu'il n'y ait presque rien à écrire dans une politique de confidentialité. Cette page explique simplement ce que deviennent vos images et le peu de données que le service manipule.",
    sections: [
      {
        heading: "Vos images",
        body: "Les images transitent par une connexion chiffrée, sont traitées entièrement dans la mémoire du serveur et supprimées à l'instant où le résultat vous est renvoyé. Elles ne sont jamais écrites sur disque, jamais sauvegardées, jamais utilisées pour entraîner quoi que ce soit, et personne ne les voit.",
      },
      {
        heading: "Ce que le serveur journalise",
        body: "Les requêtes laissent une trace technique standard : dimensions de l'image, temps de traitement et statut de la réponse. Les journaux du serveur peuvent inclure votre adresse IP, utilisée uniquement pour faire fonctionner et protéger le service. Le contenu des images n'est jamais journalisé.",
      },
      {
        heading: "Limitation d'usage",
        body: "Pour que le service reste gratuit et rapide pour tout le monde, votre adresse IP est conservée dans la mémoire du serveur afin d'appliquer les limites d'usage équitable. Ces compteurs ne sont jamais écrits sur disque et disparaissent au redémarrage du service.",
      },
      {
        heading: "Cookies et stockage local",
        body: "Google Analytics dépose quelques cookies afin qu'une visite récurrente ne soit pas comptée comme nouvelle. En dehors de ceux-ci, le stockage local de votre navigateur conserve une seule valeur - votre préférence de thème clair ou sombre - qui ne quitte jamais votre appareil.",
      },
      {
        heading: "Mesure d'audience",
        body: "Cette instance utilise Google Analytics 4 pour mesurer l'usage réel de l'outil : pages vues et événements anonymes - une image sélectionnée, un fond détouré, un résultat téléchargé - ainsi que la durée du traitement. Vos images, leurs noms de fichier et leur contenu n'en font jamais partie. Google reçoit votre adresse IP pour en déduire une localisation approximative et déclare ne pas la conserver. N'importe quel bloqueur de contenu, ou le module de désinscription de Google lui-même, vous en exclut totalement.",
      },
      {
        heading: "Instances auto-hébergées",
        body: "Cette politique couvre l'instance officielle sur unback.app. Unback est open source, et les copies auto-hébergées sont gérées de façon indépendante par leurs propriétaires : elles ne mesurent rien, à moins que leur exploitant n'active la mesure d'audience avec sa propre propriété.",
      },
      {
        heading: "Questions",
        body: "Ouvrez une issue sur GitHub : le projet est développé au grand jour, et cette politique aussi - toute modification est visible dans l'historique du dépôt.",
      },
    ],
  },
};
