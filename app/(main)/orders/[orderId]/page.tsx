// app/(main)/orders/[orderId]/page.tsx
import { notFound } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { client } from '../../../../sanity/lib/client';
import OrderDetailsClient from './OrderDetailsClient';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  userId?: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  _createdAt: string;
  _updatedAt: string;
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    name?: string;
  };  paymentDetails?: {
    paymentType: string;
    transactionId: string;
    paymentUrl?: string;
  };
  customerNotes?: string;
  adminNotes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string;
  }>;
}

async function getOrder(orderId: string, userEmail: string): Promise<Order | null> {
  try {
    const order = await client.fetch(
      `*[_type == "order" && orderId == $orderId && userEmail == $userEmail][0] {
        _id,
        orderId,
        userName,
        userEmail,
        userId,
        totalAmount,
        orderStatus,
        paymentStatus,
        _createdAt,
        _updatedAt,
        items[] {
          productId,
          productName,
          quantity,
          price,
          total,
          image
        },
        shippingAddress,
        paymentDetails {
          paymentType,
          transactionId,
          paymentUrl
        },
        customerNotes,
        adminNotes,
        estimatedDelivery,
        actualDelivery,
        trackingNumber,
        statusHistory[] {
          status,
          timestamp,
          note,
          updatedBy
        }
      }`,
      { orderId, userEmail }
    );

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { userId } = await auth();
  const resolvedParams = await params;
  
  if (!userId) {
    notFound();
  }

  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    notFound();
  }

  const order = await getOrder(resolvedParams.orderId, userEmail);

  if (!order) {
    notFound();
  }

  return <OrderDetailsClient order={order} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  return {
    title: `Order #${resolvedParams.orderId} - JustEatss.id`,
    description: `View details for order #${resolvedParams.orderId}`,
  };
}
