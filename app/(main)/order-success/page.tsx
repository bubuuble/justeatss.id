// app/(main)/order-success/page.tsx
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Untuk mengambil orderId dari URL
import React, { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    // Anda bisa fetch detail order berdasarkan orderId jika perlu ditampilkan

    return (
        <div className="container mx-auto px-4 py-16 text-center text-white min-h-[60vh] flex flex-col items-center justify-center">
            <div className="bg-green-600 text-white rounded-full h-16 w-16 flex items-center justify-center mb-6 text-3xl">
                ✓ {/* Checkmark icon */}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pesanan Berhasil!</h1>
            {orderId && (
                <p className="text-zinc-300 mb-2">
                    Nomor Pesanan Anda: <span className="font-semibold text-white">{orderId}</span>
                </p>
            )}
            <p className="text-zinc-400 mb-8 max-w-md">
                Terima kasih telah berbelanja. Kami akan segera memproses pesanan Anda.
                Detail konfirmasi telah dikirim ke email Anda.
            </p>
            <div className="space-x-4">
                <Link href="/products">
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700">
                        Lanjut Belanja
                    </button>
                </Link>
                <Link href="/account"> {/* Atau ke halaman riwayat pesanan */}
                    <button className="border border-zinc-700 text-zinc-300 px-6 py-2 rounded-md font-medium hover:bg-zinc-800">
                        Lihat Pesanan Saya
                    </button>
                </Link>
            </div>
        </div>
    );
}