import React from 'react';
import { FiShoppingBag } from 'react-icons/fi'; // Shopping bag icon

const Product: React.FC = () => {
  // Helper function for styled product titles
  const renderTitle = (line1: string, line2: string) => (
    <>
      {line1} <br /> {line2}
    </>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white">
        Our Products
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
        <ProductCard
          category="Pastry"
          title={renderTitle('CHOUX AU', 'CRAQUELIN')}
          imageSrc="/images/pastry.jpg" // Replace with actual image path
        />
        <ProductCard
          category="Pasta"
          title={renderTitle('SPAGHETTI', 'BRÛLÉE')}
          imageSrc="/images/pasta.jpg" // Replace with actual image path
        />
        <ProductCard
          category="Cookies"
          title={renderTitle('DOUBLE CHOCO', 'COOKIES')}
          imageSrc="/images/cookies.jpg" // Replace with actual image path
        />
        <ProductCard
          category="Puddings"
          title="PUDDING" // Single line title
          imageSrc="/images/pudding.jpg" // Replace with actual image path
        />
      </div>

      {/* Floating Cart Button - Positioned relative to the container or fixed */}
      {/* Example: Fixed positioning bottom right */}
       <button
         aria-label="View Cart"
         className="fixed bottom-20 right-5 sm:bottom-24 sm:right-8 md:right-12 lg:right-16
                   bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-lg z-40
                   transition-colors"
       >
         <FiShoppingBag size={24} />
       </button>

      {/* Example: Positioning relative to the grid (might need adjustments) */}
      {/* <button
          aria-label="View Cart"
          className="absolute -bottom-8 right-0 sm:bottom-5 sm:right-5
                   bg-zinc-800 hover:bg-zinc-700 text-white p-3 sm:p-4 rounded-md shadow-lg z-10
                   transition-colors"
       >
         <FiShoppingBag size={20} sm:size={24} />
       </button> */}

      {/* Spacer before footer if subscription moved there */}
      <div className="h-16"></div> {/* Adjust height as needed */}

    </div>
  );
};

export default Product;