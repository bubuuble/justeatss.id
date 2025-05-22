// app/admin/dashboard/page.tsx
import OrderStats from "./components/order-stats"
import RecentOrders from "./components/recent-orders"
import { DashboardShell } from "./components/dashboard-shell"
import { DashboardHeader } from "./components/dashboard-header"

import { sanityClient } from '@/sanity/lib/client'; // Adjust path
import { groq } from 'next-sanity';
// import { auth } from '@clerk/nextjs/server'; // For server-side auth check
// import { redirect } from 'next/navigation';

// Define the type for the order data fetched from Sanity
// This should match the fields selected in your GROQ query
export interface AdminOrder {
  _id: string;
  orderId: string;
  userName?: string;
  userEmail?: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  _createdAt: string; // Sanity's creation timestamp
  // Add 'items' if you want to quickly count products for stats, or pass full items to RecentOrders
  items?: Array<{ productName?: string; quantity?: number }>; // Example
}

const ordersQuery = groq`
  *[_type == "order"] | order(_createdAt desc) {
    _id,
    orderId,
    userName,
    userEmail,
    totalAmount,
    paymentStatus,
    orderStatus,
    _createdAt,
    items[]{productName, quantity} // Fetching items for potential display or stats
  }
`;

async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const orders = await sanityClient.fetch<AdminOrder[]>(ordersQuery);
    return orders || [];
  } catch (error) {
    console.error("Failed to fetch orders for admin dashboard:", error);
    return [];
  }
}


export default async function DashboardPage() {
  // --- Optional: Server-side Role Check ---
  // const { sessionClaims } = auth();
  // if (sessionClaims?.metadata?.role !== 'admin') {
  //   console.warn("Unauthorized access attempt to admin dashboard by user:", sessionClaims?.sub);
  //   redirect('/'); // Or to a dedicated unauthorized page
  // }
  // --- End Role Check ---

  const orders = await getAdminOrders();

  return (
    <DashboardShell>
      <DashboardHeader heading="Order Dashboard" text="Manage and monitor all your customer orders." />
      <div className="text-white">
        <OrderStats orders={orders} />
        <RecentOrders initialOrders={orders} />
      </div>
    </DashboardShell>
  )
}