"use client";

import { motion } from "framer-motion";

interface HeatmapData {
  platforms: string[];
  matrix: { band: string; cells: { platform: string; count: number }[] }[];
}

const BAND_COLOR: Record<string, string> = {
  "300-479": "#FF4D6D",
  "480-579": "#FF9F43",
  "580-669": "#F5D547",
  "670-749": "#3DF2FF",
  "750-850": "#00FF87",
};

export function RiskHeatmap({ data }: { data: HeatmapData }) {
  const maxCount = Math.max(1, ...data.matrix.flatMap((row) => row.cells.map((c) => c.count)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1.5 min-w-[560px]">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-medium text-white/40 px-2 pb-2 w-28">Score Band</th>
            {data.platforms.map((p) => (
              <th key={p} className="text-[11px] font-medium text-white/40 pb-2">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.matrix.map((row) => (
            <tr key={row.band}>
              <td className="text-xs font-semibold text-white/70 pr-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: BAND_COLOR[row.band] }}
                />
                {row.band}
              </td>
              {row.cells.map((cell) => {
                const intensity = cell.count / maxCount;
                return (
                  <td key={cell.platform} className="p-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-12 rounded-lg flex items-center justify-center text-sm font-semibold tabular-nums"
                      style={{
                        backgroundColor: `${BAND_COLOR[row.band]}${Math.round(
                          14 + intensity * 45
                        ).toString(16)}`,
                        border: `1px solid ${BAND_COLOR[row.band]}${cell.count ? "40" : "10"}`,
                        color: cell.count ? "#fff" : "rgba(255,255,255,0.2)",
                      }}
                    >
                      {cell.count || "—"}
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
