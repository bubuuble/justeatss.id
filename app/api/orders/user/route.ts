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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const userName = user?.firstName || 'User';

    const body = await request.json();
    // Destructure order data from body
    const {
      orderId,
      totalAmount,
      orderStatus,
      items,
      shippingAddress,
      paymentDetails,
      customerNotes,
      estimatedDelivery
    } = body;

    // Basic validation
    if (!orderId || !totalAmount) {
      return NextResponse.json({ message: 'Missing orderId or totalAmount' }, { status: 400 });
    }

    // --- Mapping items agar sesuai schema Sanity ---
    const mappedItems = Array.isArray(items)
      ? items.map((item: any) => ({
          productId: item.id || item.productId || '',
          productName: item.name || item.productName || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          total: (item.price || 0) * (item.quantity || 1),
          image: item.imageUrl || item.image || '',
        }))
      : [];

    // --- Mapping shippingAddress agar konsisten ---
    let mappedShippingAddress = {};
    if (shippingAddress) {
      mappedShippingAddress = {
        name: shippingAddress.name || shippingAddress.first_name || shippingAddress.full_name || '',
        phone: shippingAddress.phone || shippingAddress.phone_number || '',
        address:
          shippingAddress.address ||
          shippingAddress.street_address ||
          shippingAddress.street ||
          '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postal_code || shippingAddress.postalCode || '',
        country: shippingAddress.country || '',
      };
    }

    // Save to Sanity
    const doc = {
      _type: 'order',
      orderId,
      userId, // Simpan userId Clerk
      userName: userName,
      userEmail: userEmail,
      totalAmount: totalAmount,
      orderStatus: 'pending_confirmation', // Paksa status awal, jangan percaya input dari client
      paymentStatus: 'pending', // Selalu 'pending' saat dibuat
      items: mappedItems,
      shippingAddress: mappedShippingAddress,
      paymentDetails: paymentDetails || {},
      customerNotes: customerNotes || '',
      estimatedDelivery: estimatedDelivery || null,
      _createdAt: new Date().toISOString(),
    };

    // Debug log: tampilkan data yang akan dikirim ke Sanity
    console.log('[ORDER API] Akan create order ke Sanity:', JSON.stringify(doc, null, 2));

    // Log env sanity token dan project info
    console.log('[ORDER API] ENV:', {
      SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN ? 'defined' : 'undefined',
      SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
      NODE_ENV: process.env.NODE_ENV
    });

    try {
      const result = await client.create(doc);
      console.log('[ORDER API] Sukses create order di Sanity:', result);
      return NextResponse.json({ success: true, order: result });
    } catch (err: any) {
      console.error('[ORDER API] ERROR create order di Sanity:', err);
      return NextResponse.json({ message: 'Failed to save order to Sanity', error: err.message, sanityError: err }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error saving order to Sanity:', error);
    return NextResponse.json({ message: 'Failed to save order', error: error.message }, { status: 500 });
  }
}
