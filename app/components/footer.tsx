import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-8">
    <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center">
          {/* Logo Section */}
          <div className="mb-4 md:mb-0 pr-10">
            <img
              src="/assets/logo.png"
              alt="Justeatss.id logo"
              className="w-24 h-24"
            />
          </div>

          {/* Newsletter Section */}
          <div className="text-center md:text-left max-w-xl">
            <h4 className="text-xl font-bold mb-2 text-white">
              Stay updated with our latest offers and delicious treats.
            </h4>
            <p className="text-gray-400">
              Join our newsletter for the latest updates.
            </p>
          </div>          
        </div>

        {/* Social Media Section */}
        <div className="flex justify-center mt-6 space-x-6">
          <a href="https://www.instagram.com/justeatss.id/" target="_blank" rel="noopener noreferrer">
            <img
              src="/assets/ig100.png"
              alt="Instagram"
              className="w-8 h-8"
            />
          </a>
          <a href="https://wa.me/+6287741704737" target="_blank" rel="noopener noreferrer">
            <img
              src="/assets/wa100.png"
              alt="WhatsApp"
              className="w-8 h-8"
            />
          </a>
        </div>
        {/* Copyright Section */}
        <div className="text-center text-white mt-8">
          <p>©2022, Justeatss.id - All Rights Reserved</p>
          <div className="flex space-x-4 mt-4 md:mt-0 justify-center">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Shipping Policy
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
