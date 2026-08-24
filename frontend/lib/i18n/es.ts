import type { Dictionary } from "./en";

export const es: Dictionary = {
  meta: {
    title: "Unback - Eliminador de fondos gratuito con IA",
    description:
      "Elimina el fondo de cualquier imagen en segundos. Gratis, de código abierto y sin registro: tus imágenes se procesan en memoria y nunca se guardan.",
    ogAlt: "Unback - eliminador de fondos gratuito",
  },

  header: {
    github: "Danos una estrella en GitHub",
    theme: "Activar o desactivar el modo oscuro",
    skipToTool: "Ir directamente a la herramienta",
  },

  hero: {
    badge: "Gratis · Código abierto · Sin registro",
    titleLead: "Elimina el fondo de tus imágenes",
    titleAccent: "en segundos",
    subtitle:
      "Sube una foto y obtén un PNG transparente. Sin registro, sin marca de agua, sin créditos - y ninguna imagen se guarda.",
  },

  tool: {
    dropTitle: "Arrastra una imagen aquí",
    dropHint: "o haz clic para elegir una, o pega con",
    pasteKey: "Ctrl+V",
    dropFormats: "JPG, PNG o WebP - hasta {mb}MB",
    samplesLabel: "¿No tienes ninguna a mano? Prueba una de estas:",
    samples: {
      portrait: "Retrato",
      product: "Foto de producto",
      animal: "Foto de animal",
    },
    processing: "Eliminando el fondo…",
    before: "Antes",
    after: "Después",
    compareHint: "Arrastra el control para comparar",
    compareLabel: "Comparación del antes y el después",
    bgLabel: "Fondo",
    bgTransparent: "Transparente",
    bgWhite: "Blanco",
    bgBlack: "Negro",
    bgCustom: "Color personalizado",
    download: "Descargar PNG",
    preparing: "Preparando…",
    reset: "Nueva imagen",
    ready: "Fondo eliminado: listo para descargar.",
    resultAlt: "Imagen sin fondo",
    originalAlt: "Imagen original",
    errors: {
      notImage: "Ese archivo no es una imagen. Usa JPG, PNG o WebP.",
      tooLarge: "Imagen demasiado grande: el límite es {mb}MB.",
      badImage: "No se pudo leer la imagen: puede estar dañada.",
      tooManyPixels: "La imagen tiene demasiados píxeles. Prueba con una versión más pequeña.",
      busy: "El servidor está ocupado en este momento. Vuelve a intentarlo en unos instantes.",
      busyRetry: "El servidor está ocupado en este momento. Vuelve a intentarlo en unos {s}s.",
      dailyLimit:
        "Has alcanzado el límite de uso de hoy. Vuelve a intentarlo mañana o monta tu propia instancia: es gratis.",
      network: "No se puede conectar con el servidor. Comprueba que el backend esté en marcha.",
      unknown: "Algo ha salido mal. Vuelve a intentarlo.",
    },
  },

  features: {
    title: "¿Por qué Unback?",
    items: [
      {
        title: "Gratis de verdad",
        body: "Sin créditos, sin marcas de agua, sin cuenta. Úsalo cuanto necesites.",
      },
      {
        title: "Privado de verdad",
        body: "Las imágenes se procesan en memoria y nunca se escriben en disco: nunca se guardan, nunca se comparten, nunca se usan para entrenar nada.",
      },
      {
        title: "Código abierto y autoalojable",
        body: "Código con licencia MIT en GitHub. Ejecútalo en tu propio hardware con una sola imagen de Docker.",
      },
    ],
  },

  api: {
    title: "Úsalo desde tu código",
    body: "El endpoint detrás de esta página es una API HTTP normal: envías una imagen y recibes un PNG transparente. Sin clave, sin registro - solo límites de uso justos.",
    docsLink: "Referencia de la API",
    githubLink: "Código en GitHub",
    copy: "Copiar",
    copied: "Copiado",
  },

  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        question: "¿Es gratis de verdad?",
        answer:
          "Sí. Unback es de código abierto bajo licencia MIT, y esta instancia es gratuita, con límites de uso justos que la mantienen rápida para todos.",
      },
      {
        question: "¿Qué pasa con mis imágenes?",
        answer:
          "Se procesan en memoria y se descartan en cuanto recibes tu PNG: nunca se escriben en disco, nunca se registran en los logs y nunca se usan para entrenar nada.",
      },
      {
        question: "¿Cómo funciona?",
        answer:
          "Una red neuronal (ISNet) se ejecuta en el servidor mediante ONNX Runtime y predice una máscara alfa por píxel. La comparación, el color de fondo y la descarga ocurren en tu navegador.",
      },
      {
        question: "¿Puedo alojarlo yo mismo?",
        answer:
          "Sí: se distribuye como una única imagen de Docker que sirve tanto esta página como la API. El README en GitHub incluye un inicio rápido con un solo comando.",
      },
    ],
  },

  footer: {
    tagline: "Eliminación de fondos gratuita y de código abierto.",
    privacy: "Las imágenes se procesan en memoria y nunca se guardan.",
    privacyPolicy: "Privacidad",
    model: "Modelo",
    license: "Licencia MIT",
    language: "Idioma",
  },

  notFound: {
    title: "Página no encontrada",
    body: "La página que buscas no existe o se ha movido.",
    home: "Volver a Unback",
  },

  privacy: {
    title: "Privacidad",
    metaDescription:
      "Cómo trata Unback tus imágenes y tus datos: procesamiento en memoria, sin almacenamiento y sin necesidad de cuenta.",
    updated: "Última actualización: 2026-08-24",
    intro:
      "Unback está construido para que apenas haya nada sobre lo que escribir una política de privacidad. Esta página explica, con claridad, qué pasa con tus imágenes y qué pocos datos toca el servicio.",
    sections: [
      {
        heading: "Tus imágenes",
        body: "Las imágenes se suben por una conexión cifrada, se procesan íntegramente en la memoria del servidor y se descartan en el momento en que recibes el resultado. Nunca se escriben en disco, nunca se incluyen en copias de seguridad, nunca se usan para entrenar nada y nadie las ve.",
      },
      {
        heading: "Qué registra el servidor",
        body: "Las peticiones dejan un rastro técnico estándar: dimensiones de la imagen, tiempo de procesamiento y estado de la respuesta. Los logs del servidor pueden incluir tu dirección IP, que se usa solo para operar y proteger el servicio. El contenido de las imágenes nunca se registra.",
      },
      {
        heading: "Límites de uso",
        body: "Para que el servicio siga siendo gratuito y rápido para todos, tu dirección IP se mantiene en la memoria del servidor para aplicar los límites de uso justo. Estos contadores nunca se escriben en disco y desaparecen cuando el servicio se reinicia.",
      },
      {
        heading: "Cookies y almacenamiento local",
        body: "Google Analytics instala unas pocas cookies para que una visita recurrente no se cuente como nueva. Aparte de esas, el almacenamiento local de tu navegador guarda un único valor - tu preferencia de tema claro u oscuro - que nunca sale de tu dispositivo.",
      },
      {
        heading: "Analítica",
        body: "Esta instancia usa Google Analytics 4 para medir cuánto se usa realmente la herramienta: páginas vistas y eventos anónimos - una imagen seleccionada, un fondo eliminado, un resultado descargado - junto al tiempo de procesamiento. Tus imágenes, sus nombres de archivo y su contenido nunca forman parte de eso. Google recibe tu dirección IP para deducir una ubicación aproximada y declara que no la almacena. Cualquier bloqueador de contenido, o el complemento de exclusión del propio Google, te deja fuera por completo.",
      },
      {
        heading: "Instancias autoalojadas",
        body: "Esta política cubre la instancia oficial en unback.app. Unback es de código abierto y las copias autoalojadas las gestionan de forma independiente sus propietarios: no miden nada, salvo que quien las administra active la analítica con una propiedad propia.",
      },
      {
        heading: "Preguntas",
        body: "Abre una issue en GitHub: el proyecto se desarrolla en abierto, igual que esta política - cualquier cambio queda visible en el historial del repositorio.",
      },
    ],
  },
};
