// app/api/midtrans/notification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
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
      case 'paid':
      case 'capture':
        if (fraud_status === 'accept') {
          orderStatus = 'paid';
          console.log(`Payment successful for order ${order_id}`);
        } else {
          orderStatus = 'fraud';
          console.log(`Fraudulent payment detected for order ${order_id}`);
        }
        break;
      case 'settlement':
        orderStatus = 'paid';
        console.log(`Payment settled for order ${order_id}`);
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
    }    if (shouldUpdateOrder) {
      // Update order status in Sanity
      try {
        const orderQuery = `*[_type == "order" && orderId == $orderId][0]`;
        const existingOrder = await client.fetch(orderQuery, { orderId: order_id });

        if (existingOrder) {
          // Prepare update data
          const updateData: any = {};
          updateData.paymentStatus = (transaction_status === 'settlement' || transaction_status === 'capture' || transaction_status === 'paid')
            ? 'paid'
            : (transaction_status === 'pending' ? 'pending' : transaction_status);

          // Update order status based on payment status
          if (transaction_status === 'paid' || transaction_status === 'capture') {
            updateData.orderStatus = 'confirmed';
          } else if (transaction_status === 'pending') {
            updateData.orderStatus = 'pending_confirmation';
          } else if (['deny', 'cancel', 'expire', 'failed', 'fraud', 'denied'].includes(transaction_status)) {
            updateData.orderStatus = 'cancelled';
          } else if (['refund', 'partial_refund'].includes(transaction_status)) {
            updateData.orderStatus = 'refunded';
          }

          // Update payment details
          updateData.paymentDetails = {
            _type: 'paymentDetails',
            transactionId: transaction_id,
            paymentType: payment_type,
            transactionTime: new Date().toISOString(),
            paidTime: transaction_status === 'paid' ? new Date().toISOString() : undefined,
            fraudStatus: fraud_status,
            grossAmount: gross_amount,
            signatureKey: signature_key,
            rawStatus: transaction_status,
          };

          // Add to order history (append, don't overwrite)
          const historyEntry = {
            _type: 'orderHistory',
            status: updateData.orderStatus || existingOrder.orderStatus,
            timestamp: new Date().toISOString(),
            note: `Payment ${transaction_status} - Transaction ID: ${transaction_id}`,
            updatedBy: 'system',
          };

          // Use Sanity patch to append to orderHistory array
          await client
            .patch(existingOrder._id)
            .set(updateData)
            .setIfMissing({ orderHistory: [] })
            .insert('after', 'orderHistory[-1]', [historyEntry])
            .set({ paymentGatewayResponse: JSON.stringify(notification) })
            .commit();

          console.log(`✅ Order ${order_id} updated successfully in Sanity`);
        } else {
          console.log(`⚠️ Order ${order_id} not found in Sanity`);
        }
      } catch (error) {
        console.error(`❌ Error updating order ${order_id} in Sanity:`, error);
      }

      console.log(`Order ${order_id} status updated to: ${orderStatus}`);

      // Implement additional business logic based on status
      switch (orderStatus) {
        case 'paid':
          console.log(`📧 TODO: Send confirmation email for order ${order_id}`);
          console.log(`📦 TODO: Update inventory for order ${order_id}`);
          console.log(`🚀 TODO: Start order fulfillment process for order ${order_id}`);
          break;
        case 'cancelled':
          console.log(`📦 TODO: Release reserved inventory for order ${order_id}`);
          console.log(`📧 TODO: Send cancellation notification for order ${order_id}`);
          break;
        case 'refunded':
          console.log(`💰 TODO: Handle refund process for order ${order_id}`);
          console.log(`📦 TODO: Update inventory if needed for order ${order_id}`);
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
