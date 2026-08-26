export interface Participant {
  id: string;
  luckyNumber: number;
  name: string;
  answers: Record<string, string>;
  createdAt: number;
}

export interface QuestionOption {
  value: string;
  labelAm: string;
  labelEn: string;
  emoji: string;
}

export interface Question {
  id: string;
  titleAm: string;
  titleEn: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    titleAm: 'ዛሬ ልጅዎትን ለመንከባከብ ምን አይነት ሃይል ነው እየተጠቀሙ ያሉት?',
    titleEn: 'What kind of energy are you using to engage the children today?',
    options: [
      { value: 'coffee', labelAm: 'የጠዋት ኮስታራ ቡና', labelEn: 'Morning coffee', emoji: '☕' },
      { value: 'bread', labelAm: 'ትኩስ ዳቦ እና ሻይ', labelEn: 'Fresh bread & tea', emoji: '🥖' },
      { value: 'shiro', labelAm: 'የዕለቱ ሽሮ እና ጉርሻ', labelEn: "Today's shiro & gursha", emoji: '🍲' },
      { value: 'joy', labelAm: 'የፌስቲቫሉ ደስታ ', labelEn: "The festival's joy & cheers", emoji: '⚡' },
    ],
  },
 
  {
    id: 'q3',
    titleAm: 'የልጅዎ ዋና አላማ ዛሬ ምንድነው?',
    titleEn: "What is your child's main goal today?",
    options: [
      { value: 'art', labelAm: 'ስዕል መሳል እና ፈጠራ ላይ መሳተፍ', labelEn: 'Drawing and joining creative activities', emoji: '🎨' },
      { value: 'run', labelAm: 'የጫማቸው ሶል እስኪያልቅ መሮጥ', labelEn: "Running until their soles wear out", emoji: '🏃' },
      { value: 'snack', labelAm: 'ጣፋጭ ምግቦችን መብላት', labelEn: 'Snacking and eating treats', emoji: '🍿' },
      { value: 'together', labelAm: 'ከአስተማሪዎቻቸው ጎን አለመለየት', labelEn: 'Staying close to their teachers', emoji: '🤝' },
    ],
  },
  {
    id: 'q4',
    titleAm: 'የበጎ ፈቃድ አገልግሎቱ መጠናቀቁን እንዴት እያከበሩ ነው?',
    titleEn: 'How are you celebrating the end of the volunteer service?',
    options: [
      { value: 'photos', labelAm: 'ብዙ የትዝታ ፎቶዎችን በማንሳት', labelEn: 'Taking lots of memory photos', emoji: '📸' },
      { value: 'play', labelAm: 'ከልጆች ጋር በጨዋታዎች ላይ በመሳተፍ', labelEn: 'Joining games with the children', emoji: '🕺' },
      { value: 'sleep', labelAm: 'ነገ ሙሉ ቀን ለመተኛት እቅድ በማውጣት', labelEn: 'Planning to sleep all day tomorrow', emoji: '😴' },
      { value: 'remember', labelAm: 'የነበረንን ጥሩ ጊዜ እና ትዝታ በማስታወስ', labelEn: 'Remembering the good times', emoji: '❤️' },
    ],
  },
  {
    id: 'q5',
    titleAm: 'የአሁኑን የደስታ ስሜትዎን የትኛው ኢሞጂ ይገልፀዋል?',
    titleEn: 'Which emoji best describes your current mood?',
    options: [
      { value: 'happy', labelAm: 'ደስተኛ', labelEn: 'Happy', emoji: '🥳' },
      { value: 'calm', labelAm: 'የተረጋጋ', labelEn: 'Calm', emoji: '☕' },
      { value: 'creative', labelAm: 'ፈጠራ ላይ', labelEn: 'Creative', emoji: '🎨' },
      { value: 'playful', labelAm: 'ጨዋታ ላይ', labelEn: 'Playful', emoji: '💃' },
      { value: 'cool', labelAm: 'ዘናጭ', labelEn: 'Feeling cool', emoji: '😎' },
    ],
  },
];
