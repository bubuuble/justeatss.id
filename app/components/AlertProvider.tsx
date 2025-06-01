// app/components/AlertProvider.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo, FiLoader } from 'react-icons/fi';

interface AlertConfig {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
  autoClose?: boolean;
  duration?: number;
}

interface AlertContextType {
  showAlert: (config: AlertConfig) => void;
  showConfirm: (config: AlertConfig) => void;
  showLoading: (message: string) => void;
  hideAlert: () => void;
  isVisible: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setIsVisible(true);
    
    if (config.autoClose !== false) {
      const duration = config.duration || 3000;
      setTimeout(() => {
        hideAlert();
      }, duration);
    }
  };

  const showConfirm = (config: AlertConfig) => {
    setAlertConfig({
      ...config,
      showCancel: true,
      autoClose: false,
    });
    setIsVisible(true);
  };

  const showLoading = (message: string) => {
    setAlertConfig({
      message,
      type: 'loading',
      autoClose: false,
    });
    setIsVisible(true);
    setIsLoading(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
    setIsLoading(false);
    setTimeout(() => {
      setAlertConfig(null);
    }, 300);
  };

  const handleConfirm = async () => {
    if (alertConfig?.onConfirm) {
      setIsLoading(true);
      try {
        await alertConfig.onConfirm();
      } catch (error) {
        console.error('Error in confirm action:', error);
      } finally {
        setIsLoading(false);
      }
    }
    hideAlert();
  };

  const handleCancel = () => {
    if (alertConfig?.onCancel) {
      alertConfig.onCancel();
    }
    hideAlert();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-6 h-6 text-green-500" />;
      case 'error':
        return <FiX className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <FiInfo className="w-6 h-6 text-blue-500" />;
      case 'loading':
        return <FiLoader className="w-6 h-6 text-orange-500 animate-spin" />;
      default:
        return <FiInfo className="w-6 h-6 text-zinc-400" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-900/20';
      case 'error':
        return 'border-red-500/20 bg-red-900/20';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-900/20';
      case 'info':
        return 'border-blue-500/20 bg-blue-900/20';
      case 'loading':
        return 'border-orange-500/20 bg-orange-900/20';
      default:
        return 'border-zinc-500/20 bg-zinc-900/20';
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, showLoading, hideAlert, isVisible }}>
      {children}
      
      {/* Alert Modal */}
      {isVisible && alertConfig && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div 
            className={`bg-zinc-900 border rounded-lg p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            } ${getTypeStyles(alertConfig.type || 'info')}`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              {getIcon(alertConfig.type || 'info')}
              <div>
                {alertConfig.title && (
                  <h3 className="text-lg font-semibold text-white">{alertConfig.title}</h3>
                )}
                <p className="text-zinc-300 leading-relaxed">{alertConfig.message}</p>
              </div>
            </div>

            {/* Actions */}
            {(alertConfig.showCancel || alertConfig.onConfirm) && (
              <div className="flex gap-3 mt-6">
                {alertConfig.showCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {alertConfig.cancelText || 'Cancel'}
                  </button>
                )}
                {alertConfig.onConfirm && (
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      alertConfig.confirmText || 'Confirm'
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Auto-close indicator */}
            {alertConfig.autoClose !== false && !alertConfig.showCancel && (
              <div className="mt-4 text-center">
                <p className="text-xs text-zinc-500">This will close automatically</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
