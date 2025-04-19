"use client";

import React, { useState } from "react";
import Image from "next/image";

const AboutUs: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika untuk menangani submit email
    console.log("Email submitted:", email);
  };

  return (
    <div className="relative w-full font-poppins">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <div className="absolute inset-0">
          <Image
            src="/assets/heroaboutus.jpeg"
            alt="Bakery Display"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-9xl font-bold text-white mb-8 font-poppins">Our Story</h1>
          <p className="text-white font-extralight text-lg max-w-2xl mx-auto leading-relaxed font-poppins">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget molestie urna. Sed vel pellentesque tortor, id dignissim ante. Curabitur eu sollicitudin metus.
          </p>
        </div>
      </div>    

      {/* Foundation Story Section */}
      <div className="bg-[#1E1E1E] py-16 px-4">
        <div className="container mx-auto">
          {/* First Row */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-white mb-6 font-poppins">Foundation Story</h2>
              <p className="text-white leading-relaxed font-light">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget molestie urna. Sed vel pellentesque tortor, id dignissim ante. Curabitur eu sollicitudin metus. Pellentesque ac lectus non velit efficitur venenatis. Nam id ipsum quam ultrices lacus eget eget sem. Nunc eleifend ac nulla quis placerat. Integer ultrices ipsum quis facilisis sollicitudin. Suspendisse potenti. Suspendisse leo nibh, auctor vitae justo vel, sagittis tempus mi.
              </p>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/assets/Choux.jpg"
                alt="Foundation Story Image 1"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Image
                src="/assets/spaghetti.jpg"
                alt="Foundation Story Image 2"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-white leading-relaxed font-light">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget molestie urna. Sed vel pellentesque tortor, id dignissim ante. Curabitur eu sollicitudin metus. Pellentesque ac lectus non velit efficitur venenatis. Nam id ipsum quam ultrices lacus eget eget sem. Nunc eleifend ac nulla quis placerat. Integer ultrices ipsum quis facilisis sollicitudin. Suspendisse potenti. Suspendisse leo nibh, auctor vitae justo vel, sagittis tempus mi.
              </p>
            </div>
          </div>

          {/* Third Row */}
          <div className="flex flex-col md:flex-row items-center gap-8 mt-16 mb-16">
            <div className="md:w-1/2">
              <p className="text-white leading-relaxed font-light">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget molestie urna. Sed vel pellentesque tortor, id dignissim ante. Curabitur eu sollicitudin metus. Pellentesque ac lectus non velit efficitur venenatis. Nam id ipsum quam ultrices lacus eget eget sem. Nunc eleifend ac nulla quis placerat. Integer ultrices ipsum quis facilisis sollicitudin. Suspendisse potenti. Suspendisse leo nibh, auctor vitae justo vel, sagittis tempus mi.
              </p>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/assets/regal.jpg"
                alt="Foundation Story Image 3"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Fourth Row */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Image
                src="/assets/pudding.jpg"
                alt="Foundation Story Image 4"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-white leading-relaxed font-light">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget molestie urna. Sed vel pellentesque tortor, id dignissim ante. Curabitur eu sollicitudin metus. Pellentesque ac lectus non velit efficitur venenatis. Nam id ipsum quam ultrices lacus eget eget sem. Nunc eleifend ac nulla quis placerat. Integer ultrices ipsum quis facilisis sollicitudin. Suspendisse potenti. Suspendisse leo nibh, auctor vitae justo vel, sagittis tempus mi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="bg-[#1E1E1E] py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-2 font-poppins">
            Subscribe to our emails
          </h2>
          <p className="text-gray-300 text-sm mb-6 font-light">
            Be the first to know about new products and exclusive offers
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 px-4 py-2 rounded-md bg-[#D9D9D9] text-black border border-gray-600 focus:outline-none focus:border-gray-400 font-poppins"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#D9D9D9] text-black rounded-md hover:bg-gray-500 transition-colors font-poppins"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;