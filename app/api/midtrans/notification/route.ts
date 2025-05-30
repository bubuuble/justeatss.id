// app/api/midtrans/notification/route.ts
import { NextRequest, NextResponse } from 'next/server';
const midtransClient = require('midtrans-client');

// Initialize Midtrans Core API
const core = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const notification = await request.json();
    console.log('Midtrans notification received:', notification);

    const {
      order_id,
      transaction_status,
      transaction_id,
      fraud_status,
      gross_amount,
      payment_type,
      signature_key,
    } = notification;

    // Verify the notification authenticity
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const grossAmount = gross_amount;
    const signatureKey = signature_key;

    // Create expected signature
    const expectedSignature = require('crypto')
      .createHash('sha512')
      .update(order_id + transaction_status + grossAmount + serverKey)
      .digest('hex');

    if (signatureKey !== expectedSignature) {
      console.error('Invalid signature key');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }    // Handle different transaction statuses
    let orderStatus: string = 'unknown';
    let shouldUpdateOrder = true;

    switch (transaction_status) {
      case 'settlement':
      case 'capture':
        if (fraud_status === 'accept') {
          orderStatus = 'paid';
          console.log(`Payment successful for order ${order_id}`);
          // TODO: Update order status in database
          // TODO: Send confirmation email
          // TODO: Trigger order processing
        } else {
          orderStatus = 'fraud';
          console.log(`Fraudulent payment detected for order ${order_id}`);
        }
        break;

      case 'pending':
        orderStatus = 'pending';
        console.log(`Payment pending for order ${order_id}`);
        break;

      case 'deny':
        orderStatus = 'denied';
        console.log(`Payment denied for order ${order_id}`);
        break;

      case 'cancel':
      case 'expire':
        orderStatus = 'cancelled';
        console.log(`Payment cancelled/expired for order ${order_id}`);
        break;

      case 'refund':
      case 'partial_refund':
        orderStatus = 'refunded';
        console.log(`Payment refunded for order ${order_id}`);
        break;

      default:
        console.log(`Unknown transaction status: ${transaction_status} for order ${order_id}`);
        shouldUpdateOrder = false;
        break;
    }

    if (shouldUpdateOrder) {
      // TODO: Update order status in your database
      // Example:
      // await updateOrderStatus(order_id, {
      //   status: orderStatus,
      //   transaction_id,
      //   payment_type,
      //   transaction_status,
      //   updated_at: new Date().toISOString()
      // });

      console.log(`Order ${order_id} status updated to: ${orderStatus}`);

      // TODO: Implement additional business logic based on status
      switch (orderStatus) {
        case 'paid':
          // Send confirmation email
          // Update inventory
          // Start order fulfillment process
          break;
        case 'cancelled':
          // Release reserved inventory
          // Send cancellation notification
          break;
        case 'refunded':
          // Handle refund process
          // Update inventory if needed
          break;
      }
    }

    // Log the transaction for audit purposes
    console.log('Transaction details:', {
      order_id,
      transaction_id,
      transaction_status,
      payment_type,
      gross_amount,
      fraud_status,
      timestamp: new Date().toISOString(),
    });

    // Return success response to Midtrans
    return NextResponse.json({ 
      status: 'ok',
      message: 'Notification processed successfully' 
    });

  } catch (error: any) {
    console.error('Error processing Midtrans notification:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process notification',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Midtrans notification webhook endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
