// app/(main)/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { FiCoffee, FiHeart, FiUsers, FiAward, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-black flex-grow text-black dark:text-white">

      {/* 1. Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30">
        <Image
          src="/assets/hero1.jpg" // Using an existing bakery-themed image
          alt="Artisanal bread and pastries display"
          fill
          className="object-cover object-center opacity-40 dark:opacity-30"
          priority
        />
        <div className="relative z-10 px-4 py-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-zinc-800 dark:text-white text-shadow-sm dark:text-shadow-none">
            The Heart of Justeatss
          </h1>
          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-200 max-w-3xl mx-auto leading-relaxed">
            Discover the passion, craftsmanship, and community spirit that bake Justeatss into a beloved neighborhood bakery.
          </p>
        </div>
      </section>

      {/* Container for content sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20 md:space-y-28">

        {/* 2. Our Philosophy Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center">
              <FiHeart className="text-orange-500 mr-3 text-4xl" /> Our Baking Philosophy
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
              At Justeatss,we believe that the best-tasting treats start with the finest ingredients and a sprinkle of love. We source locally whenever possible, supporting our community farmers and ensuring freshness in every bite. Our bakers are artisans, dedicated to traditional techniques while embracing innovative flavors.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              From hand-kneaded sourdough to delicate pastries, every item is crafted with meticulous care. We aim to create not just food, but moments of joy and connection for our customers.
            </p>
            <Link href="/products" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg shadow-md hover:shadow-lg">
              Explore Our Menu
            </Link>
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl group">
            <Image
              src="/assets/choux1.jpg" // Using an existing bakery-themed image
              alt="Close-up of freshly baked choux pastries"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <p className="text-white text-lg font-semibold">Crafted with passion daily.</p>
            </div>
          </div>
        </section>

        {/* 4. Our Commitment Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group order-last md:order-first">
            <Image
              src="/assets/coookies.jpg" // Using an existing bakery-themed image
              alt="Freshly baked cookies on a tray"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <p className="text-white text-lg font-semibold">Quality you can taste.</p>
            </div>
          </div>
          <div className="space-y-6 md:order-last">
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center">
              <FiAward className="text-orange-500 mr-3 text-4xl" /> Our Commitment
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
              We are committed to quality, community, and sustainability. This means using eco-friendly packaging, reducing waste, and giving back through local partnerships. We believe a good bakery is a cornerstone of its community.
            </p>
            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center"><FiCoffee className="text-green-500 mr-2" /> Freshly baked daily, no compromises.</li>
              <li className="flex items-center"><FiHeart className="text-red-500 mr-2" /> Sourced from local and ethical suppliers.</li>
              <li className="flex items-center"><FiUsers className="text-blue-500 mr-2" /> A warm and welcoming space for everyone.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

// Add simple text shadow utility if needed in globals.css
/*
@layer utilities {
  .text-shadow-sm {
    text-shadow: 1px 1px 2px rgb(0 0 0 / 0.2);
  }
  .text-shadow-md {
    text-shadow: 1px 1px 3px rgb(0 0 0 / 0.3);
  }
}
*/