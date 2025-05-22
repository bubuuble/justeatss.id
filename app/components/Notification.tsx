// app/components/Notification.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { FiCheck, FiShoppingCart, FiX } from 'react-icons/fi';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'success',
  isOpen,
  onClose,
  autoClose = true,
  autoCloseTime = 3000,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, autoCloseTime, onClose]);

  if (!isOpen) return null;

  const bgColor = {
    success: 'bg-amber-600',
    error: 'bg-red-600',
    info: 'bg-zinc-800',
  }[type];

  const icon = {
    success: <FiCheck className="text-white" size={18} />,
    error: <FiX className="text-white" size={18} />,
    info: <FiShoppingCart className="text-white" size={18} />,
  }[type];

  return (
    <div className="fixed top-20 right-0 left-0 z-50 flex justify-center mx-auto">
      <div 
        className={`${bgColor} text-white px-4 py-3 rounded-md shadow-lg flex items-center max-w-md mx-4 animate-fade-in-down`}
        style={{ animationDuration: '0.3s' }}
      >
        <div className="mr-3">
          <div className="p-1">{icon}</div>
        </div>
        <div className="flex-grow">{message}</div>
        <button 
          onClick={onClose}
          className="ml-3 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default Notification;

// Tambahkan animasi ini ke globals.css Anda:
// 
// @keyframes fadeInDown {
//   from {
//     opacity: 0;
//     transform: translateY(-20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// 
// .animate-fade-in-down {
//   animation-name: fadeInDown;
//   animation-duration: 0.3s;
//   animation-fill-mode: both;
// }