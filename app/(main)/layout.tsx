import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  icons: {
    icon: '/assets/logo.png',
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
        <Analytics />
        <SpeedInsights />
      </main>
      <Footer />
    </div>
  );
}