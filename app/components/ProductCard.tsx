import React from 'react';
import Image from 'next/image';

interface ProductCardProps {
  category: string;
  title: string | React.ReactNode; // Allow ReactNode for styled text
  imageSrc: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ category, title, imageSrc }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-3 text-gray-300">{category}</h3>
      <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow-lg group">
        <Image
          src={imageSrc}
          alt={category}
          fill // Use fill for responsive aspect ratio
          style={{ objectFit: 'cover' }} // Ensure image covers the area
          className="transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optional: optimize image loading
        />
        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-start justify-start p-4 sm:p-6 bg-black bg-opacity-10">
          <div className="text-orange-500 text-2xl sm:text-3xl font-bold uppercase leading-tight tracking-wide">
             {/* Using brand-orange if defined in tailwind.config.ts */}
             {/* <div className="text-brand-orange text-2xl sm:text-3xl font-bold uppercase leading-tight tracking-wide"> */}
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;