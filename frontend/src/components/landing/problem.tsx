import { motion } from "motion/react";
import Container from "./container";
import { Reveal } from "./reveal";

export default function Problem() {
  return (
    <section id="problem" className="landing-section relative w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <Container>
        <Reveal className="landing-center mb-14 max-w-3xl md:mb-20">
          <p className="section-kicker">The problem</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl">
            The nearest ship is often the wrong ship.
          </h2>
          <p className="section-body mx-auto max-w-2xl">
            Most open-ocean petroleum pollution is routine bilge dumping. By the
            time a satellite sees the slick, wind and current have already moved
            it 15–45 km — nearest-ship blame invents false suspects.
          </p>
        </Reveal>

        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="landing-stack">
            <p className="section-body">
              Most open-ocean petroleum pollution is not a catastrophic tanker
              accident. It is routine bilge dumping — vessels discharging waste
              offshore to avoid port fees, then sailing on.
            </p>
            <p className="section-body">
              Software that blames whoever is closest at capture time invents
              false suspects and lets the real source leave the scene.
              Attribution has to move backward in time with the ocean.
            </p>
          </Reveal>

          <Reveal
            delay={0.12}
            className="glass-panel w-full overflow-hidden rounded-3xl"
          >
            <motion.img
              src="/assets/evidence/oilspill_drone.jpg"
              alt="Aerial view of a vessel wake and oil sheen on the sea surface"
              className="aspect-[16/10] w-full object-cover"
              initial={{ scale: 1.06 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="border-t border-white/10 px-6 py-5 md:px-8 md:py-6">
              <p className="text-[0.95rem] leading-relaxed text-muted">
                Oil moves with the ocean. Attribution has to move backward in
                time with it.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
