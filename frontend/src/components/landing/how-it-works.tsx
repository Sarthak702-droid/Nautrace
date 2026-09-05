import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useAnimation,
  type Variants,
} from "motion/react";
import { ArrowDown, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import LaunchButton from "./launch-button";

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
  points: string[];
}

function StepCard({
  step,
  reverse,
}: {
  step: Step;
  reverse?: boolean;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a1620]/92 shadow-lg shadow-cyan-950/25 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/15 via-transparent to-teal-800/15 opacity-60" />
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-400" />

      <div className="relative p-6 sm:p-8 md:p-10">
        <div
          className={cn(
            "grid w-full items-center gap-8 md:gap-12",
            reverse
              ? "md:grid-cols-[1.35fr_1fr]"
              : "md:grid-cols-[1fr_1.35fr]",
            reverse && "md:[direction:rtl]",
          )}
        >
          <div className={cn("w-full min-w-0", reverse && "md:[direction:ltr]")}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/45 bg-[#061018]/70 px-3.5 py-1.5">
              <span className="font-mono text-sm font-bold tracking-wide text-primary">
                {step.number}
              </span>
              <span className="text-[11px] font-semibold tracking-[0.14em] text-white/55 uppercase">
                Step
              </span>
            </div>
            <h3 className="mb-4 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {step.title}
            </h3>
            <p className="text-[0.95rem] leading-relaxed text-white/65 md:text-base md:leading-8">
              {step.description}
            </p>

            <ul className="mt-6 space-y-3.5">
              {step.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary md:h-[18px] md:w-[18px]" />
                  <span className="text-sm leading-relaxed text-white/60 md:text-[0.95rem]">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              "relative aspect-[16/11] w-full min-w-0 overflow-hidden rounded-xl border border-white/10",
              reverse && "md:[direction:ltr]",
            )}
          >
            <img
              src={step.image}
              alt={step.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1620]/55 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepConnector() {
  return (
    <div className="flex w-full flex-col items-center py-5 md:py-7" aria-hidden>
      <div className="h-10 w-px bg-gradient-to-b from-cyan-500/80 to-teal-400/40 md:h-12" />
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/50 bg-[#061018] text-primary shadow-[0_0_20px_rgba(125,211,224,0.25)]">
        <ArrowDown className="h-5 w-5" />
      </div>
      <div className="h-10 w-px bg-gradient-to-b from-teal-400/40 to-cyan-500/80 md:h-12" />
    </div>
  );
}

const steps: Step[] = [
  {
    number: "01",
    title: "Spill in",
    description:
      "Provide the observed slick geometry, detection time, and oil probability from satellite evidence.",
    image: "/assets/evidence/sentinel2_oil_spill.jpg",
    points: [
      "Ingest SAR / optical slick polygons with capture timestamps.",
      "Carry oil probability and sensor metadata into the case record.",
      "Keep a request hash so the same inputs reproduce the same run.",
    ],
  },
  {
    number: "02",
    title: "Hindcast",
    description:
      "Propagate an ensemble backward with met-ocean forcing to recover a probabilistic origin region.",
    image: "/assets/evidence/oilspill_drone.jpg",
    points: [
      "192 stochastic RK4 particles rewind through wind and current.",
      "Build 50% and 90% Mahalanobis origin envelopes — not a fake pin.",
      "Uncertainty stays visible for investigators and courts.",
    ],
  },
  {
    number: "03",
    title: "Rank vessels",
    description:
      "Reconstruct AIS positions at release hypotheses and score spatial, temporal, and heading agreement.",
    image: "/assets/evidence/sfbay_RAD_2007316.jpg",
    points: [
      "Clean AIS trajectories with gap-aware interpolation.",
      "Score vessels against the origin window, not capture-time proximity.",
      "Surface explainable ranking factors for each candidate.",
    ],
  },
  {
    number: "04",
    title: "Evidence chain",
    description:
      "Return explainable scores with request and config hashes — or Unknown when vessels do not fit.",
    image: "/assets/evidence/gulf_amo_2010115.jpg",
    points: [
      "Fail closed with Unknown / Non-AIS when evidence is weak.",
      "Preserve provenance: request hash, config hash, run artifacts.",
      "Export a chain investigators can defend, not a vibes-based guess.",
    ],
  },
];

export default function HowItWorks({
  onLaunchConsole,
}: {
  onLaunchConsole?: () => void;
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      void mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const stepVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="method"
      ref={sectionRef}
      className="landing-section relative w-full overflow-hidden bg-gradient-to-b from-[#061018] via-[#071820] to-[#061018]"
    >
      <div className="pointer-events-none absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-cyan-600/12 to-teal-500/8 blur-xl"
            style={{
              width: `${50 + (i % 5) * 20}px`,
              height: `${50 + (i % 3) * 20}px`,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{
              x: [0, (i % 2 === 0 ? 1 : -1) * (16 + (i % 8))],
              y: [0, (i % 2 === 0 ? -1 : 1) * (16 + (i % 8))],
            }}
            transition={{
              duration: 18 + (i % 10),
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="landing-shell relative z-10">
        <div className="landing-center mb-14 max-w-3xl md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-kicker mb-0 inline-block rounded-full bg-cyan-950/50 px-4 py-1.5 text-xs backdrop-blur-sm">
              Forensic pipeline
            </span>
            <h2 className="section-title mt-5 text-3xl tracking-tight md:text-4xl lg:text-5xl">
              How it{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <p className="section-body mx-auto max-w-2xl">
              Four stages. Each one is explicit, hashable, and designed to fail
              closed when the ocean evidence is not enough.
            </p>
            <div className="relative mx-auto mt-8 h-1 w-32 md:w-40">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col">
          {steps.map((step, index) => (
            <div key={step.number} className="w-full">
              <motion.div
                custom={index}
                variants={stepVariants}
                initial="hidden"
                animate={mainControls}
                className="w-full"
              >
                <StepCard step={step} reverse={index % 2 === 1} />
              </motion.div>
              {index < steps.length - 1 ? <StepConnector /> : null}
            </div>
          ))}
        </div>

        <motion.div
          className="landing-center mt-14 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 30,
          }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          {onLaunchConsole ? (
            <div className="relative inline-block">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 opacity-60 blur-md" />
              <LaunchButton
                label="Launch Console"
                onClick={onLaunchConsole}
                className="relative"
              />
            </div>
          ) : (
            <a
              href="#top"
              className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600/90 to-teal-500/90 px-7 py-3.5 text-base font-medium text-white"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </a>
          )}
          <p className="mt-4 text-sm text-white/45 md:text-base">
            Open the operational console and run a live case
          </p>
        </motion.div>
      </div>
    </section>
  );
}
