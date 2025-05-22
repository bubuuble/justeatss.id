// app/admin/dashboard/orders/page.tsx
import React from 'react';
// import { auth } from '@clerk/nextjs/server'; // For server-side role check if Server Component
// import { redirect } from 'next/navigation'; // For redirecting if not admin

// You can make this an async Server Component to fetch data later
export default async function AdminOrdersPage() {
    // --- Example Server-Side Role Check (if you want to protect here too) ---
    // const { sessionClaims } = auth();
    // if (sessionClaims?.publicMetadata?.role !== 'admin') {
    //     console.warn("Unauthorized access attempt to /admin/dashboard/orders by user:", sessionClaims?.sub);
    //     redirect('/'); // Or to a specific "unauthorized" page
    // }
    // --- End Role Check ---

    return (
        <div className="space-y-6 text-white bg-black min-h-screen"> {/* Dark theme */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl md:text-4xl">
                        Orders List
                    </h1>
                    <p className="text-lg text-zinc-400">
                        View and manage all customer orders.
                    </p>
                </div>
            </div>
            {/* Orders table/list placeholder */}
            <div className="bg-zinc-900 p-6 rounded-lg shadow">
                <p className="text-center text-zinc-500">
                    The orders table will be displayed here.
                </p>
            </div>
        </div>
    );
}