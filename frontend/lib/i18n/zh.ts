import type { Dictionary } from "./en";

export const zh: Dictionary = {
  meta: {
    title: "Unback - 免费 AI 抠图工具",
    description:
      "几秒内去除任意图片的背景。免费、开源、无需注册-图片只在内存中处理,绝不存储。",
    ogAlt: "Unback - 免费抠图工具",
  },

  header: {
    github: "在 GitHub 上加星",
    theme: "切换深色模式",
    skipToTool: "跳转到工具",
  },

  hero: {
    badge: "免费 · 开源 · 无需注册",
    titleLead: "去除图片背景",
    titleAccent: "只需几秒",
    subtitle:
      "上传照片,得到透明 PNG。无需注册,没有水印,不用买点数-图片也绝不会被存储。",
  },

  tool: {
    dropTitle: "把图片拖到这里",
    dropHint: "或点击选择,也可以粘贴:",
    pasteKey: "Ctrl+V",
    dropFormats: "JPG、PNG 或 WebP,最大 {mb}MB",
    samplesLabel: "手边没有图片?试试这些:",
    samples: {
      portrait: "人像照片",
      product: "产品图",
      animal: "动物照片",
    },
    processing: "正在去除背景…",
    before: "处理前",
    after: "处理后",
    compareHint: "拖动滑块对比效果",
    compareLabel: "处理前后对比",
    bgLabel: "背景",
    bgTransparent: "透明",
    bgWhite: "白色",
    bgBlack: "黑色",
    bgCustom: "自定义颜色",
    download: "下载 PNG",
    preparing: "正在准备…",
    reset: "换一张",
    ready: "背景已去除,可以下载了。",
    resultAlt: "去除背景后的图片",
    originalAlt: "原图",
    errors: {
      notImage: "这个文件不是图片。请使用 JPG、PNG 或 WebP。",
      tooLarge: "图片太大,上限为 {mb}MB。",
      badImage: "无法读取这张图片,文件可能已损坏。",
      tooManyPixels: "图片像素太多,请换一个小一点的版本。",
      busy: "服务器正忙,请稍后再试。",
      busyRetry: "服务器正忙,请在约 {s} 秒后重试。",
      dailyLimit:
        "已达到今天的合理使用上限。明天再来,或者自己部署一个实例-完全免费。",
      network: "无法连接服务器。请检查后端是否已启动。",
      unknown: "出了点问题,请重试。",
    },
  },

  features: {
    title: "为什么选 Unback?",
    items: [
      {
        title: "真正免费",
        body: "没有点数、没有水印、不用注册账号。在合理范围内随便用。",
      },
      {
        title: "真正私密",
        body: "图片只在内存中处理,从不写入磁盘。不存储、不分享、不用于训练。",
      },
      {
        title: "开源,可自托管",
        body: "代码以 MIT 许可证发布在 GitHub。一个 Docker 镜像就能跑在自己的硬件上。",
      },
    ],
  },

  api: {
    title: "在代码里使用",
    body: "这个页面背后就是一个普通的 HTTP API:发一张图片,拿回一张透明 PNG。不需要密钥,不用注册,只有合理的用量限制。",
    docsLink: "API 文档",
    githubLink: "GitHub 源码",
    copy: "复制",
    copied: "已复制",
  },

  faq: {
    title: "常见问题",
    items: [
      {
        question: "真的免费吗?",
        answer:
          "是的。Unback 以 MIT 许可证开源,这个实例可以免费使用,只设有合理的用量限制,保证大家都能用得流畅。",
      },
      {
        question: "我的图片会怎么处理?",
        answer:
          "图片只在内存中处理,PNG 一返回就立刻丢弃-从不写入磁盘,从不记入日志,也从不用于训练任何模型。",
      },
      {
        question: "它是怎么工作的?",
        answer:
          "服务器通过 ONNX Runtime 运行一个神经网络(ISNet),为每个像素预测透明度。对比、换背景色和下载都在你的浏览器里完成。",
      },
      {
        question: "我可以自己部署吗?",
        answer:
          "可以。它以单个 Docker 镜像发布,同时提供这个页面和 API。GitHub 上的 README 有一条命令即可启动的快速指南。",
      },
    ],
  },

  footer: {
    tagline: "免费、开源的背景去除工具。",
    privacy: "图片只在内存中处理,绝不存储。",
    privacyPolicy: "隐私",
    model: "模型",
    license: "MIT 许可证",
    language: "语言",
  },

  notFound: {
    title: "页面不存在",
    body: "你要找的页面不存在,或者已被移动。",
    home: "返回 Unback",
  },

  privacy: {
    title: "隐私",
    metaDescription:
      "Unback 如何处理你的图片和数据:只在内存中处理,绝不存储,无需注册账号。",
    updated: "最后更新:2026-08-24",
    intro:
      "Unback 的设计目标,是让隐私政策几乎无话可写。这个页面用平实的语言说明你的图片会经历什么,以及服务会接触到哪些为数不多的数据。",
    sections: [
      {
        heading: "你的图片",
        body: "图片通过加密连接上传,完全在服务器内存中处理,结果一返回就立即丢弃。从不写入磁盘,从不备份,从不用于训练任何模型,也不会被任何人看到。",
      },
      {
        heading: "服务器记录什么",
        body: "请求会留下标准的技术记录:图片尺寸、处理耗时和响应状态。服务器日志可能包含你的 IP 地址,仅用于运行和保护服务。图片内容绝不会被记录。",
      },
      {
        heading: "用量限制",
        body: "为了让服务对所有人保持免费和快速,你的 IP 地址会保存在服务器内存中,用于执行合理使用限制。这些计数器从不写入磁盘,服务重启后即消失。",
      },
      {
        heading: "Cookie 与本地存储",
        body: "Google Analytics 会设置少量 Cookie,以便回访不被算成新访客。除此之外,浏览器的本地存储只保存一个值-你的浅色/深色主题偏好-它永远不会离开你的设备。",
      },
      {
        heading: "统计分析",
        body: "这个实例使用 Google Analytics 4 来衡量工具的真实使用情况:页面浏览,以及匿名事件-选择了图片、移除了背景、下载了结果-还有处理耗时。你的图片、文件名和图片内容绝不会包含在内。Google 会收到你的 IP 地址用于推断大致位置,并声明不会存储它。任何内容拦截器,或者 Google 官方的停用插件,都可以让你完全不被统计。",
      },
      {
        heading: "自托管实例",
        body: "本政策适用于 unback.app 上的官方实例。Unback 是开源项目,自托管副本由各自的所有者独立运营:除非运营者用自己的媒体资源开启统计,否则它们不会统计任何东西。",
      },
      {
        heading: "有疑问?",
        body: "在 GitHub 上开一个 issue。这个项目公开开发,这份政策也一样:任何改动都可以在仓库历史中看到。",
      },
    ],
  },
};
