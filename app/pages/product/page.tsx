"use client";

import React, { useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import Image from "next/image";

const Product: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("Small");

  const openModal = (image: string, title: string) => {
    setSelectedImage(image);
    setSelectedTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedTitle(null);
    setQuantity(1); // Reset quantity when modal is closed
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

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

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
        <div
          className="text-center mb-2 cursor-pointer"
          onClick={() => openModal("/assets/Choux.jpg", "Choux Craquelin")}
        >
          <h2 className="text-lg font-bold text-white">Pastry</h2>
          <Image
            src="/assets/Choux.jpg"
            alt="Choux Craquelin"
            width={400}
            height={300}
            className="rounded-md mx-auto mt-3"
            unoptimized
          />
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#4E4E4E] rounded-lg p-6 max-w-4xl w-full relative flex">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold"
            >
              &times;
            </button>

            {/* Gambar dan Deskripsi Produk */}
            <div className="w-1/2 pr-6">
              <Image
                src={selectedImage!}
                alt={selectedTitle || "Product"}
                width={400}
                height={300}
                className="rounded-md"
                unoptimized
              />
            </div>

            <div className="w-1/2">
              <h2 className="text-3xl font-semibold mb-4">{selectedTitle}</h2>
              <p className="text-[#4E4E4E]-600 mb-4">
                Choux au Craquelin adalah salah satu jenis pastry Prancis yang
                terbuat dari donat choux (adonan ringan yang dipanggang) yang diberi
                lapisan craquelin, yaitu adonan gula yang dipanggang hingga membentuk
                lapisan renyah di atasnya. Pastry ini memiliki tekstur yang ringan
                di dalam dan renyah di luar, serta sering kali diisi dengan krim
                kental atau isi manis lainnya.
              </p>

              {/* Pilihan Ukuran */}
              <div className="mb-4">
                <p className="text-white-600 text-sm">Type</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => setSelectedSize("Small")}
                    className={`px-4 py-2 text-black rounded-md ${
                      selectedSize === "Small" ? "bg-gray-400" : "bg-[#D9D9D9]"
                    }`}
                  >
                    Small (3 pcs)
                  </button>
                  <button
                    onClick={() => setSelectedSize("Medium")}
                    className={`px-4 py-2 text-black rounded-md ${
                      selectedSize === "Medium" ? "bg-gray-400" : "bg-[#D9D9D9]"
                    }`}
                  >
                    Medium (6 pcs)
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4 flex justify-center items-center space-x-4">
                <button onClick={handleDecrease} className="text-xl text-white font-semibold">
                  -
                </button>
                <span className="text-lg text-white">{quantity}</span>
                <button onClick={handleIncrease} className="text-xl text-white font-semibold">
                  +
                </button>
              </div>

              {/* Tombol */}
              <div className="flex space-x-4">
                <button className="w-full py-2 bg-[#D9D9D9] text-black rounded-md hover:bg-gray-400">
                  Add to Cart
                </button>
                <button className="w-full py-2 bg-[#D9D9D9] text-black rounded-md hover:bg-gray-400">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Cart */}
      <button
        aria-label="View Cart"
        className="fixed bottom-20 right-5 sm:bottom-24 sm:right-8 md:right-12 lg:right-16
                 bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-lg z-40
                 transition-colors"
      >
        <FiShoppingBag size={24} />
      </button>

      <div className="h-16" />
    </div>
  );
};

export default Product;
