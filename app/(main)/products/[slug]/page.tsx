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

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { addToCart } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  })

  useEffect(() => {
    const fetchProduct = async () => {
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

    if (slug) {
      fetchProduct()
    }
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

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center text-sm text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-white transition-colors">
            Products
          </Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/categories/${product.category.slug.current}`}
                className="hover:text-white transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-zinc-500 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Product Gallery Section */}
          <div className="lg:sticky lg:top-24">
            {product.image && (
              <ProductGallery mainImage={product.image} galleryImages={product.gallery} altText={product.name} />
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Link
                  href={`/categories/${product.category.slug.current}`}
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-block mb-2"
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-zinc-400">(24 reviews)</span>
                </div>

                {product.isBestSeller && (
                  <span className="inline-flex items-center bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded">
                    BEST SELLER
                  </span>
                )}
              </div>

              <p className="text-3xl font-bold text-white">{formatCurrency(product.price)}</p>
            </div>

            {/* Product Description */}
            <div className="py-4 border-t border-b border-zinc-800">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              {product.description && Array.isArray(product.description) && product.description.length > 0 ? (
                <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-zinc-300">
                  <PortableText value={product.description} />
                </div>
              ) : (
                <p className="text-zinc-500 italic">Deskripsi tidak tersedia.</p>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-6 pt-4">
              {/* Quantity Selector */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium text-zinc-300">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-l-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
                    className="w-16 h-10 px-2 text-center bg-zinc-800 border-x-0 border-y border-zinc-700 text-white focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-r-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium border ${
                    isWishlisted
                      ? "bg-pink-900/20 border-pink-700 text-pink-400"
                      : "border-zinc-700 hover:border-zinc-600 text-zinc-300"
                  } transition-colors`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
                </button>

                <button
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium border border-zinc-700 hover:border-zinc-600 text-zinc-300 transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-zinc-900/50 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 p-2 rounded-md">
                  <ShoppingBag className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Free delivery on orders over Rp 150.000</h4>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-16 mb-8">
          <Link href="/products" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
