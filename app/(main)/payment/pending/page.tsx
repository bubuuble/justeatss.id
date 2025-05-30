// app/(main)/payment/pending/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiClock, FiRefreshCw, FiHome, FiInfo } from 'react-icons/fi';

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    console.log('Payment pending for order:', orderId);
    
    // Countdown timer (assuming 30 minutes from now)
    const targetTime = new Date().getTime() + (30 * 60 * 1000);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;
      
      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Expired');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Pending Card */}
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-8 text-center">
            {/* Pending Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-10 h-10 text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pembayaran Tertunda
              </h1>
              <p className="text-zinc-300">
                Pembayaran Anda sedang diproses. Mohon tunggu konfirmasi.
              </p>
            </div>

            {/* Timer */}
            {timeLeft && timeLeft !== 'Expired' && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Waktu Tersisa
                </h2>
                <div className="text-3xl font-mono font-bold text-yellow-400 mb-2">
                  {timeLeft}
                </div>
                <p className="text-sm text-zinc-400">
                  Selesaikan pembayaran sebelum waktu habis
                </p>
              </div>
            )}

            {/* Order Details */}
            {orderId && (
              <div className="bg-zinc-700/50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Detail Pesanan
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Order ID:</span>
                    <span className="text-white font-mono">{orderId}</span>
                  </div>
                  {transactionStatus && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status:</span>
                      <span className="text-yellow-400 capitalize">{transactionStatus}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Waktu Pemesanan:</span>
                    <span className="text-white">
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

            {/* Information */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <FiInfo className="w-6 h-6 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">
                  Informasi Penting
                </h3>
              </div>
              <ul className="text-sm text-zinc-300 space-y-2 text-left">
                <li>• Pembayaran sedang dalam proses verifikasi</li>
                <li>• Untuk transfer bank, konfirmasi biasanya membutuhkan 1-24 jam</li>
                <li>• Untuk e-wallet dan kartu kredit, konfirmasi biasanya instan</li>
                <li>• Anda akan menerima notifikasi email saat pembayaran dikonfirmasi</li>
                <li>• Jangan melakukan pembayaran ulang</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FiRefreshCw className="w-5 h-5 mr-2" />
                Periksa Status Pembayaran
              </button>
              
              <Link
                href="/products"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                Lanjut Belanja
              </Link>
              
              <Link
                href="/"
                className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FiHome className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Link>
            </div>

            {/* Support Section */}
            <div className="mt-8 pt-6 border-t border-zinc-700">
              <p className="text-sm text-zinc-400 mb-2">
                Pembayaran tidak kunjung dikonfirmasi?
              </p>
              <p className="text-sm text-zinc-300">
                Hubungi kami di{' '}
                <a
                  href="mailto:support@justeatss.id"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  support@justeatss.id
                </a>
                {' '}atau{' '}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
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

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PaymentPendingContent />
    </Suspense>
  );
}
