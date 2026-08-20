import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/auth';
import { LangProvider, useI18n } from '@/i18n';
import { useRouter, navigate } from '@/router';
import { FloatingBackground } from '@/components/FloatingBackground';
import { LanguageToggle } from '@/components/LanguageToggle';
import { GuestCheckIn } from '@/pages/GuestCheckIn';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminDashboard } from '@/pages/AdminDashboard';

function Routes() {
  const path = useRouter();
  const { isAdmin } = useAuth();
  const { lang } = useI18n();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (path === '/admin' && !isAdmin) {
      navigate('/login');
    }
  }, [path, isAdmin]);

  let page: React.ReactNode;
  if (path === '/login') {
    page = <AdminLogin />;
  } else if (path === '/admin') {
    page = isAdmin ? <AdminDashboard /> : <AdminLogin />;
  } else {
    page = <GuestCheckIn />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-cream-100 via-cream-100 to-sunflower-50">
      <FloatingBackground />
      <div className="fixed right-3 top-3 z-30 sm:right-5 sm:top-5">
        <LanguageToggle />
      </div>
      <main className="relative z-10">{page}</main>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </LangProvider>
  );
}
