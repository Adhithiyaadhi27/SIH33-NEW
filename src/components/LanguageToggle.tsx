import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, useLanguageStore, type LanguageCode } from '../store/languageStore';

export default function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLanguageStore();

  const select = (code: LanguageCode) => {
    setLang(code);
    setOpen(false);
  };

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-xl transition cursor-pointer"
        title="Change language"
        aria-label="Change language"
      >
        <Languages className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">{lang}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 glass-panel p-2 z-50"
          >
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-soil-gold tracking-wider">
              Language
            </div>
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => select(l.code)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-text-primary hover:bg-white/10 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-text-muted">{l.native}</span>
                  <span className="text-[10px] text-text-muted/60">{l.label}</span>
                </span>
                {lang === l.code && <Check className="w-3.5 h-3.5 text-soil-gold" />}
              </button>
            ))}
            {current && (
              <div className="px-3 py-1.5 text-[10px] text-text-muted border-t border-white/10 mt-1">
                Now: {current.native}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}