export interface GraphicDesign {
  id: string;
  filename: string;
  title: string;
  image: string;
  category: string;
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

  // 1. Spaced format: 'Name Number' (e.g. 'Krishna Janmasthami 1')
  const spacedMatch = name.match(/^(.+?)\s+(\d+)$/);
  if (spacedMatch) {
    const rawCat = spacedMatch[1].trim();
    const num = spacedMatch[2];
    return { title: `${rawCat} ${num}`, category: rawCat };
  }

  // 2. Compact format: 'NameNumber' (e.g. 'krishna1', 'genz2')
  let m: RegExpMatchArray | null;
  if ((m = name.match(/^genz(\d+)$/i))) {
    return { title: `GenZ Martyrs Day ${m[1]}`, category: 'GenZ Martyrs Day' };
  }
  if ((m = name.match(/^krishna(\d+)$/i))) {
    return { title: `Krishna Janmasthami ${m[1]}`, category: 'Krishna Janmasthami' };
  }
  if ((m = name.match(/^ropai(\d+)$/i))) {
    return { title: `Ropai Jatra ${m[1]}`, category: 'Ropai Jatra' };
  }
  if ((m = name.match(/^gaura(\d+)$/i))) {
    return { title: `Gaura Parba ${m[1]}`, category: 'Gaura Parba' };
  }
  if ((m = name.match(/^gaijatra(\d+)$/i))) {
    return { title: `Gai Jatra ${m[1]}`, category: 'Gai Jatra' };
  }
  if ((m = name.match(/^news(\d+)$/i))) {
    return { title: `New Template ${m[1]}`, category: 'New Template' };
  }

  // Fallback
  const cleaned = name
    .replace(/[-_]/g, ' ')
    .replace(/([a-zA-Z])(\d+)/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return { title: cleaned, category: 'Other Designs' };
}

function matchFeaturedFile(pattern: string, allFiles: string[]): string | null {
  const p = pattern.toLowerCase();
  for (const f of allFiles) {
    const fn = f.toLowerCase();
    if (p === 'genz1' && (fn.includes('genz1') || (fn.includes('genz') && fn.includes('1')))) return f;
    if (p === 'krishna1' && (fn.includes('krishna1') || (fn.includes('krishna') && fn.includes('1')))) return f;
    if (p === 'ropai1' && (fn.includes('ropai1') || (fn.includes('ropai') && fn.includes('1')))) return f;
    if (p === 'gaura1' && (fn.includes('gaura1') || (fn.includes('gaura') && fn.includes('1')))) return f;
    if (p === 'gaijatra1' && (fn.includes('gaijatra1') || (fn.includes('gai') && fn.includes('1')))) return f;
    if (p === 'genz2' && (fn.includes('genz2') || (fn.includes('genz') && fn.includes('2')))) return f;
  }
  return null;
}

export function getAllDesigns(): GraphicDesign[] {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const dirPath = path.join(process.cwd(), 'public', 'design-resources');

      if (fs.existsSync(dirPath)) {
        const files: string[] = fs
          .readdirSync(dirPath)
          .filter((f: string) => /\.(png|jpe?g|webp|svg)$/i.test(f));

        // Find the 6 featured files
        const featuredMatched: string[] = [];
        for (const key of FEATURED_DESIGN_KEYS) {
          const matched = matchFeaturedFile(key, files);
          if (matched && !featuredMatched.includes(matched)) {
            featuredMatched.push(matched);
          }
        }

        // Remaining files sorted
        const remaining = files
          .filter((f) => !featuredMatched.includes(f))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        const sortedFiles = [...featuredMatched, ...remaining];

        return sortedFiles.map((filename) => {
          const { title, category } = parseDesignMeta(filename);
          const id = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          return {
            id,
            filename,
            title,
            image: `/design-resources/${encodeURIComponent(filename)}`,
            category,
          };
        });
      }
    } catch (err) {
      console.warn('Error reading design-resources directory:', err);
    }
  }

  return [];
}

export function getFeaturedDesigns(): GraphicDesign[] {
  const all = getAllDesigns();
  if (all.length >= 6) {
    return all.slice(0, 6);
  }
  return all;
}
