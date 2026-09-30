"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Headphones,
  MessageCircle,
  Play,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: "01",
    title: "Find something interesting",
    text: "Open a Reddit thread, Quora answer, article, or any page you want to understand.",
  },
  {
    num: "02",
    title: "Press Tellme",
    text: "One click captures the useful content and turns the discussion into a clear listening experience.",
  },
  {
    num: "03",
    title: "Keep doing your thing",
    text: "Tellme narrates the important parts while you code, study, walk, or work.",
  },
];

const features = [
  {
    icon: Headphones,
    title: "Listen while you work",
    text: "Turn long pages and discussions into natural audio without stopping what you are doing.",
  },
  {
    icon: Sparkles,
    title: "Understand, don't just read",
    text: "Cut repetition and connect scattered replies into a coherent story worth hearing.",
  },
  {
    icon: MessageCircle,
    title: "Ask the thread",
    text: "Ask what people disagree about, what matters, or what a particular comment means.",
  },
];

export default function Home() {
  const [openStep, setOpenStep] = useState(0);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-[#f5f5f0]">
      <div className="pointer-events-none fixed inset-0 -z-0 grid-bg" />
      <div className="pointer-events-none fixed left-1/2 top-[-320px] -z-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-lime-300/[0.045] blur-[140px]" />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#070707]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <a href="#" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-lime-300 text-black">
              <Volume2 size={17} strokeWidth={2.7} />
            </span>
            <span className="text-[20px]">
              tellme<span className="text-lime-300">.</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-white/55 md:flex">
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#use-cases" className="transition hover:text-white">Use cases</a>
          </div>

          <Button size="sm">
            Get Tellme <ArrowRight size={15} className="ml-2" />
          </Button>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-[1400px] px-6 pb-24 pt-36 text-center lg:px-10 lg:pb-32 lg:pt-44">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-5xl text-balance text-5xl font-medium leading-[.98] tracking-[-0.055em] sm:text-7xl lg:text-[92px]"
        >
          You found something interesting.
          <span className="block text-white/35">You don't have to read it.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-white/50 sm:text-lg"
        >
          Tellme turns long threads, articles, and webpages into natural audio you can listen to while you keep working.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg">
            Start listening free <ArrowRight size={17} className="ml-2" />
          </Button>
          <Button size="lg" variant="secondary">
            <Play size={15} className="mr-2 fill-current" /> See how it works
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="relative mx-auto mt-20 max-w-6xl"
        >
          <div className="absolute -inset-16 -z-10 rounded-full bg-lime-300/[0.055] blur-[90px]" />
          <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0c0c0c] text-left shadow-2xl shadow-black/60 glow">
            <div className="flex h-11 items-center gap-2 border-b border-white/[0.07] px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <div className="mx-auto flex h-7 w-1/2 items-center rounded-md border border-white/[0.07] bg-white/[0.025] px-3 text-[10px] text-white/25">
                reddit.com/r/...
              </div>
            </div>

            <div className="grid min-h-[390px] md:grid-cols-[1fr_340px]">
              <div className="border-b border-white/[0.07] p-7 md:border-b-0 md:border-r md:p-10">
                <div className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-white/30">
                  <span className="h-2 w-2 rounded-full bg-orange-400" /> Reddit · Discussion
                </div>
                <h3 className="max-w-xl text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                  What's something you learned way too late?
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
                  Hundreds of replies, arguments, stories and useful advice. Tellme turns the noise into something you can hear.
                </p>
                <div className="mt-9 space-y-3">
                  {[
                    "The answer that changed the discussion",
                    "A useful counterpoint",
                    "Three replies saying essentially the same thing",
                  ].map((x, i) => (
                    <div
                      key={x}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-white/35"
                    >
                      <span className="text-white/20">0{i + 1}</span>
                      {x}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between bg-[#101010] p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-300 text-black">
                        <Volume2 size={14} />
                      </span>
                      Tellme
                    </div>
                    <span className="rounded-full bg-lime-300/10 px-2.5 py-1 text-[10px] text-lime-300">
                      LISTENING
                    </span>
                  </div>
                  <p className="mt-8 text-xs uppercase tracking-[.18em] text-white/30">Now playing</p>
                  <p className="mt-2 text-lg leading-6">The useful parts of this discussion</p>
                  <div className="player-wave mt-6 flex h-14 items-center gap-[3px]">
                    {Array.from({ length: 34 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-8 w-[3px] origin-center rounded-full bg-lime-300/80"
                        style={{ height: 12 + ((i * 17) % 31) + "px" }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] text-white/30">
                    <span>02:18</span><span>08:42</span>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-xs leading-5 text-white/55">
                    &quot;The discussion really comes down to three ideas. First, ...&quot;
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-300 text-black">
                      <Play size={15} fill="currentColor" />
                    </button>
                    <span className="text-[11px] text-white/30">1.5× speed</span>
                    <span className="text-[11px] text-white/30">Ask Tellme ↗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-14 gap-y-5 px-6 py-7 text-[11px] font-medium tracking-[.18em] text-white/25 lg:px-10">
          {["REDDIT", "QUORA", "HACKER NEWS", "MEDIUM", "ANY WEBPAGE"].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.2em] text-lime-300">How it works</p>
            <h2 className="mt-5 max-w-lg text-4xl font-medium leading-[1.02] tracking-[-.04em] sm:text-5xl">
              Stop switching between work and the web.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/45">
              Tellme sits beside your browser and turns the pages you care about into something you can consume hands-free.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">
            {steps.map((step, i) => {
              const isOpen = openStep === i;
              return (
                <div key={step.num} className="border-b border-white/[0.08] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenStep(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-5 px-6 py-6 text-left transition-colors hover:bg-white/[0.035] sm:px-7"
                  >
                    <span className="w-8 shrink-0 text-xs text-white/25">{step.num}</span>
                    <span className="flex-1 text-lg font-medium sm:text-xl">{step.title}</span>
                    <ChevronDown
                      size={19}
                      className={`shrink-0 text-white/35 transition-transform duration-300 ${isOpen ? "rotate-180 text-lime-300" : ""}`}
                    />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-7 pl-[68px] text-sm leading-6 text-white/40 sm:px-7 sm:pl-[76px]">
                      {step.text}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-white/[0.07] bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
          <p className="text-xs font-medium uppercase tracking-[.2em] text-lime-300">More than text-to-speech</p>
          <h2 className="mt-5 max-w-2xl text-4xl font-medium leading-[1.02] tracking-[-.04em] sm:text-6xl">
            The useful parts, in your ears.
          </h2>
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                whileHover={{ backgroundColor: "rgba(255,255,255,.045)" }}
                className="bg-[#0a0a0a] p-8 sm:p-10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-lime-300">
                  <Icon size={19} />
                </div>
                <p className="mt-20 text-[11px] text-white/20">0{i + 1}</p>
                <h3 className="mt-3 text-xl font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/40">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="relative z-10 mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.2em] text-lime-300">Built for real life</p>
            <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-.04em] sm:text-6xl">
              Keep your hands busy. Stay in the loop.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/45">
              Whether you're shipping code, studying, commuting, cooking, or moving between tasks — Tellme lets information follow you instead of the other way around.
            </p>
            <div className="mt-8 space-y-3">
              {["Coding & building", "Research & studying", "Long Reddit & Quora threads", "Articles you saved for later"].map((x) => (
                <div key={x} className="flex items-center gap-3 text-sm text-white/65">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-300/10 text-lime-300">
                    <Check size={12} />
                  </span>
                  {x}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-lime-300/[0.05] blur-[80px]" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] p-6">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300 text-black">
                    <Zap size={16} fill="currentColor" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Tellme is listening</p>
                    <p className="text-[11px] text-white/30">Reddit thread · 14 min read</p>
                  </div>
                </div>
                <span className="text-xs text-lime-300">02:41</span>
              </div>

              <div className="py-10">
                <div className="mx-auto flex h-28 max-w-md items-center justify-center gap-1.5">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-lime-300/70"
                      style={{ height: 18 + Math.abs(Math.sin(i * 1.7)) * 65 + "px" }}
                    />
                  ))}
                </div>
                <p className="mx-auto mt-8 max-w-md text-center text-lg leading-7 text-white/75">
                  &quot;Most commenters agree on the outcome — they disagree on why it works.&quot;
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.07] pt-5">
                <span className="text-xs text-white/25">1.5×</span>
                <div className="flex items-center gap-2">
                  <button className="h-10 w-10 rounded-full border border-white/10 text-white/60">↶</button>
                  <button className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300 text-black">
                    <Play size={15} fill="currentColor" />
                  </button>
                  <button className="h-10 w-10 rounded-full border border-white/10 text-white/60">↷</button>
                </div>
                <span className="text-xs text-white/25">Ask ↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 lg:px-10">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[30px] border border-white/10 bg-[#111] px-7 py-20 text-center sm:px-10 lg:py-28">
          <p className="text-xs font-medium uppercase tracking-[.2em] text-lime-300">Your next tab can wait</p>
          <h2 className="mt-5 text-4xl font-medium leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">
            Hear what matters.<br /><span className="text-white/35">Keep doing what matters.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/40">
            Tellme is being built for people who want to stay curious without putting everything else on pause.
          </p>
          <div className="mt-9">
            <Button size="lg">Get early access <ArrowRight size={17} className="ml-2" /></Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-300 text-black">
              <Volume2 size={14} />
            </span>
            tellme<span className="text-lime-300">.</span>
          </div>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="https://github.com/chaitanya-92/Tellme" className="hover:text-white">GitHub</a>
          </div>
          <p className="text-xs text-white/20">© 2026 Tellme. The web, spoken.</p>
        </div>
      </footer>
    </main>
  );
}
