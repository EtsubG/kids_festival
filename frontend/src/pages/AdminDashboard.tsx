import { useMemo, useState, useEffect } from 'react';
import {
  LogOut,
  Search,
  Download,
  Trash2,
  Users,
  Trophy,
  X,
  AlertTriangle,
  Sparkles,
  PartyPopper,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useAuth } from '@/auth';
import { useParticipants } from '@/store';
import { navigate } from '@/router';
import { QUESTIONS, type Participant } from '@/types';
import { WinnerWheel } from '@/components/WinnerWheel';
import { Confetti } from '@/components/Confetti';
import { useI18n } from '@/i18n';

function formatTime(ts: number, lang: string) {
  const d = new Date(ts);
  const locale = lang === 'am' ? 'en-GB' : 'en-GB';
  return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) +
    ' · ' +
    d.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
}

function answerLabel(qid: string, value: string, lang: string) {
  const q = QUESTIONS.find((x) => x.id === qid);
  const opt = q?.options.find((o) => o.value === value);
  if (!opt) return value;
  const label = lang === 'am' ? opt.labelAm : opt.labelEn;
  return `${opt.emoji} ${label}`;
}

function exportCSV(participants: Participant[], lang: string) {
  const headers = ['Lucky Number', 'Parent Name', ...QUESTIONS.map((q) => (lang === 'am' ? q.titleAm : q.titleEn)), 'Timestamp'];
  const rows = participants.map((p) => [
    `#${p.luckyNumber}`,
    `"${p.name.replace(/"/g, '""')}"`,
    ...QUESTIONS.map((q) => `"${answerLabel(q.id, p.answers[q.id] || '', lang).replace(/"/g, '""')}"`),
    new Date(p.createdAt).toISOString(),
  ]);
  const csv = [headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `festival-guests-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboard() {
  const { logout } = useAuth();
  const { participants, loading, error, isOnline, refresh, resetAll } = useParticipants();
  const { t, lang } = useI18n();
  const [search, setSearch] = useState('');
  const [winner, setWinner] = useState<Participant | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
  const [confetti, setConfetti] = useState(false);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 69000);
    return () => clearInterval(interval);
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(
      (p) => p.name.toLowerCase().includes(q) || String(p.luckyNumber).includes(q) || `#${p.luckyNumber}`.includes(q)
    );
  }, [participants, search]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function handleWinner(p: Participant) {
    setWinner(p);
    setShowWinnerModal(true);
    setConfetti(true);
  }

  function executeReset() {
    resetAll();
    setShowResetModal(false);
    setResetConfirm('');
  }

  if (loading && participants.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sunflower-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 font-ethiopic text-terracotta-600">Loading participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <Confetti active={confetti} count={120} />

      {/* Header bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-ethiopic text-2xl font-extrabold text-terracotta-800 sm:text-3xl">
            {t('dashTitle')}
          </h1>
          <p className="font-ethiopic text-sm text-terracotta-500">{t('dashSubtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium card-shadow">
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-ethiogreen-500" />
                <span className="text-ethiogreen-600">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-terracotta-400" />
                <span className="text-terracotta-500">Offline</span>
              </>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 font-ethiopic text-sm font-semibold text-terracotta-700 card-shadow transition hover:bg-terracotta-50 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-2xl bg-terracotta-50 border-2 border-terracotta-200 p-4 text-center">
          <p className="text-sm text-terracotta-600">{error}</p>
          <button 
            onClick={refresh}
            className="mt-2 text-xs font-semibold text-terracotta-700 underline hover:text-terracotta-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* ... rest of your AdminDashboard code remains the same ... */}
      {/* Counter + reset */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-sunflower-400 to-sunflower-500 p-5 text-terracotta-900 card-shadow sm:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ethiopic text-sm font-semibold opacity-80">{t('registeredGuests')}</p>
              <p className="font-ethiopic text-4xl font-extrabold leading-none">
                {participants.length}
              </p>
              <p className="mt-1 font-ethiopic text-xs opacity-70">{t('totalGuests')}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/30">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-terracotta-200 bg-white p-5 font-ethiopic text-sm font-bold text-terracotta-600 transition hover:border-terracotta-400 hover:bg-terracotta-50 active:scale-95"
        >
          <Trash2 className="h-5 w-5" />
          <div className="text-left">
            <div>{t('resetBtnAm')}</div>
            <div className="text-xs font-medium opacity-70">{t('resetBtnEn')}</div>
          </div>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Wheel */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-white p-6 card-shadow">
            <h2 className="mb-4 flex items-center gap-2 font-ethiopic text-lg font-bold text-terracotta-800">
              <Trophy className="h-5 w-5 text-sunflower-500" />
              {t('raffleTitle')}
            </h2>
            <WinnerWheel participants={participants} onWinner={handleWinner} />
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl bg-white p-5 card-shadow sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-ethiopic text-lg font-bold text-terracotta-800">{t('participantsTitle')}</h2>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terracotta-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full rounded-full border-2 border-cream-300 bg-cream-50 py-2 pl-9 pr-4 font-ethiopic text-sm outline-none transition focus:border-sunflower-400 focus:ring-2 focus:ring-sunflower-100 sm:w-48"
                  />
                </div>
                <button
                  onClick={() => exportCSV(filtered, lang)}
                  disabled={filtered.length === 0}
                  className="inline-flex flex-none items-center gap-1.5 rounded-full bg-ethiogreen-100 px-3.5 py-2 font-ethiopic text-xs font-semibold text-ethiogreen-700 transition hover:bg-ethiogreen-200 active:scale-95 disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-cream-300 py-12 text-center">
                <p className="text-3xl">📋</p>
                <p className="mt-2 font-ethiopic text-sm text-terracotta-500">
                  {participants.length === 0 ? t('noParticipants') : t('noResults')}
                </p>
              </div>
            ) : (
              <div className="thin-scroll max-h-[420px] overflow-auto rounded-2xl border border-cream-200">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-cream-100 font-ethiopic text-xs font-bold text-terracotta-700">
                    <tr>
                      <th className="px-3 py-3">{t('colNumber')}</th>
                      <th className="px-3 py-3">{t('colName')}</th>
                      <th className="hidden px-3 py-3 sm:table-cell">{t('colAnswers')}</th>
                      <th className="px-3 py-3">{t('colTime')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {filtered.map((p) => (
                      <tr key={p.id} className="transition hover:bg-sunflower-50">
                        <td className="whitespace-nowrap px-3 py-3">
                          <span className="inline-flex items-center justify-center rounded-lg bg-sunflower-100 px-2 py-0.5 font-bold text-terracotta-800">
                            #{p.luckyNumber}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-ethiopic font-semibold text-terracotta-800">
                          {p.name}
                        </td>
                        <td className="hidden max-w-xs px-3 py-3 sm:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {QUESTIONS.map((q) => {
                              const opt = q.options.find((o) => o.value === p.answers[q.id]);
                              const label = opt ? (lang === 'am' ? opt.labelAm : opt.labelEn) : '';
                              return opt ? (
                                <span key={q.id} title={label} className="text-base">
                                  {opt.emoji}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-terracotta-500">
                          {formatTime(p.createdAt, lang)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-3 text-right font-ethiopic text-xs text-terracotta-400">
              {filtered.length} {t('resultCount')}
              {filtered.length !== participants.length && ` (${t('resultCountOf')} ${participants.length})`}
            </p>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && winner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-terracotta-900/50 p-4 backdrop-blur-sm"
          onClick={() => setShowWinnerModal(false)}
        >
          <div
            className="animate-pop-in relative w-full max-w-md rounded-3xl bg-white p-8 text-center card-shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWinnerModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cream-100 text-terracotta-500 transition hover:bg-cream-200"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sunflower-100">
              <PartyPopper className="h-10 w-10 text-sunflower-500" />
            </div>
            <p className="font-ethiopic text-sm font-semibold uppercase tracking-wider text-terracotta-500">
              {t('congrats')}
            </p>
            <h2 className="mt-1 font-ethiopic text-2xl font-extrabold text-terracotta-800">
              {t('winnerTitle')}
            </h2>
            <div className="my-6 rounded-3xl bg-gradient-to-br from-sunflower-300 to-sunflower-500 p-6">
              <p className="font-ethiopic text-5xl font-extrabold leading-none text-terracotta-900">
                #{winner.luckyNumber}
              </p>
              <p className="mt-2 font-ethiopic text-lg font-bold text-terracotta-800">{winner.name}</p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-sm text-terracotta-500">
              <Sparkles className="h-4 w-4 text-sunflower-500" />
              {t('winnerSelected')}
            </div>
            <button
              onClick={() => setShowWinnerModal(false)}
              className="mt-6 w-full rounded-2xl bg-terracotta-500 px-6 py-3 font-ethiopic text-base font-bold text-white transition hover:bg-terracotta-600 active:scale-95"
            >
              {t('continueBtn')}
            </button>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-terracotta-900/50 p-4 backdrop-blur-sm"
          onClick={() => {
            setShowResetModal(false);
            setResetConfirm('');
          }}
        >
          <div
            className="animate-pop-in relative w-full max-w-md rounded-3xl bg-white p-8 card-shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta-100">
              <AlertTriangle className="h-8 w-8 text-terracotta-600" />
            </div>
            <h2 className="text-center font-ethiopic text-xl font-extrabold text-terracotta-800">
              {t('resetConfirmTitle')}
            </h2>
            <p className="mt-3 text-center font-ethiopic text-sm text-terracotta-600">
              {t('resetConfirmBody')}
            </p>
            <p className="mt-2 text-center text-xs text-terracotta-400">
              {t('resetConfirmEn')}
            </p>

            <div className="mt-6">
              <label className="mb-1.5 block text-center text-xs font-semibold text-terracotta-600">
                {t('typeDelete')}
              </label>
              <input
                type="text"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-2xl border-2 border-cream-300 bg-cream-50 px-4 py-3 text-center font-mono text-base uppercase outline-none transition focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirm('');
                }}
                className="flex-1 rounded-2xl bg-cream-100 px-4 py-3 font-ethiopic text-sm font-bold text-terracotta-700 transition hover:bg-cream-200 active:scale-95"
              >
                {t('cancelBtn')}
              </button>
              <button
                onClick={executeReset}
                disabled={resetConfirm !== 'DELETE'}
                className="flex-1 rounded-2xl bg-terracotta-600 px-4 py-3 font-ethiopic text-sm font-bold text-white transition hover:bg-terracotta-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('deleteBtn')}
              </button>
            </div>

            {participants.length > 0 && (
              <button
                onClick={() => exportCSV(participants, lang)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-ethiogreen-100 px-4 py-2.5 font-ethiopic text-xs font-semibold text-ethiogreen-700 transition hover:bg-ethiogreen-200"
              >
                <Download className="h-4 w-4" />
                {t('exportBefore')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}