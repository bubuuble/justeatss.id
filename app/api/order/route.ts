// app/api/create-order/route.ts
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'; // Dapatkan user dari server
import { sanityClient } from '@/sanity/lib/client'; // Client Sanity Anda
import { v4 as uuidv4 } from 'uuid'; // Untuk generate Order ID unik

// Asumsi tipe ItemKeranjang dari konteks Anda
interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

// Tipe untuk request body
interface CreateOrderRequestBody {
  cartItems: CartItem[];
  totalAmount: number;
  shippingAddress: { // Pastikan ini sesuai dengan struktur di Sanity
    street_address: string;
    city: string;
    state_province?: string;
    postal_code: string;
    country: string;
    phone_number?: string;
  };
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser(); // Dapatkan detail user Clerk

    if (!userId || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as CreateOrderRequestBody;
    const { cartItems, totalAmount, shippingAddress } = body;

    if (!cartItems || cartItems.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json({ message: 'Missing required order data' }, { status: 400 });
    }

    const orderId = `ORDER-${uuidv4().substring(0, 8).toUpperCase()}`; // Buat ID Pesanan

    // Persiapkan data item untuk disimpan di Sanity
    const orderItems = cartItems.map(item => ({
      _key: uuidv4(), // Sanity array items need a _key
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrl || null,
    }));

    // Buat dokumen pesanan baru di Sanity
    const newOrderDocument = {
      _type: 'order',
      orderId: orderId,
      userId: userId,
      userName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || 'N/A',
      userEmail: user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress || 'N/A',
      items: orderItems,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress, // Pastikan field shippingAddress sesuai
      paymentStatus: 'pending', // Awalnya pending, akan diupdate oleh Doku callback
      orderStatus: 'pending_confirmation',
      // Anda bisa menambahkan paymentGatewayResponse nanti setelah pembayaran Doku
    };

    const createdOrder = await sanityClient.create(newOrderDocument);

    // Di sini, setelah pesanan dibuat di Sanity dengan status 'pending',
    // Anda akan mengarahkan pengguna ke Doku atau memproses pembayaran Doku.
    // Doku akan memberikan respons, dan Anda perlu webhook untuk mengupdate paymentStatus.

    // Untuk sekarang, kita hanya kembalikan info pesanan yang dibuat
    return NextResponse.json({
        message: 'Order created successfully (pending payment)',
        orderId: createdOrder.orderId,
        // Mungkin Anda ingin mengembalikan URL redirect ke Doku di sini
        // paymentUrl: 'URL_DARI_DOKU_UNTUK_PEMBAYARAN'
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/create-order Error:", error);
    return NextResponse.json({ message: 'Error creating order', error: error.message }, { status: 500 });
  }
}