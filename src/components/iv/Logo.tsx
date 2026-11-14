import { motion } from "framer-motion";

// ملفات الشعار مأخوذة من ملف الهوية البصرية بخلفية شفافة (public/brand).
const src = {
  dark: "/brand/mark-on-dark.png",
  light: "/brand/mark-on-light.png",
} as const;

/** أيقونة الشعار فقط. tone = لون الخلفية اللي تحتها. */
export function LogoMark({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <img
      src={src[tone]}
      alt=""
      aria-hidden
      decoding="async"
      className={`select-none object-contain ${className}`}
      draggable={false}
    />
  );
}

/** الشعار الكامل للخلفيات الداكنة: sm أفقي للترويسة والتذييل، lg عمودي للواجهة. */
export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  if (size === "sm")
    return (
      <img
        src="/brand/logo-on-dark.png"
        alt="INVESTVERSE"
        width={1101}
        height={331}
        className="h-9 w-auto select-none md:h-10"
        draggable={false}
      />
    );
  return (
    <div className="flex flex-col items-center text-center">
      <div className="float">
        <motion.img
          src="/brand/logo-stacked-on-dark.png"
          alt="INVESTVERSE"
          width={351}
          height={316}
          className="h-28 w-auto select-none sm:h-36 lg:h-44"
          draggable={false}
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <motion.div
        className="mt-4 text-lg text-deep-foreground/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        عالم الاستثمار
      </motion.div>
    </div>
  );
}
