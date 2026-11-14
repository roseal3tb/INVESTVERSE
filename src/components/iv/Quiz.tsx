import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X, Compass, Shield, Scale, Building2, Rocket } from "lucide-react";
import { questions, personalities, scoreResult, type PKey } from "./data";

export const icons = { Compass, Shield, Scale, Building2, Rocket } as const;

export function Quiz({ onClose }: { onClose: (home?: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PKey[]>([]);
  const [dir, setDir] = useState(1);
  const done = step >= questions.length;
  const result = done ? personalities[scoreResult(answers)] : null;

  useEffect(() => {
    if (!done) return;
    let t: ReturnType<typeof setTimeout>;
    const reset = () => { clearTimeout(t); t = setTimeout(() => onClose(true), 60000); };
    const ev = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"];
    ev.forEach((e) => window.addEventListener(e, reset, true));
    reset();
    return () => { clearTimeout(t); ev.forEach((e) => window.removeEventListener(e, reset, true)); };
  }, [done, onClose]);

  const pick = (p: PKey) => { setDir(1); setAnswers([...answers.slice(0, step), p]); setStep(step + 1); };
  const back = () => { if (step > 0) { setDir(-1); setStep(step - 1); } };
  const restart = () => { setAnswers([]); setDir(1); setStep(0); };
  const Icon = result ? icons[result.icon as keyof typeof icons] : null;

  return (
    <motion.div className="fixed inset-0 z-50 overflow-y-auto bg-deep-gradient text-deep-foreground"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-5 py-6 md:py-10">
        <div className="flex items-center justify-between gap-4">
          <button onClick={back} disabled={step === 0 || done} aria-label="رجوع"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-foreground/10 transition active:scale-95 disabled:opacity-30">
            <ArrowRight />
          </button>
          {!done && (
            <div className="flex-1">
              <div className="mb-2 text-center font-latin text-sm text-mint-soft">{step + 1} / {questions.length}</div>
              <div className="h-2 overflow-hidden rounded-full bg-deep-foreground/10">
                <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${((step + 1) / questions.length) * 100}%` }} transition={{ duration: 0.4 }} />
              </div>
            </div>
          )}
          <button onClick={() => onClose()} aria-label="إغلاق"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-deep-foreground/10 transition active:scale-95"><X /></button>
        </div>

        <div className="relative flex flex-1 items-center py-8">
          <AnimatePresence mode="wait" custom={dir}>
            {!done ? (
              <motion.div key={step} custom={dir} className="w-full"
                initial={{ opacity: 0, x: -60 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 * dir }} transition={{ duration: 0.4 }}>
                <h2 className="mb-8 text-center text-2xl font-bold leading-snug md:text-4xl">{questions[step]!.q}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {questions[step]!.o.map((o) => (
                    <motion.button key={o.t} onClick={() => pick(o.p)} whileTap={{ scale: 0.97 }}
                      className={`min-h-20 rounded-3xl border-2 p-5 text-start text-lg font-medium transition hover:border-primary hover:bg-deep-foreground/10 ${answers[step] === o.p ? "border-primary bg-deep-foreground/10" : "border-deep-foreground/15 bg-deep-foreground/5"}`}>
                      {o.t}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : result && Icon && (
              <motion.div key="result" className="w-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-14 w-14" />
                </motion.div>
                <div className="font-latin text-xs tracking-[0.3em] text-primary">YOUR INVESTOR PERSONALITY</div>
                <h2 className="mt-2 text-4xl font-bold md:text-5xl">{result.name}</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-deep-foreground/85">{result.desc}</p>
                <div className="mt-8 grid gap-4 text-start md:grid-cols-2">
                  <div className="rounded-3xl bg-deep-foreground/5 p-6">
                    <div className="mb-3 text-sm font-semibold text-primary">نقاط القوة</div>
                    <ul className="space-y-2">{result.strengths.map((s) => <li key={s} className="border-s-2 border-primary ps-3">{s}</li>)}</ul>
                  </div>
                  <div className="rounded-3xl bg-deep-foreground/5 p-6">
                    <div className="mb-3 text-sm font-semibold text-primary">انتبه من</div>
                    <p>{result.watch}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-3xl bg-primary p-6 text-primary-foreground">
                  <div className="text-sm font-semibold">البوث المقترح لك</div>
                  <div className="mt-1 text-2xl font-bold">{result.booth}</div>
                </div>
                <motion.button whileTap={{ scale: 0.96 }} onClick={restart}
                  className="mt-8 rounded-full border-2 border-primary px-10 py-4 text-lg font-semibold text-primary">أعد الاختبار</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
