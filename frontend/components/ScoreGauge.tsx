"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { riskToneColor } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  min?: number;
  max?: number;
  tierLabel: string;
  tone: string;
  size?: number;
  subtitle?: string;
}

// Gauge sweeps 270deg starting at 135deg (bottom-left) around to 45deg (bottom-right)
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function ScoreGauge({
  score,
  min = 300,
  max = 850,
  tierLabel,
  tone,
  size = 280,
  subtitle = "GigScore",
}: ScoreGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.055;

  const progress = Math.max(0, Math.min(1, (score - min) / (max - min)));
  const fullPath = describeArc(cx, cy, r, START_ANGLE, START_ANGLE + SWEEP_ANGLE);

  const circumference = (SWEEP_ANGLE / 360) * 2 * Math.PI * r;
  const dashOffset = useMotionValue(circumference);
  const springOffset = useSpring(dashOffset, { stiffness: 60, damping: 18, mass: 0.6 });

  const [displayScore, setDisplayScore] = useState(min);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    dashOffset.set(circumference * (1 - progress));
  }, [progress, circumference, dashOffset]);

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();
    const startVal = displayScore;

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(startVal + (score - startVal) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const color = riskToneColor(tone);
  const needleAngle = START_ANGLE + SWEEP_ANGLE * progress;
  const needleTip = polarToCartesian(cx, cy, r - strokeWidth * 1.6, needleAngle);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF87" />
            <stop offset="100%" stopColor="#3DF2FF" />
          </linearGradient>
          <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={fullPath}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <motion.path
          d={fullPath}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: springOffset }}
          filter="url(#gaugeGlow)"
        />

        {/* Needle dot */}
        <motion.circle
          cx={needleTip.x}
          cy={needleTip.y}
          r={strokeWidth * 0.55}
          fill={color}
          initial={false}
          animate={{ cx: needleTip.x, cy: needleTip.y }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
          filter="url(#gaugeGlow)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium">
          {subtitle}
        </span>
        <span
          className="font-display font-bold tabular-nums leading-none mt-1"
          style={{ fontSize: size * 0.19, color }}
        >
          {displayScore}
        </span>
        <span
          className="mt-2 text-xs font-semibold px-3 py-1 rounded-full border"
          style={{
            color,
            borderColor: `${color}55`,
            backgroundColor: `${color}14`,
          }}
        >
          {tierLabel}
        </span>
      </div>
    </div>
  );
}
