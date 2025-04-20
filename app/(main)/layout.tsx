// app/(main)/layout.tsx
import React from 'react';
import Navbar from '../components/navbar'; // Adjust import path if needed
import Footer from '../components/footer'; // Adjust import path if needed

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen"> {/* Example structure */}
      <Navbar />
      <main className="flex-grow"> {/* Ensure content takes up space */}
        {children}
      </main>
      <Footer />
    </div>
  );
}