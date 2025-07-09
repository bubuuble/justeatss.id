"use client";
import React from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import Notification from "../../components/Notification";

interface ProductListingItem {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  imageUrl?: string;
  alt?: string;
  inStock?: boolean;
}

interface ProductsListClientProps {
  products: ProductListingItem[];
  searchTerm: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const ProductsListClient: React.FC<ProductsListClientProps> = ({ products, searchTerm }) => {
  const { addToCart } = useCart();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifMsg, setNotifMsg] = React.useState("");

  const handleAddToCart = (product: ProductListingItem) => {
    const success = addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug.current,
      inStock: product.inStock
    });
    if (success) {
      setNotifMsg(`${product.name} added to cart!`);
      setNotifOpen(true);
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Notification
        message={notifMsg}
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        type="success"
        autoClose
        autoCloseTime={2500}
      />
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-black dark:text-white mb-6">
            <span className="font-light">{searchTerm ? "Search" : "Our"}</span>
            <span className="font-bold text-orange-500 ml-4">{searchTerm ? "Results" : "Products"}</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            {searchTerm
              ? `Found ${products.length} result${products.length !== 1 ? "s" : ""} for "${searchTerm}"`
              : "Discover our carefully crafted selection of premium pastries and delicious treats"}
          </p>
          {searchTerm && (
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors duration-300 font-medium"
              >
                ← View All Products
              </Link>
            </div>
          )}
        </div>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {products.map((product) => (
              <div key={product._id} className="group block">
                <Link href={`/products/${product.slug.current}`} className="block">
                  <div className="relative bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-800/50 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
                    <div className="relative aspect-square w-full overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.alt || product.name}
                          fill
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                          <div className="text-zinc-400 dark:text-zinc-500 text-sm font-light">No Image</div>
                        </div>
                      )}
                      {product.inStock === false && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-semibold px-4 py-2 bg-red-500 rounded-full text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-medium text-black dark:text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold text-orange-400">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                      product.inStock === false
                        ? 'bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed text-zinc-500 dark:text-zinc-400 opacity-50'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-black hover:from-orange-400 hover:to-orange-500 hover:scale-105 shadow-lg shadow-orange-500/25'
                    }`}
                    disabled={product.inStock === false}
                  >
                    <span>{product.inStock === false ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-zinc-200 dark:bg-zinc-800/50 rounded-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700/50 mb-6">
              <span className="text-zinc-400 dark:text-zinc-500 text-2xl">{searchTerm ? '🔍' : '🍰'}</span>
            </div>
            <h3 className="text-2xl font-light text-black dark:text-white mb-4">
              {searchTerm ? `No Results for "${searchTerm}"` : 'No Products Found'}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6">
              {searchTerm
                ? 'Try searching with different keywords or browse all our products.'
                : "We're working on adding new delicious items to our collection."}
            </p>
            {searchTerm && (
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors duration-300 font-medium"
              >
                View All Products
              </Link>
            )}
          </div>
        )}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-orange-400 transition-colors duration-300 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsListClient;
