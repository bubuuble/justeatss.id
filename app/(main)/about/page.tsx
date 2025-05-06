// app/(main)/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi'; // Example icon for newsletter

export default function AboutPage() {
  return (
    // Assuming main layout provides black background and base text color
    <main className="flex-grow text-white">

      {/* 1. Hero Section */}
    <section className="relative h-[65vh] md:h-[75vh] flex items-center justify-center text-center">
        {/* Background Image */}
        <Image
          src="/assets/hero1.jpg" // Replace with your actual hero image path
          alt="Bakery interior"
          fill
          className="object-cover object-center opacity-30" // Dim the background
          priority
        />
        {/* Overlay Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-shadow-md"> {/* Added simple text shadow */}
            Our Story
          </h1>
          <p className="text-base md:text-lg text-zinc-200 max-w-2xl mx-auto text-shadow-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>
      </section>

      {/* Container for content sections */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-20 space-y-16 md:space-y-24">

        {/* 2. Foundation Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100">
              Foundation Story
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </p>
          </div>
          {/* Image Placeholder */}
          <div className="aspect-video bg-zinc-800 rounded-lg shadow-lg flex items-center justify-center text-zinc-500">
            {/* Replace with <Image /> component when data is ready */}
            <span>Image Placeholder (16:9)</span>
          </div>
        </section>

        {/* 3. Second Section (Reversed) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image Placeholder (Order first on mobile, second on desktop) */}
          <div className="aspect-square bg-zinc-800 rounded-lg shadow-lg flex items-center justify-center text-zinc-500 order-last md:order-first">
             {/* Replace with <Image /> component when data is ready */}
            <span>Image Placeholder (1:1)</span>
          </div>
          {/* Text Content (Order second on mobile, first on desktop) */}
          <div className="space-y-4 md:order-last">
            {/* Optional Heading could go here */}
            <p className="text-zinc-300 leading-relaxed">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
             <p className="text-zinc-400 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </p>
          </div>
        </section>

        {/* 4. Third Section ("Where the journey begins") */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100">
              Where the journey begins
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Welcome to Justeatss, where every bite tells a story. We believe in bringing the finest, freshest ingredients to your table, making each moment a delicious experience. Join us on this exciting culinary journey and discover the joy of homemade treats, crafted with love.
            </p>
              <p className="text-zinc-400 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
          </div>
          {/* Image Placeholder */}
          <div className="aspect-square bg-zinc-800 rounded-lg shadow-lg flex items-center justify-center text-zinc-500">
            {/* Replace with <Image /> component when data is ready */}
            <span>Image Placeholder (1:1)</span>
          </div>
        </section>

      </div> {/* End container for content sections */}

      {/* Note: Footer is likely rendered by app/(main)/layout.tsx */}

    </main>
  );
}

// Add simple text shadow utility if needed in globals.css
/*
@layer utilities {
  .text-shadow-sm {
    text-shadow: 1px 1px 2px rgb(0 0 0 / 0.4);
  }
  .text-shadow-md {
    text-shadow: 1px 1px 3px rgb(0 0 0 / 0.6);
  }
}
*/