// app/api/admin/orders/[orderId]/status/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '../../../../../../sanity/lib/client';
import { isUserAdmin } from '../../../../../../lib/admin';

// Valid order status transitions
const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  'pending_confirmation': ['confirmed', 'cancelled'],
  'settlement': ['processing', 'cancelled'], // Allow transition from legacy settlement status
  'confirmed': ['processing', 'shipped', 'cancelled'], // Allow direct ship for small orders
  'processing': ['shipped', 'cancelled'],
  'shipped': ['delivered', 'cancelled'],
  'delivered': ['refunded'],
  'cancelled': [],
  'refunded': []
};

// Update order status in Sanity
async function updateOrderStatus(orderId: string, newStatus: string, updatedBy: string, note?: string) {
  try {
    // First, get the current order to validate the status transition
    const currentOrder = await client.fetch(
      `*[_type == "order" && orderId == $orderId][0]{ _id, orderStatus, paymentStatus, orderHistory }`,
      { orderId }
    );

    if (!currentOrder) {
      throw new Error('Order not found');
    }    // Validate status transition
    const currentStatus = currentOrder.orderStatus || 'pending_confirmation';
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    
    console.log('Status transition validation:', {
      orderId,
      currentStatus,
      newStatus,
      allowedTransitions,
      isValid: allowedTransitions.includes(newStatus)
    });
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(`Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ')}`);
    }

    // Create new history entry
    const newHistoryEntry = {
      _type: 'orderHistoryEntry',
      _key: Date.now().toString(),
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy,
      note: note || `Status updated to ${newStatus.replace('_', ' ')}`
    };

    const patch = client.patch(currentOrder._id);

    // Update the order with new status and history
    patch.set({ 
      orderStatus: newStatus,
      _updatedAt: new Date().toISOString()
    });

    // If an admin confirms an order, it implies payment is also confirmed.
    if (newStatus === 'confirmed' && currentOrder.paymentStatus !== 'paid') {
      patch.set({ paymentStatus: 'paid' });
    }

    const updatedOrder = await patch
      .setIfMissing({ orderHistory: [] })
      .append('orderHistory', [newHistoryEntry])
      .commit();

    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // Add detailed debugging
  console.log('🚀 STATUS API CALLED - PATCH request received');
  console.log('📅 Timestamp:', new Date().toISOString());
  
  try {    const { userId } = await auth();
    
    if (!userId) {
      console.log('❌ STATUS API: No user ID - unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin access
    const hasAdminAccess = await isUserAdmin();
    if (!hasAdminAccess) {
      console.log('❌ STATUS API: User does not have admin access:', userId);
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    console.log('✅ STATUS API: Admin user authenticated:', userId);

    const resolvedParams = await params;
    const { orderId } = resolvedParams;
    
    console.log('📋 STATUS API: Processing order:', orderId);
    
    const body = await request.json();
    const { newStatus, note } = body;

    console.log('📤 STATUS API: Request details:', { 
      orderId, 
      newStatus, 
      note,
      userId 
    });

    if (!newStatus) {
      console.log('❌ STATUS API: Missing newStatus parameter');
      return NextResponse.json({ message: 'New status is required' }, { status: 400 });
    }

    // Validate status value
    const validStatuses = ['pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(newStatus)) {
      console.log('❌ STATUS API: Invalid status value:', newStatus, 'Valid:', validStatuses);
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    console.log('✅ STATUS API: Status validation passed');

    // Get admin user info (you might want to fetch this from Clerk or your user system)
    const adminName = 'Admin'; // You can enhance this to get actual admin name

    console.log('🔄 STATUS API: Calling updateOrderStatus...');
    const updatedOrder = await updateOrderStatus(orderId, newStatus, adminName, note);
    
    console.log('✅ STATUS API: Order updated successfully:', updatedOrder);

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: updatedOrder,
      newStatus
    });

  } catch (error: any) {
    console.error('❌ STATUS API: Error occurred:', error);
    
    if (error.message === 'Order not found') {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    if (error.message.includes('Invalid status transition')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
