import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Logo, LogoMark } from "@/components/iv/Logo";
import { Quiz, icons } from "@/components/iv/Quiz";
import { personalities, pOrder, booths, zones } from "@/components/iv/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "INVESTVERSE – اكتشف شخصيتك الاستثمارية" },
      { name: "description", content: "اختبار تفاعلي من ٩ أسئلة يكشف شخصيتك الاستثمارية ويرشدك إلى البوث المناسب." },
      { property: "og:title", content: "INVESTVERSE – اكتشف شخصيتك الاستثمارية" },
      { property: "og:description", content: "٩ أسئلة · دقيقتان. اكتشف أي نوع من المستثمرين أنت." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;

/** يظهر العنصر بهدوء من الأسفل أول ما يدخل الشاشة. */
function Reveal({ i = 0, className = "", children }: { i?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease, delay: (i % 3) * 0.09 }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ tag, title, dark }: { tag: string; title: string; dark?: boolean }) {
  return (
    <Reveal className="mb-12 text-center md:mb-16">
      <div className={`font-latin text-xs font-semibold tracking-[0.35em] ${dark ? "text-primary" : "text-mint-deep"}`}>
        {tag}
      </div>
      <h2 className="mt-3 text-3xl font-bold md:text-5xl">{title}</h2>
    </Reveal>
  );
}

const Num = ({ n }: { n: string }) => (
  <span className="inline-flex rounded-full bg-primary px-4 py-1 font-latin text-sm font-bold text-primary-foreground">
    {n}
  </span>
);

function CTA({ onClick, children, ghost }: { onClick: () => void; children: ReactNode; ghost?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`min-h-14 rounded-full px-9 text-lg font-semibold ${
        ghost
          ? "border-2 border-deep-foreground/25 text-deep-foreground hover:border-primary"
          : "bg-primary text-primary-foreground shadow-card-hover"
      }`}
    >
      {children}
    </motion.button>
  );
}

const panel = "mx-2 rounded-[2rem] md:mx-3 md:rounded-[3rem]";
const card =
  "h-full rounded-[1.75rem] p-7 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover";
const nav = [
  ["idea", "الفكرة"],
  ["personas", "الشخصيات"],
  ["booths", "البوثات"],
];

function Index() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  const start = () => setOpen(true);
  const close = useCallback((home?: boolean) => {
    setOpen(false);
    if (home) window.scrollTo({ top: 0 });
  }, []);
  const title = "اكتشف شخصيتك الاستثمارية".split(" ");

  // المحتوى الرئيسي ينسحب ويخفت بهدوء مع النزول
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroO = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-4 z-40 px-4 md:top-6">
        <div
          className={`mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full py-2 pe-2 ps-5 text-deep-foreground transition-all duration-500 ${
            scrolled ? "bg-deep/85 shadow-card-hover backdrop-blur-xl" : "bg-transparent"
          }`}
        >
          <a href="#top" aria-label="INVESTVERSE" className="rounded-full">
            <Logo />
          </a>
          <nav className="hidden gap-8 md:flex">
            {nav.map(([id, l]) => (
              <a key={id} href={`#${id}`} className="rounded-full text-deep-foreground/75 transition hover:text-primary">
                {l}
              </a>
            ))}
          </nav>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={start}
            className="min-h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
          >
            ابدأ الاختبار
          </motion.button>
        </div>
      </header>

      <main id="top" className="pt-2 md:pt-3">
        <section
          ref={hero}
          className={`${panel} relative flex min-h-[calc(100svh-1rem)] flex-col items-center justify-center overflow-hidden bg-deep-gradient px-5 pb-24 pt-28 text-center text-deep-foreground md:min-h-[calc(100svh-1.5rem)]`}
        >
          <div aria-hidden className="blob -top-24 start-[-8%] h-80 w-80 bg-primary/25" />
          <div aria-hidden className="blob blob-slow bottom-[-18%] end-[-8%] h-96 w-96 bg-mint-soft/15" />

          <motion.div style={{ y: heroY, opacity: heroO }} className="relative flex flex-col items-center gap-10">
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
                className="mt-4 text-xl text-mint-soft"
              >
                ٩ أسئلة · دقيقتان
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.6, ease }}
                className="mt-9 flex flex-wrap justify-center gap-4"
              >
                <CTA onClick={start}>ابدأ الاختبار</CTA>
                <CTA ghost onClick={() => document.getElementById("personas")?.scrollIntoView()}>
                  تعرّف على الشخصيات
                </CTA>
              </motion.div>
            </div>
          </motion.div>

          <motion.a
            href="#idea"
            className="absolute bottom-7 flex flex-col items-center rounded-full text-sm text-deep-foreground/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          >
            مرّر للاكتشاف <ChevronDown />
          </motion.a>
        </section>

        <section id="idea" className="scroll-mt-24 px-5 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto mb-14 max-w-4xl text-center md:mb-20">
              <div className="text-sm font-semibold text-mint-deep">الفكرة</div>
              <h2 className="mt-4 text-balance text-2xl font-bold leading-relaxed md:text-4xl md:leading-relaxed">
                تدخل وأنت لا تعرف الكثير عن الاستثمار، وتخرج وأنت تعرف{" "}
                <span className="text-mint-deep">كيف تبدأ، وأين تستثمر، وكيف تحمي أموالك</span>
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {zones.map((z, i) => (
                <Reveal key={z.n} i={i}>
                  <div
                    className={`${card} ${
                      i === 2 ? "bg-deep text-deep-foreground shadow-card-hover" : "bg-card shadow-card"
                    }`}
                  >
                    <div className="font-latin text-4xl font-bold text-primary">{z.n}</div>
                    <div className="mt-5 text-2xl font-bold">{z.name}</div>
                    <p className={`mt-2 ${i === 2 ? "text-deep-foreground/75" : "text-muted-foreground"}`}>{z.goal}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="personas" className={`${panel} scroll-mt-24 bg-mint-tint px-5 py-20 md:py-28`}>
          <div className="mx-auto max-w-6xl">
            <Heading tag="5 PERSONALITIES" title="الشخصيات الخمس" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {pOrder.map((k, i) => {
                const p = personalities[k];
                const I = icons[p.icon as keyof typeof icons];
                return (
                  <Reveal key={k} i={i}>
                    <div className={`${card} bg-card text-center shadow-card`}>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-deep text-primary">
                        <I className="h-7 w-7" />
                      </div>
                      <div className="mt-5 text-xl font-bold">{p.name}</div>
                      <p className="mt-2 text-muted-foreground">{p.line}</p>
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
          className={`${panel} relative scroll-mt-24 overflow-hidden bg-deep-gradient px-5 py-20 text-deep-foreground md:py-28`}
        >
          <div aria-hidden className="blob blob-slow -top-32 end-[10%] h-80 w-80 bg-primary/15" />
          <div className="relative mx-auto max-w-6xl">
            <Heading dark tag="BOOTHS" title="البوثات" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {booths.map((b, i) => (
                <Reveal key={b.name} i={i}>
                  <div className={`${card} border border-deep-foreground/10 bg-deep-foreground/[0.06]`}>
                    <Num n={`0${i + 1}`} />
                    <div className="mt-5 text-xl font-bold">{b.name}</div>
                    <p className="mt-2 text-deep-foreground/70">{b.msg}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:py-32">
          <Reveal className="flex flex-col items-center text-center">
            <LogoMark className="h-16 w-16 text-deep" />
            <h2 className="mt-6 text-4xl font-bold md:text-6xl">جاهز تعرف شخصيتك؟</h2>
            <p className="mt-3 text-lg text-muted-foreground">٩ أسئلة · دقيقتان</p>
            <div className="mt-9">
              <CTA onClick={start}>ابدأ الاختبار</CTA>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className={`${panel} mb-2 bg-deep px-5 py-12 text-deep-foreground md:mb-3`}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <Logo />
          <p className="text-sm text-deep-foreground/55">
            هذا الاختبار لأغراض تثقيفية فقط ولا يُعد توصية أو نصيحة استثمارية.
          </p>
        </div>
      </footer>

      <AnimatePresence>{open && <Quiz onClose={close} />}</AnimatePresence>
    </MotionConfig>
  );
}
