// components/BestSellers.tsx
"use client"; // Still needed for Swiper

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../(main)/context/CartContext';

// Define the Product type expected from Sanity (or import from a types file)
interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  imageUrl?: string;
  alt?: string;
  inStock?: boolean; // Added inStock property
}

// Accept products as a prop
interface BestSellersProps {
  products: Product[];
}

const BestSellers: React.FC<BestSellersProps> = ({ products }) => {
  const { addToCart } = useCart();

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="flex flex-col items-center text-center">
                <Link href={`/products/${product.slug.current}`} className="block w-full">
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-800 mb-4 relative">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.alt || product.name}
                        fill
                        className="object-cover object-center group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    )}
                    {product.inStock === false && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-semibold px-3 py-1 bg-red-600 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-zinc-100 mb-1 truncate px-1">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-zinc-300">
                    {formatCurrency(product.price)}
                  </p>
                </Link>
                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.imageUrl,
                      slug: product.slug?.current,
                      inStock: product.inStock
                    })
                  }}
                  className={`mt-4 w-full px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    product.inStock === false 
                    ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                  disabled={product.inStock === false}
                >
                  {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 col-span-full">No best sellers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;