// app/(main)/products/page.tsx
// HAPUS "use client" AGAR JADI SERVER COMPONENT
import { sanityClient } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Interface for the product data needed for the listing
interface ProductListingItem {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  imageUrl?: string;
  alt?: string;
  inStock?: boolean;
}

// Query to fetch all products (or a subset for pagination)
// Select only the fields needed for the listing card
const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    "imageUrl": image.asset->url,
    "alt": image.alt,
    inStock
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
    "alt": image.alt,
    inStock
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
const ProductsListClient = dynamic(() => import('./ProductsListClient'), { ssr: false });

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.search?.trim();
  const products = searchTerm ? await searchProducts(searchTerm) : await getAllProducts();

  return (
    <ProductsListClient products={products} searchTerm={searchTerm || ''} />
  );
}

// Optional: Add revalidate for this page if needed
export const revalidate = 60; // Revalidate product list every 60 detik (1 menit)