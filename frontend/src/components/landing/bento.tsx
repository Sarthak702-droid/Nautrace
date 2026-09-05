import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

interface BentoProps {
  className?: string;
}

const bentoCardClass = cn(
  "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/[0.04] p-6 duration-300 antialiased lg:p-8",
  "shadow-[inset_0_0_2px_2px_rgba(255,255,255,0.04),inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.06),0_1px_2px_-1px_rgba(0,0,0,0.5),0_2px_4px_0_rgba(0,0,0,0.4)]",
);

/** Adapted from Watermelon bento-02 — Nautrace forensic capabilities */
export default function Bento({ className }: BentoProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section
      id="product"
      className={cn(
        "landing-section flex w-full items-center justify-center font-sans antialiased",
        className,
      )}
    >
      <div className="landing-shell">
        <div className="landing-center mb-14 max-w-3xl md:mb-16">
          <p className="section-kicker">The product</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl">
            Built like a forensic workspace
          </h2>
          <p className="section-body mx-auto max-w-2xl">
            Detect, rewind, attribute — with uncertainty you can defend.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-5">
          {/* Card 1 */}
          <div
            className={cn(bentoCardClass, "min-h-[300px] flex-col justify-end md:col-span-2")}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative z-10 flex w-full flex-1 items-start justify-center overflow-visible">
              <motion.div className="flex w-full flex-col">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold tracking-wider text-white/45 uppercase">
                      Ensemble rewind
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-white">
                      192{" "}
                      <span className="text-sm font-medium text-white/45">
                        particles
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex h-30 items-end gap-1.5 overflow-hidden">
                  {[40, 70, 45, 90, 65, 85, 35, 60, 50, 80, 55, 75].map(
                    (height, i) => (
                      <motion.div
                        key={i}
                        className="w-full rounded-t-sm bg-primary/70"
                        initial={{ height: `${height}%` }}
                        animate={
                          hoveredCard === 1
                            ? {
                                height: [
                                  `${height}%`,
                                  `${Math.max(15, height - 30)}%`,
                                  `${height}%`,
                                ],
                              }
                            : { height: `${height}%` }
                        }
                        transition={{
                          duration: 2,
                          repeat: hoveredCard === 1 ? Infinity : 0,
                          delay: i * 0.05,
                          ease: "easeInOut",
                        }}
                      />
                    ),
                  )}
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 flex flex-col gap-2 pt-4">
              <h3 className="text-xl font-semibold text-white">
                Hydrodynamic hindcast
              </h3>
              <p className="max-w-sm text-sm text-white/55">
                Stochastic RK4 members push the slick origin backward through
                wind and current — not a nearest-ship guess.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={cn(bentoCardClass, "min-h-[320px] flex-col justify-start md:col-span-1")}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative z-10 flex flex-col gap-2 pb-4">
              <h3 className="text-xl font-semibold text-white">50 / 90 envelopes</h3>
              <p className="max-w-[200px] text-sm text-white/55">
                Mahalanobis origin regions you can show in court.
              </p>
            </div>

            <div className="relative z-10 flex w-full flex-1 items-end justify-center overflow-visible pt-6 pb-2">
              <motion.div className="relative z-10 flex w-full flex-col gap-3 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[9px] font-bold tracking-widest text-white/45 uppercase">
                    Confidence
                  </span>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                      animate={
                        hoveredCard === 2
                          ? { opacity: [1, 0.3, 1] }
                          : { opacity: 1 }
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-[9px] font-bold tracking-wider text-primary uppercase">
                      Live
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { name: "Spatial fit", delay: 0.2 },
                    { name: "Temporal window", delay: 0.5 },
                    { name: "Heading agree", delay: 0.8 },
                  ].map((service) => (
                    <div key={service.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-white">
                          {service.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="font-mono text-[9px] text-primary drop-shadow-[0_0_4px_var(--primary)]"
                            initial={{ opacity: 0, x: -5 }}
                            animate={
                              hoveredCard === 2
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -5 }
                            }
                            transition={{
                              type: "spring",
                              delay: hoveredCard === 2 ? service.delay + 0.4 : 0,
                            }}
                          >
                            scored
                          </motion.span>
                          <div className="relative h-1 w-12 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="absolute top-0 bottom-0 left-0 bg-primary shadow-[0_0_8px_var(--primary)]"
                              initial={{ width: "0%" }}
                              animate={
                                hoveredCard === 2
                                  ? { width: "100%" }
                                  : { width: "0%" }
                              }
                              transition={{
                                duration: 0.6,
                                delay: hoveredCard === 2 ? service.delay : 0,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(14)].map((_, j) => (
                          <motion.div
                            key={j}
                            className="h-2 flex-1 rounded-[1px] bg-primary"
                            initial={{ opacity: 0.2 }}
                            animate={
                              hoveredCard === 2
                                ? { opacity: [0.2, 0.9, 0.2] }
                                : { opacity: 0.2 }
                            }
                            transition={{
                              duration: 0.4,
                              delay:
                                hoveredCard === 2
                                  ? service.delay + j * 0.03
                                  : 0,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={cn(
              bentoCardClass,
              "min-h-[300px] h-full flex-col justify-between md:col-span-1",
            )}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative z-10 flex w-full flex-1 items-center justify-center overflow-visible py-6">
              <div className="relative flex w-full flex-col items-center">
                <motion.div
                  className="relative z-30 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-[#061018]/60 shadow-sm backdrop-blur-md"
                  animate={hoveredCard === 3 ? { y: -8 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="font-mono text-sm font-bold text-primary">
                    UNK
                  </span>
                  <motion.div
                    className="absolute top-3 right-3 size-2 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={hoveredCard === 3 ? { scale: 1 } : { scale: 0 }}
                    transition={{ type: "spring", delay: 0.3 }}
                  />
                </motion.div>

                <div className="mt-4 flex w-full justify-center">
                  <motion.div
                    className="relative z-20 flex w-[90%] max-w-[220px] items-center gap-3 rounded-xl border border-white/15 bg-[#061018]/80 p-3 shadow-lg backdrop-blur-md"
                    initial={{ opacity: 0.55, y: 8 }}
                    animate={
                      hoveredCard === 3
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0.55, y: 8 }
                    }
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <div className="size-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-semibold text-white">
                        Unknown / Non-AIS
                      </span>
                      <span className="text-[10px] text-white/50">
                        Fail closed when vessels do not fit
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-2 pt-2">
              <h3 className="text-xl font-semibold text-white">Honest Unknown</h3>
              <p className="text-sm leading-relaxed text-white/55">
                First-class hypothesis when AIS cannot explain the slick.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div
            className={cn(
              bentoCardClass,
              "min-h-[300px] h-full flex-col items-stretch justify-start md:col-span-2",
            )}
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative z-10 mb-5 flex flex-col gap-2 text-left">
              <h3 className="text-xl font-semibold text-white">
                Satellite evidence chain
              </h3>
              <p className="max-w-lg text-sm leading-relaxed text-white/55">
                Real slick archives that demand rewind — Sentinel, SAR, and
                aerial sheen geometry.
              </p>
            </div>

            <div className="relative z-10 grid flex-1 grid-cols-2 gap-3 overflow-hidden">
              {[
                "/assets/evidence/sentinel2_oil_spill.jpg",
                "/assets/evidence/oilspill_drone.jpg",
                "/assets/evidence/sfbay_RAD_2007316.jpg",
                "/assets/evidence/gulf_amo_2010115.jpg",
              ].map((src, idx) => (
                <motion.div
                  key={src}
                  className="overflow-hidden rounded-lg border border-white/10"
                  animate={
                    hoveredCard === 4 ? { y: [0, -4, 0] } : { y: 0 }
                  }
                  transition={{
                    duration: 2.8,
                    repeat: hoveredCard === 4 ? Infinity : 0,
                    delay: idx * 0.15,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="aspect-[16/10] h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
