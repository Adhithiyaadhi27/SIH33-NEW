import { useEffect } from 'react';
import api from './api';
import { useLanguageStore, translate, type LanguageCode } from '../store/languageStore';

export function useI18nInit() {
  const { lang, setTranslations, markLoaded } = useLanguageStore();

  useEffect(() => {
    api
      .get(`/translations/${lang}`)
      .then((res) => {
        if (res.data?.success) {
          setTranslations(res.data.translations ?? {});
        } else {
          setTranslations({});
        }
      })
      .catch(() => setTranslations({}))
      .finally(markLoaded);
  }, [lang, setTranslations, markLoaded]);
}

export function useTranslation() {
  const { lang, setLang, translations } = useLanguageStore();
  return {
    t: (key: string, vars?: Record<string, string | number>) => translate(key, vars),
    lang,
    setLang: (l: LanguageCode) => setLang(l),
    translations,
  };
}

export default useTranslation;