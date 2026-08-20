import { useMemo } from 'react';

const EMOJIS = ['🎈', '🎨', '☕', '✨', '💃', '🥁', '🎶', '❤️', '🥳', '🌟'];

interface Floater {
  id: number;
  emoji: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
  drift: boolean;
}

export function FloatingBackground() {
  const floaters = useMemo<Floater[]>(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        left: Math.random() * 100,
        duration: 18 + Math.random() * 14,
        delay: Math.random() * 12,
        size: 22 + Math.random() * 26,
        drift: Math.random() > 0.5,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {floaters.map((f) => (
        <span
          key={f.id}
          className={`absolute bottom-0 select-none ${f.drift ? 'animate-float-up' : 'animate-float-up'}`}
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            filter: 'drop-shadow(0 4px 8px rgba(166,90,50,0.15))',
            opacity: 0.55,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
