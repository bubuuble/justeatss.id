// app/components/AccountModal.tsx
"use client";

import React, { Fragment } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { UserProfile, SignOutButton, useUser } from "@clerk/nextjs";
import ManageAddresses from "./ManageAddresses";
import { FiX, FiUser, FiMapPin, FiLogOut } from "react-icons/fi";

interface AccountModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useUser();

  React.useEffect(() => {
    if (!user && isOpen) {
      setIsOpen(false);
    }
  }, [user, isOpen, setIsOpen]);

  const userProfileAppearance = {
    elements: {
      card: {
        boxShadow: "none",
        border: "none",
        backgroundColor: "transparent",
        width: "100%",
      },
    },
  };

  const tabs = [
    { name: "Profile", icon: <FiUser className="mr-2" /> },
    { name: "Address", icon: <FiMapPin className="mr-2" /> },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-[950px] w-full rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/50 shadow-2xl overflow-hidden flex flex-col">
              {/* Header with subtle gradient background */}
              <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-zinc-700/50">
                <Dialog.Title className="text-xl font-bold text-white flex items-center">
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Akun Saya
                  </span>
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1.5 transition-all duration-200 hover:bg-zinc-700/50"
                  aria-label="Tutup modal akun"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs with improved styling */}
              <Tab.Group defaultIndex={0}>
                <Tab.List className="flex-shrink-0 flex space-x-1 p-2 border-b border-zinc-700/50 bg-zinc-800/40">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 px-4 text-sm font-medium leading-5 flex items-center justify-center transition-all duration-200",
                          selected
                            ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/30"
                            : "text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                        )
                      }
                    >
                      {tab.icon}
                      {tab.name}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="flex-grow p-6 overflow-y-auto max-h-[70vh]">
                  {/* Panel 1: Profile */}
                  <Tab.Panel className="focus:outline-none space-y-4">
                    <UserProfile
                      routing="hash"
                      appearance={userProfileAppearance}
                    />
                  </Tab.Panel>

                  {/* Panel 2: Addresses */}
                  <Tab.Panel className="focus:outline-none space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                      Alamat Saya
                    </h2>
                    <ManageAddresses />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>              {/* Logout button with improved styling */}
              <div className="flex-shrink-0 border-t border-zinc-700/50 px-6 py-4 bg-zinc-800/30 space-y-3">
                {/* Account Settings Link */}
                <a 
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-all duration-200 shadow-lg shadow-orange-900/30"
                >
                  <FiUser className="mr-2" />
                  Account Settings
                </a>
                
                <SignOutButton redirectUrl="/">
                  <button className="flex items-center w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-all duration-200 shadow-lg shadow-red-900/30">
                    <FiLogOut className="mr-2" />
                    Keluar
                  </button>
                </SignOutButton>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AccountModal;