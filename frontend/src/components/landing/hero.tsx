import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, type Variants } from "motion/react";
import LaunchButton from "./launch-button";

interface LandingHeroProps {
  onLaunchConsole: () => void;
  onOpenAbout: () => void;
}

/** Adapted from Watermelon hero-35 — full-bleed split composition */
export default function Hero({
  onLaunchConsole,
  onOpenAbout,
}: LandingHeroProps) {
  const [open, setOpen] = useState(false);

  const navVariants: Variants = {
    hidden: { opacity: 0, y: -18, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 22, stiffness: 150, delay: 0.1 },
    },
  };

  const titleWords = ["Trace", "every", "slick", "through", "the", "ocean."];
  const titleContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.09, delayChildren: 0.35 },
    },
  };
  const titleWordVariants: Variants = {
    hidden: { opacity: 0, y: 32, filter: "blur(10px)", rotateX: 8 },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      rotateX: 0,
      transition: { type: "spring", damping: 26, stiffness: 95, mass: 1.1 },
    },
  };

  const statsVariants: Variants = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 24, stiffness: 110, delay: 1.0 },
    },
  };

  const rightContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.7 },
    },
  };
  const rightItemVariants: Variants = {
    hidden: { opacity: 0, x: 24, filter: "blur(5px)" },
    show: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 20, stiffness: 100, mass: 0.9 },
    },
  };

  const links = [
    { href: "#problem", label: "PROBLEM" },
    { href: "#product", label: "PRODUCT" },
    { href: "#method", label: "METHOD" },
    { href: "#evidence", label: "EVIDENCE" },
  ];

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#061018] font-sans antialiased selection:bg-primary/30 selection:text-white"
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full scale-105 object-cover"
          poster="/assets/evidence/oil_spill.webp"
        >
          <source src="/assets/ocean_waves_surface.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-[#061018]/92" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,211,224,0.12),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-6 py-6 sm:px-8 lg:px-12 lg:py-8">
        <motion.nav
          variants={navVariants}
          initial="hidden"
          animate="show"
          className="flex w-full items-center gap-4"
        >
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5 text-white"
          >
            <img
              src="/nautrace-logo.png"
              alt=""
              className="size-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold tracking-wide">Nautrace</span>
          </a>

          <div className="hidden flex-1 items-center justify-center gap-7 text-[13px] font-medium tracking-[0.08em] text-white/75 lg:flex xl:gap-9">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-[40px] items-center transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenAbout}
              className="flex min-h-[40px] items-center transition-colors hover:text-white"
            >
              ABOUT
            </button>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onLaunchConsole}
              className="group hidden min-h-[42px] items-center gap-2 rounded-full bg-[#c8eef4] px-5 py-2.5 text-[14px] font-semibold text-[#061018] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18),inset_0_2px_0_rgba(255,255,255,0.35)] transition-all will-change-transform hover:bg-white active:scale-[0.96] md:inline-flex"
            >
              Launch Console
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              className="rounded-md p-1 text-white lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </motion.nav>

        {open ? (
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#061018]/92 p-4 backdrop-blur-xl md:hidden">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-white/80"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenAbout();
              }}
              className="py-2 text-left text-sm text-white/80"
            >
              ABOUT
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLaunchConsole();
              }}
              className="mt-1 rounded-full bg-[#c8eef4] py-3 text-sm font-semibold text-[#061018]"
            >
              Launch Console
            </button>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col items-stretch justify-end gap-14 pb-14 pt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-20 lg:pb-16">
          <div
            className="flex w-full flex-col gap-12 lg:w-[55%] lg:max-w-none"
            style={{ perspective: "800px" }}
          >
            <motion.h1
              variants={titleContainerVariants}
              initial="hidden"
              animate="show"
              className="font-[family-name:var(--font-heading)] text-[2.75rem] leading-[1.08] font-semibold tracking-tight text-white sm:text-[4.25rem] md:text-[5rem] xl:text-[5.5rem]"
            >
              {titleWords.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  variants={titleWordVariants}
                  className="mr-[0.22em] inline-block last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              variants={statsVariants}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-10 sm:gap-16"
            >
              {[
                { value: "RK4", label: "Hindcast ensemble" },
                { value: "UNK", label: "Non-AIS safe" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="opacity-80"
                      aria-hidden
                    >
                      <circle cx="4" cy="4" r="1.5" />
                      <circle cx="12" cy="4" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                    </svg>
                    <span className="text-[1.25rem] font-medium tracking-wide tabular-nums">
                      {value}
                    </span>
                  </div>
                  <span className="ml-6 text-[14px] font-medium tracking-wide text-white/60">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={rightContainerVariants}
            initial="hidden"
            animate="show"
            className="flex w-full flex-col items-start gap-10 lg:w-[420px] xl:w-[480px]"
          >
            <motion.p
              variants={rightItemVariants}
              className="text-[1.125rem] leading-[1.8] font-normal text-pretty text-white/85 md:text-[1.2rem] md:leading-[1.85]"
            >
              Satellite oil detection, hydrodynamic rewind, and explainable
              vessel attribution — or an honest Unknown when the ocean evidence
              is not strong enough.
            </motion.p>

            <motion.div
              variants={rightItemVariants}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <LaunchButton
                label="Launch Console"
                onClick={onLaunchConsole}
              />
              <LaunchButton
                label="Methodology"
                onClick={onOpenAbout}
                variant="ghost"
                icon={false}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
