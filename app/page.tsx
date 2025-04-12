"use client";
import Image from "next/image";
import Navbar from "./components/navbar";

import { useState } from "react";
import Footer from "./components/footer";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
  };
  return (
    <main className="flex-grow">
      {/* Hero Section with Food Image */}
      <Navbar />
      <section className="relative">
        <img 
          alt="Delicious pastries" 
          className="w-full h-180 object-cover" 
          src="/assets/hero.jpg" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* <h2 className="text-2xl text-white mb-2 font-thin">
            Welcome To
            </h2> */}
            <h1 className="text-7xl font-bold text-white italic">
            Justeatss.id
            </h1>
        </div>
      </section>

      {/* Products Section */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Our Products</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-2 rounded-lg">
            <Image 
              src="/assets/Choux.jpg" 
              alt="Choux Au Craquelin" 
              width={200} 
              height={150}
              className="w-full h-auto object-cover rounded-md"
            />
            <p className="mt-2 text-center text-sm">Choux Au Craquelin</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <Image 
              src="/assets/spaghetti.jpg" 
              alt="Spaghetti Brulee" 
              width={200} 
              height={150}
              className="w-full h-auto object-cover rounded-md"
            />
            <p className="mt-2 text-center text-sm">Spaghetti Brulee</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <Image 
              src="/assets/Pudding.jpg" 
              alt="Pudding" 
              width={200} 
              height={150}
              className="w-full h-auto object-cover rounded-md"
            />
            <p className="mt-2 text-center text-sm">Pudding</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <Image 
              src="/assets/coookies.jpg" 
              alt="Double Choco Cookies" 
              width={200} 
              height={150}
              className="w-full h-auto object-cover rounded-md"
            />
            <p className="mt-2 text-center text-sm">Double Choco Cookies</p>
          </div>
        </div>
      </div>

      {/* Sweet Savory Section */}
      <div className="px-4 pt-50">
        <h2 className="text-8xl font-bold mb-4 text-center">Sweet and Savory</h2>
      </div>

      {/* Subscribe Section */}
      <div className="px-4 py-6">
        <h3 className="text-xl font-semibold mb-2 text-center">Subscribe to our emails</h3>
        <form onSubmit={handleSubscribe} className="mb-8 flex flex-col items-center">
          <div className="relative w-150">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full p-2 rounded-lg bg-white text-black pr-20"
              required
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-transparent text-black rounded-r-lg hover:bg-gray-200 flex items-center justify-center"
            >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5l6 6m0 0l-6 6m6-6H3"
              />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
}
