"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [orbOffset, setOrbOffset] = useState({ x: 0, y: 0 });
  const orbGuideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onPointerMove = (event: PointerEvent) => {
      const guide = orbGuideRef.current;
      if (!guide) return;

      const rect = guide.getBoundingClientRect();
      const orbCenterX = rect.left + rect.width / 2;
      const orbCenterY = rect.top + rect.height / 2;
      const dx = event.clientX - orbCenterX;
      const dy = event.clientY - orbCenterY;
      const distance = Math.hypot(dx, dy);
      const maxDistance = Math.max(0, rect.width / 2 - 105);

      if (distance <= maxDistance) {
        setOrbOffset({ x: dx, y: dy });
      } else {
        const scale = maxDistance / distance;
        setOrbOffset({ x: dx * scale, y: dy * scale });
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <main className="vintage-paper min-h-screen overflow-hidden text-[#26384D] selection:bg-[#7A263A]/15">
      <div className="pointer-events-none fixed left-0 top-[47%] z-0 h-px w-[43%] dashed-path opacity-80" />
      <div className="pointer-events-none fixed right-0 top-[59%] z-0 h-px w-[31%] dashed-path opacity-80" />
      <div className="pointer-events-none fixed bottom-0 left-[50%] z-0 h-48 dashed-path-vertical opacity-70" />

      <motion.nav
        initial={false}
        animate={{
          top: isScrolled ? 0 : 0,
          left: isScrolled ? 12 : 0,
          right: isScrolled ? 12 : 0,
          y: isScrolled ? [0, -5, 1.5, 0] : 0,
          scaleX: isScrolled ? [1, 1.012, 0.997, 1] : 1,
          scaleY: isScrolled ? [1, 0.985, 1.003, 1] : 1,
          rotate: isScrolled ? [0, -0.18, 0.05, 0] : 0,
        }}
        transition={{
          top: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
          left: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
          right: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
          scaleX: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
          scaleY: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
          rotate: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
        }}
        style={{ transformOrigin: "top center" }}
        className={`fixed z-50 ${isScrolled ? "mx-auto max-w-[1180px]" : "w-full"}`}
      >
        <motion.div
          animate={{
            height: isScrolled ? 64 : 104,
            borderRadius: isScrolled ? 18 : 0,
            boxShadow: isScrolled
              ? [
                  "0 0 0 rgba(24,37,53,0)",
                  "0 16px 30px rgba(24,37,53,.10)",
                  "0 7px 18px rgba(24,37,53,.08)",
                  "0 10px 28px rgba(24,37,53,.10)",
                ]
              : "0 0 0 rgba(31,48,68,0)",
            backgroundColor: isScrolled ? "rgba(243,235,221,.94)" : "rgba(243,235,221,0)",
          }}
          transition={{
            height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            borderRadius: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            boxShadow: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
            backgroundColor: { duration: 0.35, ease: "easeOut" },
          }}
          className="mx-auto overflow-hidden border border-[#1F3044]/[0.08] backdrop-blur-xl"
        >
          <div className="mx-auto grid h-full max-w-[1180px] grid-cols-[1fr_auto] items-center px-5 sm:px-7 md:grid-cols-[1fr_1fr]">
            <a href="#" className="flex items-center gap-3">
              <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#1F3044]">
                <span className="absolute top-[8px] h-px w-6 bg-[#F3EBDD]" />
                <span className="absolute top-[13px] h-px w-6 bg-[#F3EBDD]" />
                <span className="absolute top-[18px] h-px w-6 bg-[#F3EBDD]" />
                <span className="absolute top-[23px] h-px w-6 bg-[#F3EBDD]" />
              </span>
              <span className="vintage-serif text-[23px] tracking-[-.02em]">tellme.</span>
            </a>

            <div className="flex h-full items-center justify-end gap-6 text-[11px] uppercase tracking-[.12em] text-[#70685E] sm:gap-8">
              <a href="#how" className="transition-colors hover:text-[#1F3044]">how it works</a>
              <a href="#features" className="transition-colors hover:text-[#1F3044]">features</a>
              <a href="#use-cases" className="transition-colors hover:text-[#1F3044]">use cases</a>
              <Button size="sm" className="ml-2 hidden sm:inline-flex">
                Get Tellme <ArrowRight size={15} className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
      <section className="relative z-10 mx-auto min-h-[760px] max-w-[1400px] px-6 pb-24 pt-40 lg:px-10 lg:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_.72fr]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7 }}
              className="mb-7 flex items-center gap-3 text-xs uppercase tracking-[.18em] text-[#70685E]"
            >
              <span className="h-px w-10 bg-[#7A263A]" />
              <span>THE WEB, SPOKEN</span>
              <span className="text-[#AFA18D]">VOL. 01 · 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .8 }}
              className="vintage-serif text-balance text-[58px] leading-[.84] sm:text-[78px] lg:text-[108px]"
            >
              You found something
              <span className="relative block">
                interesting<span className="absolute -bottom-2 ml-1 text-[#70685E]">.</span>
              </span>
              <span className="mt-5 block text-[#70685E]">You don't have to read it.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7, delay: .1 }}
              className="magazine-dropcap mt-8 max-w-xl text-[15px] leading-7 text-[#70685E] sm:text-base"
            >
              Tellme turns long threads, articles, and webpages into natural audio you can listen to while you keep working.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7, delay: .2 }}
              className="mt-9 flex flex-col gap-3 border-t border-[#1F3044]/15 pt-6 sm:flex-row"
            >
              <Button size="lg">
                Start listening free <ArrowRight size={17} className="ml-2" />
              </Button>
              <Button size="lg" variant="secondary">
                <Play size={15} className="mr-2 fill-current" /> See how it works
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: .97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: .25 }}
            className="relative hidden min-h-[390px] lg:block"
          >
            <div className="absolute right-0 top-1/2 h-px w-full -translate-y-1/2 dashed-path opacity-70" />
            <div
              ref={orbGuideRef}
              className="absolute right-10 top-1/2 h-[270px] w-[270px] -translate-y-1/2 rounded-full border border-dashed border-[#AFA18D]"
            />
            <div className="absolute right-[135px] top-[calc(50%-135px)] h-[270px] w-px bg-[#CFC2AE]" />
            <div className="absolute right-[135px] top-1/2 h-px w-[270px] bg-[#CFC2AE]" />

            <motion.div
              animate={{ x: orbOffset.x, y: orbOffset.y }}
              transition={{ type: "spring", stiffness: 170, damping: 18, mass: 0.55 }}
              className="absolute right-10 top-1/2 flex h-[210px] w-[210px] -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#1F3044] text-center text-[#F3EBDD] shadow-[0_24px_50px_rgba(24,37,53,.18)] will-change-transform"
            >
              <motion.span
                animate={{ x: orbOffset.x * 0.18, y: orbOffset.y * 0.18 }}
                transition={{ type: "spring", stiffness: 190, damping: 20 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7A263A] text-[#F3EBDD] shadow-[0_8px_18px_rgba(122,38,58,.24)]"
              >
                <Volume2 size={21} />
              </motion.span>
              <p className="vintage-serif mt-4 text-2xl">listen.</p>
              <p className="mt-1 text-xs text-white/55">while you keep moving</p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, delay: .35 }}
          className="relative mx-auto mt-20 max-w-6xl"
        >
          <div className="overflow-hidden border-y-2 border-[#1F3044] bg-[#F3EBDD]/60">
            <div className="flex h-11 items-center gap-2 border-b border-[#1F3044]/10 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1F3044]/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1F3044]/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1F3044]/20" />
              <div className="mx-auto flex h-7 w-1/2 items-center rounded-md border border-[#1F3044]/10 bg-[#CFC2AE] px-3 text-[10px] text-[#70685E]">
                reddit.com/r/...
              </div>
            </div>

            <div className="grid min-h-[390px] md:grid-cols-[1fr_340px]">
              <div className="p-7 md:border-r md:border-dashed md:border-[#C9BBA7] md:p-10">
                <div className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-[#70685E]">
                  <span className="h-2 w-2 rounded-full bg-[#7A263A]" /> Reddit · Discussion
                </div>
                <h3 className="vintage-serif max-w-xl text-3xl leading-tight sm:text-4xl">
                  What's something you learned way too late?
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#70685E]">
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
                      className="flex items-center gap-3 border-b border-dashed border-[#C9BBA7] px-1 py-3 text-xs text-[#70685E]"
                    >
                      <span className="text-[#1F3044]/35">0{i + 1}</span>
                      {x}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-[#F3EBDD]/15 bg-[#1F3044] p-6 text-white sm:border-l sm:border-t-0 sm:p-7">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7A263A]">
                        <Volume2 size={14} />
                      </span>
                      Tellme
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/65">
                      LISTENING
                    </span>
                  </div>
                  <p className="mt-8 text-xs uppercase tracking-[.18em] text-white/35">Now playing</p>
                  <p className="mt-2 text-lg leading-6">The useful parts of this discussion</p>
                  <div className="player-wave mt-6 flex h-14 items-center gap-[3px]">
                    {Array.from({ length: 34 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-8 w-[3px] origin-center rounded-full bg-[#7A263A]"
                        style={{ height: 12 + ((i * 17) % 31) + "px" }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] text-white/35">
                    <span>02:18</span><span>08:42</span>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/15 bg-transparent pt-4">
                  <p className="text-xs leading-5 text-white/65">
                    &quot;The discussion really comes down to three ideas. First, ...&quot;
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7A263A] text-white">
                      <Play size={15} fill="currentColor" />
                    </button>
                    <span className="text-[11px] text-white/40">1.5× speed</span>
                    <span className="text-[11px] text-white/40">Ask Tellme ↗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 overflow-hidden border-y border-[#1F3044]/10 bg-[#E7DED0]">
        <div className="marquee-track flex w-max items-center py-7 text-[11px] font-medium tracking-[.18em] text-[#1F3044]">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center">
              {[
                ["REDDIT", "https://cdn.simpleicons.org/reddit/26384D"],
                ["QUORA", "https://cdn.simpleicons.org/quora/26384D"],
                ["HACKER NEWS", "https://cdn.simpleicons.org/ycombinator/26384D"],
                ["MEDIUM", "https://cdn.simpleicons.org/medium/26384D"],
                ["DEV.TO", "https://cdn.simpleicons.org/devdotto/26384D"],
                ["HASHNODE", "https://cdn.simpleicons.org/hashnode/26384D"],
                ["STACK OVERFLOW", "https://cdn.simpleicons.org/stackoverflow/26384D"],
              ].map(([name, logo]) => (
                <span
                  key={group + "-" + name}
                  className="mx-5 inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-[3px] bg-[#F3EBDD] px-3 text-[#26384D] ring-1 ring-[#C9BBA7]/70 shadow-[0_2px_8px_rgba(38,56,77,.05)] lg:mx-8"
                >
                  <img src={logo} alt="" aria-hidden="true" className="h-4 w-4 object-contain opacity-90" />
                  <span>{name}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 border-y border-[#1F3044]/15 bg-[#E7DED0]/35">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex items-end justify-between border-b-2 border-[#1F3044] pb-5">
            <div>
              <p className="magazine-kicker text-[#7A263A]">How it works</p>
              <p className="mt-2 text-[10px] uppercase tracking-[.18em] text-[#70685E]">Three steps · One less screen to read</p>
            </div>
            <span className="magazine-caption hidden sm:block">Page 02</span>
          </div>
          <div className="grid lg:grid-cols-[.9fr_1.7fr]">
            <div className="border-b border-dashed border-[#C9BBA7] py-10 lg:border-b-0 lg:border-r lg:pr-14">
              <h2 className="vintage-serif max-w-xl text-5xl leading-[.9] sm:text-7xl">Stop switching between work and the web.</h2>
              <p className="mt-7 max-w-md text-sm leading-6 text-[#70685E]">Tellme sits beside your browser and turns the pages you care about into something you can consume hands-free.</p>
            </div>
            <div className="lg:pl-14">
              {steps.map((step, i) => {
                const isOpen = openStep === i;
                return (
                  <div key={step.num} className="border-b border-dashed border-[#C9BBA7] last:border-b-0">
                    <button type="button" onClick={() => setOpenStep(isOpen ? -1 : i)} aria-expanded={isOpen}
                      className="group flex w-full items-center gap-5 py-7 text-left transition-colors">
                      <span className="font-mono text-[10px] text-[#7A263A]">{step.num}</span>
                      <span className="vintage-serif flex-1 text-2xl sm:text-3xl">{step.title}</span>
                      <ChevronDown size={18} className={`text-[#70685E] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#7A263A]" : "group-hover:translate-y-0.5"}`} />
                    </button>
                    <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: .28, ease: "easeOut" }} className="overflow-hidden">
                      <p className="pb-7 pl-10 max-w-xl text-sm leading-6 text-[#70685E]">{step.text}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-[#1F3044]/15 bg-[#F3EBDD] text-[#1F3044]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex items-end justify-between border-b-2 border-[#1F3044] pb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#7A263A]">The Tellme Review</p>
              <p className="mt-2 text-[10px] uppercase tracking-[.18em] text-[#70685E]">Audio · Attention · The web</p>
            </div>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[.22em] text-[#70685E] sm:block">Vol. 01 — 03</p>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[1.05fr_1.95fr] lg:gap-14">
            <div className="lg:border-r lg:border-dashed lg:border-[#C9BBA7] lg:pr-14">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#7A263A]">More than text-to-speech</p>
              <h2 className="vintage-serif mt-5 max-w-xl text-5xl leading-[.9] sm:text-7xl">
                The useful parts,<br />in your ears.
              </h2>
              <p className="mt-7 max-w-sm text-sm leading-6 text-[#70685E]">
                A quieter way to keep up with the internet without giving every interesting page your full attention.
              </p>
            </div>

            <div className="grid md:grid-cols-3">
              {features.map(({ icon: Icon, title, text }, i) => (
                <motion.article
                  key={title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: .25, ease: "easeOut" }}
                  className={`group relative py-2 md:px-7 lg:px-8 ${i > 0 ? "mt-8 border-t border-dashed border-[#C9BBA7] pt-8 md:mt-0 md:border-l md:border-t-0 md:pt-2" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[.18em] text-[#70685E]">0{i + 1}</span>
                    <span className="text-[#7A263A] transition-transform duration-300 group-hover:translate-x-1">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                  </div>
                  <h3 className="vintage-serif mt-12 text-3xl leading-[1.02] sm:text-[2.15rem]">
                    {title}
                  </h3>
                  <div className="mt-5 h-px w-12 bg-[#7A263A] transition-all duration-300 group-hover:w-20" />
                  <p className="mt-5 text-sm leading-6 text-[#70685E]">{text}</p>
                  <p className="mt-10 text-[9px] uppercase tracking-[.2em] text-[#AFA18D]">Tellme / 2026</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1F3044] pt-4 text-[9px] uppercase tracking-[.2em] text-[#70685E]">
            <div className="flex items-center justify-between gap-4">
              <span>Read less. Hear more.</span>
              <span className="hidden sm:block">A digital publication for curious minds</span>
              <span>Page 03</span>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="relative z-10 border-y border-[#1F3044]/15 bg-[#F3EBDD]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex items-end justify-between border-b-2 border-[#1F3044] pb-5">
            <div>
              <p className="magazine-kicker text-[#7A263A]">Built for real life</p>
              <p className="mt-2 text-[10px] uppercase tracking-[.18em] text-[#70685E]">What happens when the web follows you</p>
            </div>
            <span className="magazine-caption hidden sm:block">The weekend edition</span>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_.85fr]">
            <div className="py-10 lg:border-r lg:border-dashed lg:border-[#C9BBA7] lg:pr-14">
              <h2 className="vintage-serif max-w-3xl text-5xl leading-[.88] sm:text-7xl">Keep your hands busy. Stay in the loop.</h2>
              <p className="magazine-dropcap mt-7 max-w-2xl text-[15px] leading-7 text-[#70685E]">
                Whether you're shipping code, studying, commuting, cooking, or moving between tasks — Tellme lets information follow you instead of the other way around.
              </p>
              <div className="mt-9 grid max-w-2xl grid-cols-2 border-t border-[#1F3044]">
                {["Coding & building", "Research & studying", "Long Reddit & Quora threads", "Articles you saved for later"].map((x, i) => (
                  <div key={x} className="border-b border-dashed border-[#C9BBA7] py-4 pr-5 text-sm text-[#70685E]">
                    <span className="mr-3 font-mono text-[9px] text-[#7A263A]">0{i + 1}</span>{x}
                  </div>
                ))}
              </div>
            </div>

            <div className="py-10 lg:pl-14">
              <div className="border-y-2 border-[#1F3044] py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Tellme is listening</p>
                    <p className="text-[10px] uppercase tracking-[.16em] text-[#70685E]">Reddit thread · 14 min read</p>
                  </div>
                  <span className="text-xs text-[#7A263A]">02:41</span>
                </div>
                <div className="py-10">
                  <div className="mx-auto flex h-28 items-center justify-center gap-1">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div key={i} className="w-1 bg-[#7A263A]/65" style={{ height: 16 + Math.abs(Math.sin(i * 1.7)) * 65 + "px" }} />
                    ))}
                  </div>
                  <p className="vintage-serif mx-auto max-w-md text-center text-2xl leading-8 text-[#1F3044]">
                    &quot;Most commenters agree on the outcome — they disagree on why it works.&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-[#C9BBA7] pt-4">
                  <span className="text-xs text-[#70685E]">1.5×</span>
                  <div className="flex items-center gap-3">
                    <button className="text-xs text-[#70685E]">↶</button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7A263A] text-white"><Play size={14} fill="currentColor" /></button>
                    <button className="text-xs text-[#70685E]">↷</button>
                  </div>
                  <span className="text-xs text-[#70685E]">Ask ↗</span>
                </div>
              </div>
              <p className="magazine-caption mt-3 text-[#70685E]">A listening desk for the pages you never have time to finish.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 pt-10 lg:px-10">
        <div className="mx-auto max-w-[1400px] border-y-2 border-[#1F3044] bg-[#1F3044] px-7 py-20 text-center text-white sm:px-10 lg:py-28">
          <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-4 text-[9px] uppercase tracking-[.2em] text-white/45">
            <span>The Tellme Review</span><span>Final page</span><span>2026</span>
          </div>
          <p className="magazine-kicker text-[#B08D57]">Your next tab can wait</p>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.55 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.16, delayChildren: 0.08 } },
            }}
            className="vintage-serif mt-5 text-5xl leading-[.95] sm:text-7xl"
          >
            <span className="block overflow-hidden">
              <motion.span
                variants={{
                  hidden: { y: "105%", opacity: 0 },
                  visible: { y: "0%", opacity: 1 },
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Hear what matters.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                variants={{
                  hidden: { y: "105%", opacity: 0 },
                  visible: { y: "0%", opacity: 1 },
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block text-white/45"
              >
                Keep doing what matters.
              </motion.span>
            </span>
          </motion.h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/50">
            Tellme is being built for people who want to stay curious without putting everything else on pause.
          </p>
          <div className="mt-9">
            <Button size="lg">Get early access <ArrowRight size={17} className="ml-2" /></Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t-2 border-[#1F3044]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-10 sm:grid-cols-3 sm:items-center lg:px-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#1F3044]">
              <span className="absolute top-[7px] h-px w-5 bg-[#F3EBDD]" />
              <span className="absolute top-[12px] h-px w-5 bg-[#F3EBDD]" />
              <span className="absolute top-[17px] h-px w-5 bg-[#F3EBDD]" />
              <span className="absolute top-[22px] h-px w-5 bg-[#F3EBDD]" />
            </span>
            <span className="vintage-serif text-lg">tellme.</span>
          </div>
          <div className="flex gap-6 text-xs text-[#70685E]">
            <a href="#" className="hover:text-[#1F3044]">Privacy</a>
            <a href="#" className="hover:text-[#1F3044]">Terms</a>
            <a href="https://github.com/chaitanya-92/Tellme" className="hover:text-[#1F3044]">GitHub</a>
          </div>
          <p className="text-right text-[9px] uppercase tracking-[.18em] text-[#70685E]">© 2026 Tellme · The web, spoken.</p>
        </div>
      </footer>
    </main>
  );
}
