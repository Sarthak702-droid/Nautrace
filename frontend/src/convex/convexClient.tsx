import React, { createContext, useContext, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

interface ConvexConfigContextType {
  isConfigured: boolean;
  deploymentUrl: string;
}

const ConvexConfigContext = createContext<ConvexConfigContextType>({
  isConfigured: false,
  deploymentUrl: "",
});

export const useConvexConfig = () => useContext(ConvexConfigContext);

export const NautraceConvexProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  const isConfigured = Boolean(convexUrl && convexUrl.startsWith("http"));

  const client = useMemo(() => {
    if (isConfigured) {
      try {
        return new ConvexReactClient(convexUrl);
      } catch (err) {
        console.warn("Could not initialize Convex client, falling back to local simulation", err);
        return null;
      }
    }
    return null;
  }, [convexUrl, isConfigured]);

  const value = useMemo(() => ({
    isConfigured: Boolean(client),
    deploymentUrl: convexUrl || "https://dashboard.convex.dev/t/sarthak-tripathy/nautrace",
  }), [client, convexUrl]);

  if (client) {
    return (
      <ConvexConfigContext.Provider value={value}>
        <ConvexProvider client={client}>
          {children}
        </ConvexProvider>
      </ConvexConfigContext.Provider>
    );
  }

  return (
    <ConvexConfigContext.Provider value={value}>
      {children}
    </ConvexConfigContext.Provider>
  );
};
