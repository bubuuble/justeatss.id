// components/BestSellers.tsx
"use client"; // Still needed for Swiper

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

// Define the Product type expected from Sanity (or import from a types file)
interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  imageUrl?: string; // Now fetched directly
  alt?: string;
  // Add other fields if needed
}

// Accept products as a prop
interface BestSellersProps {
    products: Product[];
}

const BestSellers: React.FC<BestSellersProps> = ({ products }) => {
  // Helper to format currency (can be moved to utils)
  const formatCurrency = (amount: number): string => {
     return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="py-12 md:py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-zinc-100">
            Best Seller Products
          </h2>
          <p className="text-base text-zinc-400 mb-5">
            Discover the wide selection of our delicious menu
          </p>
          <Link href="/products">
            <button className="bg-zinc-800 text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-zinc-500">
              SEE ALL
            </button>
          </Link>
        </div>

        {/* Swiper Carousel */}
        <div className="relative px-10 md:px-0">
          {products && products.length > 0 ? ( // Check if products exist
             <Swiper
               modules={[Navigation, A11y]}
               spaceBetween={20}
               slidesPerView={1.5}
               navigation
               grabCursor={true}
               breakpoints={{
                 640: { slidesPerView: 2, spaceBetween: 20 },
                 768: { slidesPerView: 3, spaceBetween: 25 },
                 1024: { slidesPerView: 4, spaceBetween: 30 },
               }}
               className="!pb-1"
             >
               {products.map((product) => (
                 <SwiperSlide key={product._id}> {/* Use Sanity's _id as key */}
                   <div className="group text-center">
                     <Link href={`/product/${product.slug.current}` || '#'} className="block"> {/* Use slug for link */}
                       <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-800 mb-4 relative">
                         {product.imageUrl && ( // Check if imageUrl exists
                           <Image
                             src={product.imageUrl}
                             alt={product.alt || product.name} // Use defined alt or fallback to name
                             fill
                             className="object-cover object-center group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                             sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" // Help optimize image loading
                           />
                         )}
                       </div>
                       <h3 className="text-sm font-medium text-zinc-100 mb-1 truncate px-1">
                           {product.name}
                       </h3>
                       <p className="text-sm font-semibold text-zinc-300">
                           {formatCurrency(product.price)} {/* Format the price */}
                       </p>
                     </Link>
                   </div>
                 </SwiperSlide>
               ))}
             </Swiper>
           ) : (
             <p className="text-center text-zinc-500">No best sellers found.</p> // Fallback message
           )}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;