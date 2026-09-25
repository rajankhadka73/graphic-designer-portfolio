import { NavLink, ProcessStep, SiteMetadata, SocialLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Works', href: '#works' },
  { label: 'Designs', href: '/designs' },
  { label: 'Skills', href: '#skills' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  // { name: 'GitHub', url: 'https://github.com/rajan-khadkaa' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rajan-khadka-106868268/' },
  { name: 'WhatsApp', url: 'https://wa.me/+9779814364007?text=Hello%20Rajan,%20Let%27s%20work%20together.' }
];

export const SKILLS_LIST = [
  'Photoshop',
  'Illustrator',
  'InDesign',
  'Figma',
  'Canva',
  'Typography',
  'Brand Identity',
  'Poster Design',
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    num: '01',
    title: 'Discover',
    description: 'Understanding the creative brief, audience, brand tone, and visual goals before touching the canvas.',
  },
  {
    num: '02',
    title: 'Design',
    description: 'Exploring visual directions, typography pairings, color palettes, and balanced compositions that command attention.',
  },
  {
    num: '03',
    title: 'Refine',
    description: 'Refining typography hierarchy, contrast, balance, and visual details through tight client feedback loops.',
  },
  {
    num: '04',
    title: 'Deliver',
    description: 'Preparing high-resolution, production-ready assets color-calibrated and formatted for print and digital.',
  },
];

export const SITE_METADATA: SiteMetadata = {
  name: 'Rajan',
  title: 'Rajan • Graphic Designer',
  description: 'Graphic Designer creating impactful brand identities, poster artwork, and visual stories.',
  email: 'rajankhadkaa0809@gmail.com',
};
