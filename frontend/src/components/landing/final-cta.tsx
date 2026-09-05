import { motion } from "motion/react";
import LaunchButton from "./launch-button";

/** Adapted from Watermelon cta-1 — horizontal CTA with glow */
export default function FinalCta({
  onLaunchConsole,
}: {
  onLaunchConsole: () => void;
}) {
  return (
    <section className="landing-section w-full">
      <div className="landing-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative isolate mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 p-8 shadow-sm md:flex-row md:gap-12 md:px-12 md:py-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 blur-2xl"
          >
            <div
              className="aspect-[577/310] w-[36rem] bg-gradient-to-r from-primary to-primary/60 opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 blur-2xl"
          >
            <div
              className="aspect-[577/310] w-[36rem] bg-gradient-to-r from-primary to-primary/60 opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>

          <div className="flex max-w-xl flex-col items-center gap-3 text-center md:items-start md:text-left">
            <p className="m-0 font-mono text-[0.72rem] font-semibold tracking-[0.2em] text-primary uppercase">
              Ready to investigate
            </p>
            <h2 className="m-0 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-white md:text-4xl">
              Open the operational console
            </h2>
            <p className="m-0 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
              Run hindcast attribution, inspect vessel rankings, and keep an
              honest Unknown when the ocean evidence is not enough.
            </p>
          </div>

          <div className="mt-2 flex w-full max-w-xs shrink-0 justify-center md:mt-0 md:w-auto">
            <LaunchButton
              label="Launch Console"
              onClick={onLaunchConsole}
              className="h-12 w-full justify-center px-8 text-base md:w-auto"
              icon
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
