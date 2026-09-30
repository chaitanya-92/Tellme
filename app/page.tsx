"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Headphones,
  MessageCircle,
  Play,
  Sparkles,
  Volume2,
  Zap,
  Cookie,
  Mic,
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

const waveformHeights = [
  22, 34, 48, 29, 58, 72, 41, 64, 31, 52, 78, 44, 67, 36, 59, 74, 28, 47, 69, 38, 61,
  76, 43, 55, 30, 68, 49, 73, 35, 57, 80, 42, 63, 27, 51, 70, 39, 60, 75, 33, 54, 66, 45
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [orbOffset, setOrbOffset] = useState({ x: 0, y: 0 });
  const [showConversation, setShowConversation] = useState(false);
  const [cookieChoice, setCookieChoice] = useState<"unset" | "accepted" | "rejected">("unset");
  const orbGuideRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeTargetRef = useRef(0);
  const marqueePositionRef = useRef(0);
  const marqueeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const animateMarquee = () => {
      const element = marqueeRef.current;
      if (element) {
        const loopWidth = element.scrollWidth / 2;

        if (loopWidth > 0) {
          const target = marqueeTargetRef.current;
          const current = marqueePositionRef.current;
          const next = current + (target - current) * 0.12;

          marqueePositionRef.current = Math.abs(target - next) < 0.08 ? target : next;
          const wrapped = ((marqueePositionRef.current % loopWidth) + loopWidth) % loopWidth;

          element.style.transform = `translate3d(${-wrapped}px, 0, 0)`;
        }
      }

      marqueeFrameRef.current = window.requestAnimationFrame(animateMarquee);
    };

    marqueeFrameRef.current = window.requestAnimationFrame(animateMarquee);

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (delta !== 0) {
        // Follow the page direction: scroll down → marquee moves right, scroll up → left.
        marqueeTargetRef.current -= delta * 0.34;
      }

      lastScrollY = currentScrollY;
      setIsScrolled(currentScrollY > 48);
    };

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
      if (marqueeFrameRef.current !== null) {
        window.cancelAnimationFrame(marqueeFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("tellme-cookie-choice");
    if (saved === "accepted" || saved === "rejected") {
      setCookieChoice(saved);
      return;
    }

    const timer = window.setTimeout(() => setCookieChoice("unset"), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const chooseCookies = (choice: "accepted" | "rejected") => {
    window.localStorage.setItem("tellme-cookie-choice", choice);
    setCookieChoice(choice);
  };

  return (
    <main className="vintage-paper min-h-screen overflow-hidden text-[#262522] selection:bg-[#9A3038]/15">
      <div className="pointer-events-none fixed left-0 top-[47%] z-0 h-px w-[43%] dashed-path opacity-80" />
      <div className="pointer-events-none fixed right-0 top-[59%] z-0 h-px w-[31%] dashed-path opacity-80" />
      <div className="pointer-events-none fixed bottom-0 left-[50%] z-0 h-48 dashed-path-vertical opacity-70" />

      <motion.nav
        initial={false}
        animate={{
          top: isScrolled ? 10 : 0,
          left: isScrolled ? 18 : 0,
          right: isScrolled ? 18 : 0,
          y: isScrolled ? [0, -10, 2, 0] : 0,
          scaleX: isScrolled ? [1, 1.018, 0.994, 1] : 1,
          scaleY: isScrolled ? [1, 0.94, 1.008, 1] : 1,
          rotateX: isScrolled ? [0, 1.2, -0.35, 0] : 0,
          rotateZ: isScrolled ? [0, -0.35, 0.08, 0] : 0,
        }}
        transition={{
          top: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
          left: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
          right: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 0.72, ease: [0.12, 0.8, 0.2, 1] },
          scaleX: { duration: 0.72, ease: [0.12, 0.8, 0.2, 1] },
          scaleY: { duration: 0.72, ease: [0.12, 0.8, 0.2, 1] },
          rotateX: { duration: 0.72, ease: [0.12, 0.8, 0.2, 1] },
          rotateZ: { duration: 0.72, ease: [0.12, 0.8, 0.2, 1] },
        }}
        style={{ transformOrigin: "top center", perspective: 900 }}
        className={`fixed z-50 ${isScrolled ? "mx-auto max-w-[1040px]" : "w-full"}`}
      >
        <motion.div
          animate={{
            height: isScrolled ? 64 : 104,
            borderRadius: isScrolled ? 20 : 0,
            boxShadow: isScrolled
              ? [
                  "0 0 0 rgba(27,26,24,0)",
                  "0 20px 45px rgba(27,26,24,.16)",
                  "0 8px 20px rgba(27,26,24,.08)",
                  "0 14px 34px rgba(27,26,24,.12)",
                ]
              : "0 0 0 rgba(38,37,34,0)",
            backgroundColor: isScrolled ? "rgba(244,238,223,.96)" : "rgba(244,238,223,0)",
            borderColor: isScrolled ? "rgba(38,37,34,.13)" : "rgba(38,37,34,.08)",
          }}
          transition={{
            height: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
            borderRadius: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
            boxShadow: { duration: 0.78, ease: [0.12, 0.8, 0.2, 1] },
            backgroundColor: { duration: 0.42, ease: "easeOut" },
            borderColor: { duration: 0.42, ease: "easeOut" },
          }}
          className="mx-auto overflow-hidden border backdrop-blur-xl"
        >
          <div className="mx-auto grid h-full max-w-[1040px] grid-cols-[1fr_auto] items-center px-5 sm:px-7 md:grid-cols-[1fr_1fr]">
            <motion.a
              href="#"
              animate={{
                x: isScrolled ? [0, 3, 0] : 0,
                scale: isScrolled ? [1, 1.04, 1] : 1,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <motion.span
                animate={{
                  rotate: isScrolled ? [0, -8, 4, 0] : 0,
                  scale: isScrolled ? [1, 1.08, 1] : 1,
                }}
                transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#262522]"
              >
                <span className="absolute top-[8px] h-px w-6 bg-[#F4EEDF]" />
                <span className="absolute top-[13px] h-px w-6 bg-[#F4EEDF]" />
                <span className="absolute top-[18px] h-px w-6 bg-[#F4EEDF]" />
                <span className="absolute top-[23px] h-px w-6 bg-[#F4EEDF]" />
              </motion.span>
              <span className="vintage-serif text-[23px] tracking-[-.02em]">tellme.</span>
            </motion.a>

            <div className="flex h-full items-center justify-end gap-6 text-[11px] uppercase tracking-[.12em] text-[#665F56] sm:gap-8">
              <a href="#how" className="transition-all duration-300 hover:-translate-y-0.5 hover:text-[#262522]">how it works</a>
              <a href="#features" className="transition-all duration-300 hover:-translate-y-0.5 hover:text-[#262522]">features</a>
              <a href="#use-cases" className="transition-all duration-300 hover:-translate-y-0.5 hover:text-[#262522]">use cases</a>
              <Button size="sm" className="ml-2 hidden sm:inline-flex">
                Get Tellme <ArrowRight size={15} className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
      <section className="relative z-10 mx-auto min-h-[650px] max-w-[1080px] px-6 pb-16 pt-32 lg:px-8 lg:pt-36">
        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_.72fr]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7 }}
              className="mb-7 flex items-center gap-3 text-xs uppercase tracking-[.18em] text-[#665F56]"
            >
              <span className="h-px w-10 bg-[#9A3038]" />
              <span>THE WEB, SPOKEN</span>
              <span className="text-[#9D9180]">VOL. 01 · 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .8 }}
              className="vintage-serif max-w-[720px] text-balance text-[54px] leading-[.9] sm:text-[68px] lg:text-[82px]"
            >
              You found something interesting<span className="text-[#9A3038]">.</span>
              <span className="mt-3 block text-[#665F56]">Let Tellme read it.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7, delay: .1 }}
              className="magazine-dropcap mt-6 max-w-lg text-[14px] leading-6 text-[#665F56] sm:text-[15px]"
            >
              Tellme turns long threads, articles, and webpages into natural audio you can listen to while you keep working.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7, delay: .2 }}
              className="mt-7 flex flex-col gap-3 border-t border-[#262522]/15 pt-5 sm:flex-row"
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
            className="relative hidden min-h-[330px] lg:block"
          >
            <div className="absolute right-0 top-1/2 h-px w-full -translate-y-1/2 dashed-path opacity-55" />
            <div
              ref={orbGuideRef}
              className="absolute right-10 top-1/2 h-[270px] w-[270px] -translate-y-1/2 rounded-full border border-dashed border-[#9D9180]"
            />
            <div className="absolute right-[135px] top-[calc(50%-135px)] h-[270px] w-px bg-[#C8BBA5]" />
            <div className="absolute right-[135px] top-1/2 h-px w-[270px] bg-[#C8BBA5]" />

            <motion.div
              animate={{ x: orbOffset.x, y: orbOffset.y }}
              transition={{ type: "spring", stiffness: 170, damping: 18, mass: 0.55 }}
              className="absolute right-10 top-1/2 flex h-[210px] w-[210px] -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#262522] text-center text-[#F4EEDF] shadow-[0_24px_50px_rgba(27,26,24,.18)] will-change-transform"
            >
              <motion.span
                animate={{ x: orbOffset.x * 0.18, y: orbOffset.y * 0.18 }}
                transition={{ type: "spring", stiffness: 190, damping: 20 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9A3038] text-[#F4EEDF] shadow-[0_8px_18px_rgba(154,48,56,.24)]"
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
          className="relative mx-auto mt-20 max-w-[1000px]"
        >
          <div className="overflow-hidden border-y-2 border-[#262522] bg-[#F4EEDF]/60">
            <div className="flex h-11 items-center gap-2 border-b border-[#262522]/10 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#262522]/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#262522]/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#262522]/20" />
              <div className="mx-auto flex h-7 w-1/2 items-center rounded-md border border-[#262522]/10 bg-[#C8BBA5] px-3 text-[10px] text-[#665F56]">
                reddit.com/r/...
              </div>
            </div>

            <div className="grid min-h-[390px] md:grid-cols-[1fr_340px]">
              <div className="p-7 md:border-r md:border-dashed md:border-[#B8AB95] md:p-10">
                <div className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-[#665F56]">
                  <span className="h-2 w-2 rounded-full bg-[#9A3038]" /> Reddit · Discussion
                </div>
                <h3 className="vintage-serif max-w-xl text-3xl leading-tight sm:text-4xl">
                  What's something you learned way too late?
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#665F56]">
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
                      className="flex items-center gap-3 border-b border-dashed border-[#B8AB95] px-1 py-3 text-xs text-[#665F56]"
                    >
                      <span className="text-[#262522]/35">0{i + 1}</span>
                      {x}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-[#F4EEDF]/15 bg-[#262522] p-6 text-white sm:border-l sm:border-t-0 sm:p-7">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9A3038]">
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
                        className="h-8 w-[3px] origin-center rounded-full bg-[#9A3038]"
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
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9A3038] text-white">
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

      <section className="relative z-10 overflow-hidden border-y border-[#262522]/10 bg-[#DED3BF]">
        <div className="marquee-track flex w-max items-center py-7 text-[11px] font-medium tracking-[.18em] text-[#262522]" ref={marqueeRef}>
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
                  className="mx-5 inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-[3px] bg-[#F4EEDF] px-3 text-[#262522] ring-1 ring-[#B8AB95]/70 shadow-[0_2px_8px_rgba(38,56,77,.05)] lg:mx-8"
                >
                  <img src={logo} alt="" aria-hidden="true" className="h-4 w-4 object-contain opacity-90" />
                  <span>{name}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 border-y border-[#262522]/15 bg-[#DED3BF]/35">
        <div className="mx-auto max-w-[1080px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex items-end justify-between border-b-2 border-[#262522] pb-5">
            <div>
              <p className="magazine-kicker text-[#9A3038]">How it works</p>
              <p className="mt-2 text-[10px] uppercase tracking-[.18em] text-[#665F56]">Three steps · One less screen to read</p>
            </div>
            <span className="magazine-caption hidden sm:block">Page 02</span>
          </div>

          <div className="grid gap-12 pt-12 lg:grid-cols-[.78fr_1.72fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md"
            >
              <h2 className="vintage-serif text-5xl leading-[.92] sm:text-7xl">
                Stop switching between work and the web.
              </h2>
              <p className="mt-7 max-w-md text-sm leading-6 text-[#665F56]">
                Tellme sits beside your browser and turns the pages you care about into something you can consume hands-free.
              </p>

              <div className="mt-10 max-w-sm border-t border-[#262522] pt-5">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[.18em] text-[#665F56]">
                  <span>Illustration · 02</span>
                  <span>Keep moving</span>
                </div>
                <div className="relative mt-4 overflow-hidden border border-[#262522]/20 bg-[#E7DED0]">
                  <img
                    src="/editorial-listening.svg"
                    alt="Editorial illustration of a person wearing earbuds and listening while working"
                    className="block h-auto w-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[520px] overflow-hidden border border-[#262522]/15 bg-[#F7F2E8] p-5 shadow-[inset_0_0_45px_rgba(38,37,34,.05)] sm:p-8"
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(38,37,34,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(38,37,34,.055) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between border-b border-dashed border-[#B8AB95] pb-3">
                  <span className="font-mono text-[9px] uppercase tracking-[.18em] text-[#665F56]">Tellme desk · mission</span>
                  <span className="font-mono text-[9px] uppercase tracking-[.18em] text-[#9A3038]">03 steps</span>
                </div>

                <div className="relative mt-8 min-h-[425px]">
                  <div className="absolute bottom-10 left-[24px] top-10 w-px bg-[#B8AB95]" />
                  <div className="absolute bottom-10 left-[24px] top-10 w-px border-l border-dashed border-[#9A3038]/45" />

                  {steps.map((step, i) => (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, x: 22 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{
                        duration: 0.55,
                        delay: i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative mb-7 pl-14 last:mb-0"
                    >
                      <div className="absolute left-0 top-7 flex h-12 w-12 items-center justify-center rounded-full border border-[#262522]/25 bg-[#F7F2E8] shadow-[0_4px_12px_rgba(38,37,34,.08)]">
                        <span className="font-mono text-[10px] font-semibold text-[#9A3038]">{step.num}</span>
                      </div>

                      <div
                        className={[
                          "relative border border-[#262522]/15 px-6 pb-6 pt-7 shadow-[0_10px_22px_rgba(38,37,34,.09)]",
                          i === 0 ? "rotate-[-1.2deg] bg-[#E9D8A6]" : "",
                          i === 1 ? "rotate-[1deg] bg-[#F1D6A7]" : "",
                          i === 2 ? "rotate-[-.7deg] bg-[#D8E0C1]" : "",
                        ].join(" ")}
                      >
                        <span className="absolute left-1/2 top-[-7px] h-4 w-11 -translate-x-1/2 rotate-[-2deg] bg-[#F4EEDF]/90 shadow-sm" />
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-[.18em] text-[#665F56]">Mission note</span>
                          <span className="text-[9px] uppercase tracking-[.16em] text-[#665F56]">tellme.</span>
                        </div>
                        <h3 className="vintage-serif mt-4 text-2xl leading-[.98] sm:text-3xl">{step.title}</h3>
                        <p className="mt-4 max-w-lg text-xs leading-5 text-[#665F56]">{step.text}</p>
                        <div className="mt-5 flex items-center gap-2 text-[8px] uppercase tracking-[.16em] text-[#665F56]/75">
                          <span className="h-px w-8 bg-[#665F56]/40" />
                          step {i + 1} of 3
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-[#262522]/15 bg-[#F4EEDF] text-[#262522]">
        <div className="mx-auto max-w-[1080px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex items-end justify-between border-b-2 border-[#262522] pb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#9A3038]">The Tellme Review</p>
              <p className="mt-2 text-[10px] uppercase tracking-[.18em] text-[#665F56]">Audio · Attention · The web</p>
            </div>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[.22em] text-[#665F56] sm:block">Vol. 01 — 03</p>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[1.05fr_1.95fr] lg:gap-14">
            <div className="lg:border-r lg:border-dashed lg:border-[#B8AB95] lg:pr-14">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9A3038]">More than text-to-speech</p>
              <h2 className="vintage-serif mt-5 max-w-xl text-5xl leading-[.9] sm:text-7xl">
                The useful parts,<br />in your ears.
              </h2>
              <p className="mt-7 max-w-sm text-sm leading-6 text-[#665F56]">
                A quieter way to keep up with the internet without giving every interesting page your full attention.
              </p>
            </div>

            <div className="grid md:grid-cols-3">
              {features.map(({ icon: Icon, title, text }, i) => (
                <motion.article
                  key={title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: .25, ease: "easeOut" }}
                  className={`group relative py-2 md:px-7 lg:px-8 ${i > 0 ? "mt-8 border-t border-dashed border-[#B8AB95] pt-8 md:mt-0 md:border-l md:border-t-0 md:pt-2" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[.18em] text-[#665F56]">0{i + 1}</span>
                    <span className="text-[#9A3038] transition-transform duration-300 group-hover:translate-x-1">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                  </div>
                  <h3 className="vintage-serif mt-12 text-3xl leading-[1.02] sm:text-[2.15rem]">
                    {title}
                  </h3>
                  <div className="mt-5 h-px w-12 bg-[#9A3038] transition-all duration-300 group-hover:w-20" />
                  <p className="mt-5 text-sm leading-6 text-[#665F56]">{text}</p>
                  <p className="mt-10 text-[9px] uppercase tracking-[.2em] text-[#9D9180]">Tellme / 2026</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="border-t border-[#262522] pt-4 text-[9px] uppercase tracking-[.2em] text-[#665F56]">
            <div className="flex items-center justify-between gap-4">
              <span>Read less. Hear more.</span>
              <span className="hidden sm:block">A digital publication for curious minds</span>
              <span>Page 03</span>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="relative z-10 border-y border-[#262522]/15 bg-[#F4EEDF]">
        <div className="mx-auto max-w-[1080px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex items-end justify-between border-b-2 border-[#262522] pb-5">
            <div>
              <p className="magazine-kicker text-[#9A3038]">Built for real life</p>
              <p className="mt-2 text-[10px] uppercase tracking-[.18em] text-[#665F56]">What happens when the web follows you</p>
            </div>
            <span className="magazine-caption hidden sm:block">The weekend edition</span>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_.85fr]">
            <div className="py-10 lg:border-r lg:border-dashed lg:border-[#B8AB95] lg:pr-14">
              <h2 className="vintage-serif max-w-3xl text-5xl leading-[.88] sm:text-7xl">Keep your hands busy. Stay in the loop.</h2>
              <p className="magazine-dropcap mt-7 max-w-2xl text-[15px] leading-7 text-[#665F56]">
                Whether you're shipping code, studying, commuting, cooking, or moving between tasks — Tellme lets information follow you instead of the other way around.
              </p>
              <div className="mt-9 grid max-w-2xl grid-cols-2 border-t border-[#262522]">
                {["Coding & building", "Research & studying", "Long Reddit & Quora threads", "Articles you saved for later"].map((x, i) => (
                  <div key={x} className="border-b border-dashed border-[#B8AB95] py-4 pr-5 text-sm text-[#665F56]">
                    <span className="mr-3 font-mono text-[9px] text-[#9A3038]">0{i + 1}</span>{x}
                  </div>
                ))}
              </div>
            </div>

            <div className="py-10 lg:pl-14">
              <div className="border-y-2 border-[#262522] py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Tellme is listening</p>
                    <p className="text-[10px] uppercase tracking-[.16em] text-[#665F56]">Reddit thread · 14 min read</p>
                  </div>
                  <span className="text-xs text-[#9A3038]">02:41</span>
                </div>
                <div className="py-10">
                  <div className="mx-auto flex h-28 items-center justify-center gap-1">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div key={i} className="w-1 bg-[#9A3038]/65" style={{ height: `${waveformHeights[i]}px` }} />
                    ))}
                  </div>
                  <p className="vintage-serif mx-auto max-w-md text-center text-2xl leading-8 text-[#262522]">
                    &quot;Most commenters agree on the outcome — they disagree on why it works.&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-[#B8AB95] pt-4">
                  <span className="text-xs text-[#665F56]">1.5×</span>
                  <div className="flex items-center gap-3">
                    <button className="text-xs text-[#665F56]">↶</button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9A3038] text-white"><Play size={14} fill="currentColor" /></button>
                    <button className="text-xs text-[#665F56]">↷</button>
                  </div>
                  <span className="text-xs text-[#665F56]">Ask ↗</span>
                </div>
              </div>
              <p className="magazine-caption mt-3 text-[#665F56]">A listening desk for the pages you never have time to finish.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 pt-10 lg:px-8">
        <div className="mx-auto max-w-[1080px] border-y-2 border-[#262522] bg-[#262522] px-7 py-20 text-center text-white sm:px-10 lg:py-28">
          <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-4 text-[9px] uppercase tracking-[.2em] text-white/45">
            <span>The Tellme Review</span><span>Final page</span><span>2026</span>
          </div>
          <p className="magazine-kicker text-[#A47732]">Your next tab can wait</p>
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

      
      {cookieChoice === "unset" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-5 z-[70] mx-auto max-w-[800px] rounded-2xl bg-[#172131] px-5 py-5 text-white shadow-[0_20px_60px_rgba(23,33,49,.28)] sm:px-7"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-[570px]">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Cookie size={16} />
                <span>Audience measurement</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/70 sm:text-sm">
                With your permission, Tellme uses cookies to understand visits and improve the experience. You can change your choice at any time.
              </p>
              <a href="#" className="mt-2 inline-block text-xs underline underline-offset-2 text-white/80 hover:text-white">
                Privacy policy
              </a>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => chooseCookies("rejected")}
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => chooseCookies("accepted")}
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-[#172131] transition hover:bg-[#F4EEDF]"
              >
                Allow
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 border-t-2 border-[#262522]">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-6 py-10 sm:grid-cols-3 sm:items-center lg:px-8">
          <div className="flex items-center gap-3">
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#262522]">
              <span className="absolute top-[7px] h-px w-5 bg-[#F4EEDF]" />
              <span className="absolute top-[12px] h-px w-5 bg-[#F4EEDF]" />
              <span className="absolute top-[17px] h-px w-5 bg-[#F4EEDF]" />
              <span className="absolute top-[22px] h-px w-5 bg-[#F4EEDF]" />
            </span>
            <span className="vintage-serif text-lg">tellme.</span>
          </div>
          <div className="flex gap-6 text-xs text-[#665F56]">
            <a href="#" className="hover:text-[#262522]">Privacy</a>
            <a href="#" className="hover:text-[#262522]">Terms</a>
            <a href="https://github.com/chaitanya-92/Tellme" className="hover:text-[#262522]">GitHub</a>
          </div>
          <p className="text-right text-[9px] uppercase tracking-[.18em] text-[#665F56]">© 2026 Tellme · The web, spoken.</p>
        </div>
      </footer>
    </main>
  );
}
