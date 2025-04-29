"use client";

import './globals.css';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

// Initialize Inter font with subsets
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" 
      // No dynamic theme class at initial render to prevent hydration mismatch
      className={`${inter.variable} h-full`}
      // We handle dark mode with Providers component instead of directly here
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AnnaData - AI Nutrition Assistant</title>
        {/* Use a simpler script that doesn't modify classes (handles by next-themes instead) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // We'll let next-themes handle this instead of manual DOM manipulation
                // This prevents the hydration mismatch
              })();
            `
          }}
        />
      </head>
      <body className="h-full bg-slate-950">
        <Providers>
          {/* Custom Cursor */}
          <CustomCursor />
          
          {/* Enhanced Background Effects */}
          <div className="fixed inset-0 bg-gradient-mesh bg-animate-gradient z-[-2]"></div>
          <div className="fixed inset-0 bg-grid bg-noise z-[-1] pointer-events-none"></div>
          
          <div className="flex flex-col min-h-screen relative z-[1]">
            <Navigation />
            <main className="flex-grow pt-16 pb-8">
              {children}
            </main>
            <footer className="bg-slate-900/90 backdrop-blur border-t border-slate-800/50 py-6 relative z-[2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </div>
                      <span className="bg-gradient-to-r from-emerald-400 to-teal-300 text-transparent bg-clip-text font-display font-bold text-lg">
                        Nutritionist AI
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">
                      Your AI-powered nutrition assistant that helps you make better food choices.
                      Track meals, get personalized insights, and achieve your health goals.
                    </p>
                    <div className="flex space-x-4">
                      {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                        <a key={social} href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                          <span className="sr-only">{social}</span>
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                              {social === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>}
                              {social === 'twitter' && <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></>}
                              {social === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>}
                              {social === 'linkedin' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></>}
                            </svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider mb-4">Features</h3>
                    <ul className="space-y-2">
                      {['Food Analysis', 'Nutritional Insights', 'Meal Tracking', 'Recipe Suggestions', 'Fitness Integration'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
                    <ul className="space-y-2">
                      {['Help Center', 'Nutritional Guide', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 mt-8 pt-6 text-center">
                  <p className="text-slate-400 text-xs">
                    © {new Date().getFullYear()} Nutritionist AI. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}