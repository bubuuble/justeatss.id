// app/components/navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import AccountModal from "./AccountModal";
import { ClientSignedIn, ClientSignedOut } from "./ClientAuthWrapper";
import { useCart } from "../(main)/context/CartContext";
import { 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiUser, 
  FiHome,
  FiPackage,
  FiInfo,
  FiHeart,
  FiBell,
  FiTrendingUp
} from 'react-icons/fi';
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications] = useState(3); // Dummy notification count

  // Enhanced navigation items with icons
  const navigationItems = [
    { href: "/", label: "Home", icon: FiHome, emoji: "🏠" },
    { href: "/products", label: "Products", icon: FiPackage, emoji: "🛍️" },
    { href: "/about", label: "About", icon: FiInfo, emoji: "ℹ️" },
  ];

  // Handle scroll effect with navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <nav className={`bg-black/95 backdrop-blur-xl text-white shadow-2xl sticky top-0 z-40 border-b transition-all duration-300 ${
        isScrolled 
          ? "border-orange-500/30 shadow-orange-500/10" 
          : "border-zinc-800/50"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left Side: Logo + Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 hover:scale-110"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
              
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image 
                      src="/assets/logo.png" 
                      alt="Justeatss Logo" 
                      width={40} 
                      height={40} 
                      className="rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 to-orange-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                  </div>
                  <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-500 transition-all duration-300">
                    Justeatss
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links & Search (Desktop) */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group flex items-center space-x-2 ${
                        isActive 
                          ? "text-orange-400 bg-orange-500/10 border border-orange-500/20" 
                          : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="relative z-10">{item.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="ml-6">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-64 px-4 py-2 pl-10 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                        autoFocus
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 p-2 text-zinc-400 hover:text-white transition-colors duration-300"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all duration-300 group"
                  >
                    <FiSearch className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Notifications, Cart, Wishlist, Auth Controls */}
            <div className="flex items-center space-x-2">
              {/* Search Button (Mobile) */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all duration-300"
              >
                {isSearchOpen ? <FiX className="h-5 w-5" /> : <FiSearch className="h-5 w-5" />}
              </button>

              {/* Cart Icon */}
              <Link href="/cart" className="relative text-zinc-400 hover:text-orange-400 group transition-all duration-300">
                <div className="relative p-2 rounded-xl hover:bg-zinc-800/50 transition-all duration-300">
                  <FiShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-bounce">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Auth Controls */}
              <div className="flex items-center ml-2">
                <ClientSignedOut fallback={<div className="hidden md:flex md:space-x-2"></div>}>
                  <div className="hidden md:flex md:space-x-2">
                    <Link href="/sign-in">
                      <button className="px-4 py-2 rounded-xl text-sm font-medium text-black bg-gradient-to-r from-white to-zinc-100 hover:from-zinc-100 hover:to-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20">
                        Login
                      </button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="px-4 py-2 border border-zinc-600 rounded-xl text-sm font-medium text-white bg-transparent hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-orange-600/10 hover:border-orange-500 transition-all duration-300 hover:scale-105">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                </ClientSignedOut>
                <ClientSignedIn fallback={<div className="ml-3 h-10 w-10 rounded-full bg-zinc-700 animate-pulse"></div>}>
                  <button
                    onClick={() => setIsAccountModalOpen(true)}
                    className="ml-3 flex items-center justify-center h-10 w-10 rounded-full overflow-hidden bg-zinc-700 hover:ring-2 hover:ring-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 hover:scale-110 group relative"
                    aria-label="Open account menu"
                  >
                    {user?.imageUrl ? (
                      <Image src={user.imageUrl} alt="User profile" width={40} height={40} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-orange-500 to-orange-600">
                        <span className="text-sm font-bold text-white">
                          {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </ClientSignedIn>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pl-12 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  autoFocus
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-300"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Enhanced Mobile Menu Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-zinc-900 to-zinc-950 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col border-r border-zinc-800/50 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="mobile-menu"
      >
        {/* Sidebar Header with Close */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="text-lg font-semibold text-white flex items-center">
            <FiMenu className="mr-2 h-5 w-5 text-orange-400" />
            Menu
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl focus:outline-none transition-all duration-300 hover:rotate-90"
            aria-label="Close menu"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        {/* Logo in Sidebar */}
        <div className="flex justify-center py-8 mb-4">
          <Link 
            href="/" 
            className="flex-shrink-0 group" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative">
              <Image 
                src="/assets/logo.png" 
                alt="Justeatss Logo" 
                width={80} 
                height={80} 
                className="rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" 
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 to-orange-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </div>
          </Link>
        </div>
          
        {/* Menu Navigation Links */}
        <div className="px-6 py-2 flex-grow space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 group ${
                  isActive 
                    ? "text-orange-400 bg-orange-500/10 border border-orange-500/20" 
                    : "text-white hover:bg-zinc-800/50 hover:text-orange-400"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-xl group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </Link>
            );
          })}
          
          {/* Divider */}
          <div className="border-t border-zinc-800/50 my-4" />

          {/* Trending/Hot Deals Section */}
          <div className="px-4 py-2">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Quick Access</h3>
          </div>
          
          {/* Cart Link in Mobile Menu */}
          <Link 
            href="/cart" 
            className="flex items-center px-4 py-4 rounded-xl text-base font-medium text-white hover:bg-zinc-800/50 hover:text-orange-400 transition-all duration-300 group" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="mr-3 relative">
              <FiShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </span>
            <span className="flex-1">Shopping Cart</span>
            {itemCount > 0 && (
              <span className="text-orange-400 text-sm font-semibold">
                {itemCount} item{itemCount > 1 ? 's' : ''}
              </span>
            )}
          </Link>
        </div>
        
        {/* Auth Links at Bottom */}
        <div className="mt-auto px-6 py-8 space-y-3 border-t border-zinc-800/50 bg-zinc-900/30">
          <ClientSignedOut fallback={<div className="space-y-3"></div>}>
            <Link 
              href="/sign-in" 
              className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium text-black bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiUser className="inline mr-2" />
              Login
            </Link>
            <Link 
              href="/sign-up" 
              className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium text-white border border-zinc-600 hover:bg-zinc-800/50 hover:border-orange-500 transition-all duration-300 hover:scale-105" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Account
            </Link>
          </ClientSignedOut>
          <ClientSignedIn fallback={<div className="w-full px-4 py-3 rounded-xl bg-zinc-700 animate-pulse"></div>}>
            <button
              onClick={() => {
                setIsAccountModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-center text-base font-medium text-black bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25 flex items-center justify-center"
            >
              <FiUser className="mr-2" />
              My Account
            </button>
          </ClientSignedIn>
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal isOpen={isAccountModalOpen} setIsOpen={setIsAccountModalOpen} />
    </>
  );
};

export default Navbar;