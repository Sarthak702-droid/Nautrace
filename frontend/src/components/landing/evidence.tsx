import { motion } from "motion/react";
import Container from "./container";
import { Reveal, RevealStagger, revealItem } from "./reveal";

const thumbs = [
  {
    src: "/assets/evidence/Mauri.jpg",
    alt: "Mauritius Wakashio spill imagery",
  },
  {
    src: "/assets/evidence/huntington_oli_2021276.jpg",
    alt: "Huntington Beach pipeline spill",
  },
  {
    src: "/assets/evidence/sfbay_RAD_2007316.jpg",
    alt: "San Francisco Bay SAR slick",
  },
  {
    src: "/assets/evidence/gulf_amo_2010115.jpg",
    alt: "Gulf of Mexico macro spill",
  },
];

export default function Evidence() {
  return (
    <section id="evidence" className="landing-section">
      <Container>
        <Reveal className="landing-center mb-14 max-w-3xl md:mb-16">
          <p className="section-kicker">Evidence</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl">
            Real spills. Real sensors.
          </h2>
          <p className="section-body mx-auto max-w-2xl">
            Historic satellite and aerial archives that define the forensic
            problem Nautrace is built to investigate.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <Reveal
            className="glass-panel overflow-hidden rounded-3xl lg:col-span-7"
            delay={0.05}
          >
            <img
              src="/assets/evidence/sentinel2_oil_spill.jpg"
              alt="Sentinel-2 oil spill observation"
              className="aspect-[16/10] w-full object-cover transition duration-700 hover:scale-[1.02]"
            />
            <div className="border-t border-white/10 px-5 py-4 md:px-6">
              <p className="text-sm font-medium text-white/90">
                Sentinel-class optical / multispectral slick observation
              </p>
              <p className="mt-1 text-sm text-muted">
                Surface sheen and dispersion geometry that demand hydrodynamic
                rewind — not a static pin on a map.
              </p>
            </div>
          </Reveal>

          <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {thumbs.map((thumb) => (
              <motion.div
                key={thumb.src}
                variants={revealItem}
                className="glass-panel overflow-hidden rounded-2xl"
              >
                <img
                  src={thumb.src}
                  alt={thumb.alt}
                  className="aspect-[16/9] w-full object-cover transition duration-500 hover:scale-[1.03] lg:aspect-[21/9]"
                />
              </motion.div>
            ))}
          </RevealStagger>
        </div>
      </Container>
    </section>
  );
}
