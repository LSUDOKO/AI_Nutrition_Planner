"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  
  // Set mounted to true once component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark"
      // Prevent forcing the theme during SSR to avoid hydration mismatches
      enableSystem={false}
      forcedTheme={!mounted ? undefined : null}
      // Disable class/style changes during SSR
      enableColorScheme={mounted}
    >
      {children}
    </ThemeProvider>
  );
}