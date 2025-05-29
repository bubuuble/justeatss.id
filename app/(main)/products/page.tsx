// app/(main)/products/page.tsx
import { sanityClient } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

// Interface for the product data needed for the listing
interface ProductListingItem {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  imageUrl?: string;
  alt?: string;
}

// Query to fetch all products (or a subset for pagination)
// Select only the fields needed for the listing card
const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) { // Order by creation date, newest first
    _id,
    name,
    slug,
    price,
    "imageUrl": image.asset->url,
    "alt": image.alt
  }
`;

// Query to search products by name or description
const searchProductsQuery = groq`
  *[_type == "product" && (name match $searchTerm + "*" || description match $searchTerm + "*")] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    "imageUrl": image.asset->url,
    "alt": image.alt
  }
`;

// Fetch all products
async function getAllProducts(): Promise<ProductListingItem[]> {
  try {
    const products = await sanityClient.fetch<ProductListingItem[]>(allProductsQuery);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
}

// Fetch products based on search term
async function searchProducts(searchTerm: string): Promise<ProductListingItem[]> {
  try {
    const products = await sanityClient.fetch<ProductListingItem[]>(searchProductsQuery, { searchTerm });
    return products || [];
  } catch (error) {
    console.error("Failed to search products:", error);
    return [];
  }
}

// Helper to format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};


// --- The Product Listing Page Component ---
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.search?.trim();
  const products = searchTerm ? await searchProducts(searchTerm) : await getAllProducts();

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">        {/* Page Header */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white mb-6">
            <span className="font-light">{searchTerm ? 'Search' : 'Our'}</span>
            <span className="font-bold text-orange-500 ml-4">{searchTerm ? 'Results' : 'Products'}</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            {searchTerm 
              ? `Found ${products.length} result${products.length !== 1 ? 's' : ''} for "${searchTerm}"`
              : 'Discover our carefully crafted selection of premium pastries and delicious treats'
            }
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
              <Link
                key={product._id}
                href={`/products/${product.slug.current}`}
                className="group block"
              >
                <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
                  {/* Product Image */}
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
                      <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                        <div className="text-zinc-500 text-sm font-light">No Image</div>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-medium text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold text-orange-400">
                      {formatCurrency(product.price)}
                    </p>
                    
                    {/* Hover CTA */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                      <div className="text-sm text-zinc-400 font-medium">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-zinc-800/50 rounded-full flex items-center justify-center border border-zinc-700/50 mb-6">
              <span className="text-zinc-500 text-2xl">{searchTerm ? '🔍' : '🍰'}</span>
            </div>
            <h3 className="text-2xl font-light text-white mb-4">
              {searchTerm ? `No Results for "${searchTerm}"` : 'No Products Found'}
            </h3>
            <p className="text-zinc-400 text-lg mb-6">
              {searchTerm 
                ? 'Try searching with different keywords or browse all our products.'
                : "We're working on adding new delicious items to our collection."
              }
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
        
        {/* Back to Home Link */}
        <div className="text-center mt-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors duration-300 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Optional: Add revalidate for this page if needed
// export const revalidate = 3600; // Revalidate product list every hour