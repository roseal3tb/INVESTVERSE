import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Logo, LogoMark } from "@/components/iv/Logo";
import { Quiz } from "@/components/iv/Quiz";
import { personalities, pOrder, booths, zones } from "@/components/iv/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "INVESTVERSE – اكتشف شخصيتك الاستثمارية" },
      {
        name: "description",
        content: "١٣ سؤال من مواقف الحياة اليومية تكشف شخصيتك الاستثمارية من بين عشر شخصيات.",
      },
      { property: "og:title", content: "INVESTVERSE – اكتشف شخصيتك الاستثمارية" },
      { property: "og:description", content: "١٣ سؤال · ٣ دقائق. اكتشف أي نوع من المستثمرين أنت." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;

// ───── تمرير ناعم ─────
let raf = 0;
const stopScroll = () => {
  cancelAnimationFrame(raf);
  raf = 0;
};
/** تمرير ناعم إلى قسم في الصفحة، مع ترك مساحة للترويسة العائمة. يتوقف لو الزائر مرّر بنفسه. */
function go(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  stopScroll();
  const from = window.scrollY;
  const to = id === "top" ? 0 : Math.max(0, el.getBoundingClientRect().top + from - 96);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, to);
    return;
  }
  const dur = Math.min(1400, Math.max(700, Math.abs(to - from) * 0.5));
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / dur);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, from + (to - from) * e);
    raf = t < 1 ? requestAnimationFrame(step) : 0;
  };
  raf = requestAnimationFrame(step);
}
const jump = (id: string) => (e: { preventDefault: () => void }) => {
  e.preventDefault();
  go(id);
};

// ───── عناصر مشتركة ─────
/** يظهر العنصر بهدوء من الأسفل أول ما يدخل الشاشة. */
function Reveal({
  i = 0,
  className = "",
  children,
}: {
  i?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease, delay: i * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ tag, title, dark }: { tag: string; title: string; dark?: boolean }) {
  return (
    <Reveal className="mb-12 text-center md:mb-16">
      <div
        dir="ltr"
        className={`font-latin text-xs font-semibold tracking-[0.35em] ${dark ? "text-primary" : "text-mint-deep"}`}
      >
        {tag}
      </div>
      <h2 className="mt-3 text-3xl font-bold md:text-5xl">{title}</h2>
      <motion.span
        className="mx-auto mt-6 block h-1.5 w-16 rounded-full bg-primary"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
      />
    </Reveal>
  );
}

const Num = ({ n }: { n: string }) => (
  <span className="inline-flex rounded-full bg-primary px-4 py-1 font-latin text-sm font-bold text-primary-foreground">
    {n}
  </span>
);

function CTA({
  onClick,
  children,
  ghost,
}: {
  onClick: () => void;
  children: ReactNode;
  ghost?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`press min-h-14 rounded-full px-9 text-lg font-semibold ${
        ghost
          ? "border-2 border-deep-foreground/25 text-deep-foreground hover:border-primary hover:bg-deep-foreground/10"
          : "bg-primary text-primary-foreground shadow-card-hover"
      }`}
    >
      {children}
    </button>
  );
}

/** علامة الشعار كخلفية باهتة، مثل ما تظهر في ملف الهوية. */
const Watermark = ({ className }: { className: string }) => (
  <img
    src="/brand/mark-on-dark.png"
    alt=""
    aria-hidden
    className={`pointer-events-none absolute w-auto select-none opacity-[0.07] ${className}`}
  />
);

/** شريط متحرك بأسماء الشخصيات. */
function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div dir="ltr" aria-hidden className={`marquee ${reverse ? "marquee-rev" : ""}`}>
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            dir="rtl"
            className="me-4 whitespace-nowrap rounded-full border-2 border-border bg-card px-6 py-2.5 text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const panel = "mx-2 rounded-[2rem] md:mx-3 md:rounded-[3rem]";
const card = "lift h-full rounded-[1.75rem] border-2 p-7";
const nav = [
  ["idea", "الفكرة"],
  ["personas", "الشخصيات"],
  ["booths", "البوثات"],
] as const;

function Index() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const f = () => {
      setScrolled(window.scrollY > 40);
      // القسم الحالي = آخر قسم تجاوز أعلاه ثلث الشاشة
      let cur = "";
      for (const [id] of nav) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) cur = id;
      }
      setActive(cur);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    window.addEventListener("resize", f);
    // أي تمرير يدوي يوقف التمرير الآلي، و touchstart يفعّل حالة الضغط (:active) على آيباد
    const ev = ["wheel", "touchstart", "keydown"] as const;
    ev.forEach((e) => window.addEventListener(e, stopScroll, { passive: true }));
    return () => {
      window.removeEventListener("scroll", f);
      window.removeEventListener("resize", f);
      ev.forEach((e) => window.removeEventListener(e, stopScroll));
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const start = () => {
    stopScroll();
    setOpen(true);
  };
  const close = useCallback((home?: boolean) => {
    setOpen(false);
    if (home) window.scrollTo({ top: 0 });
  }, []);
  const title = "اكتشف شخصيتك الاستثمارية".split(" ");
  const names = pOrder.map((k) => personalities[k].name);

  // محتوى الواجهة ينسحب ويخفت بهدوء مع النزول
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroO = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-4 z-40 px-4 md:top-6">
        <div
          className={`mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full py-2 pe-2 ps-5 text-deep-foreground transition-all duration-500 ${
            scrolled ? "bg-deep/85 shadow-card-hover backdrop-blur-xl" : "bg-transparent"
          }`}
        >
          <a
            href="#top"
            onClick={jump("top")}
            aria-label="INVESTVERSE"
            className="press inline-flex rounded-full"
          >
            <Logo />
          </a>
          <nav className="hidden gap-1 md:flex" aria-label="أقسام الصفحة">
            {nav.map(([id, l]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={jump(id)}
                aria-current={active === id ? "true" : undefined}
                className={`press relative inline-flex rounded-full px-5 py-2 hover:text-primary ${
                  active === id
                    ? "text-primary"
                    : "text-deep-foreground/80 hover:bg-deep-foreground/10"
                }`}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-deep-foreground/15"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l}</span>
              </a>
            ))}
          </nav>
          <button
            onClick={start}
            className="press min-h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
          >
            ابدأ الاختبار
          </button>
        </div>
      </header>

      <main id="top" className="pt-2 md:pt-3">
        <section
          ref={hero}
          className={`${panel} relative flex min-h-[calc(100svh-1rem)] flex-col items-center justify-center overflow-hidden bg-deep-gradient px-5 pb-24 pt-24 text-center md:pt-28 text-deep-foreground md:min-h-[calc(100svh-1.5rem)]`}
        >
          <div aria-hidden className="blob -top-24 start-[-8%] h-80 w-80 bg-primary/20" />
          <div
            aria-hidden
            className="blob blob-slow bottom-[-18%] start-[30%] h-96 w-96 bg-mint-soft/10"
          />
          <motion.div aria-hidden style={{ y: markY }} className="absolute inset-0">
            <Watermark className="-bottom-20 -end-16 h-[22rem] md:h-[34rem]" />
          </motion.div>

          <motion.div
            style={{ y: heroY, opacity: heroO }}
            className="relative flex flex-col items-center gap-7 md:gap-9"
          >
            <Logo size="lg" />
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                {title.map((w, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease }}
                  >
                    {w}&nbsp;
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-4 text-lg text-mint-soft md:text-xl"
              >
                ١٣ سؤال من حياتك اليومية · ٣ دقائق
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.6, ease }}
                className="mt-9 flex flex-wrap justify-center gap-4"
              >
                <CTA onClick={start}>ابدأ الاختبار</CTA>
                <CTA ghost onClick={() => go("personas")}>
                  تعرّف على الشخصيات
                </CTA>
              </motion.div>
            </div>
          </motion.div>

          <motion.a
            href="#idea"
            onClick={jump("idea")}
            className="absolute bottom-7 flex flex-col items-center rounded-full text-sm text-deep-foreground/60 transition-colors hover:text-primary"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          >
            مرّر للاكتشاف <ChevronDown />
          </motion.a>
        </section>

        <section id="idea" className="px-5 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto mb-14 max-w-4xl text-center md:mb-20">
              <div className="text-sm font-semibold text-mint-deep">الفكرة</div>
              <h2 className="mt-4 text-balance text-2xl font-bold leading-relaxed md:text-4xl md:leading-relaxed">
                تدخل وأنت لا تعرف الكثير عن الاستثمار، وتخرج وأنت تعرف{" "}
                <span className="text-mint-deep">كيف تبدأ، وأين تستثمر، وكيف تحمي أموالك</span>
              </h2>
            </Reveal>
            <div className="grid gap-9 md:grid-cols-3 md:gap-6">
              {zones.map((z, i) => (
                <Reveal
                  key={z.n}
                  i={i}
                  className={`relative ${i === 0 ? "z-20" : i === 1 ? "z-10" : ""}`}
                >
                  <div
                    className={`${card} ${
                      i === 2
                        ? "border-deep bg-deep text-deep-foreground shadow-card-hover"
                        : "border-card bg-card shadow-card"
                    }`}
                  >
                    <div className="font-latin text-4xl font-bold text-primary">{z.n}</div>
                    <div className="mt-5 text-2xl font-bold">{z.name}</div>
                    <p
                      className={`mt-2 ${i === 2 ? "text-deep-foreground/75" : "text-muted-foreground"}`}
                    >
                      {z.goal}
                    </p>
                  </div>
                  {i < 2 && (
                    <span
                      aria-hidden
                      className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card max-md:inset-x-0 max-md:-bottom-[2.1rem] max-md:mx-auto md:-end-[1.9rem] md:top-1/2 md:-translate-y-1/2"
                    >
                      <ChevronDown className="h-5 w-5 md:rotate-90" />
                    </span>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="personas" className={`${panel} bg-mint-tint px-5 py-20 md:py-28`}>
          <div className="mx-auto max-w-6xl">
            <Heading tag="10 PERSONALITIES" title="الشخصيات العشر" />
            <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-5">
              {pOrder.map((k, i) => {
                const p = personalities[k];
                return (
                  <Reveal key={k} i={i % 5}>
                    <div
                      className={`${card} flex flex-col items-center border-card bg-card px-4 text-center shadow-card md:px-6`}
                    >
                      <span className="whitespace-nowrap rounded-full bg-deep px-3 py-1 text-xs text-deep-foreground md:px-4 md:text-sm">
                        {p.trait}
                      </span>
                      <span className="mt-5 text-balance text-lg font-bold leading-snug md:text-xl">
                        {p.name}
                      </span>
                      <span className="mt-3 text-sm text-muted-foreground">{p.risk}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <div className="py-3 md:py-4" />

        <section
          id="booths"
          className={`${panel} relative overflow-hidden bg-deep-gradient px-5 py-20 text-deep-foreground md:py-28`}
        >
          <div aria-hidden className="blob blob-slow -top-32 end-[10%] h-80 w-80 bg-primary/15" />
          <Watermark className="-bottom-24 -start-16 h-[20rem] md:h-[30rem]" />
          <div className="relative mx-auto max-w-6xl">
            <Heading dark tag="BOOTHS" title="البوثات" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {booths.map((b, i) => (
                <Reveal key={b.name} i={i % 3}>
                  <div
                    className={`${card} border-deep-foreground/10 bg-deep-foreground/[0.06] hover:bg-deep-foreground/10`}
                  >
                    <Num n={`0${i + 1}`} />
                    <div className="mt-5 text-xl font-bold">{b.name}</div>
                    <p className="mt-2 text-deep-foreground/70">{b.msg}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <Reveal>
            <Marquee items={names} />
          </Reveal>
          <Reveal className="flex flex-col items-center px-5 py-14 text-center md:py-16">
            <LogoMark tone="light" className="h-24" />
            <h2 className="mt-7 text-4xl font-bold md:text-6xl">جاهز تعرف شخصيتك؟</h2>
            <p className="mt-3 text-lg text-muted-foreground">١٣ سؤال · ٣ دقائق</p>
            <div className="mt-9">
              <CTA onClick={start}>ابدأ الاختبار</CTA>
            </div>
          </Reveal>
          <Reveal>
            <Marquee items={[...names].reverse()} reverse />
          </Reveal>
        </section>
      </main>

      <footer
        className={`${panel} relative mb-2 overflow-hidden bg-deep px-5 py-12 text-deep-foreground md:mb-3`}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <Logo />
          <p className="text-sm text-deep-foreground/55">
            النتيجة للتوعية والمتعة، وما هي نصيحة استثمارية.
          </p>
        </div>
      </footer>

      <AnimatePresence>{open && <Quiz onClose={close} />}</AnimatePresence>
    </MotionConfig>
  );
}
