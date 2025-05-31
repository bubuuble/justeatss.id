import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';


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
      </main>
      <Footer />
    </div>
  );
}