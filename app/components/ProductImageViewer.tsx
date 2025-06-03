// app/components/ProductImageViewer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image'; // Adjust path if needed

interface ProductImageViewerProps {
  mainImage: any; // Sanity Image object
  galleryImages?: any[]; // Array of Sanity Image objects
  altText: string; // Alt text for the main image (product name)
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({
  mainImage,
  galleryImages, // Removing default here to rely on the check below
  altText,
}) => {
  const [selectedImage, setSelectedImage] = useState<any>(mainImage);

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

  // Ensure galleryImages is treated as an array, default to empty if not
  const galleryArray = Array.isArray(galleryImages) ? galleryImages : [];
  // Combine main image and gallery images, filter out any invalid ones
  const allImages = [mainImage, ...galleryArray].filter(img => img?.asset?._ref);

  const selectedImageUrl = selectedImage ? urlFor(selectedImage)?.width(800).height(800).fit('max').auto('format').url() : null;

  const handleThumbnailClick = (image: any) => {
    setSelectedImage(image);
  };

  // --- Log for debugging ---
  console.log("[ProductImageViewer] Calculated allImages:", allImages);
  console.log("[ProductImageViewer] allImages.length:", allImages.length);
  // --- End Log ---


  return (
    <div className="space-y-4">
      {/* Main Displayed Image */}
      {selectedImageUrl ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Image
            key={selectedImage?.asset?._ref} // Use optional chaining for safety
            src={selectedImageUrl}
            alt={altText}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
         <div className="aspect-square w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500">
           No Image Available
         </div>
      )}

      {/* Thumbnails Section - ADDED THE CONDITION BACK */}
      {allImages && allImages.length > 1 && ( // <--- Condition to only show if more than 1 image
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3">
          {allImages.map((imgObj, index) => {
            // --- Check for valid image object again (belt-and-suspenders) ---
            if (!imgObj || !imgObj.asset?._ref) {
                console.warn(`[ProductImageViewer] Skipping invalid image object at index ${index}:`, imgObj);
                return null;
            }
            // --- End Check ---

            const thumbUrl = urlFor(imgObj)?.width(200).height(200).fit('crop').auto('format').url();
            // Use optional chaining for selectedImage too, just in case
            const isSelected = imgObj.asset._ref === selectedImage?.asset?._ref;

            // --- Log inside map ---
            console.log(`[ProductImageViewer] Mapping Thumbnail ${index}:`, { thumbUrl, isSelected });
            // --- End Log ---

            return thumbUrl ? (
              <button
                key={imgObj.asset._ref} // Use asset ref as key
                onClick={() => handleThumbnailClick(imgObj)}                className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-orange-500 ${
                  isSelected ? 'border-orange-500 scale-105' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 opacity-70 hover:opacity-100' // Added scale and opacity changes
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className={`object-cover object-center transition-opacity duration-200`}
                  sizes="20vw"
                />
              </button>
            ) : null;
          })}
        </div>
      )}
      {/* --- END THUMBNAILS SECTION --- */}

    </div>
  );
};

export default ProductImageViewer;