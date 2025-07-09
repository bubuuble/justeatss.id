// app/(main)/payment/callback/page.tsx
"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ambil semua parameter dari URL
    const orderId = searchParams.get('order_id');
    const transactionStatus = searchParams.get('transaction_status');
    const statusCode = searchParams.get('status_code');

    // Buat URLSearchParams baru untuk diteruskan ke halaman tujuan
    const newSearchParams = new URLSearchParams();
    if (orderId) newSearchParams.set('order_id', orderId);
    if (transactionStatus) newSearchParams.set('transaction_status', transactionStatus);

    // Logika redirect berdasarkan transaction_status
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      // Pembayaran berhasil
      router.replace(`/payment/success?${newSearchParams.toString()}`);
    } else if (transactionStatus === 'pending') {
      // Pembayaran tertunda
      router.replace(`/payment/pending?${newSearchParams.toString()}`);
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire' || statusCode === '407') {
      // Pembayaran gagal, dibatalkan, atau kadaluarsa
      newSearchParams.set('status_message', 'Payment failed, was cancelled, or expired.');
      router.replace(`/payment/error?${newSearchParams.toString()}`);
    } else {
      // Status tidak dikenali atau pengguna hanya menutup popup
      // Arahkan ke halaman pending atau halaman utama sebagai fallback
      console.warn(`Unhandled transaction status: ${transactionStatus}`);
      router.replace(`/payment/pending?${newSearchParams.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex flex-col items-center justify-center text-white">
      <FiLoader className="w-12 h-12 animate-spin text-orange-400 mb-4" />
      <h1 className="text-2xl font-semibold">Memproses pembayaran Anda...</h1>
      <p className="text-zinc-400 mt-2">Mohon tunggu, jangan tutup halaman ini.</p>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}