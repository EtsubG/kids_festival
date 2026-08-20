import { Globe } from 'lucide-react';
import { useI18n } from '@/i18n';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border-2 border-cream-300 bg-white/80 p-1 backdrop-blur transition ${className}`}
    >
      <Globe className="ml-1.5 h-3.5 w-3.5 text-terracotta-400" />
      <button
        onClick={() => setLang('am')}
        className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
          lang === 'am'
            ? 'bg-sunflower-400 text-terracotta-900'
            : 'text-terracotta-500 hover:text-terracotta-700'
        }`}
      >
        አማ
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
          lang === 'en'
            ? 'bg-sunflower-400 text-terracotta-900'
            : 'text-terracotta-500 hover:text-terracotta-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}
