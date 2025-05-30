// app/(main)/payment/error/page.tsx
"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiXCircle, FiRefreshCw, FiHome, FiAlertTriangle } from 'react-icons/fi';

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');
  const statusMessage = searchParams.get('status_message');

  useEffect(() => {
    console.log('Payment failed for order:', orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Error Card */}
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiXCircle className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pembayaran Gagal
              </h1>
              <p className="text-zinc-300">
                Maaf, terjadi kesalahan dalam memproses pembayaran Anda.
              </p>
            </div>

            {/* Error Details */}
            {(orderId || transactionStatus || statusMessage) && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center justify-center">
                  <FiAlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Detail Kesalahan
                </h2>
                <div className="space-y-2 text-sm text-left">
                  {orderId && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Order ID:</span>
                      <span className="text-white font-mono">{orderId}</span>
                    </div>
                  )}
                  {transactionStatus && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status:</span>
                      <span className="text-red-400 capitalize">{transactionStatus}</span>
                    </div>
                  )}
                  {statusMessage && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Pesan:</span>
                      <span className="text-white">{statusMessage}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Waktu:</span>
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

            {/* Common Causes */}
            <div className="bg-zinc-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Kemungkinan Penyebab
              </h3>
              <ul className="text-sm text-zinc-300 space-y-2 text-left">
                <li>• Saldo atau limit kartu kredit/debit tidak mencukupi</li>
                <li>• Data kartu yang dimasukkan tidak valid</li>
                <li>• Koneksi internet terputus saat proses pembayaran</li>
                <li>• Bank atau penyedia pembayaran sedang mengalami gangguan</li>
                <li>• Transaksi dibatalkan atau timeout</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <FiRefreshCw className="w-5 h-5 mr-2" />
                Coba Lagi
              </Link>
              
              <Link
                href="/cart"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                Kembali ke Keranjang
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
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Butuh Bantuan?</h4>
                <p className="text-sm text-zinc-300 mb-3">
                  Jika masalah terus berlanjut, jangan ragu untuk menghubungi tim dukungan kami.
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@justeatss.id"
                    className="block text-orange-400 hover:text-orange-300 transition-colors text-sm"
                  >
                    📧 support@justeatss.id
                  </a>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-orange-400 hover:text-orange-300 transition-colors text-sm"
                  >
                    📱 WhatsApp: +62 812-3456-7890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PaymentErrorContent />
    </Suspense>
  );
}
