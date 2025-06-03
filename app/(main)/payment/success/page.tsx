// app/(main)/payment/success/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Here you could fetch order details from your database using the order_id
    // For now, we'll just show the success message
    console.log('Payment successful for order:', orderId);
  }, [orderId]);
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 text-center shadow-xl dark:shadow-none">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Pembayaran Berhasil!
              </h1>
              <p className="text-zinc-600 dark:text-zinc-300">
                Terima kasih atas pesanan Anda. Pembayaran telah berhasil diproses.
              </p>
            </div>

            {/* Order Details */}
            {orderId && (
              <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">
                  Detail Pesanan
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Order ID:</span>
                    <span className="text-black dark:text-white font-mono">{orderId}</span>
                  </div>
                  {transactionStatus && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Status:</span>
                      <span className="text-green-500 dark:text-green-400 capitalize">{transactionStatus}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Tanggal:</span>
                    <span className="text-black dark:text-white">
                      {new Date().toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <FiPackage className="w-6 h-6 text-orange-500 dark:text-orange-400 mr-2" />
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Langkah Selanjutnya
                </h3>
              </div>
              <ul className="text-sm text-zinc-600 dark:text-zinc-300 space-y-2 text-left">
                <li>• Kami akan segera memproses pesanan Anda</li>
                <li>• Konfirmasi email akan dikirim ke alamat email Anda</li>
                <li>• Pesanan akan dikirim sesuai dengan alamat yang telah dipilih</li>
                <li>• Estimasi waktu pengiriman: 1-3 hari kerja</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/products"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FiPackage className="w-5 h-5 mr-2" />
                Belanja Lagi
              </Link>
              
              <Link
                href="/"
                className="w-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-black dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FiHome className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Link>
            </div>            {/* Contact Support */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                Ada pertanyaan tentang pesanan Anda?
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Hubungi kami di{' '}
                <a
                  href="mailto:support@justeatss.id"
                  className="text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
                >
                  support@justeatss.id
                </a>
                {' '}atau{' '}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
                >
                  WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 py-12 flex items-center justify-center">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
