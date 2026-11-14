import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/iv/Logo";
import { Quiz, icons } from "@/components/iv/Quiz";
import { personalities, pOrder, booths } from "@/components/iv/data";

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
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const pop = { hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease } } };

function Section({ id, dark, children }: { id?: string; dark?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-20 md:py-28 ${dark ? "bg-deep-gradient text-deep-foreground" : "bg-background text-foreground"}`}>
      <motion.div className="mx-auto max-w-6xl" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
        {children}
      </motion.div>
    </section>
  );
}
function Heading({ tag, title }: { tag: string; title: string }) {
  return (
    <motion.div variants={fadeUp} className="mb-12 text-center">
      <div className="font-latin text-xs font-semibold tracking-[0.35em] text-primary">{tag}</div>
      <h2 className="mt-3 text-3xl font-bold md:text-5xl">{title}</h2>
    </motion.div>
  );
}
const Num = ({ n }: { n: string }) => (
  <motion.span variants={pop} className="inline-flex rounded-full bg-primary px-4 py-1 font-latin text-sm font-bold text-primary-foreground">{n}</motion.span>
);
const lift = { whileHover: { y: -6 }, whileTap: { y: -4, scale: 0.99 } };
function CTA({ onClick, children, ghost }: { onClick: () => void; children: ReactNode; ghost?: boolean }) {
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
      className={`min-h-14 rounded-full px-8 text-lg font-semibold transition ${ghost ? "border-2 border-deep-foreground/30 text-deep-foreground hover:border-primary" : "bg-primary text-primary-foreground shadow-card-hover"}`}>
      {children}
    </motion.button>
  );
}

const nav = [["about", "عن الاختبار"], ["how", "كيف يعمل"], ["personas", "الشخصيات"], ["journey", "الرحلة"], ["booths", "البوثات"]];

function Index() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const start = () => setOpen(true);
  const close = useCallback((home?: boolean) => { setOpen(false); if (home) window.scrollTo({ top: 0 }); }, []);
  const title = "اكتشف شخصيتك الاستثمارية".split(" ");

  const tl = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: tl, offset: ["start 80%", "end 60%"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <MotionConfig reducedMotion="user">
      <header className={`fixed inset-x-0 top-0 z-40 transition-all ${scrolled ? "bg-deep/80 py-2 shadow-card backdrop-blur-md" : "py-4"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top"><Logo /></a>
          <nav className="hidden gap-6 lg:flex">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} className="text-deep-foreground/80 transition hover:text-primary">{l}</a>)}
          </nav>
          <motion.button whileTap={{ scale: 0.95 }} onClick={start} className="min-h-11 rounded-full bg-primary px-5 font-semibold text-primary-foreground">ابدأ الاختبار</motion.button>
        </div>
      </header>

      <main id="top">
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 bg-deep-gradient px-5 pb-24 pt-28 text-center text-deep-foreground">
          <Logo size="lg" />
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              className="mx-auto mb-4 inline-flex rounded-full border border-primary/40 px-4 py-1 text-sm text-mint-soft">
              <span className="font-latin">INVESTVERSE</span>&nbsp;· عالم الاستثمار
            </motion.div>
            <h1 className="text-4xl font-bold md:text-7xl">
              {title.map((w, i) => (
                <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 + i * 0.12, duration: 0.5, ease }}>{w}&nbsp;</motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-4 text-xl text-mint-soft">٩ أسئلة · دقيقتان</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.35, duration: 0.5 }} className="mt-8 flex flex-wrap justify-center gap-4">
              <CTA onClick={start}>ابدأ الاختبار</CTA>
              <CTA ghost onClick={() => document.getElementById("personas")?.scrollIntoView()}>تعرّف على الشخصيات</CTA>
            </motion.div>
          </div>
          <motion.a href="#about" className="absolute bottom-6 flex flex-col items-center text-sm text-deep-foreground/70"
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
            مرّر للاكتشاف <ChevronDown />
          </motion.a>
        </section>

        <Section id="about">
          <Heading tag="ABOUT" title="عن الاختبار" />
          <motion.p variants={fadeUp} className="mx-auto max-w-3xl text-center text-xl leading-loose text-muted-foreground md:text-2xl">
            تجربة تثقيفية تفاعلية؛ تدخل وأنت لا تعرف الكثير عن الاستثمار، وتخرج وأنت تعرف كيف تبدأ، وأين تستثمر، وكيف تحمي أموالك.
          </motion.p>
        </Section>

        <Section id="how" dark>
          <Heading tag="HOW IT WORKS" title="كيف يعمل" />
          <div className="grid gap-6 md:grid-cols-3">
            {[["01", "ANSWER", "أجب عن ٩ أسئلة"], ["02", "DISCOVER", "اكتشف شخصيتك"], ["03", "EXPLORE", "زر البوث المناسب لك"]].map(([n, t, l]) => (
              <motion.div key={n} variants={fadeUp} {...lift} className="rounded-3xl bg-card p-8 text-card-foreground shadow-card transition-shadow hover:shadow-card-hover">
                <Num n={n} />
                <div className="mt-6 font-latin text-xs tracking-[0.3em] text-muted-foreground">{t}</div>
                <div className="mt-2 text-2xl font-bold">{l}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="personas">
          <Heading tag="5 PERSONALITIES" title="الشخصيات الخمس" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {pOrder.map((k) => { const p = personalities[k]; const I = icons[p.icon as keyof typeof icons]; return (
              <motion.div key={k} variants={fadeUp} {...lift} className="rounded-3xl bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-deep text-primary"><I className="h-7 w-7" /></div>
                <div className="mt-5 text-xl font-bold">{p.name}</div>
                <p className="mt-2 border-s-2 border-primary ps-3 text-muted-foreground">{p.line}</p>
              </motion.div>); })}
          </div>
        </Section>

        <Section id="journey" dark>
          <Heading tag="THE JOURNEY" title="الرحلة" />
          <div ref={tl} className="relative mx-auto max-w-2xl">
            <div className="absolute inset-y-0 start-6 w-0.5 bg-deep-foreground/15" />
            <motion.div style={{ height: lineH }} className="absolute start-6 top-0 w-0.5 bg-primary" />
            {[["01", "افهم قبل أن تستثمر"], ["02", "اكتشف الفرص الاستثمارية"], ["03", "كن مستثمرًا"]].map(([n, l]) => (
              <motion.div key={n} variants={fadeUp} className="relative flex items-center gap-6 py-8">
                <motion.div variants={pop} className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-latin font-bold text-primary-foreground">{n}</motion.div>
                <div className="text-2xl font-bold md:text-3xl">{l}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="booths">
          <Heading tag="BOOTHS" title="البوثات" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {booths.map((b, i) => (
              <motion.div key={b.name} variants={fadeUp} {...lift} className="flex flex-col rounded-3xl bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover">
                <div><Num n={`0${i + 1}`} /></div>
                <div className="mt-4 text-xl font-bold">{b.name}</div>
                <div className="mt-4 rounded-2xl bg-deep p-4 text-deep-foreground">
                  <div className="text-xs font-semibold text-primary">الرسالة</div>
                  <p className="mt-1">{b.msg}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section dark>
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-4xl font-bold md:text-6xl">جاهز تعرف شخصيتك؟</h2>
            <div className="mt-8"><CTA onClick={start}>ابدأ الاختبار</CTA></div>
          </motion.div>
        </Section>
      </main>

      <footer className="border-t border-deep-foreground/10 bg-deep px-5 py-10 text-deep-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <Logo />
          <div className="flex flex-wrap justify-center gap-5 text-deep-foreground/75">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} className="hover:text-primary">{l}</a>)}
          </div>
          <p className="text-sm text-deep-foreground/60">هذا الاختبار لأغراض تثقيفية فقط ولا يُعد توصية أو نصيحة استثمارية.</p>
        </div>
      </footer>

      <AnimatePresence>{open && <Quiz onClose={close} />}</AnimatePresence>
    </MotionConfig>
  );
}
