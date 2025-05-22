// app/components/navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import AccountModal from "./AccountModal";
import { useCart } from "../(main)/context/CartContext"; // Pastikan path ini benar
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'; // Tambahkan FiMenu dan FiX

const Navbar: React.FC = () => {
  const { user } = useUser();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- State baru untuk sidebar

  return (
    <>
      <nav className="bg-zinc-900 text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left Side: Logo + Mobile Menu Button */}
            <div className="flex items-center">
              {/* Mobile Menu Button - Only visible on mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white mr-2"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Buka menu utama</span>
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              </button>
              
              {/* Logo - Always visible */}
              <Link href="/" className="flex-shrink-0">
                <Image src="/assets/logo.png" alt="Justeatss Logo" width={40} height={40} className="rounded-full" />
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link href="/" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link href="/products" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Products</Link>
              <Link href="/about" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
            </div>

            {/* Right Side: Cart, Auth Controls */}
            <div className="flex items-center">
              {/* Cart Icon */}
              <Link href="/cart" className="mr-3 relative text-zinc-300 hover:text-white">
                <FiShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Auth Controls */}
              <div className="flex items-center">
                <SignedOut>
                  <Link href="/sign-in" className="hidden md:block">
                    <button className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/sign-up" className="hidden md:block">
                    <button className="ml-2 px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white hover:text-black transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <button
                    onClick={() => setIsAccountModalOpen(true)}
                    className="ml-4 flex items-center justify-center h-9 w-9 rounded-full overflow-hidden bg-zinc-700 hover:ring-2 hover:ring-offset-2 hover:ring-offset-zinc-900 hover:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500"
                    aria-label="Open account menu"
                  >
                    {user?.imageUrl ? (
                      <Image src={user.imageUrl} alt="User profile" width={36} height={36} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium">{user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}</span>
                    )}
                  </button>
                </SignedIn>
              </div>
            </div> {/* Akhir Sisi Kanan */}
          </div> {/* Akhir flex items-center justify-between */}
        </div> {/* Akhir container */}
      </nav>

      {/* Mobile Menu Sidebar / Panel */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="mobile-menu"
      >
        {/* Sidebar Header with Close and Cart */}
        <div className="flex justify-between items-center px-4 py-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Tutup menu"
          >
            <FiX className="h-6 w-6" />
          </button>

        </div>
        
        {/* Logo di dalam Sidebar */}
        <div className="flex justify-center py-6 mb-4">
          <Link href="/" className="flex-shrink-0 transform hover:scale-110 transition-transform duration-200" onClick={() => setIsMobileMenuOpen(false)}>
            <Image src="/assets/logo.png" alt="Justeatss Logo" width={80} height={80} className="rounded-full shadow-lg" />
          </Link>
        </div>
          
        {/* Menu Navigation Links */}
        <div className="px-6 py-2 flex-grow">
          <Link 
            href="/" 
            className="block px-4 py-3 mb-2 rounded-lg text-base font-medium text-white hover:bg-zinc-700 transition-colors duration-200" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="block px-4 py-3 mb-2 rounded-lg text-base font-medium text-white hover:bg-zinc-700 transition-colors duration-200" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link 
            href="/about" 
            className="block px-4 py-3 mb-2 rounded-lg text-base font-medium text-white hover:bg-zinc-700 transition-colors duration-200" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
        </div>
        
        {/* Auth Links di Mobile Menu - Placed at bottom */}
        <div className="mt-auto px-6 py-8 space-y-3">
          <SignedOut>
            <Link 
              href="/sign-in" 
              className="block w-full px-4 py-3 rounded-lg text-center text-base font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md transition-all duration-200" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/sign-up" 
              className="block w-full px-4 py-3 rounded-lg text-center text-base font-medium text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-colors duration-200" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => {
                setIsAccountModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg text-center text-base font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md transition-all duration-200"
            >
              Akun Saya
            </button>
          </SignedIn>
        </div>
      </div>
      {/* Akhir Mobile Menu Sidebar */}

      {/* Account Modal (sudah ada sebelumnya) */}
      <AccountModal isOpen={isAccountModalOpen} setIsOpen={setIsAccountModalOpen} />
    </>
  );
};

export default Navbar;