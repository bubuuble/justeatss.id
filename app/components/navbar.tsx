"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <nav className="bg-black text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left Side: Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/assets/logo.png"
                                alt="Justeatss Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </Link>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleSidebar}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Center: Navigation Links (Hidden on Mobile) */}
                    <div className="hidden md:flex md:items-center md:justify-center md:space-x-4 pl-20">
                        <Link href="/" className="hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        <Link href="/products" className="hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                            Products
                        </Link>
                        <Link href="/about" className="hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                            About Us
                        </Link>
                    </div>

                    {/* Right Side: Auth Controls */}
                    <div className="hidden md:flex items-center">
                        <SignedOut>
                            <Link href="/sign-in">
                                <button className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors">
                                    Login
                                </button>
                            </Link>
                            <Link href="/sign-up">
                                <button className="ml-2 px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white hover:text-black transition-colors">
                                    Sign Up
                                </button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <div className="ml-4">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-black text-white w-64 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50`}
            >
                <div className="flex items-center justify-between p-4">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button
                        onClick={toggleSidebar}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col space-y-4 p-4">
                    <Link href="/" className="hover:text-gray-300 transition-colors duration-200">
                        Home
                    </Link>
                    <Link href="/products" className="hover:text-gray-300 transition-colors duration-200">
                        Products
                    </Link>
                    <Link href="/about" className="hover:text-gray-300 transition-colors duration-200">
                        About Us
                    </Link>
                </div>

                {/* Bottom Auth Controls */}
                <div className="mt-auto p-4">
                    <SignedOut>
                        <Link href="/sign-in">
                            <button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link href="/sign-up">
                            <button className="w-full mt-2 px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white hover:text-black transition-colors">
                                Sign Up
                            </button>
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <div className="w-full mt-2">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}
        </nav>
    );
};

export default Navbar;
