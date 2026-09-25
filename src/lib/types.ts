export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface Project {
  num: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  slug: string;
  bgColor?: string;
}


export interface ProcessStep {
  num: string;
  title: string;
  description: string;
}

export interface SiteMetadata {
  name: string;
  title: string;
  description: string;
  email: string;
}
