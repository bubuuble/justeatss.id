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
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "FAQ & Help", href: "#" },
  { name: "Store Location", href: "#" },
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
    <footer className="bg-gradient-to-b from-zinc-900 to-black text-zinc-300 py-20 px-6 md:px-10 lg:px-16 border-t border-zinc-800/50">
      <div className="container mx-auto max-w-7xl">

        {/* Top Row: Logo & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 pb-12 border-b border-zinc-800/50">
          {/* Logo & Brand */}
          <div className="mb-8 lg:mb-0">
            <Link href="/" className="group inline-block">
              <div className="relative">
                <img
                  src="/assets/logo.png"
                  alt="Justeatss.id logo"
                  className="w-20 h-20 rounded-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
              </div>
            </Link>
            <div className="mt-4 space-y-2">
              <h3 className="text-xl font-light text-white">Justeatss.id</h3>
              <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
                Crafting exceptional culinary experiences with passion and dedication
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-auto lg:max-w-md">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Stay Updated</h4>
                <p className="text-sm text-zinc-400">Get the latest updates on our delicious offerings</p>
              </div>
              <form className="group">
                <div className="relative">
                  <input
                    type="email"
                    id="footer-email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-black font-semibold hover:from-orange-400 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 hover:scale-105 text-sm"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Grid: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Col 1: Store Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative">
                Our Store
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              </h3>
              <ul className="space-y-3">
                {stores.map((store) => (
                  <li key={store.name}>
                    <a href={store.href} className="flex items-center gap-3 hover:text-white group transition-colors duration-300">
                      <FaMapMarkerAlt className="text-orange-500 group-hover:text-orange-400 flex-shrink-0 transition-colors duration-300" />
                      <span className="text-sm">{store.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-white mb-4">Hours</h4>
              <div className="space-y-2">
                {operationalHours.map((op, index) => (
                  <p key={index} className="text-sm text-zinc-400">
                    {op.hours}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            </h3>
            <div className="space-y-6">
              <div>
                <p className="font-medium text-white mb-2 text-sm">WhatsApp</p>
                <a 
                  href="https://wa.me/+6281387017677" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 hover:text-white group transition-colors duration-300"
                >
                  <FaWhatsapp className="text-green-500 group-hover:text-green-400 transition-colors duration-300" />
                  <span className="text-sm">+62-813-8701-7677</span>
                </a>
              </div>
              <div>
                <p className="font-medium text-white mb-2 text-sm">Email</p>
                <a 
                  href="mailto:info@justeatss.id" 
                  className="flex items-center gap-3 hover:text-white group transition-colors duration-300"
                >
                   <FaEnvelope className="text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                   <span className="text-sm">info@justeatss.id</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Information
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm hover:text-white hover:text-orange-400 transition-colors duration-300 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Social & Platforms */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative">
                Available On
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              </h3>
              <ul className="space-y-3">
                {availableOn.map((platform) => (
                  <li key={platform.name}>
                    <a 
                      href={platform.href} 
                      className="text-sm hover:text-white hover:text-orange-400 transition-colors duration-300 block py-1"
                    >
                       {platform.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-white mb-4">Follow Us</h4>
              <div className="flex items-center gap-4">
                 {socialLinks.map(({ name, href, Icon }) => (
                  <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="text-zinc-400 hover:text-orange-400 transition-all duration-300 p-2 rounded-lg hover:bg-zinc-800/50 group"
                  >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Copyright */}
        <div className="text-center border-t border-zinc-800/50 pt-8">
            <p className="text-zinc-500 text-sm">
                © {new Date().getFullYear()} Justeatss.id - All Rights Reserved.
            </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;