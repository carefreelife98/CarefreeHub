export const siteConfig = {
  logo: {
    src: "/logo.png",
    alt: "Carefree Hub",
  },
  meta: {
    title: "Carefree Hub",
    description: "Carefree Hub is a platform for creating and sharing carefree life",
  },
  sidebar: {
    header: {
      author: {
        title: "Carefreelife98",
        job: "Full Stack Developer",
        description: "반갑습니다, 채승민입니다 ☺️"
      },
    },
    footer: {
      designedBy: "Carefreelife98",
      socialLinks: [
        {
          name: "flow",
          url: "http://www.flow.team",
          icon: "/icons/flowai.svg",
          alt: "flow"
        },
        {
          name: "github",
          url: "https://github.com/Carefreelife98",
          icon: "/icons/github.svg",
          alt: "github"
        },
        {
          name: "linkedin",
          url: "http://www.linkedin.com/in/carefreelife98",
          icon: "/icons/linkedin.svg",
          alt: "linkedin"
        },
        {
          name: "gmail",
          url: "mailto:csm12180318@gmail.com",
          icon: "/icons/google.svg",
          alt: "gmail"
        }
      ]
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
