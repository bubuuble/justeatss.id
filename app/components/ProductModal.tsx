"use client"; // Pastikan ini ada di bagian atas file

import React from 'react';
import { FiX } from 'react-icons/fi';

interface Product {
  title: string;
  description: string;
  image: string;
  typeOptions: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
        <button onClick={onClose} className="absolute top-2 right-2">
          <FiX size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">{product.title}</h2>
        <img src={product.image} alt={product.title} className="w-full h-auto mb-4" />
        <p className="mb-4">{product.description}</p>
        
        <div className="mb-4">
          <label className="block mb-2">Type</label>
          <select className="border rounded p-2">
            {product.typeOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Quantity</label>
          <input type="number" min="1" defaultValue="1" className="border rounded p-2 w-full" />
        </div>

        <div className="flex justify-between">
          <button className="bg-blue-500 text-white p-2 rounded">Add to Cart</button>
          <button className="bg-green-500 text-white p-2 rounded">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 