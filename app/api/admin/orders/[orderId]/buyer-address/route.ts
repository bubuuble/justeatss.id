// app/api/admin/orders/[orderId]/buyer-address/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { client } from '../../../../../../sanity/lib/client';
import { requireAdminAPI } from '../../../../../../lib/admin-middleware';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Query to fetch order by orderId
const orderQuery = `
  *[_type == "order" && orderId == $orderId][0]{
    _id,
    orderId,
    userId,
    shippingAddress
  }
`;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Check admin access
    const authError = await requireAdminAPI();
    if (authError) return authError;

    const resolvedParams = await params;
    const { orderId } = resolvedParams;

    // First, get the order to find the buyer's userId
    const order = await client.fetch(orderQuery, { orderId });
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Get buyer's addresses from Supabase
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', order.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching buyer addresses:', error);
      return NextResponse.json({ 
        message: 'Error fetching buyer addresses',
        fallback: order.shippingAddress // Return basic shipping address as fallback
      }, { status: 500 });
    }

    // Find the default address or the one that matches the shipping address
    let primaryAddress = addresses?.find(addr => addr.is_default) || addresses?.[0];
    
    // Try to match the shipping address with stored addresses
    if (order.shippingAddress && addresses) {
      const matchingAddress = addresses.find(addr => 
        addr.street_address?.toLowerCase().includes(order.shippingAddress.address?.toLowerCase()) ||
        addr.city?.toLowerCase() === order.shippingAddress.city?.toLowerCase()
      );
      if (matchingAddress) {
        primaryAddress = matchingAddress;
      }
    }

    // Return enhanced address information
    const enhancedAddress = {
      // Basic shipping info from order
      orderShippingInfo: order.shippingAddress,
      
      // Enhanced address from buyer's profile
      enhancedAddress: primaryAddress ? {
        id: primaryAddress.id,
        street_address: primaryAddress.street_address,
        city: primaryAddress.city,
        state_province: primaryAddress.state_province,
        postal_code: primaryAddress.postal_code,
        country: primaryAddress.country,
        phone_number: primaryAddress.phone_number,
        is_default: primaryAddress.is_default,
        created_at: primaryAddress.created_at,
        updated_at: primaryAddress.updated_at
      } : null,
      
      // All buyer addresses for reference
      allAddresses: addresses?.map(addr => ({
        id: addr.id,
        street_address: addr.street_address,
        city: addr.city,
        state_province: addr.state_province,
        postal_code: addr.postal_code,
        country: addr.country,
        phone_number: addr.phone_number,
        is_default: addr.is_default,
        created_at: addr.created_at
      })) || [],
      
      // Metadata
      buyerUserId: order.userId,
      totalAddresses: addresses?.length || 0
    };

    return NextResponse.json(enhancedAddress);

  } catch (error: any) {
    console.error('Error in buyer-address API:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
