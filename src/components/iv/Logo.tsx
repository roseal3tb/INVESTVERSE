import { motion, useReducedMotion } from "framer-motion";

// الشعار مرسوم SVG بخلفية شفافة: الحلقة تأخذ لون النص المحيط (currentColor) والسهم بالنعناعي.
const RING = "M75.7 25.1A42 42 0 1 0 101.1 55.3";
const LINE = "M33 82 49 66.5 65 77.5 99 34";
const HEAD = "M108 22 92 29 105 40Z";

export function LogoMark({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  const reduce = useReducedMotion();
  const a = animate && !reduce;
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <motion.path
        d={RING}
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        initial={a ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <motion.path
        d={LINE}
        className="stroke-primary"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={a ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: a ? 0.6 : 0, ease: "easeOut" }}
      />
      <motion.path
        d={HEAD}
        className="fill-primary stroke-primary"
        strokeWidth="3"
        strokeLinejoin="round"
        initial={a ? { opacity: 0, scale: 0.4 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: a ? 1.1 : 0, ease: "easeOut" }}
      />
    </svg>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span dir="ltr" className={`font-latin font-extrabold tracking-tight ${className}`}>
      INVEST<span className="font-light text-primary">VERSE</span>
    </span>
  );
}

export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  if (size === "sm")
    return (
      <div className="flex items-center gap-2.5" dir="ltr">
        <LogoMark className="h-9 w-9" />
        <Wordmark className="text-lg" />
      </div>
    );
  return (
    <div className="flex flex-col items-center text-center">
      <LogoMark animate className="h-28 w-28 md:h-36 md:w-36" />
      <Wordmark className="mt-5 text-4xl md:text-5xl" />
      <div className="mt-2 text-lg opacity-85">عالم الاستثمار</div>
      <div dir="ltr" className="mt-3 font-latin text-[0.7rem] tracking-[0.4em] opacity-60">
        EXPLORE · INVEST · GROW
      </div>
    </div>
  );
}
