/**
 * Source of truth for every string in the UI. Its inferred shape is the contract every other
 * language must satisfy, so a missing or misspelled key is a compile error.
 *
 * Values must stay plain serializable data: dictionaries cross the server/client boundary.
 */
export const en = {
  meta: {
    title: "Unback - Free AI Background Remover",
    description:
      "Remove the background from any image in seconds. Free, open source, no signup - your images are processed in memory and never stored.",
    ogAlt: "Unback - free background remover",
  },

  header: {
    github: "Star on GitHub",
    theme: "Toggle dark mode",
    skipToTool: "Skip to the tool",
  },

  hero: {
    badge: "Free · Open source · No signup",
    titleLead: "Remove image backgrounds",
    titleAccent: "in seconds",
    subtitle:
      "Upload a photo, get a transparent PNG. No signup, no watermark, no credits - and no image ever stored.",
  },

  tool: {
    dropTitle: "Drop an image here",
    dropHint: "or click to choose one, or paste with",
    pasteKey: "Ctrl+V",
    dropFormats: "JPG, PNG or WebP - up to {mb}MB",
    samplesLabel: "No image handy? Try one of these:",
    samples: {
      portrait: "Portrait photo",
      product: "Product photo",
      animal: "Animal photo",
    },
    processing: "Removing background…",
    before: "Before",
    after: "After",
    compareHint: "Drag the handle to compare",
    compareLabel: "Before and after comparison",
    bgLabel: "Background",
    bgTransparent: "Transparent",
    bgWhite: "White",
    bgBlack: "Black",
    bgCustom: "Custom colour",
    download: "Download PNG",
    preparing: "Preparing…",
    reset: "New image",
    ready: "Background removed - ready to download.",
    resultAlt: "Image with the background removed",
    originalAlt: "Original image",
    errors: {
      notImage: "That file isn't an image. Use JPG, PNG or WebP.",
      tooLarge: "Image too large - the limit is {mb}MB.",
      badImage: "Couldn't read that image - it may be corrupted.",
      tooManyPixels: "That image has too many pixels. Try a smaller version.",
      busy: "The server is busy right now. Try again in a moment.",
      busyRetry: "The server is busy right now. Try again in about {s}s.",
      dailyLimit:
        "You've reached today's fair-use limit. Try again tomorrow, or run your own instance - it's free.",
      network: "Can't reach the server. Check that the backend is running.",
      unknown: "Something went wrong. Please try again.",
    },
  },

  features: {
    title: "Why Unback?",
    items: [
      {
        title: "Actually free",
        body: "No credits, no watermarks, no account. Use it as much as you reasonably need.",
      },
      {
        title: "Actually private",
        body: "Images are processed in memory and never written to disk - never stored, never shared, never used for training.",
      },
      {
        title: "Open source, self-hostable",
        body: "MIT-licensed code on GitHub. Run it on your own hardware with a single Docker image.",
      },
    ],
  },

  api: {
    title: "Use it from your code",
    body: "The endpoint behind this page is a plain HTTP API: send an image, get a transparent PNG back. No key, no signup - just fair-use rate limits.",
    docsLink: "API reference",
    githubLink: "Source on GitHub",
    copy: "Copy",
    copied: "Copied",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "Is it really free?",
        answer:
          "Yes. Unback is open source under the MIT licence, and this instance is free to use with fair rate limits that keep it fast for everyone.",
      },
      {
        question: "What happens to my images?",
        answer:
          "They are processed in memory and discarded as soon as your PNG is returned - never written to disk, never logged, never used to train anything.",
      },
      {
        question: "How does it work?",
        answer:
          "A neural network (ISNet) runs on the server through ONNX Runtime and predicts a per-pixel alpha mask. Comparing, recolouring and downloading all happen in your browser.",
      },
      {
        question: "Can I self-host it?",
        answer:
          "Yes - it ships as a single Docker image that serves both this page and the API. The README on GitHub has a one-command quickstart.",
      },
    ],
  },

  footer: {
    tagline: "Free, open-source background removal.",
    privacy: "Images are processed in memory and never stored.",
    privacyPolicy: "Privacy",
    model: "Model",
    license: "MIT licence",
    language: "Language",
  },

  notFound: {
    title: "Page not found",
    body: "The page you are looking for doesn't exist or has moved.",
    home: "Back to Unback",
  },

  privacy: {
    title: "Privacy",
    metaDescription:
      "How Unback handles your images and data: processed in memory, never stored, no account required.",
    updated: "Last updated: 2026-08-24",
    intro:
      "Unback is built so that there is almost nothing to write a privacy policy about. This page explains, plainly, what happens to your images and what little data the service touches.",
    sections: [
      {
        heading: "Your images",
        body: "Images are uploaded over an encrypted connection, processed entirely in the server's memory, and discarded the moment your result is returned. They are never written to disk, never backed up, never used to train anything, and never seen by anyone.",
      },
      {
        heading: "What the server logs",
        body: "Requests leave a standard technical trace: image dimensions, processing time and response status. Server logs may include your IP address, which is used only to operate and protect the service. Image content is never logged.",
      },
      {
        heading: "Rate limiting",
        body: "To keep the service free and fast for everyone, your IP address is held in the server's memory to enforce fair-use limits. These counters are never written to disk and disappear when the service restarts.",
      },
      {
        heading: "Cookies and local storage",
        body: "Google Analytics sets a few cookies so that a returning visit is not counted as a brand new one. Apart from those, your browser's local storage keeps a single value - your light/dark theme preference - which never leaves your device.",
      },
      {
        heading: "Analytics",
        body: "This instance uses Google Analytics 4 to measure how much the tool is actually used: page views, plus anonymous events - an image selected, a background removed, a result downloaded - and how long processing took. Your images, their file names and their contents are never part of it. Google receives your IP address to derive an approximate location and states that it does not store it. Any content blocker, or Google's own opt-out add-on, keeps you out of it entirely.",
      },
      {
        heading: "Self-hosted instances",
        body: "This policy covers the official instance at unback.app. Unback is open source, and self-hosted copies are operated independently by their owners - they measure nothing at all unless their operator switches analytics on with a property of their own.",
      },
      {
        heading: "Questions",
        body: "Open an issue on GitHub - the project is developed in the open, and so is this policy: any change to it is visible in the repository history.",
      },
    ],
  },
};

/** Widened on purpose: translations supply their own strings, not these literals. */
export type Dictionary = typeof en;
