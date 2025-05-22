// components/footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt, // For store locations
  FaEnvelope,    // For email
  FaFacebookF,   // Example extra social
  FaYoutube,     // Example extra social
} from "react-icons/fa";

// --- Data Structures ---
const stores = [
  { name: "Justeatss.id", href: "#" }, // Replace # with actual store link/map link
];

const operationalHours = [
  {hours: "Monday - Saturday: 10.00 - 21.00 (GMT+7)" },

];

const infoLinks = [
  { name: "Shipping & Delivery", href: "#" },
  { name: "Terms & Conditions", href: "#" },
  { name: "FAQ & Help", href: "#" },
  { name: "Store Location", href: "#" },
  { name: "Blog", href: "#" },
];

const availableOn = [
  { name: "GoFood", href: "#" },
  { name: "GrabFood", href: "#" },
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/justeatss.id/", Icon: FaInstagram },
  { name: "WhatsApp", href: "https://wa.me/+6287741704737", Icon: FaWhatsapp },
  // Add more if needed
  // { name: "Facebook", href: "#", Icon: FaFacebookF },
  // { name: "Youtube", href: "#", Icon: FaYoutube },
];

// --- Component ---
const Footer: React.FC = () => {
  const pathname = usePathname();
  const excludedPrefixes = ["/sign-in", "/sign-up"];
  const isExcluded = excludedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isExcluded) {
    return null;
  }

  return (
    <footer className="bg-zinc-900 text-zinc-300 py-12 px-6 md:px-10 lg:px-16"> {/* Darker BG, more padding */}
      <div className="container mx-auto">

        {/* Top Row: Logo & Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-zinc-700">
          {/* Logo */}
          <Link href="/" className="mb-6 md:mb-0">
            <img
              src="/assets/logo.png" // Your logo path
              alt="Justeatss.id logo"
              className="w-24 h-auto rounded-full" // Adjust size as needed
            />
          </Link>

          {/* Newsletter */}
          <form className="w-full md:w-auto md:max-w-md">
            <label htmlFor="footer-email" className="block text-sm font-medium mb-2 text-zinc-200">
              Subscribe to our newsletter
            </label>
            <div className="flex">
              <input
                type="email"
                id="footer-email"
                placeholder="your.email@example.com"
                className="flex-grow px-4 py-2 rounded-l-md bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 focus:border-transparent" // Style input
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-r-md bg-zinc-700 text-zinc-100 font-semibold hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-zinc-600 transition-colors" // Style button
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {/* Main Grid: Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 mb-10 text-sm">

          {/* Col 1: Stores & Hours (Wider) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold text-white mb-4">
              Our Stores - Justeatss.id
            </h3>
            <ul className="space-y-2 mb-6">
              {stores.map((store) => (
                <li key={store.name}>
                  <a href={store.href} className="flex items-center gap-2 hover:text-white group">
                    <FaMapMarkerAlt className="text-indigo-400 group-hover:text-indigo-300 flex-shrink-0" />
                    <span>{store.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="text-base font-semibold text-white mb-4">
              Operational Hours
            </h3>
            <div className="space-y-1">
                {operationalHours.map((op, index) => (
                <p key={index}>
                  <span className="font-medium text-zinc-100">{op.hours}</span>
                </p>
                ))}
            </div>
          </div>

          {/* Col 2: Contact Us */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-zinc-100 mb-1">WhatsApp</p>
                <a href="https://wa.me/+6281387017677" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                  <FaWhatsapp />
                  <span>0877-4170-4737</span>
                </a>
              </div>
              <div>
                <p className="font-medium text-zinc-100 mb-1">Email</p>
                <a href="mailto:your.email@example.com" className="flex items-center gap-1.5 hover:text-white"> {/* Replace email */}
                   <FaEnvelope />
                   <span>Send Your Inquiry</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Information */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">Information</h3>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Available On & Social */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">Available On</h3>
            <ul className="space-y-2 mb-6">
              {availableOn.map((platform) => (
                <li key={platform.name}>
                  {/* Decide if these should be links or just text */}
                  <a href={platform.href} className="hover:text-white">
                     {platform.name}
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="text-base font-semibold text-white mb-4">Social Media</h3>
            <div className="flex items-center gap-4">
               {socialLinks.map(({ name, href, Icon }) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-zinc-300 hover:text-white transition-colors duration-200"
                >
                    <Icon className="w-5 h-5 hover:scale-110 transition-transform duration-200" />
                </a>
                ))}
            </div>
          </div>

        </div> {/* End Main Grid */}

        {/* Bottom Row: Copyright & Halal Logo */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-700 pt-6 text-xs"> {/* Adjusted size/padding */}
            <p className="text-zinc-400 mb-4 md:mb-0">
                © {new Date().getFullYear()} Justeatss.id - All Rights Reserved
            </p>
            {/* Add Halal Logo if needed */}
            {/* <img src="/path/to/halal-logo.png" alt="Halal Indonesia" className="h-10 w-auto" /> */}
             {/* Optional: Language switcher placeholder */}
             {/* <div> English (US) ▼ </div> */}
        </div>

      </div> {/* End Container */}
    </footer>
  );
};

export default Footer;