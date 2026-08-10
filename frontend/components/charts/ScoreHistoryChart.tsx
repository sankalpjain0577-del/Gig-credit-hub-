"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { month: string; score: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel-strong rounded-xl px-3.5 py-2.5 border border-emerald-glow/20">
      <p className="text-[11px] text-white/50">{label}</p>
      <p className="text-sm font-semibold text-emerald-glow tabular-nums">
        {payload[0].value} pts
      </p>
    </div>
  );
}

export function ScoreHistoryChart({ data }: Props) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FF87" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#00FF87" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
          />
          <YAxis
            domain={[300, 850]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            width={38}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,255,135,0.2)" }} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#00FF87"
            strokeWidth={2.5}
            fill="url(#scoreArea)"
            dot={{ fill: "#00FF87", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#00FF87", stroke: "#07090B", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
