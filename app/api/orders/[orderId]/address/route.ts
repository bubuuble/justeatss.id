// app/api/orders/[orderId]/address/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { client } from '../../../../../sanity/lib/client';

interface Address {
  id: string;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  phone_number?: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Only initialize Supabase if credentials are available
let supabase: any = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    console.log('🔍 Enhanced Address API called');
    
    const { userId } = await auth();
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    console.log('📧 User email:', userEmail);

    if (!userEmail) {
      return NextResponse.json({ message: 'User email not found' }, { status: 400 });
    }

    const resolvedParams = await params;
    console.log('📋 Order ID:', resolvedParams.orderId);    // First, get the order to verify ownership and get basic shipping info
    console.log('🔍 Fetching order from Sanity...');
    const order = await client.fetch(
      `*[_type == "order" && orderId == $orderId && userEmail == $userEmail][0] {
        _id,
        shippingAddress,
        userId
      }`,
      { 
        orderId: resolvedParams.orderId,
        userEmail: userEmail
      }
    );
    console.log('📦 Order found:', !!order, order ? { id: order._id, hasShipping: !!order.shippingAddress } : 'null');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }    // Check if Supabase environment variables are available
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, returning order shipping info only');
      return NextResponse.json({
        orderShippingInfo: order.shippingAddress,
        enhancedAddress: null,
        allAddresses: [],
        totalAddresses: 0,
        warning: 'Enhanced address features unavailable - Supabase not configured'
      });
    }    // Get user's addresses from Supabase
    console.log('🗄️ Fetching addresses from Supabase...');
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('📍 Addresses result:', { count: addresses?.length || 0, error: !!error });

    if (error) {
      console.error('Error fetching user addresses:', error);
      return NextResponse.json({ 
        message: 'Error fetching addresses',
        orderShippingInfo: order.shippingAddress,
        enhancedAddress: null,
        allAddresses: [],
        totalAddresses: 0,
        warning: 'Could not fetch enhanced address data'
      }, { status: 200 }); // Return 200 with fallback data instead of 500
    }

    // Find the best matching address or default address
    let enhancedAddress: Address | null = null;
    const typedAddresses = addresses as Address[] | null;
    
    if (typedAddresses && typedAddresses.length > 0) {
      enhancedAddress = typedAddresses.find((addr: Address) => addr.is_default) || typedAddresses[0];
      
      // Try to match the shipping address with stored addresses
      if (order.shippingAddress && typedAddresses) {
        const matchingAddress = typedAddresses.find((addr: Address) => 
          addr.street_address?.toLowerCase().includes(order.shippingAddress.address?.toLowerCase() || '') ||
          addr.city?.toLowerCase() === order.shippingAddress.city?.toLowerCase() ||
          addr.phone_number === order.shippingAddress.phone
        );
        if (matchingAddress) {
          enhancedAddress = matchingAddress;
        }
      }
    }

    // Return enhanced address information
    return NextResponse.json({
      // Basic shipping info from order
      orderShippingInfo: order.shippingAddress,
      
      // Enhanced address from user's profile
      enhancedAddress: enhancedAddress ? {
        id: enhancedAddress.id,
        street_address: enhancedAddress.street_address,
        city: enhancedAddress.city,
        state_province: enhancedAddress.state_province,
        postal_code: enhancedAddress.postal_code,
        country: enhancedAddress.country,
        phone_number: enhancedAddress.phone_number,
        is_default: enhancedAddress.is_default,
        created_at: enhancedAddress.created_at,
        updated_at: enhancedAddress.updated_at
      } : null,
        // All user addresses for reference
      allAddresses: typedAddresses?.map((addr: Address) => ({
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
      totalAddresses: typedAddresses?.length || 0
    });

  } catch (error: any) {
    console.error('Error in order address API:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
