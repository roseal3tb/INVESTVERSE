import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { LogoMark } from "./Logo";
import { ar, questions, personalities, rank, type Opt, type PKey } from "./data";

const ease = [0.22, 1, 0.36, 1] as const;
const list = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};
const optList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
};
const optItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};
const round =
  "press flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-deep-foreground/10 hover:bg-deep-foreground/20 disabled:pointer-events-none disabled:opacity-0";

// ترتيب الخيارات يتغير عشوائيًا في كل مرة يبدأ فيها الاختبار
const shuffled = (): Opt[][] =>
  questions.map((q) => {
    const o = [...q.o];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j]!, o[i]!];
    }
    return o;
  });

const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export function Quiz({ onClose }: { onClose: (home?: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PKey[]>([]);
  const [opts, setOpts] = useState(shuffled);
  const [dir, setDir] = useState(1);
  const [ready, setReady] = useState(false); // لحظة «نجهّز شخصيتك» قبل إظهار النتيجة
  const wait = useRef<ReturnType<typeof setTimeout> | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const done = step >= questions.length;
  const top = done ? rank(answers).slice(0, 3) : [];
  const result = done ? personalities[top[0]!.key] : null;

  // نُظهر الاختيار لحظة قصيرة قبل الانتقال حتى يرى الزائر ما اختاره
  const pick = useCallback(
    (p: PKey) => {
      if (wait.current || done) return;
      setDir(1);
      setAnswers((a) => [...a.slice(0, step), p]);
      wait.current = setTimeout(() => {
        wait.current = null;
        setStep((s) => s + 1);
      }, 340);
    },
    [done, step],
  );
  const back = () => {
    if (step > 0 && !wait.current && !done) {
      setDir(-1);
      setStep(step - 1);
    }
  };
  const restart = () => {
    setAnswers([]);
    setOpts(shuffled());
    setReady(false);
    setDir(1);
    setStep(0);
  };

  useEffect(
    () => () => {
      if (wait.current) clearTimeout(wait.current);
    },
    [],
  );

  // كل سؤال يبدأ من أعلى الشاشة
  useEffect(() => {
    box.current?.scrollTo({ top: 0 });
  }, [step, ready]);

  // لوحة المفاتيح: Esc للإغلاق، والأرقام ١–٥ للاختيار
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const n = Number(e.key);
      if (!done && n >= 1 && n <= 5) pick(opts[step]![n - 1]!.p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, onClose, opts, pick, step]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, [done]);

  // وضع الكشك: الرجوع للرئيسية بعد ٦٠ ثانية بدون تفاعل في شاشة النتيجة
  useEffect(() => {
    if (!ready) return;
    let t: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(t);
      t = setTimeout(() => onClose(true), 60000);
    };
    const ev = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"];
    ev.forEach((e) => window.addEventListener(e, reset, true));
    reset();
    return () => {
      clearTimeout(t);
      ev.forEach((e) => window.removeEventListener(e, reset, true));
    };
  }, [ready, onClose]);

  return (
    <motion.div
      ref={box}
      role="dialog"
      aria-modal="true"
      aria-label="اختبار الشخصية الاستثمارية"
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-deep-gradient text-deep-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex min-h-full max-w-2xl flex-col px-5 py-6 md:py-10">
        <div className="flex items-center justify-between gap-5">
          <button
            onClick={back}
            disabled={step === 0 || done}
            aria-label="السؤال السابق"
            className={round}
          >
            <ArrowRight />
          </button>
          {!done && (
            <div className="flex-1">
              <div className="mb-2 text-center text-sm text-mint-soft" aria-live="polite">
                {ar(step + 1)} / {ar(questions.length)}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-deep-foreground/10">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease }}
                />
              </div>
            </div>
          )}
          <button onClick={() => onClose()} aria-label="إغلاق" className={round}>
            <X />
          </button>
        </div>

        <div className="relative flex flex-1 items-center py-8">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                className="w-full"
                initial={{ opacity: 0, x: -50 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 * dir }}
                transition={{ duration: 0.4, ease }}
              >
                <h2 className="mb-8 text-balance text-center text-2xl font-bold leading-relaxed md:text-3xl md:leading-relaxed">
                  {questions[step]!.q}
                </h2>
                <motion.div
                  className="grid gap-3"
                  variants={optList}
                  initial="hidden"
                  animate="show"
                >
                  {opts[step]!.map((o) => {
                    const on = answers[step] === o.p;
                    return (
                      <motion.div key={o.t} variants={optItem}>
                        <button
                          onClick={() => pick(o.p)}
                          aria-pressed={on}
                          className={`lift flex min-h-16 w-full items-center gap-4 rounded-[1.5rem] border-2 px-5 py-4 text-start text-lg font-medium ${
                            on
                              ? "border-primary bg-primary/15"
                              : "border-deep-foreground/10 bg-deep-foreground/5 hover:bg-deep-foreground/10"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                              on
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-deep-foreground/30 text-transparent"
                            }`}
                          >
                            <Check />
                          </span>
                          {o.t}
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            ) : !ready ? (
              <motion.div
                key="loading"
                className="flex w-full flex-col items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                  <LogoMark className="h-24" />
                </motion.div>
                <p className="mt-8 text-xl text-mint-soft">نجهّز شخصيتك…</p>
              </motion.div>
            ) : (
              result && (
                <motion.div
                  key="result"
                  className="w-full text-center"
                  variants={list}
                  initial="hidden"
                  animate="show"
                >
                  {/* بطاقة النتيجة: مصممة لتصلح لقطة شاشة */}
                  <motion.div
                    variants={item}
                    className="relative overflow-hidden rounded-[2rem] border-2 border-primary/40 bg-deep-foreground/[0.06] px-6 py-9 md:px-10"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 160, damping: 13, delay: 0.15 }}
                    >
                      <LogoMark className="mx-auto h-16" />
                    </motion.div>
                    <div className="mt-5 text-sm font-semibold text-primary">
                      شخصيتك الاستثمارية
                    </div>
                    <h2 className="mt-2 text-balance text-4xl font-bold leading-tight md:text-5xl">
                      {result.name}
                    </h2>
                    <div className="mt-4 inline-flex rounded-full bg-primary px-5 py-1.5 font-semibold text-primary-foreground">
                      {result.trait}
                    </div>
                    <p className="mx-auto mt-5 max-w-xl text-lg text-deep-foreground/85">
                      {result.desc}
                    </p>
                  </motion.div>

                  <motion.div variants={item} className="mt-4 grid gap-4 text-start md:grid-cols-3">
                    {[
                      ["وش يميزك", result.strength],
                      ["خل بالك", result.watch],
                      ["وش يناسبك", result.fit],
                    ].map(([label, text]) => (
                      <div
                        key={label}
                        className="lift rounded-[1.5rem] border-2 border-deep-foreground/10 bg-deep-foreground/[0.06] p-5"
                      >
                        <div className="mb-2 text-sm font-semibold text-primary">{label}</div>
                        <p>{text}</p>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    variants={item}
                    className="mt-4 rounded-[1.5rem] bg-deep-foreground/[0.06] p-6 text-start"
                  >
                    <div className="mb-4 text-sm font-semibold text-primary">
                      أعلى ٣ شخصيات عندك
                    </div>
                    <div className="grid gap-4">
                      {top.map((r, i) => (
                        <div key={r.key}>
                          <div className="mb-1.5 flex items-baseline justify-between gap-3">
                            <span className="font-semibold">{personalities[r.key].name}</span>
                            <span className="text-mint-soft">{ar(r.pct)}٪</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-deep-foreground/10">
                            <motion.div
                              className={`h-full rounded-full ${i === 0 ? "bg-primary" : "bg-primary/55"}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${r.pct}%` }}
                              transition={{ duration: 0.9, delay: 0.6 + i * 0.15, ease }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={restart}
                      className="press min-h-14 rounded-full bg-primary px-10 text-lg font-semibold text-primary-foreground"
                    >
                      أعد الاختبار
                    </button>
                    <button
                      onClick={() => onClose(true)}
                      className="press min-h-14 rounded-full border-2 border-deep-foreground/25 px-10 text-lg font-semibold hover:border-primary hover:bg-deep-foreground/10"
                    >
                      الرئيسية
                    </button>
                  </motion.div>
                  <motion.p variants={item} className="mt-6 text-sm text-deep-foreground/60">
                    النتيجة للتوعية والمتعة، وما هي نصيحة استثمارية.
                  </motion.p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
