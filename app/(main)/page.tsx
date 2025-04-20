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
    <main className="flex-grow">
      {/* Hero Section */}
       <section className="relative h-[60vh] md:h-[80vh]">
         <Image
           alt="Delicious pastries background"
           className="w-full h-full object-cover"
           src="/assets/hero.jpg" // Consider making this dynamic via Sanity too
           fill
           priority
         />
         <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
           <h1 className="text-6xl md:text-8xl font-bold text-white italic text-center px-4">
             Justeatss.id
           </h1>
         </div>
      </section>

      {/* Best Sellers Section */}
      <BestSellers products={bestSellerProducts} />

    </main>
  );
}
