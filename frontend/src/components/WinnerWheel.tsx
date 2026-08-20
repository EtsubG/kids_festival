import { useRef, useState } from 'react';
import type { Participant } from '@/types';
import { useI18n } from '@/i18n';

interface WheelProps {
  participants: Participant[];
  onWinner: (p: Participant) => void;
}

const SEGMENT_COLORS = [
  '#E8B04B',
  '#C25E3A',
  '#3C9148',
  '#F4C430',
  '#D67E5D',
  '#5DAE68',
  '#A84A2C',
  '#2D7739',
];

export function WinnerWheel({ participants, onWinner }: WheelProps) {
  const { t } = useI18n();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);

  const count = participants.length;
  const segmentAngle = count > 0 ? 360 / count : 360;

  function spin() {
    if (spinning || count === 0) return;
    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * count);
    const baseRotation = rotationRef.current;
    // Normalize so we land with the winner segment at the top pointer (0deg = top)
    const targetSegmentCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    // We want the pointer (at top, 0deg) to point at the winner segment center.
    // Wheel rotates clockwise; pointer stays at top. So rotation must move segment center to 0deg (top).
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const desired = 360 * fullSpins - targetSegmentCenter;
    // Normalize relative to current to always move forward
    const currentMod = ((baseRotation % 360) + 360) % 360;
    let delta = desired - currentMod;
    if (delta < 0) delta += 360;
    const finalRotation = baseRotation + delta + 360 * fullSpins;

    rotationRef.current = finalRotation;
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      onWinner(participants[winnerIndex]);
    }, 5200);
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cream-300 bg-white/60 p-12 text-center">
        <div className="mb-3 text-5xl">🎡</div>
        <p className="font-ethiopic text-base font-semibold text-terracotta-600">
          {t('wheelEmptyAm')}
        </p>
        <p className="mt-1 text-sm text-terracotta-400">{t('wheelEmptyEn')}</p>
      </div>
    );
  }

  const radius = 160;
  const center = 180;
  const wheelSize = 360;

  return (
    <div className="flex flex-col items-center">
      {/* Pointer */}
      <div className="relative z-10 -mb-3 flex flex-col items-center">
        <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-terracotta-700 drop-shadow-md" />
      </div>

      {/* Wheel */}
      <div className="relative" style={{ width: wheelSize, height: wheelSize }}>
        <div
          className="absolute inset-0 rounded-full border-[6px] border-white card-shadow-lg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.21, 1)' : 'none',
          }}
        >
          <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
            {participants.map((p, i) => {
              const startAngle = i * segmentAngle - 90;
              const endAngle = (i + 1) * segmentAngle - 90;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = center + radius * Math.cos(startRad);
              const y1 = center + radius * Math.sin(startRad);
              const x2 = center + radius * Math.cos(endRad);
              const y2 = center + radius * Math.sin(endRad);
              const largeArc = segmentAngle > 180 ? 1 : 0;
              const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
              const midAngle = (startAngle + endAngle) / 2;
              const midRad = (midAngle * Math.PI) / 180;
              const labelRadius = radius * 0.62;
              const lx = center + labelRadius * Math.cos(midRad);
              const ly = center + labelRadius * Math.sin(midRad);
              const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
              return (
                <g key={p.id}>
                  <path d={path} fill={color} stroke="white" strokeWidth={1.5} />
                  <text
                    x={lx}
                    y={ly}
                    fill="white"
                    fontSize={count > 20 ? 11 : count > 12 ? 13 : 16}
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${lx}, ${ly})`}
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    #{p.luckyNumber}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* Center hub */}
        <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-terracotta-600 card-shadow">
          <span className="text-xl">🎯</span>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={`mt-6 flex items-center gap-2 rounded-2xl px-8 py-4 font-ethiopic text-lg font-extrabold transition active:scale-95 ${
          spinning
            ? 'cursor-not-allowed bg-cream-300 text-terracotta-400'
            : 'bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white hover:from-terracotta-600 hover:to-terracotta-700 card-shadow'
        }`}
      >
        {spinning ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {t('wheelSpinning')}
          </>
        ) : (
          <>{t('wheelSpinBtn')}</>
        )}
      </button>
    </div>
  );
}
