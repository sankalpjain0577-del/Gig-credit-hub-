"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, SlidersHorizontal, Landmark, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulator", label: "Simulator", icon: SlidersHorizontal },
  { href: "/lender", label: "Lender", icon: Landmark },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/5 sticky top-0 z-40 glass-panel-strong">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-glow to-cyan-glow flex items-center justify-center">
            <Zap className="w-4 h-4 text-charcoal-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold tracking-tight">
            Gig<span className="text-gradient-emerald">Score</span>
          </span>
        </Link>
      </div>
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-panel-strong border-t border-white/5 px-4 py-2 flex justify-around">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-medium",
                active ? "text-emerald-glow" : "text-white/40"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
