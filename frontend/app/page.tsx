"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Repeat,
  ReceiptText,
  PiggyBank,
  Landmark,
  SlidersHorizontal,
  ShieldCheck,
  Gauge,
} from "lucide-react";
import { HeroScorePreview } from "@/components/HeroScorePreview";

const FEATURES = [
  {
    icon: Repeat,
    title: "UPI Transaction Consistency",
    desc: "We read the rhythm of your everyday payments, not a bureau file, to prove you're financially active.",
  },
  {
    icon: Landmark,
    title: "Platform Earnings Frequency",
    desc: "Connect Swiggy, Zomato, Uber, Ola, and more to verify how regularly you actually get paid.",
  },
  {
    icon: ReceiptText,
    title: "Bill Payment History",
    desc: "On-time electricity, rent, and recharge payments count as real credit signals here.",
  },
  {
    icon: PiggyBank,
    title: "Wallet Retention",
    desc: "Holding a buffer between gigs shows resilience — and it's rewarded in your score.",
  },
];

const STEPS = [
  {
    title: "Link your gig accounts",
    desc: "Securely connect your delivery, ride-hailing, or freelance platforms and UPI history in minutes.",
  },
  {
    title: "We build your GigScore",
    desc: "Our weighted engine turns five alternative-data signals into a transparent 300–850 score.",
  },
  {
    title: "Unlock fair credit",
    desc: "Lenders see your real earning pattern, not a blank file, and offer rates that match your risk.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <nav className="relative z-10 max-w-[1400px] mx-auto flex items-center justify-between px-6 sm:px-8 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-glow to-cyan-glow flex items-center justify-center shadow-glow-emerald">
            <Zap className="w-4.5 h-4.5 text-charcoal-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Gig<span className="text-gradient-emerald">Score</span>
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
        >
          Launch Platform <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative max-w-[1400px] mx-auto px-6 sm:px-8 pt-10 sm:pt-16 pb-20 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-medium text-emerald-glow mb-6"
          >
            <Gauge className="w-3.5 h-3.5" /> Alternative Credit Scoring for 200M+ Gig Workers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
          >
            Credit scoring
            <br />
            reimagined for the{" "}
            <span className="text-gradient-emerald">gig economy</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="text-white/55 text-base sm:text-lg mt-6 max-w-lg leading-relaxed"
          >
            No payslips, no bureau file, no problem. GigScore turns UPI activity, platform
            earnings, and bill payment habits into a fair, real-time credit score — built for
            drivers, delivery partners, and freelancers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mt-9"
          >
            <Link
              href="/simulator"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-sm bg-gradient-to-r from-emerald-glow to-cyan-glow text-charcoal-950 shadow-glow-emerald hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" /> Simulate Your GigScore
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-sm border border-white/15 hover:bg-white/5 transition-colors"
            >
              Launch Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex items-center gap-2 mt-8 text-xs text-white/35"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-glow" />
            Bank-grade encryption · No impact to traditional credit score
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex justify-center lg:justify-end animate-float"
        >
          <HeroScorePreview />
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="relative max-w-[1400px] mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mb-14"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-cyan-glow font-semibold">
            The Signal Stack
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-3">
            Four data streams. One honest score.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-glow/10 border border-emerald-glow/25 flex items-center justify-center mb-5">
                <f.icon className="w-5 h-5 text-emerald-glow" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative max-w-[1400px] mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-7 relative overflow-hidden"
            >
              <span className="font-display font-bold text-5xl text-white/[0.06] absolute top-4 right-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display font-semibold text-lg mb-2.5 relative">{step.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed relative">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-[1400px] mx-auto px-6 sm:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-3xl p-10 sm:p-14 text-center border-glow-emerald relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-glow" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl relative">
            Your work is real. <span className="text-gradient-emerald">Your credit should be too.</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto relative">
            Join thousands of gig workers building a credit history from the earnings they
            already have.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-sm bg-gradient-to-r from-emerald-glow to-cyan-glow text-charcoal-950 shadow-glow-emerald hover:brightness-110 active:scale-[0.98] transition-all mt-8 relative"
          >
            Launch Platform <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <footer className="relative border-t border-white/5 py-8 text-center text-xs text-white/30">
        © {new Date().getFullYear()} GigScore. Alternative credit scoring, built for the gig economy.
      </footer>
    </div>
  );
}
