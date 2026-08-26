import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'am' | 'en';

const LANG_KEY = 'festival_lang_v1';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const STRINGS: Record<string, Record<Lang, string>> = {
  // Generic
  'adminLogin': { am: 'አድሚን / Admin Login', en: 'Admin Login' },
  'logout': { am: 'ውጣ / Logout', en: 'Logout' },

  // Guest - hero
  'liveBadge': { am: 'ፌስቲቫሉ እየተካሄደ ነው', en: 'Festival is live' },
  'heroTitle1': { am: 'የበጎ ፈቃድ አገልግሎት ማጠናቀቂያ', en: 'Volunteer Service' },
  'heroTitle2': { am: 'የልጆች ፌስቲቫል!', en: "Children's Festival!" },
  'heroSubtitle': {
    am: 'ውድ ቤተሰቦች፣ ልጆቻችሁን በእኛ እጅ ስላሳደራችሁን እና ከረምቱን ሙሉ አብራችሁን ስለቆያችሁ ከልብ እናመሰግናለን። ዛሬ አብረን እንደስት፣ እንጫወት እና ትዝታ እንፍጠር።',
    en: 'Dear families, thank you from the bottom of our hearts for trusting us with your children and spending the year by our side. Today let us celebrate, play, and make memories together.',
  },
  'photoAlt': {
    am: 'ደስተኛ ልጆች ከበጎ ፈቃደኛ አስተማሪያቸው ጋር',
    en: 'Happy children with their volunteer teachers',
  },

  // Guest - form
  'nameLabel': { am: 'የወላጅ / የእንግዳ ስም', en: 'Parent / Guest Name' },
  'namePlaceholder': { am: 'ስምዎን አስገቡ...', en: 'Enter your name...' },
  'nameError': { am: 'እባክዎ ስምዎን ያስገቡ።', en: 'Please enter your name.' },
  'submitBtn': { am: 'የእድል ቁጥሬን አውጣ!', en: 'Get My Lucky Number!' },
  'answerAll': { am: 'ሁሉንም ጥያቄዎች ይምልሱ።', en: 'Please answer all questions.' },

  // Guest - result
  'registered': { am: 'ተመዝግበዋል!', en: 'Registered!' },
  'resultTitle': { am: 'ተመዝግበዋል! ይህንን የእድል ቁጥር በእጅዎ ይያዙ።', en: "You're registered! Keep this lucky number handy." },
  'resultSubtitle': { am: 'ይህ ቁጥር በእድል መጥራት ላይ ይውላል — አስቀምጡት!', en: 'This number will be used in the raffle — save it!' },
  'guestName': { am: 'የእንግዳ ስም', en: 'Guest Name' },
  'registerAnother': { am: 'ሌላ ሰው ይመዝገብ', en: 'Register another person' },

  // Admin login
  'backHome': { am: 'ወደ መነሻ ተመለስ', en: 'Back to home' },
  'loginTitle': { am: 'የአድሚን መግቢያ', en: 'Admin Login' },
  'loginSubtitle': { am: 'Admin Login', en: 'Admin Login' },
  'passwordLabel': { am: 'የአድሚን ይለፍ ቃል', en: 'Admin Password' },
  'loginError': { am: 'የሆነ የተሳሳተ ይለፍ ቃል። እባክዎ በድጋሚ ይሞክሩ።', en: 'Incorrect password. Please try again.' },
  'loginBtn': { am: 'ግበሩ / Login', en: 'Login' },
  'loginHint': { am: 'ምክር: ይለፍ ቃሉ', en: 'Hint: the password is' },

  // Admin dashboard
  'dashTitle': { am: '🎪 የፌስቲቫል ዳሽቦርድ', en: '🎪 Festival Dashboard' },
  'dashSubtitle': { am: 'Festival Admin Dashboard', en: 'Festival Admin Dashboard' },
  'registeredGuests': { am: 'የተመዘገቡ እንግዶች', en: 'Registered Guests' },
  'totalGuests': { am: 'Total Registered Guests', en: 'Total Registered Guests' },
  'resetBtnAm': { am: 'ታሪክ አፅዳ', en: 'Clear Data' },
  'resetBtnEn': { am: 'Reset Event Data', en: 'Reset Event Data' },
  'raffleTitle': { am: 'የእድል መጥራት', en: 'Lucky Raffle' },
  'participantsTitle': { am: 'ተሳታፊዎች', en: 'Participants' },
  'searchPlaceholder': { am: 'ፈልግ...', en: 'Search...' },
  'colNumber': { am: '#', en: '#' },
  'colName': { am: 'ስም', en: 'Name' },
  'colAnswers': { am: 'ምላሾች', en: 'Answers' },
  'colTime': { am: 'ሰዓት', en: 'Time' },
  'noParticipants': { am: 'ተሳታፊ የለም።', en: 'No participants yet.' },
  'noResults': { am: 'የሚገኝ ውጤት የለም።', en: 'No results found.' },
  'resultCount': { am: 'ውጤት', en: 'results' },
  'resultCountOf': { am: 'ከ', en: 'of' },

  // Winner modal
  'congrats': { am: '🎉 እንኳን ደስ አለዎት!', en: '🎉 Congratulations!' },
  'winnerTitle': { am: 'የእድል አሸናፊ!', en: 'Lucky Winner!' },
  'winnerSelected': { am: 'ይህ ቁጥር በእድል ተመርጧል', en: 'This number was drawn at random' },
  'continueBtn': { am: 'ቀጥል / Continue', en: 'Continue' },

  // Reset modal
  'resetConfirmTitle': { am: 'ሁሉንም መረጃዎች ላፅዳ?', en: 'Clear all data?' },
  'resetConfirmBody': {
    am: 'ሁሉም የእንግዳ ምዝገባዎች ይደምሰሳሉ። የእድል ቁጥሮች ለአዲስ ዙር ይጀመራሉ። ይህ እርምጃ መመለስ አይቻልም።',
    en: 'All guest registrations will be deleted. Lucky numbers will reset for a new event round. This action cannot be undone.',
  },
  'resetConfirmEn': {
    am: 'Are you sure you want to clear all guest registrations? This will reset lucky numbers for a new event round.',
    en: 'Are you sure you want to clear all guest registrations? This will reset lucky numbers for a new event round.',
  },
  'typeDelete': { am: 'ለመቀጠል DELETE ይተይቡ', en: 'Type DELETE to continue' },
  'cancelBtn': { am: 'ይቅር', en: 'Cancel' },
  'deleteBtn': { am: 'አፅዳ / Delete', en: 'Delete' },
  'exportBefore': { am: 'ከመሰረዝዎ በፊት CSV አውርድ', en: 'Download CSV before clearing' },

  // Wheel
  'wheelEmptyAm': { am: 'ተሳታፊዎች እስኪመዘገቡ ይጠብቁ', en: 'Waiting for participants' },
  'wheelEmptyEn': { am: 'No participants yet', en: 'No participants yet' },
  'wheelSpinning': { am: 'እየዞረ ነው...', en: 'Spinning...' },
  'wheelSpinBtn': { am: '🎲 ዕጣ አውጣ / Spin', en: '🎲 Spin' },
};

interface LangProviderProps {
  children: ReactNode;
}

export function LangProvider({ children }: LangProviderProps) {
  const [lang, setLangState] = useState<Lang>('am');

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY) as Lang | null;
    if (stored === 'am' || stored === 'en') setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'am' ? 'en' : 'am');
  }, [lang, setLang]);

  const t = useCallback((key: string) => STRINGS[key]?.[lang] ?? key, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>{children}</LangContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n must be used within LangProvider');
  return ctx;
}
