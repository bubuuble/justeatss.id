// components/BestSellers.tsx
"use client"; // Still needed for Swiper

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../(main)/context/CartContext';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import Notification from './Notification';

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
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const handleAddToCart = (product: Product) => {
    // Check if user is logged in
    if (!isLoaded) {
      setNotification({
        isOpen: true,
        message: "Please wait...",
        type: "error",
      });
      return;
    }

    if (!user) {
      setNotification({
        isOpen: true,
        message: "Please login to add items to cart",
        type: "error",
      });
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
      return;
    }

    // Check if product is in stock
    if (product.inStock === false) {
      setNotification({
        isOpen: true,
        message: "This product is currently out of stock",
        type: "error",
      });
      return;
    }

    // Add to cart
    const success = addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug?.current,
      inStock: product.inStock
    });

    if (success) {
      setNotification({
        isOpen: true,
        message: `${product.name} added to cart!`,
        type: "success",
      });
    } else {
      setNotification({
        isOpen: true,
        message: "Failed to add item to cart",
        type: "error",
      });
    }  };
  return (
    <>
      <div className="py-20 md:py-24 bg-black text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white">
              <span className="font-light">Best</span>
              <span className="font-bold text-orange-500 ml-4">Sellers</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              Discover our most beloved creations that define exceptional taste
            </p>
            <Link href="/products" className="inline-block group mt-8">
              <div className="relative">
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform group-hover:scale-105 shadow-lg shadow-orange-500/25">
                  Explore All Products
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300" />
              </div>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="group">
                <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
                  <Link href={`/products/${product.slug.current}`} className="block">
                    {/* Product Image */}
                    <div className="aspect-square w-full overflow-hidden relative">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.alt || product.name}
                          fill
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                          <div className="text-zinc-500 text-sm font-light">No Image</div>
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Out of stock overlay */}
                      {product.inStock === false && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-semibold px-4 py-2 bg-red-500 rounded-full text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-medium text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold text-orange-400">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </Link>
                    {/* Add to Cart Button */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                        product.inStock === false
                          ? 'bg-zinc-700 cursor-not-allowed text-zinc-400 opacity-50'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-black hover:from-orange-400 hover:to-orange-500 hover:scale-105 shadow-lg shadow-orange-500/25'
                      }`}
                      disabled={product.inStock === false}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>{product.inStock === false ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-zinc-500 text-lg font-light">No best sellers found.</p>
            </div>          )}        </div>
      </div>
    </div>

      {/* Notification Component */}
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default BestSellers;