import { NextRequest, NextResponse } from 'next/server';
const midtransClient = require('midtrans-client');

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems, totalAmount, customerName, customerEmail, customerPhone, shippingAddress } = body;

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('Creating Midtrans transaction for order:', orderId);

    // Prepare item details for Midtrans
    const itemDetails = cartItems.map((item: any) => ({
      id: item.id,
      price: Math.round(item.price), // Ensure integer
      quantity: item.quantity,
      name: item.name,
      category: item.category || 'food',
      merchant_name: "JustEatss"
    }));

    // Add shipping cost if needed (free shipping in your case)
    itemDetails.push({
      id: 'shipping',
      price: 0,
      quantity: 1,
      name: 'Free Shipping',
      category: 'shipping'
    });

    // Prepare transaction parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(totalAmount), // Ensure integer
      },
      credit_card: {
        secure: true,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customerName.split(' ')[0] || 'Customer',
        last_name: customerName.split(' ').slice(1).join(' ') || 'JustEatss',
        email: customerEmail,
        phone: customerPhone || '081234567890',
        billing_address: {
          first_name: shippingAddress?.first_name || customerName.split(' ')[0] || 'Customer',
          last_name: shippingAddress?.last_name || customerName.split(' ').slice(1).join(' ') || 'JustEatss',
          address: shippingAddress?.address || 'Jakarta',
          city: shippingAddress?.city || 'Jakarta',
          postal_code: shippingAddress?.postal_code || '12345',
          phone: shippingAddress?.phone || customerPhone || '081234567890',
          country_code: 'IDN',
        },
        shipping_address: {
          first_name: shippingAddress?.first_name || customerName.split(' ')[0] || 'Customer',
          last_name: shippingAddress?.last_name || customerName.split(' ').slice(1).join(' ') || 'JustEatss',
          address: shippingAddress?.address || 'Jakarta',
          city: shippingAddress?.city || 'Jakarta',
          postal_code: shippingAddress?.postal_code || '12345',
          phone: shippingAddress?.phone || customerPhone || '081234567890',
          country_code: 'IDN',
        },
      },
      callbacks: {
        // Arahkan SEMUA callback ke satu halaman terpusat.
        // Halaman callback ini akan menangani status dan mengarahkan ke halaman yang benar (success, pending, error).
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/callback`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/callback`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/callback`,
      },      expiry: {
        start_time: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace('T', ' ') + ' +0700',
        unit: 'minutes',
        duration: 30
      }
    };

    console.log('Midtrans transaction parameter:', JSON.stringify(parameter, null, 2));

    // Create transaction with Midtrans
    const transaction = await snap.createTransaction(parameter);

    console.log('Midtrans transaction created:', transaction);

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId: orderId,
    });

  } catch (error: any) {
    console.error('Midtrans API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create payment transaction' 
      },
      { status: 500 }
    );
  }
}
