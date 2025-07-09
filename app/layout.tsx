// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { Appearance } from '@clerk/types';
// import { light } from '@clerk/themes';
import './globals.css';
import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SanityLive } from '@/sanity/lib/live';
import ClientCartProvider from '@/app/components/ClientCartProvider';
import { AlertProvider } from '@/app/components/AlertProvider'; // <-- IMPORT AlertProvider
import { ThemeProvider } from '@/app/components/theme-provider';

// ... (clerkAppearance definition) ...
const clerkAppearance: Appearance = { /* ... */ };
export const metadata = { /* ... */ };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/assets/logo.png" type="image/png" />
        </head>
        <body> {/* Theme classes will be applied automatically */}
          <ThemeProvider>
            <ClientCartProvider>
              <AlertProvider>
                {/* Navbar and Footer are rendered by (main)/layout.tsx */}
                {children}
                <Analytics />
                <SpeedInsights />
                <SanityLive />
              </AlertProvider>
            </ClientCartProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}