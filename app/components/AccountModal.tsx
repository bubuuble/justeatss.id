// app/components/AccountModal.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { FiSettings, FiLogOut } from "react-icons/fi";

interface AccountModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when user is not authenticated
  useEffect(() => {
    if (!user && isOpen) {
      setIsOpen(false);
    }
  }, [user, isOpen, setIsOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  const handleAccountSettingsClick = () => {
    setIsOpen(false);
  };

  const handleSignOutClick = () => {
    setIsOpen(false);
  };

  if (!user) return null;  return (
    <div className="relative" ref={dropdownRef}>
      <Transition
        show={isOpen}
        as="div"
        className="absolute right-0 top-2 mt-2 w-56 origin-top-right"
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="rounded-lg bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 shadow-2xl shadow-black/50 ring-1 ring-black/5 overflow-hidden">
          {/* Compact User Info Section */}
          <div className="px-3 py-2.5 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border-b border-zinc-700/30">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-sm truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.emailAddresses[0]?.emailAddress || "User"
                  }
                </p>
                <p className="text-zinc-400 text-xs truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Account Settings */}
            <a 
              href="/account"
              onClick={handleAccountSettingsClick}
              className="flex items-center w-full px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-all duration-200 group"
            >
              <FiSettings className="mr-2.5 h-4 w-4 text-zinc-400 group-hover:text-orange-400 transition-colors duration-200" />
              <span>Account Settings</span>
            </a>
            
            {/* Divider */}
            <div className="border-t border-zinc-700/30 my-1" />
            
            {/* Sign Out */}
            <SignOutButton redirectUrl="/">
              <button 
                onClick={handleSignOutClick}
                className="flex items-center w-full px-3 py-2.5 text-sm text-zinc-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
              >
                <FiLogOut className="mr-2.5 h-4 w-4 text-zinc-400 group-hover:text-red-400 transition-colors duration-200" />
                <span>Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default AccountModal;