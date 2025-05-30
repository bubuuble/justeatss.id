// app/(main)/test-payment/page.tsx
"use client";

import React, { useState } from 'react';
import { FiPlay, FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function TestPaymentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testPayment = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const testOrder = {
        cartItems: [
          {
            id: "test-product-1",
            name: "Test Choux Cream",
            price: 25000,
            quantity: 2,
            category: "food",
            imageUrl: "/assets/choux.jpg",
            slug: "test-choux-cream"
          },
          {
            id: "test-product-2", 
            name: "Test Cookies",
            price: 15000,
            quantity: 1,
            category: "food",
            imageUrl: "/assets/cookies.jpg",
            slug: "test-cookies"
          }
        ],
        totalAmount: 65000,
        customerName: "John Doe",
        customerEmail: "john.doe@example.com",
        customerPhone: "081234567890",
        shippingAddress: {
          first_name: "John",
          last_name: "Doe",
          address: "Jl. Test No. 123",
          city: "Jakarta",
          postal_code: "12345",
          phone: "081234567890"
        }
      };

      const response = await fetch('/api/midtrans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrder),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Payment creation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/midtrans/notification');
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError('Webhook test failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Midtrans Integration Test
            </h1>
            <p className="text-zinc-300">
              Test the Midtrans payment integration endpoints
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Test */}
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiPlay className="w-5 h-5 mr-2 text-orange-400" />
                Payment Creation Test
              </h2>
              <p className="text-zinc-300 mb-4 text-sm">
                Test creating a payment transaction with sample data
              </p>
              <button
                onClick={testPayment}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FiPlay className="w-5 h-5 mr-2" />
                )}
                Test Payment API
              </button>
            </div>

            {/* Webhook Test */}
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiPlay className="w-5 h-5 mr-2 text-blue-400" />
                Webhook Test
              </h2>
              <p className="text-zinc-300 mb-4 text-sm">
                Test the webhook notification endpoint availability
              </p>
              <button
                onClick={testWebhook}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FiPlay className="w-5 h-5 mr-2" />
                )}
                Test Webhook
              </button>
            </div>
          </div>

          {/* Results */}
          {(result || error) && (
            <div className="mt-8">
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  {error ? (
                    <FiX className="w-5 h-5 mr-2 text-red-400" />
                  ) : (
                    <FiCheck className="w-5 h-5 mr-2 text-green-400" />
                  )}
                  Test Results
                </h3>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                    <p className="text-red-400 font-semibold">Error:</p>
                    <p className="text-red-300">{error}</p>
                  </div>
                )}

                {result && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-400 font-semibold mb-2">Success:</p>
                    <pre className="text-green-300 text-sm overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                    
                    {result.redirectUrl && (
                      <div className="mt-4">
                        <a
                          href={result.redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                        >
                          Open Payment Page
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Test Data Info */}
          <div className="mt-8">
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Test Data Used</h3>
              <div className="text-sm text-zinc-300 space-y-2">
                <p><strong>Items:</strong> Test Choux Cream (2x Rp 25,000), Test Cookies (1x Rp 15,000)</p>
                <p><strong>Total:</strong> Rp 65,000</p>
                <p><strong>Customer:</strong> John Doe (john.doe@example.com)</p>
                <p><strong>Phone:</strong> 081234567890</p>
                <p><strong>Address:</strong> Jl. Test No. 123, Jakarta 12345</p>
              </div>
            </div>
          </div>

          {/* Environment Info */}
          <div className="mt-8">
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Environment Info</h3>
              <div className="text-sm text-zinc-300 space-y-2">
                <p><strong>Mode:</strong> Sandbox (Testing)</p>
                <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}</p>
                <p><strong>Client Key:</strong> {process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ? 'Configured ✓' : 'Not configured ✗'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
