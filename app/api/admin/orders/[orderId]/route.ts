import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '../../../../../sanity/lib/client';
import { requireAdminAPI } from '../../../../../lib/admin-middleware';

// GET - Get specific order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Check admin access
    const authError = await requireAdminAPI();
    if (authError) return authError;

    const resolvedParams = await params;
    const order = await client.fetch(
      `*[_type == "order" && orderId == $orderId][0]{
        _id,
        orderId,
        userId,
        userName,
        userEmail,
        items,
        totalAmount,
        shippingAddress,
        paymentStatus,
        orderStatus,
        paymentDetails,
        adminNotes,
        orderNotes,
        customerNotes,
        orderHistory,
        estimatedDelivery,
        actualDelivery,
        paymentGatewayResponse,
        _createdAt,
        _updatedAt
      }`,
      { orderId: resolvedParams.orderId }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update order status and details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Check admin access
    const authError = await requireAdminAPI();
    if (authError) return authError;

    // Get userId for history tracking
    const { userId } = await auth();

    const resolvedParams = await params;
    const body = await request.json();
    const { 
      orderStatus, 
      paymentStatus, 
      adminNotes, 
      orderNotes, 
      estimatedDelivery,
      actualDelivery 
    } = body;

    // First get the current order to append to history
    const currentOrder = await client.fetch(
      `*[_type == "order" && orderId == $orderId][0]{ orderStatus, orderHistory }`,
      { orderId: resolvedParams.orderId }
    );

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prepare update object
    const updateData: any = {};
    
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (orderNotes !== undefined) updateData.orderNotes = orderNotes;
    if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
    if (actualDelivery) updateData.actualDelivery = actualDelivery;

    // Add to order history if status changed
    if (orderStatus && orderStatus !== currentOrder.orderStatus) {
      const newHistoryEntry = {
        _type: 'object',
        status: orderStatus,
        timestamp: new Date().toISOString(),
        note: `Status changed from ${currentOrder.orderStatus} to ${orderStatus}`,
        updatedBy: userId, // You might want to get actual admin name
      };

      updateData.orderHistory = [
        ...(currentOrder.orderHistory || []),
        newHistoryEntry,
      ];    }    // Update the order in Sanity
    const orderId = await client.fetch(`*[_type == "order" && orderId == $orderId][0]._id`, { orderId: resolvedParams.orderId });
    const updatedOrder = await client
      .patch(orderId)
      .set(updateData)
      .commit();

    return NextResponse.json({ 
      success: true, 
      message: 'Order updated successfully',
      order: updatedOrder 
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Cancel/Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Check admin access
    const authError = await requireAdminAPI();
    if (authError) return authError;

    // Get userId for history tracking
    const { userId } = await auth();

    const resolvedParams = await params;
    const body = await request.json();
    const { reason, hardDelete = false } = body;

    if (hardDelete) {
      // Permanently delete the order
      await client.delete({
        query: `*[_type == "order" && orderId == $orderId]`,
        params: { orderId: resolvedParams.orderId }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Order permanently deleted' 
      });
    } else {
      // Soft delete - just update status to cancelled
      const currentOrder = await client.fetch(
        `*[_type == "order" && orderId == $orderId][0]{ orderHistory }`,
        { orderId: resolvedParams.orderId }
      );

      const newHistoryEntry = {
        _type: 'object',
        status: 'cancelled',
        timestamp: new Date().toISOString(),
        note: reason || 'Order cancelled by admin',
        updatedBy: userId,
      };      const orderDocId = await client.fetch(`*[_type == "order" && orderId == $orderId][0]._id`, { orderId: resolvedParams.orderId });
      await client
        .patch(orderDocId)
        .set({
          orderStatus: 'cancelled',
          adminNotes: reason ? `Cancelled: ${reason}` : 'Cancelled by admin',
          orderHistory: [
            ...(currentOrder?.orderHistory || []),
            newHistoryEntry,
          ],
        })
        .commit();

      return NextResponse.json({ 
        success: true, 
        message: 'Order cancelled successfully' 
      });
    }

  } catch (error) {
    console.error('Error deleting/cancelling order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
