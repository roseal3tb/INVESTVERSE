import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X, Compass, Shield, Scale, Building2, Rocket } from "lucide-react";
import { questions, personalities, scoreResult, type PKey } from "./data";

export const icons = { Compass, Shield, Scale, Building2, Rocket } as const;

const ease = [0.22, 1, 0.36, 1] as const;
const list = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } };
const round =
  "flex h-12 w-12 items-center justify-center rounded-full bg-deep-foreground/10 transition hover:bg-deep-foreground/20 active:scale-95 disabled:opacity-0";

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export function Quiz({ onClose }: { onClose: (home?: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PKey[]>([]);
  const [dir, setDir] = useState(1);
  const wait = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = step >= questions.length;
  const result = done ? personalities[scoreResult(answers)] : null;

  // وضع الكشك: الرجوع للرئيسية بعد ٦٠ ثانية بدون تفاعل في شاشة النتيجة
  useEffect(() => {
    if (!done) return;
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
  }, [done, onClose]);

  useEffect(() => () => { if (wait.current) clearTimeout(wait.current); }, []);

  // نُظهر الاختيار لحظة قصيرة قبل الانتقال حتى يرى الزائر ما اختاره
  const pick = (p: PKey) => {
    if (wait.current) return;
    setDir(1);
    setAnswers([...answers.slice(0, step), p]);
    wait.current = setTimeout(() => {
      wait.current = null;
      setStep((s) => s + 1);
    }, 320);
  };
  const back = () => {
    if (step > 0 && !wait.current) {
      setDir(-1);
      setStep(step - 1);
    }
  };
  const restart = () => {
    setAnswers([]);
    setDir(1);
    setStep(0);
  };
  const Icon = result ? icons[result.icon as keyof typeof icons] : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-deep-gradient text-deep-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-5 py-6 md:py-10">
        <div className="flex items-center justify-between gap-5">
          <button onClick={back} disabled={step === 0 || done} aria-label="رجوع" className={round}>
            <ArrowRight />
          </button>
          {!done && (
            <div className="flex-1">
              <div className="mb-2 text-center font-latin text-sm text-mint-soft">
                {step + 1} / {questions.length}
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

        <div className="relative flex flex-1 items-center py-10">
          <AnimatePresence mode="wait" custom={dir}>
            {!done ? (
              <motion.div
                key={step}
                className="w-full"
                initial={{ opacity: 0, x: -50 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 * dir }}
                transition={{ duration: 0.4, ease }}
              >
                <h2 className="mb-10 text-balance text-center text-2xl font-bold leading-relaxed md:text-4xl md:leading-relaxed">
                  {questions[step]!.q}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {questions[step]!.o.map((o) => {
                    const on = answers[step] === o.p;
                    return (
                      <motion.button
                        key={o.t}
                        onClick={() => pick(o.p)}
                        whileTap={{ scale: 0.97 }}
                        className={`flex min-h-20 items-center gap-4 rounded-[1.75rem] border-2 p-5 text-start text-lg font-medium transition-colors duration-300 ${
                          on
                            ? "border-primary bg-primary/15"
                            : "border-deep-foreground/10 bg-deep-foreground/5 hover:border-primary/60 hover:bg-deep-foreground/10"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                            on ? "border-primary bg-primary text-primary-foreground" : "border-deep-foreground/30 text-transparent"
                          }`}
                        >
                          <Check />
                        </span>
                        {o.t}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              result &&
              Icon && (
                <motion.div key="result" className="w-full text-center" variants={list} initial="hidden" animate="show">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14 }}
                    className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Icon className="h-14 w-14" />
                  </motion.div>
                  <motion.div variants={item} className="text-sm font-semibold text-primary">
                    شخصيتك الاستثمارية
                  </motion.div>
                  <motion.h2 variants={item} className="mt-2 text-4xl font-bold md:text-6xl">
                    {result.name}
                  </motion.h2>
                  <motion.p variants={item} className="mx-auto mt-4 max-w-xl text-lg text-deep-foreground/80">
                    {result.desc}
                  </motion.p>
                  <motion.div variants={item} className="mt-7 flex flex-wrap justify-center gap-3">
                    {result.strengths.map((s) => (
                      <span key={s} className="rounded-full bg-deep-foreground/10 px-5 py-2">
                        {s}
                      </span>
                    ))}
                  </motion.div>
                  <motion.div variants={item} className="mt-7 grid gap-4 text-start md:grid-cols-2">
                    <div className="rounded-[1.75rem] bg-deep-foreground/[0.06] p-6">
                      <div className="mb-2 text-sm font-semibold text-primary">انتبه من</div>
                      <p>{result.watch}</p>
                    </div>
                    <div className="rounded-[1.75rem] bg-primary p-6 text-primary-foreground">
                      <div className="mb-2 text-sm font-semibold">البوث المقترح لك</div>
                      <div className="text-2xl font-bold">{result.booth}</div>
                    </div>
                  </motion.div>
                  <motion.button
                    variants={item}
                    whileTap={{ scale: 0.96 }}
                    onClick={restart}
                    className="mt-9 min-h-14 rounded-full border-2 border-primary px-10 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    أعد الاختبار
                  </motion.button>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
