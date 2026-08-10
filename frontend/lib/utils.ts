import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function riskToneColor(tone: string): string {
  const map: Record<string, string> = {
    excellent: "#00FF87",
    good: "#3DF2FF",
    moderate: "#F5D547",
    watch: "#FF9F43",
    risk: "#FF4D6D",
  };
  return map[tone] || "#3DF2FF";
}
