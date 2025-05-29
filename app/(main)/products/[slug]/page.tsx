"use client"

import { useEffect, useState } from "react"
import { sanityClient } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { urlFor } from "@/sanity/lib/image"
import { PortableText } from "@portabletext/react"
import Link from "next/link"
import ProductGallery from "@/app/components/ProductImageViewer"
import { useCart, type CartItem } from "../../context/CartContext"
import Notification from "@/app/components/Notification"
import { ChevronLeft, Heart, Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react"
import type { Metadata } from 'next'; // Import Metadata type
import React from 'react'; // Import React for FC

interface ProductDetail {
  _id: string
  name: string
  slug: { current: string }
  price: number
  image?: any
  gallery?: any[]
  description?: any
  isBestSeller?: boolean
  category?: {
    name: string
    slug: { current: string }
  }
}

const productQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    price,
    image,
    gallery,
    description,
    isBestSeller,
    category->{ name, slug }
  }
`

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
}

// Standard props for a dynamic page like [slug] - Next.js 15+ expects params to be a Promise
interface ProductPageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// Ensure generateMetadata signature is correct if you plan to use it.
// export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
//   const { slug } = params;
//   const product = await sanityClient.fetch<ProductDetail | null>(productQuery, { slug });
//
//   if (!product) {
//     return {
//       title: "Product Not Found",
//     };
//   }
//
//   return {
//     title: `${product.name} - JustEatss.id`,
//     description: product.description ? product.description[0]?.children[0]?.text.substring(0, 160) : `Check out ${product.name}`,
//     openGraph: {
//       title: product.name,
//       description: product.description ? product.description[0]?.children[0]?.text.substring(0, 160) : `Check out ${product.name}`,
//       images: product.image ? [{ url: urlFor(product.image).width(1200).height(630).url() }] : [],
//     },
//   };
// }

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const { addToCart } = useCart()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [slug, setSlug] = useState<string | null>(null)
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  })

  // Handle async params in useEffect
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    resolveParams()
  }, [params])
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return // Don't fetch if slug is not yet resolved
      
      setIsLoading(true)
      setError(null)
      try {
        const fetchedProduct = await sanityClient.fetch<ProductDetail | null>(productQuery, { slug })
        if (!fetchedProduct) {
          setError("Produk tidak ditemukan.")
          setProduct(null)
        } else {
          setProduct(fetchedProduct)
        }
      } catch (err: any) {
        console.error("Gagal memuat produk:", err)
        setError(err.message || "Gagal memuat detail produk.")
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (product) {
      const cartProduct: Omit<CartItem, "quantity"> = {
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.image && urlFor(product.image) ? urlFor(product.image)?.width(100).url() : undefined,
        slug: product.slug?.current,
      }
      addToCart(cartProduct, quantity)

      setNotification({
        isOpen: true,
        message: `${product.name} (x${quantity}) ditambahkan ke keranjang!`,
        type: "success",
      })
    }
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))
  const toggleWishlist = () => setIsWishlisted((prev) => !prev)

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-zinc-800 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-zinc-800 rounded mb-2"></div>
          <div className="h-4 w-36 bg-zinc-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900 rounded-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-zinc-400 mb-4">{error}</p>
          <Link
            href="/products"
            className="inline-block bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-zinc-400 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/products"
            className="inline-block bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-black text-white min-h-screen">
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button - Top */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Products</span>
          </Link>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-orange-400 transition-colors duration-300">
            Home
          </Link>
          <span className="mx-3 text-zinc-600">/</span>
          <Link href="/products" className="hover:text-orange-400 transition-colors duration-300">
            Products
          </Link>
          {product.category && (
            <>
              <span className="mx-3 text-zinc-600">/</span>
              <Link
                href={`/categories/${product.category.slug.current}`}
                className="hover:text-orange-400 transition-colors duration-300"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-3 text-zinc-600">/</span>
          <span className="text-zinc-400 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Product Gallery Section */}
          <div className="lg:sticky lg:top-24">
            {product.image && (
              <div className="rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50">
                <ProductGallery mainImage={product.image} galleryImages={product.gallery} altText={product.name} />
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-6">
              {product.category && (
                <Link
                  href={`/categories/${product.category.slug.current}`}
                  className="inline-block text-sm text-orange-400 hover:text-orange-300 font-medium px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 transition-all duration-300 hover:bg-orange-500/20"
                >
                  {product.category.name}
                </Link>
              )}

              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-zinc-400 font-medium">(24 reviews)</span>
                  </div>

                  {product.isBestSeller && (
                    <span className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Best Seller
                    </span>
                  )}
                </div>

                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-8">
                  {formatCurrency(product.price)}
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="py-8 border-t border-b border-zinc-800/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Description</h3>
              {product.description && Array.isArray(product.description) && product.description.length > 0 ? (
                <div className="prose prose-lg prose-invert max-w-none text-zinc-300 leading-relaxed">
                  <PortableText value={product.description} />
                </div>
              ) : (
                <p className="text-zinc-500 italic text-lg">No description available.</p>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-8">
              {/* Quantity Selector */}
              <div className="space-y-4">
                <label htmlFor="quantity" className="text-lg font-medium text-white">
                  Quantity
                </label>
                <div className="flex items-center w-fit">
                  <button
                    onClick={decrementQuantity}
                    className="w-12 h-12 flex items-center justify-center rounded-l-xl bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 transition-all duration-300 hover:scale-105"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
                    className="w-20 h-12 px-4 text-center bg-zinc-800/50 border-y border-zinc-700/50 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-12 h-12 flex items-center justify-center rounded-r-xl bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 transition-all duration-300 hover:scale-105"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={toggleWishlist}
                    className={`flex items-center justify-center w-14 h-14 rounded-xl font-medium border transition-all duration-300 hover:scale-105 ${
                      isWishlisted
                        ? "bg-pink-500/20 border-pink-500/50 text-pink-400 shadow-lg shadow-pink-500/20"
                        : "border-zinc-700/50 hover:border-orange-500/50 text-zinc-300 hover:bg-zinc-800/50"
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-6 h-6 ${isWishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
                  </button>

                  <button
                    className="flex items-center justify-center w-14 h-14 rounded-xl font-medium border border-zinc-700/50 hover:border-orange-500/50 text-zinc-300 transition-all duration-300 hover:scale-105 hover:bg-zinc-800/50"
                    aria-label="Share product"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/30">
                  <ShoppingBag className="w-6 h-6 text-orange-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white text-lg">Free Delivery</h4>
                  <p className="text-zinc-400">On orders over Rp 150.000</p>
                  <p className="text-sm text-zinc-500">Fast and reliable delivery to your doorstep</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
