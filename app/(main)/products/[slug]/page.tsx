// app/(main)/product/[slug]/page.tsx
import { sanityClient } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
// Removed urlFor import from here
import Image from 'next/image'; // Still needed if you have other images
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/app/components/ProductImageViewer'; // <-- IMPORT the new component (adjust path)

// Interface remains the same
interface ProductDetail {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  image?: any;
  gallery?: any[];
  description?: any;
  isBestSeller?: boolean;
  category?: {
    name: string;
    slug: { current: string };
  };
}

// Query remains the same
const productQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id, name, slug, price, image, gallery, description, isBestSeller,
    category->{ name, slug }
  }
`;

// getProduct function remains the same
async function getProduct(slug: string): Promise<ProductDetail | null> {
  const product = await sanityClient.fetch<ProductDetail | null>(productQuery, { slug });
  return product;
}

// generateStaticParams remains the same (optional)
export async function generateStaticParams() {
  // ...
  const slugsQuery = groq`*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`;
  const slugs = await sanityClient.fetch<{ slug: string }[]>(slugsQuery);
  return slugs || [];
}

// --- The Page Component ---
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  console.log("Fetched Product Data (Server):", JSON.stringify(product, null, 2));

  const formatCurrency = (amount: number): string => {
     return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Removed mainImageUrl generation from here

  return (
    // Added bg-black text-white to match theme likely
    <div className="bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

            {/* Image Section - Use ProductGallery Component */}
            <ProductGallery mainImage={product.image} galleryImages={product.gallery} altText={product.name} />

            {/* Details Section */}   
            <div className="space-y-4">
            {/* Category Link */}
            {product.category && (
                <Link href={`/category/${product.category.slug.current}`} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium block mb-1">
                    {product.category.name}
                </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-white">
                {product.name}
            </h1>

            <p className="text-2xl font-semibold text-zinc-200">
                {formatCurrency(product.price)}
            </p>

            {/* Best Seller Badge */}
            {product.isBestSeller && (
                <span className="inline-block bg-yellow-500 text-yellow-900 text-xs font-semibold px-2.5 py-0.5 rounded">
                Best Seller
                </span>
            )}

            {/* Description (Portable Text) - CHECK THIS */}
            {product.description && Array.isArray(product.description) && product.description.length > 0 ? (
                 <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-zinc-300">
                    <PortableText value={product.description} />
                </div>
             ) : (
                <p className="text-zinc-500 italic">No description available.</p> // Fallback if description is empty/missing
             )}


            {/* Add to Cart Button */}
            <div className="pt-4">
                <button className="w-full md:w-auto bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors">
                Add to Cart {/* Add functionality later */}
                </button>
            </div>

            </div>
        </div>
        </div>
    </div>
  );
}

// Optional: export const revalidate = 3600;