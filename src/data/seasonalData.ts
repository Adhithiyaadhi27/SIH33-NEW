export type Season = 'year-round' | 'summer' | 'monsoon' | 'winter' | 'spring';

export interface SeasonInfo {
  season: Season;
  label: string;
  color: string;
  bgColor: string;
  months: string;
}

export const SEASON_CONFIG: Record<Season, SeasonInfo> = {
  'year-round': {
    season: 'year-round',
    label: 'Year-Round',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/15 border-emerald-400/40',
    months: 'Jan – Dec',
  },
  summer: {
    season: 'summer',
    label: 'Summer',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/15 border-amber-400/40',
    months: 'Mar – Jun',
  },
  monsoon: {
    season: 'monsoon',
    label: 'Monsoon',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/15 border-blue-400/40',
    months: 'Jul – Sep',
  },
  winter: {
    season: 'winter',
    label: 'Winter',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/15 border-cyan-400/40',
    months: 'Oct – Feb',
  },
  spring: {
    season: 'spring',
    label: 'Spring',
    color: 'text-pink-300',
    bgColor: 'bg-pink-500/15 border-pink-400/40',
    months: 'Feb – Apr',
  },
};

export const PRODUCT_SEASONS: Record<string, Season> = {
  prod_tomato: 'year-round',
  prod_beans: 'monsoon',
  prod_potato: 'winter',
  prod_apple: 'winter',
  prod_onion: 'year-round',
  prod_brinjal: 'summer',
  prod_carrot: 'winter',
  prod_mango: 'summer',
};

export function getProductSeason(productId: string): SeasonInfo {
  const season = PRODUCT_SEASONS[productId] ?? 'year-round';
  return SEASON_CONFIG[season];
}

export function isCurrentlyInSeason(productId: string): boolean {
  const season = PRODUCT_SEASONS[productId] ?? 'year-round';
  if (season === 'year-round') return true;
  const month = new Date().getMonth(); // 0-11
  switch (season) {
    case 'summer':
      return month >= 2 && month <= 5; // Mar-Jun
    case 'monsoon':
      return month >= 6 && month <= 8; // Jul-Sep
    case 'winter':
      return month >= 9 || month <= 1; // Oct-Feb
    case 'spring':
      return month >= 1 && month <= 3; // Feb-Apr
    default:
      return true;
  }
}
