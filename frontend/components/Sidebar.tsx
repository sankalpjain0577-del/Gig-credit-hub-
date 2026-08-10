"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Landmark,
  Zap,
  ChevronLeft,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulator", label: "Simulator", icon: SlidersHorizontal },
  { href: "/lender", label: "Lender View", icon: Landmark },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[248px] shrink-0 h-screen sticky top-0 border-r border-white/5 px-4 py-6">
      <Link href="/" className="flex items-center gap-2 px-2 mb-10 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-glow to-cyan-glow flex items-center justify-center shadow-glow-emerald">
          <Zap className="w-5 h-5 text-charcoal-950" strokeWidth={2.5} />
        </div>
        <span className="font-display font-bold text-lg tracking-tight">
          Gig<span className="text-gradient-emerald">Score</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative">
              <div
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors relative z-10",
                  active ? "text-charcoal-950" : "text-white/60 hover:text-white"
                )}
              >
                <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                {item.label}
              </div>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-glow to-cyan-glow shadow-glow-emerald"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="glass-panel rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-charcoal-700 flex items-center justify-center border border-white/10">
            <User className="w-4 h-4 text-white/70" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Ananya Rao</p>
            <p className="text-[11px] text-white/40 truncate">Jaipur, Rajasthan</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-3 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to home
        </Link>
      </div>
    </aside>
  );
}
