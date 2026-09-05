import React, { useEffect } from "react";
import LandingPage from "../components/landing/LandingPage";

interface HomePageProps {
  onLaunchConsole: () => void;
  onOpenAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onLaunchConsole,
  onOpenAbout,
}) => {
  useEffect(() => {
    document.documentElement.classList.add("landing-mode");
    document.body.classList.add("landing-mode");
    return () => {
      document.documentElement.classList.remove("landing-mode");
      document.body.classList.remove("landing-mode");
    };
  }, []);

  return (
    <LandingPage
      onLaunchConsole={onLaunchConsole}
      onOpenAbout={onOpenAbout}
    />
  );
};
