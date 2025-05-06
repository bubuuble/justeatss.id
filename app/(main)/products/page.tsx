// app/(main)/products/page.tsx
import { sanityClient } from '@/sanity/lib/client'; // Adjust path
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image'; // Adjust path
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

// Helper to format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};


// --- The Product Listing Page Component ---
export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="bg-black text-white min-h-screen"> {/* Match your theme */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Our Products
        </h1>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              // Reusable Product Card Component (or inline structure)
              <Link
                key={product._id}
                href={`/product/${product.slug.current}`}
                className="group block bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                   {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.alt || product.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                   ) : (
                     <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">No Image</div>
                   )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-base font-medium text-zinc-100 mb-1 truncate group-hover:text-indigo-300">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-zinc-300">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500">No products found.</p>
        )}
      </div>
    </div>
  );
}

// Optional: Add revalidate for this page if needed
// export const revalidate = 3600; // Revalidate product list every hour