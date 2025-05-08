// app/components/AccountModal.tsx
"use client";

import React, { Fragment, useState, Dispatch, SetStateAction } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { UserProfile } from '@clerk/nextjs';
import ManageAddresses from './ManageAddresses';
import { FiX } from 'react-icons/fi';

interface AccountModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, setIsOpen }) => {
  const userProfileAppearance = { elements: { card: { boxShadow: 'none', border: 'none', backgroundColor: 'transparent', width: '100%' }}};

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {/* ... Backdrop ... */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      {/* ... Centering Container ... */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
      <Dialog.Panel className="mx-auto max-w-[60vw] w-full rounded-lg bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden">
          {/* ... Header ... */}
           <div className="flex justify-between items-center border-b border-zinc-700 px-5 py-3">
              <Dialog.Title className="text-lg font-semibold text-white">Account</Dialog.Title>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1" aria-label="Close account modal" ><FiX className="h-5 w-5" /></button>
           </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-t-lg bg-zinc-800/90 p-1 border-b border-zinc-700 px-3">
              {['Profile', 'Address'].map((tabName) => (
                <Tab
                  key={tabName}
                  className={({ selected }) => classNames( 'w-full rounded-md py-2 px-3 text-sm font-medium leading-5 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-zinc-900 ring-white ring-opacity-60', selected ? 'bg-zinc-700 text-white shadow' : 'text-zinc-300 hover:bg-white/[0.12] hover:text-white' )}
                >
                  {tabName}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="p-5 max-h-[85vh] overflow-y-auto">
              <Tab.Panel
                 // --- CHANGE HERE ---
                 className={() => classNames('focus:outline-none')}
              >
                 <UserProfile routing="hash" appearance={userProfileAppearance}/>
              </Tab.Panel>
              <Tab.Panel
                 // --- AND HERE ---
                 className={() => classNames('focus:outline-none')}
              >
                 <h2 className="text-xl font-semibold text-white mb-4">My Address</h2>
                 <ManageAddresses />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default AccountModal;