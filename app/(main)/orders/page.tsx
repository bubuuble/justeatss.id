// app/(main)/orders/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserOrderHistory from '../../components/UserOrderHistory';

export default async function OrdersPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-black">
      <UserOrderHistory />
    </div>
  );
}

export const metadata = {
  title: 'My Orders - JustEatss.id',
  description: 'View and manage your order history',
};
