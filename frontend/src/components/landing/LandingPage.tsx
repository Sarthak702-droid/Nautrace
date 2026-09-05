import Hero from "@/components/landing/hero";
import Problem from "@/components/landing/problem";
import Bento from "@/components/landing/bento";
import HowItWorks from "@/components/landing/how-it-works";
import Evidence from "@/components/landing/evidence";
import FinalCta from "@/components/landing/final-cta";
import Footer from "@/components/landing/footer";

export interface LandingPageProps {
  onLaunchConsole: () => void;
  onOpenAbout: () => void;
}

export default function LandingPage({
  onLaunchConsole,
  onOpenAbout,
}: LandingPageProps) {
  return (
    <main className="nautrace-landing dark min-h-screen w-full overflow-x-hidden">
      <Hero onLaunchConsole={onLaunchConsole} onOpenAbout={onOpenAbout} />
      <Problem />
      <Bento />
      <HowItWorks onLaunchConsole={onLaunchConsole} />
      <Evidence />
      <FinalCta onLaunchConsole={onLaunchConsole} />
      <Footer />
    </main>
  );
}
