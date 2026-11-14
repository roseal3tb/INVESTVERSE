import { motion, useReducedMotion } from "framer-motion";

export function LogoMark({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  const reduce = useReducedMotion();
  const a = animate && !reduce;
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <motion.path d="M78 16 A46 46 0 1 0 104 44" className="stroke-deep-foreground" strokeWidth="9" strokeLinecap="round"
        initial={a ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeInOut" }} />
      <motion.path d="M30 84 L50 62 L62 72 L92 32" className="stroke-primary" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
        initial={a ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: a ? 0.9 : 0 }} />
      <motion.path d="M74 30 L94 29 L93 49" className="stroke-primary" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
        initial={a ? { opacity: 0, x: -8, y: 8 } : false} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.4, delay: a ? 1.4 : 0 }} />
    </svg>
  );
}

export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  if (size === "sm")
    return (
      <div className="flex items-center gap-2" dir="ltr">
        <LogoMark className="h-9 w-9" />
        <span className="font-latin text-lg font-extrabold tracking-tight text-deep-foreground">
          INVEST<span className="font-semibold text-mint-soft">VERSE</span>
        </span>
      </div>
    );
  return (
    <div className="flex flex-col items-center text-center">
      <LogoMark animate className="h-40 w-40 md:h-56 md:w-56" />
      <div dir="ltr" className="mt-4 font-latin text-4xl font-extrabold tracking-tight text-deep-foreground md:text-5xl">
        INVEST<span className="font-semibold text-mint-soft">VERSE</span>
      </div>
      <div className="mt-1 text-lg text-deep-foreground/85">عالم الاستثمار</div>
      <div dir="ltr" className="mt-2 font-latin text-xs tracking-[0.4em] text-primary">EXPLORE · INVEST · GROW</div>
    </div>
  );
}
