import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  shape: 'rect' | 'circle' | 'emoji';
  emoji?: string;
  rotation: number;
}

const COLORS = ['#E8B04B', '#C25E3A', '#3C9148', '#F4C430', '#D67E5D', '#5DAE68', '#A84A2C'];
const EMOJIS = ['🎉', '🎈', '✨', '🌟', '🥳', '🎊', '💫'];

export function Confetti({ active, count = 80 }: { active: boolean; count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    const batch = Array.from({ length: count }, (_, i) => {
      const isEmoji = Math.random() > 0.7;
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.5 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 10,
        shape: isEmoji ? 'emoji' : Math.random() > 0.5 ? 'circle' : 'rect',
        emoji: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
        rotation: Math.random() * 360,
      } as ConfettiPiece;
    });
    setPieces(batch);
    const timer = setTimeout(() => setPieces([]), 5500);
    return () => clearTimeout(timer);
  }, [active, count]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.shape === 'emoji' ? (
            <span style={{ fontSize: `${p.size + 10}px` }}>{p.emoji}</span>
          ) : (
            <span
              style={{
                display: 'block',
                width: `${p.size}px`,
                height: p.shape === 'circle' ? `${p.size}px` : `${p.size * 0.6}px`,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                backgroundColor: p.color,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
