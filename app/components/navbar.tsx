// app/components/navbar.tsx
"use client";

import React, { useState } from "react"; // Import useState
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs"; // Import useUser
import AccountModal from "./AccountModal"; // Import the modal

const Navbar: React.FC = () => {
  const { user } = useUser(); // Get user data for image URL
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false); // Modal state

  return (
    <> {/* Use Fragment to render multiple top-level elements */}
      <nav className="bg-zinc-900 text-white shadow-md sticky top-0 z-40"> {/* Lower z-index than modal */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left Side: Logo and Nav Links */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                  <Image src="/assets/logo.png" alt="Justeatss Logo" width={40} height={40} className="rounded-full"/>
              </Link>
              <div className="hidden md:flex md:items-center md:ml-10 md:space-x-4">
                  <Link href="/" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                  <Link href="/products" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Products</Link>
                  <Link href="/about" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
              </div>
            </div>

            {/* Right Side: Auth Controls */}
            <div className="flex items-center">
              <SignedOut>
                {/* Login/Sign Up buttons */}
                <Link href="/sign-in"><button className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors">Login</button></Link>
                <Link href="/sign-up"><button className="ml-2 px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white hover:text-black transition-colors">Sign Up</button></Link>
              </SignedOut>

              <SignedIn>
                {/* Custom Account Button */}
                <button
                  onClick={() => setIsAccountModalOpen(true)} // Open modal on click
                  className="ml-4 flex items-center justify-center h-9 w-9 rounded-full overflow-hidden bg-zinc-700 hover:ring-2 hover:ring-offset-2 hover:ring-offset-zinc-900 hover:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500"
                  aria-label="Open account menu"
                >
                  {user?.imageUrl ? (
                    <Image src={user.imageUrl} alt="User profile" width={36} height={36} className="h-full w-full object-cover" />
                  ) : (
                    // Fallback initials or icon if no image
                    <span className="text-sm font-medium">
                      {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
                    </span>
                  )}
                </button>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Render the Modal (conditionally controlled by Navbar state) */}
      <AccountModal isOpen={isAccountModalOpen} setIsOpen={setIsAccountModalOpen} />
    </>
  );
};

export default Navbar;