export const siteConfig = {
  name: "Carefree Hub",
  url: "https://www.carefreelab.cloud",
  logo: {
    src: "/logo.png",
    alt: "Carefree Hub",
  },
  meta: {
    title: "Carefree Hub",
    description: "Carefree Hub is a platform for creating and sharing carefree life",
  },
  author: {
    name: "Carefreelife98",
    twitter: "@carefreelife98",
  },
  header: {
    author: {
      title: "Carefreelife98",
      job: "Full Stack Developer",
      description: "반갑습니다, 채승민입니다 ☺️",
      career: [
        {
          name: "TMON",
          url: "https://www.tmon.co.kr",
          icon: "/logo/tmon-logo.png",
          alt: "tmon",
        },
        {
          name: "Flow",
          url: "https://www.flow.team",
          icon: "/logo/flow-logo.png",
          alt: "flow",
        },
      ],
    },
  },
  sidebar: {
    footer: {
      designedBy: "Carefreelife98",
      socialLinks: [
        {
          name: "flow",
          url: "http://www.flow.team",
          icon: "/icons/flowai.svg",
          alt: "flow",
        },
        {
          name: "github",
          url: "https://github.com/Carefreelife98",
          icon: "/icons/github.svg",
          alt: "github",
        },
        {
          name: "linkedin",
          url: "http://www.linkedin.com/in/carefreelife98",
          icon: "/icons/linkedin.svg",
          alt: "linkedin",
        },
        {
          name: "gmail",
          url: "mailto:csm12180318@gmail.com",
          icon: "/icons/google.svg",
          alt: "gmail",
        },
      ],
    },
  },
} as const

export type SiteConfig = typeof siteConfig
