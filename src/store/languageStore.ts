import { create } from 'zustand';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn';

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

type TranslationsDict = Record<string, string>;

interface LanguageState {
  lang: LanguageCode;
  translations: TranslationsDict;
  loaded: boolean;
  setLang: (lang: LanguageCode) => void;
  setTranslations: (translations: TranslationsDict) => void;
  markLoaded: () => void;
}

const STORAGE_KEY = 'mv_lang';

function storedLang(): LanguageCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch {
    /* noop */
  }
  return 'en';
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: storedLang(),
  translations: {},
  loaded: false,

  setLang: (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* noop */
    }
    set({ lang });
  },

  setTranslations: (translations) => set({ translations }),
  markLoaded: () => set({ loaded: true }),
}));

export function translate(key: string, vars?: Record<string, string | number>): string {
  const state = useLanguageStore.getState();
  let text = state.translations[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      const re = new RegExp(`\\{${k}\\}`, 'g');
      text = text.replace(re, String(v));
    });
  }
  return text;
}