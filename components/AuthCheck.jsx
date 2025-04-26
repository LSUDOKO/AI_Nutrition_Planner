"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Temporary AuthCheck component until Clerk is properly installed
export default function AuthCheck({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For development, assume authenticated

  // This will be replaced with actual Clerk authentication once installed
  useEffect(() => {
    // For now, we'll allow all routes to be accessed
    // This will be updated once Clerk is properly installed
  }, []);

  return children;
}