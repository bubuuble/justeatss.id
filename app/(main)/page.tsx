// app/(main)/page.tsx
export const revalidate = 0; // Force dynamic rendering, disable caching

// ... rest of your imports and code

import Image from "next/image";
import BestSellers from "@/app/components/BestSellers"; // Adjust import path if needed
import { sanityClient } from "@/sanity/lib/client"; // Adjust import path if needed
import { groq } from "next-sanity"; // Make sure groq is imported

// Define the type for your fetched product data
interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  imageUrl?: string; // Correctly typed as optional string
  alt?: string;      // Correctly typed as optional string
  // Remove image/imageAlt from here if fetching directly like below
}

// --- CORRECTED GROQ QUERY ---
// Use backticks `` to define the query string
// Use "fieldName": value for projection aliases
const bestSellersQuery = groq`
  *[_type == "product" && isBestSeller == true]{
    _id,
    name,
    slug,
    price,
    "imageUrl": image.asset->url, // Get image URL directly
    "alt": image.alt // Get alt text from image object (ensure 'alt' field exists in Sanity image schema)
  }
`;
// --- END CORRECTION ---


// Fetch data server-side
async function getBestSellers(): Promise<Product[]> {
  try {
     const products = await sanityClient.fetch<Product[]>(bestSellersQuery);
     return products || []; // Return empty array on null/undefined
  } catch (error) {
    console.error("Failed to fetch best sellers:", error);
    return []; // Return empty array on error
  }
}


export default async function Home() {
  const bestSellerProducts = await getBestSellers();
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <Image
            alt="Delicious pastries background"
            className="w-full h-full object-cover opacity-40"
            src="/assets/hero.jpg"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-tight">
              <span className="font-extralight">Just</span>
              <span className="font-bold italic">eat</span>
              <span className="font-extralight">ss</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 font-light tracking-wide">
              Artisanal pastries & desserts, crafted with passion
            </p>
            <div className="pt-8">
              <a 
                href="#products" 
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 group"
              >
                Explore Menu
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce mt-2" />
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section id="products" className="relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-zinc-900" />
        <div className="relative z-10">
          <BestSellers products={bestSellerProducts} />
        </div>
      </section>
    </main>
  );
}
