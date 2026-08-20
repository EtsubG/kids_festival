import { useState } from 'react';
import { Lock, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/auth';
import { navigate } from '@/router';
import { useI18n } from '@/i18n';

export function AdminLogin() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError(true);
      triggerShake();
      return;
    }
    const ok = login(password);
    if (ok) {
      navigate('/admin');
    } else {
      setError(true);
      triggerShake();
    }
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-1.5 font-ethiopic text-sm text-terracotta-600 transition hover:text-terracotta-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backHome')}
        </button>

        <div
          className={`rounded-3xl bg-white p-8 card-shadow-lg ${shake ? 'animate-wiggle' : ''}`}
          style={shake ? { animation: 'wiggle 0.4s ease-in-out' } : undefined}
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta-100">
              <ShieldCheck className="h-8 w-8 text-terracotta-600" />
            </div>
            <h1 className="font-ethiopic text-2xl font-extrabold text-terracotta-800">{t('loginTitle')}</h1>
            <p className="mt-1 font-ethiopic text-sm text-terracotta-500">{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block font-ethiopic text-sm font-bold text-terracotta-800">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-terracotta-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••••••"
                autoFocus
                className={`w-full rounded-2xl border-2 py-3.5 pl-11 pr-4 font-ethiopic text-base outline-none transition focus:ring-4 ${
                  error
                    ? 'border-terracotta-500 bg-terracotta-50 focus:ring-terracotta-200'
                    : 'border-cream-300 bg-cream-50 focus:border-sunflower-400 focus:ring-sunflower-100'
                }`}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm font-medium text-terracotta-500">
                {t('loginError')}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta-500 px-6 py-3.5 font-ethiopic text-base font-bold text-white transition hover:bg-terracotta-600 active:scale-95"
            >
              {t('loginBtn')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 rounded-xl bg-cream-100 px-4 py-3 text-center text-xs text-terracotta-500">
            {t('loginHint')} <span className="font-mono font-bold text-terracotta-700">festival2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
