// app/api/webhooks/midtrans/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
import crypto from 'crypto';

const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;

if (!midtransServerKey) {
  throw new Error('MIDTRANS_SERVER_KEY is not set in environment variables.');
}

/**
 * Handles Midtrans payment notifications.
 * This endpoint receives webhook notifications from Midtrans, verifies them,
 * and updates the order status in Sanity accordingly.
 */
export async function POST(request: Request) {
  try {
    const notification = await request.json();

    // 1. Verify the signature to ensure the request is from Midtrans
    const signatureKey = crypto
      .createHash('sha512')
      .update(
        `${notification.order_id}${notification.status_code}${notification.gross_amount}${midtransServerKey}`
      )
      .digest('hex');

    if (signatureKey !== notification.signature_key) {
      console.error('Webhook Error: Invalid signature key.');
      return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 401 });
    }

    // 2. Process the notification based on transaction status
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let newPaymentStatus: 'pending' | 'paid' | 'failed' | 'expired' = 'pending';

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      // For credit card, 'capture' means success. For other methods, 'settlement' means success.
      if (fraudStatus === 'accept') {
        newPaymentStatus = 'paid';
      }
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'failure') {
      newPaymentStatus = 'failed';
    } else if (transactionStatus === 'expire') {
      newPaymentStatus = 'expired';
    }

    // 3. Find the order in Sanity and update it
    // We find the order by `orderId`, which should be unique.
    const orderToUpdate = await client.fetch<
      { _id: string; paymentStatus: string; orderStatus: string } | undefined
    >(`*[_type == "order" && orderId == $orderId][0]`, { orderId });

    if (!orderToUpdate) {
      console.error(`Webhook Error: Order with orderId ${orderId} not found.`);
      // Return 200 OK so Midtrans doesn't retry for a non-existent order.
      return NextResponse.json({ status: 'ok', message: 'Order not found, but acknowledged.' });
    }

    // Prevent reverting a completed order with a late 'pending' or 'expired' notification
    if (orderToUpdate.paymentStatus === 'paid' && newPaymentStatus !== 'paid') {
      console.log(`Webhook Info: Ignoring notification for already paid order ${orderId}. Current status: '${orderToUpdate.paymentStatus}', New notification: '${transactionStatus}'`);
      return NextResponse.json({ status: 'ok', message: 'Order already paid. No action taken.' });
    }

    // 4. Determine the final state and prepare the patch data
    const patchData: { [key: string]: any } = {
      paymentStatus: newPaymentStatus,
      paymentGatewayResponse: notification, // Store the full response for debugging
    };
    let historyEntry: any = null;

    if (newPaymentStatus === 'paid') {
      patchData.orderStatus = 'confirmed';
      historyEntry = {
        _key: crypto.randomBytes(12).toString('hex'), // Generate a unique key for the array item
        status: 'confirmed',
        timestamp: new  Date().toISOString(),
        note: 'Payment successful. Order automatically confirmed by system.',
        updatedBy: 'System (Webhook)',
      };
    } else if (newPaymentStatus === 'failed' || newPaymentStatus === 'expired') {
      patchData.orderStatus = 'pending_confirmation';
      historyEntry = {
        _key: crypto.randomBytes(12).toString('hex'),
        status: 'pending_confirmation',
        timestamp: new Date().toISOString(),
        note: `Payment ${newPaymentStatus}. Status from gateway: ${notification.transaction_status}. Order status set to Pending Confirmation.`,
        updatedBy: 'System (Webhook)',
      };
    } else {
      // For 'pending' status, ensure orderStatus is 'pending_confirmation'.
      // This explicitly handles the initial state and subsequent pending notifications.
      patchData.orderStatus = 'pending_confirmation';
    }

    // 5. Commit the changes to Sanity
    const patch = client.patch(orderToUpdate._id).set(patchData);
    if (historyEntry) {
      patch.append('orderHistory', [historyEntry]);
    }
    await patch.commit();

    console.log(
      `Order ${orderId} updated: Payment Status -> ${newPaymentStatus}, Order Status -> ${patchData.orderStatus}`
    );

    // 6. Respond to Midtrans with a 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
