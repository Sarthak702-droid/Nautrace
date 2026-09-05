import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function AnimatedText({
  text,
  className,
  delayStep = 0.014,
}: {
  text: string;
  className?: string;
  delayStep?: number;
}) {
  const chars = text.split("");

  return (
    <span className={className} style={{ display: "inline-flex" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          style={{ display: "inline-flex", willChange: "transform" }}
        >
          {chars.map((char, i) => (
            <motion.span
              key={`${text}-${i}-${char}`}
              initial={{
                y: 10,
                opacity: 0,
                scale: 0.5,
                filter: "blur(2px)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                y: -10,
                opacity: 0,
                scale: 0.5,
                filter: "blur(2px)",
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 16,
                mass: 1.2,
                delay: i * delayStep,
              }}
              style={{
                display: "inline-block",
                whiteSpace: char === " " ? "pre" : undefined,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type LaunchButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  icon?: boolean;
};

/** Watermelon hero-35 pill + time-undo AnimatedText spring chars */
export default function LaunchButton({
  label,
  onClick,
  variant = "primary",
  className,
  icon = true,
}: LaunchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-[44px] items-center gap-2 rounded-full px-7 py-3 text-[15px] font-medium will-change-transform transition-all active:scale-[0.96]",
        variant === "primary" &&
          "bg-[#c8eef4] text-[#061018] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18),inset_0_2px_0_rgba(255,255,255,0.35)] hover:bg-white",
        variant === "ghost" &&
          "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/15",
        className,
      )}
    >
      <AnimatedText text={label} className="leading-none" />
      {icon ? (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </button>
  );
}
