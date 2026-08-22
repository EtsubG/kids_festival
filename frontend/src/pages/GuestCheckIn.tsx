import { useState } from 'react';
import { Check, Ticket, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { QUESTIONS } from '@/types';
import { useParticipants } from '@/store';
import { navigate } from '@/router';
import { Confetti } from '@/components/Confetti';
import { useI18n } from '@/i18n';

// Import your images - make sure these exist
import photo1 from '@/assets/photo1.jpg';
import photo2 from '@/assets/photo2.jpg';
import photo3 from '@/assets/photo3.jpg';

const HERO_PHOTOS = [photo1, photo2, photo3];

export function GuestCheckIn() {
  const { addParticipant } = useParticipants();
  const { t, lang } = useI18n();
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [nameError, setNameError] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [resultName, setResultName] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);
  const canSubmit = name.trim().length > 0 && allAnswered;

  async function handleSubmit() {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    if (!allAnswered) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('📝 Submitting registration:', { name, answers });
      
      const participant = await addParticipant(name, answers);
      console.log('✅ Registration result:', participant);
      
      // Store the name and lucky number for the result screen
      setResultName(participant.name);
      setResult(participant.luckyNumber);
      
      // Trigger confetti after a small delay
      setTimeout(() => {
        setConfetti(true);
      }, 100);
      
      // Scroll to top to show result
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      // You might want to show an error message here
    } finally {
      setIsSubmitting(false);
    }
  }

  function selectOption(qid: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function handleRegisterAnother() {
    // First hide confetti
    setConfetti(false);
    // Then reset the form after a small delay
    setTimeout(() => {
      setResult(null);
      setResultName('');
      setName('');
      setAnswers({});
      setNameError(false);
    }, 300);
  }

  // Result screen - show after successful registration
  if (result !== null) {
    console.log('🎉 Showing result screen:', { resultName, result });
    
    return (
      <>
        {confetti && <Confetti active={confetti} count={80} />}
        <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-16">
          <div className="animate-pop-in rounded-3xl bg-white p-8 text-center card-shadow-lg sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sunflower-100 text-4xl">
              🎉
            </div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-terracotta-500">
              {t('registered')}
            </p>
            <h2 className="mb-2 font-ethiopic text-xl font-bold text-terracotta-900">
              {t('resultTitle')}
            </h2>
            <p className="mb-8 text-sm text-terracotta-600">
              {t('resultSubtitle')}
            </p>

            <div className="relative mx-auto mb-8 w-fit">
              <div className="absolute inset-0 animate-pulse-glow rounded-3xl" />
              <div className="relative rounded-3xl border-4 border-sunflower-400 bg-gradient-to-br from-sunflower-300 to-sunflower-500 px-10 py-6">
                <div className="flex items-center gap-2">
                  <Ticket className="h-8 w-8 text-terracotta-800" />
                  <span className="font-ethiopic text-5xl font-extrabold leading-none text-terracotta-900 sm:text-6xl">
                    #{result}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-cream-100 p-5 text-left">
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-terracotta-700">
                <Sparkles className="h-4 w-4 text-sunflower-500" />
                {t('guestName')}
              </p>
              <p className="font-ethiopic text-lg font-bold text-terracotta-900">
                {resultName || name}
              </p>
            </div>

            <button
              onClick={handleRegisterAnother}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 font-ethiopic text-sm font-semibold text-white transition hover:bg-terracotta-600 active:scale-95"
            >
              {t('registerAnother')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </>
    );
  }

  // Registration form
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6 sm:pt-10">
      {/* Hero */}
      <header className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ethiogreen-100 px-4 py-1.5 text-xs font-semibold text-ethiogreen-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-ethiogreen-500" />
          {t('liveBadge')}
        </div>
        <h1 className="mb-4 font-ethiopic text-3xl font-extrabold leading-tight text-terracotta-700 text-balance sm:text-5xl">
          {t('heroTitle1')}<br className="hidden sm:block" /> {t('heroTitle2')}
        </h1>
        <p className="mx-auto max-w-md font-ethiopic text-base text-terracotta-600 sm:text-lg">
          {t('heroSubtitle')}
        </p>

        {/* Photo cards */}
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {HERO_PHOTOS.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-white card-shadow"
              style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -2 : 2}deg)` }}
            >
              <img
                src={src}
                alt={t('photoAlt')}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchpriority={i === 0 ? 'high' : 'low'}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta-900/30 to-transparent" />
            </div>
          ))}
        </div>
      </header>

      {/* Form card */}
      <div className="rounded-3xl bg-white/90 p-5 backdrop-blur-sm card-shadow sm:p-8">
        {/* Name input */}
        <div className="mb-7">
          <label className="mb-2 block font-ethiopic text-sm font-bold text-terracotta-800">
            {t('nameLabel')} <span className="text-terracotta-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameError(false);
            }}
            placeholder={t('namePlaceholder')}
            className={`w-full rounded-2xl border-2 px-4 py-3.5 font-ethiopic text-base outline-none transition focus:ring-4 ${
              nameError
                ? 'border-terracotta-500 bg-terracotta-50 focus:ring-terracotta-200'
                : 'border-cream-300 bg-cream-50 focus:border-sunflower-400 focus:ring-sunflower-100'
            }`}
          />
          {nameError && (
            <p className="mt-1.5 text-sm font-medium text-terracotta-500">{t('nameError')}</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {QUESTIONS.map((q, qi) => (
            <div key={q.id}>
              <p className="mb-3 flex items-start gap-2 font-ethiopic text-sm font-bold text-terracotta-800 sm:text-base">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-sunflower-400 text-xs font-extrabold text-terracotta-900">
                  {qi + 1}
                </span>
                <span className="text-balance">{lang === 'am' ? q.titleAm : q.titleEn}</span>
              </p>
              <div
                className={`grid gap-2 ${
                  q.options.length > 4 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectOption(q.id, opt.value)}
                      className={`group relative flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition active:scale-[0.98] ${
                        selected
                          ? 'border-sunflower-500 bg-sunflower-50 card-shadow'
                          : 'border-cream-300 bg-cream-50 hover:border-sunflower-300 hover:bg-cream-100'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-xl transition ${
                          selected ? 'bg-sunflower-200 scale-110' : 'bg-white group-hover:scale-105'
                        }`}
                      >
                        {opt.emoji}
                      </span>
                      <span className="flex-1 font-ethiopic text-sm font-medium text-terracotta-800">
                        {lang === 'am' ? opt.labelAm : opt.labelEn}
                      </span>
                      <span
                        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition ${
                          selected
                            ? 'border-sunflower-500 bg-sunflower-500 text-white'
                            : 'border-cream-300'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`mt-8 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 font-ethiopic text-lg font-extrabold transition active:scale-[0.98] ${
            canSubmit && !isSubmitting
              ? 'bg-gradient-to-r from-sunflower-400 to-sunflower-500 text-terracotta-900 hover:from-sunflower-500 hover:to-sunflower-600 card-shadow animate-pulse-glow'
              : 'cursor-not-allowed bg-cream-300 text-terracotta-400'
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-terracotta-900 border-t-transparent" />
              Registering...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              {t('submitBtn')}
            </>
          )}
        </button>
        {!allAnswered && (
          <p className="mt-3 text-center text-sm text-terracotta-500">
            {t('answerAll')}
          </p>
        )}
      </div>

      {/* Admin link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 font-ethiopic text-xs font-medium text-terracotta-600 backdrop-blur transition hover:bg-white hover:text-terracotta-800"
        >
          <LogIn className="h-3.5 w-3.5" />
          {t('adminLogin')}
        </button>
      </div>
    </div>
  );
}