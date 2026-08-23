import type { Dictionary } from "./en";

export const pt: Dictionary = {
  meta: {
    title: "Unback - Removedor de fundo grátis com IA",
    description:
      "Remova o fundo de qualquer imagem em segundos. Grátis, open source, sem cadastro - suas imagens são processadas na memória e nunca ficam armazenadas.",
    ogAlt: "Unback - removedor de fundo gratuito",
  },

  header: {
    github: "Dê uma estrela no GitHub",
    theme: "Alternar modo escuro",
    skipToTool: "Pular para a ferramenta",
  },

  hero: {
    badge: "Grátis · Open source · Sem cadastro",
    titleLead: "Remova o fundo das imagens",
    titleAccent: "em segundos",
    subtitle:
      "Envie uma foto e receba um PNG transparente. Sem cadastro, sem marca d'água, sem créditos - e nenhuma imagem fica armazenada.",
  },

  tool: {
    dropTitle: "Arraste uma imagem para cá",
    dropHint: "ou clique para escolher uma, ou cole com",
    pasteKey: "Ctrl+V",
    dropFormats: "JPG, PNG ou WebP - até {mb}MB",
    samplesLabel: "Sem nenhuma imagem à mão? Experimente uma destas:",
    samples: {
      portrait: "Retrato",
      product: "Foto de produto",
      animal: "Foto de animal",
    },
    processing: "Removendo o fundo…",
    before: "Antes",
    after: "Depois",
    compareHint: "Arraste o controle para comparar",
    compareLabel: "Comparação antes e depois",
    bgLabel: "Fundo",
    bgTransparent: "Transparente",
    bgWhite: "Branco",
    bgBlack: "Preto",
    bgCustom: "Cor personalizada",
    download: "Baixar PNG",
    preparing: "Preparando…",
    reset: "Nova imagem",
    ready: "Fundo removido - pronto para baixar.",
    resultAlt: "Imagem com o fundo removido",
    originalAlt: "Imagem original",
    errors: {
      notImage: "Esse arquivo não é uma imagem. Use JPG, PNG ou WebP.",
      tooLarge: "Imagem grande demais - o limite é {mb}MB.",
      badImage: "Não foi possível ler a imagem - ela pode estar corrompida.",
      tooManyPixels: "Essa imagem tem pixels demais. Tente uma versão menor.",
      busy: "O servidor está ocupado agora. Tente de novo em instantes.",
      busyRetry: "O servidor está ocupado agora. Tente de novo em cerca de {s}s.",
      dailyLimit:
        "Você atingiu o limite de uso de hoje. Tente de novo amanhã, ou rode sua própria instância - é grátis.",
      network: "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
      unknown: "Algo deu errado. Tente de novo.",
    },
  },

  features: {
    title: "Por que o Unback?",
    items: [
      {
        title: "Grátis de verdade",
        body: "Sem créditos, sem marcas d'água, sem conta. Use quanto precisar.",
      },
      {
        title: "Privado de verdade",
        body: "As imagens são processadas na memória e nunca gravadas em disco. Nada é armazenado, rastreado ou compartilhado.",
      },
      {
        title: "Open source e self-hosted",
        body: "Código no GitHub sob licença MIT. Rode no seu próprio hardware com uma única imagem Docker.",
      },
    ],
  },

  api: {
    title: "Use a partir do seu código",
    body: "O endpoint por trás desta página é uma API HTTP simples: envie uma imagem e receba um PNG transparente. Sem chave, sem cadastro - só limites de uso justos.",
    docsLink: "Referência da API",
    githubLink: "Código no GitHub",
    copy: "Copiar",
    copied: "Copiado",
  },

  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        question: "É grátis mesmo?",
        answer:
          "Sim. O Unback é open source sob a licença MIT, e esta instância é gratuita, com limites de uso justos que a mantêm rápida para todo mundo.",
      },
      {
        question: "O que acontece com as minhas imagens?",
        answer:
          "Elas são processadas na memória e descartadas assim que o PNG é devolvido - nunca gravadas em disco, nunca registradas em log, nunca usadas para treinar nada.",
      },
      {
        question: "Como funciona?",
        answer:
          "Uma rede neural (ISNet) roda no servidor via ONNX Runtime e estima uma máscara alfa por pixel. Comparação, cor de fundo e download acontecem no seu navegador.",
      },
      {
        question: "Posso hospedar por conta própria?",
        answer:
          "Sim - ele é distribuído como uma única imagem Docker que serve esta página e a API. O README no GitHub tem um guia rápido de um único comando.",
      },
    ],
  },

  footer: {
    tagline: "Remoção de fundo gratuita e open source.",
    privacy: "As imagens são processadas na memória e nunca armazenadas.",
    privacyPolicy: "Privacidade",
    model: "Modelo",
    license: "Licença MIT",
    language: "Idioma",
  },

  notFound: {
    title: "Página não encontrada",
    body: "A página que você procura não existe ou foi movida.",
    home: "Voltar ao Unback",
  },

  privacy: {
    title: "Privacidade",
    metaDescription:
      "Como o Unback trata suas imagens e seus dados: processamento na memória, nada armazenado, nenhuma conta necessária.",
    updated: "Última atualização: 2026-08-21",
    intro:
      "O Unback foi construído para que quase não haja sobre o que escrever uma política de privacidade. Esta página explica, em palavras simples, o que acontece com suas imagens e os poucos dados que o serviço toca.",
    sections: [
      {
        heading: "Suas imagens",
        body: "As imagens são enviadas por uma conexão criptografada, processadas inteiramente na memória do servidor e descartadas no instante em que o resultado é devolvido. Nunca são gravadas em disco, nunca entram em backup, nunca são usadas para treinar nada e nunca são vistas por ninguém.",
      },
      {
        heading: "O que o servidor registra",
        body: "As requisições deixam um rastro técnico padrão: dimensões da imagem, tempo de processamento e status da resposta. Os logs do servidor podem incluir seu endereço IP, usado apenas para operar e proteger o serviço. O conteúdo das imagens nunca é registrado.",
      },
      {
        heading: "Limites de uso",
        body: "Para manter o serviço gratuito e rápido para todo mundo, seu endereço IP fica na memória do servidor para aplicar os limites de uso justo. Esses contadores nunca são gravados em disco e desaparecem quando o serviço reinicia.",
      },
      {
        heading: "Cookies e armazenamento local",
        body: "O Unback não define cookies. O armazenamento local do seu navegador guarda um único valor - sua preferência de tema claro ou escuro - que nunca sai do seu dispositivo.",
      },
      {
        heading: "Analytics",
        body: "Esta instância não usa analytics de terceiros.",
      },
      {
        heading: "Instâncias self-hosted",
        body: "Esta política cobre a instância oficial em unback.app. O Unback é open source, e cópias self-hosted são operadas de forma independente pelos seus donos.",
      },
      {
        heading: "Dúvidas",
        body: "Abra uma issue no GitHub - o projeto é desenvolvido às claras, e esta política também: qualquer mudança nela fica visível no histórico do repositório.",
      },
    ],
  },
};
