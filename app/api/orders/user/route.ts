// app/api/orders/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { client } from '../../../../sanity/lib/client';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ message: 'User email not found' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    // Build filter to get orders for the current user
    let filter = `_type == "order" && userEmail == "${userEmail}"`;
    
    if (status && status !== 'all') {
      filter += ` && orderStatus == "${status}"`;
    }

    // Fetch user's orders
    const orders = await client.fetch(
      `*[${filter}] | order(_createdAt desc) [${offset}...${offset + limit}] {
        _id,
        orderId,
        userName,
        userEmail,
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
        estimatedDelivery,
        actualDelivery,
        trackingNumber
      }`
    );

    // Get total count for pagination
    const totalCount = await client.fetch(
      `count(*[${filter}])`
    );

    return NextResponse.json({
      orders,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
