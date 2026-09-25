export interface GraphicDesign {
  id: string;
  filename: string;
  title: string;
  image: string;
  category: string; // Brand / Company (e.g. 'aNepali', 'KDMI', 'NRNA')
}

export const FEATURED_DESIGN_KEYS = [
  'genz1',
  'krishna1',
  'ropai1',
  'gaura1',
  'gaijatra1',
  'genz2',
];

export function parseDesignMeta(filename: string): { title: string; category: string } {
  const name = filename.replace(/\.[^/.]+$/, '').trim();
  const lower = name.toLowerCase();

  // Determine Brand / Company category
  let company = 'aNepali';
  if (lower.includes('mhendo')) {
    company = 'KDMI';
  } else if (lower.includes('nrna')) {
    company = 'NRNA';
  }

  // Remove trailing number from title (e.g. 'Krishna Janmasthami 1' -> 'Krishna Janmasthami')
  let title = name.replace(/\s+\d+$/, '').replace(/(\D+)\d+$/, '$1').trim();

  // Normalize short forms
  if (/^genz$/i.test(title)) title = 'GenZ Martyrs Day';
  if (/^krishna$/i.test(title)) title = 'Krishna Janmasthami';
  if (/^ropai$/i.test(title)) title = 'Ropai Jatra';
  if (/^gaura$/i.test(title)) title = 'Gaura Parba';
  if (/^gaijatra$/i.test(title)) title = 'Gai Jatra';
  if (/^news$/i.test(title)) title = 'News Post';

  if (!title) {
    title = name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return { title, category: company };
}

// 26 static designs with the first 6 matching the exact requested order
export const STATIC_ALL_DESIGNS: GraphicDesign[] = [
  // 6 Featured Cards (Home page)
  {
    id: 'genz-martyrs-day-1',
    filename: 'GenZ Martyrs Day 1.png',
    title: 'GenZ Martyrs Day',
    image: '/design-resources/GenZ%20Martyrs%20Day%201.png',
    category: 'aNepali',
  },
  {
    id: 'krishna-janmasthami-1',
    filename: 'Krishna Janmasthami 1.png',
    title: 'Krishna Janmasthami',
    image: '/design-resources/Krishna%20Janmasthami%201.png',
    category: 'aNepali',
  },
  {
    id: 'ropai-jatra-1',
    filename: 'Ropai Jatra 1.png',
    title: 'Ropai Jatra',
    image: '/design-resources/Ropai%20Jatra%201.png',
    category: 'aNepali',
  },
  {
    id: 'gaura-parba-1',
    filename: 'Gaura Parba 1.png',
    title: 'Gaura Parba',
    image: '/design-resources/Gaura%20Parba%201.png',
    category: 'aNepali',
  },
  {
    id: 'gai-jatra-1',
    filename: 'Gai Jatra 1.png',
    title: 'Gai Jatra',
    image: '/design-resources/Gai%20Jatra%201.png',
    category: 'aNepali',
  },
  {
    id: 'genz-martyrs-day-2',
    filename: 'GenZ Martyrs Day 2.png',
    title: 'GenZ Martyrs Day',
    image: '/design-resources/GenZ%20Martyrs%20Day%202.png',
    category: 'aNepali',
  },
  // Additional designs in archive
  {
    id: 'gai-jatra-2',
    filename: 'Gai Jatra 2.png',
    title: 'Gai Jatra',
    image: '/design-resources/Gai%20Jatra%202.png',
    category: 'aNepali',
  },
  {
    id: 'gaura-parba-2',
    filename: 'Gaura Parba 2.png',
    title: 'Gaura Parba',
    image: '/design-resources/Gaura%20Parba%202.png',
    category: 'aNepali',
  },
  {
    id: 'gaura-parba-3',
    filename: 'Gaura Parba 3.png',
    title: 'Gaura Parba',
    image: '/design-resources/Gaura%20Parba%203.png',
    category: 'aNepali',
  },
  {
    id: 'genz-martyrs-day-3',
    filename: 'GenZ Martyrs Day 3.png',
    title: 'GenZ Martyrs Day',
    image: '/design-resources/GenZ%20Martyrs%20Day%203.png',
    category: 'aNepali',
  },
  {
    id: 'genz-martyrs-day-4',
    filename: 'GenZ Martyrs Day 4.png',
    title: 'GenZ Martyrs Day',
    image: '/design-resources/GenZ%20Martyrs%20Day%204.png',
    category: 'aNepali',
  },
  {
    id: 'genz-martyrs-day-5',
    filename: 'GenZ Martyrs Day 5.png',
    title: 'GenZ Martyrs Day',
    image: '/design-resources/GenZ%20Martyrs%20Day%205.png',
    category: 'aNepali',
  },
  {
    id: 'hotel-mhendo-1',
    filename: 'Hotel Mhendo 1.png',
    title: 'Hotel Mhendo',
    image: '/design-resources/Hotel%20Mhendo%201.png',
    category: 'KDMI',
  },
  {
    id: 'hotel-mhendo-2',
    filename: 'Hotel Mhendo 2.png',
    title: 'Hotel Mhendo',
    image: '/design-resources/Hotel%20Mhendo%202.png',
    category: 'KDMI',
  },
  {
    id: 'hotel-mhendo-3',
    filename: 'Hotel Mhendo 3.png',
    title: 'Hotel Mhendo',
    image: '/design-resources/Hotel%20Mhendo%203.png',
    category: 'KDMI',
  },
  {
    id: 'krishna-janmasthami-2',
    filename: 'Krishna Janmasthami 2.png',
    title: 'Krishna Janmasthami',
    image: '/design-resources/Krishna%20Janmasthami%202.png',
    category: 'aNepali',
  },
  {
    id: 'krishna-janmasthami-3',
    filename: 'Krishna Janmasthami 3.png',
    title: 'Krishna Janmasthami',
    image: '/design-resources/Krishna%20Janmasthami%203.png',
    category: 'aNepali',
  },
  {
    id: 'krishna-janmasthami-4',
    filename: 'Krishna Janmasthami 4.png',
    title: 'Krishna Janmasthami',
    image: '/design-resources/Krishna%20Janmasthami%204.png',
    category: 'aNepali',
  },
  {
    id: 'krishna-janmasthami-5',
    filename: 'Krishna Janmasthami 5.png',
    title: 'Krishna Janmasthami',
    image: '/design-resources/Krishna%20Janmasthami%205.png',
    category: 'aNepali',
  },
  {
    id: 'krishna-janmasthami-6',
    filename: 'Krishna Janmasthami 6.png',
    title: 'Krishna Janmasthami',
    image: '/design-resources/Krishna%20Janmasthami%206.png',
    category: 'aNepali',
  },
  {
    id: 'news-post-1',
    filename: 'News Post 1.png',
    title: 'News Post',
    image: '/design-resources/News%20Post%201.png',
    category: 'aNepali',
  },
  {
    id: 'news-post-2',
    filename: 'News Post 2.png',
    title: 'News Post',
    image: '/design-resources/News%20Post%202.png',
    category: 'aNepali',
  },
  {
    id: 'news-post-3',
    filename: 'News Post 3.png',
    title: 'News Post',
    image: '/design-resources/News%20Post%203.png',
    category: 'aNepali',
  },
  {
    id: 'nrna-event-1',
    filename: 'NRNA Event 1.png',
    title: 'NRNA Event',
    image: '/design-resources/NRNA%20Event%201.png',
    category: 'NRNA',
  },
  {
    id: 'nrna-event-2',
    filename: 'NRNA Event 2.png',
    title: 'NRNA Event',
    image: '/design-resources/NRNA%20Event%202.png',
    category: 'NRNA',
  },
  {
    id: 'ropai-jatra-2',
    filename: 'Ropai Jatra 2.png',
    title: 'Ropai Jatra',
    image: '/design-resources/Ropai%20Jatra%202.png',
    category: 'aNepali',
  },
];

export const DEFAULT_FEATURED_DESIGNS = STATIC_ALL_DESIGNS.slice(0, 6);

export function getAllDesigns(): GraphicDesign[] {
  return STATIC_ALL_DESIGNS;
}

export function getFeaturedDesigns(): GraphicDesign[] {
  return DEFAULT_FEATURED_DESIGNS;
}
