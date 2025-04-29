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
      // Force client-side only rendering to prevent hydration mismatch
      enableSystem={true}
      // Disable class/style changes during SSR
      enableColorScheme={mounted}
    >
      {children}
    </ThemeProvider>
  );
}