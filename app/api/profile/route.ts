// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// --- GET Handler: Fetch user profile ---
export async function GET() {
  try {
    console.log('Profile API: Starting GET request');
    
    const { userId } = await auth();
    if (!userId) {
        console.warn("GET /api/profile: Unauthorized access attempt.");
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('Profile API: User authenticated:', userId);

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Profile API: Environment check:', {
        supabaseUrl: supabaseUrl ? 'defined' : 'undefined',
        supabaseAnonKey: supabaseAnonKey ? 'defined' : 'undefined',
        supabaseServiceKey: supabaseServiceKey ? 'defined' : 'undefined'
    });

    // Check critical environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing critical Supabase environment variables");
        return NextResponse.json({ 
            message: 'Server configuration error: Missing Supabase environment variables',
            error: 'MISSING_ENV_VARS'
        }, { status: 503 });
    }

    // Fetch from Clerk first to ensure we have user data
    console.log('Profile API: Fetching user from Clerk');
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    if (!clerkUser) {
        console.error("Clerk user not found for userId:", userId);
        return NextResponse.json({ message: 'User not found in authentication system' }, { status: 404 });
    }

    console.log('Profile API: Clerk user found:', {
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress
    });

    // For now, just return Clerk data to get the page working
    console.log('Profile API: Returning Clerk data (simplified)');
    return NextResponse.json({
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        profile_image_url: clerkUser.imageUrl || ''
    });

  } catch (error) {
    console.error('Profile API: Unexpected error in GET handler:', error);
    return NextResponse.json(
        { message: 'Internal server error', error: String(error) }, 
        { status: 500 }
    );
  }
}

// --- PUT Handler: Update user profile ---
export async function PUT(req: Request) {
  try {
    console.log('Profile API: Starting PUT request');
    
    const { userId } = await auth();
    if (!userId) {
        console.warn("PUT /api/profile: Unauthorized access attempt.");
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, profileImageUrl } = body;

    console.log('Profile API: Update data received:', { firstName, lastName, profileImageUrl: !!profileImageUrl });

    // Update Clerk
    console.log('Profile API: Updating Clerk user');
    const clerk = await clerkClient();
    const clerkUpdateData: any = {};
    if (firstName !== undefined) clerkUpdateData.firstName = firstName;
    if (lastName !== undefined) clerkUpdateData.lastName = lastName;

    if (Object.keys(clerkUpdateData).length > 0) {
        await clerk.users.updateUser(userId, clerkUpdateData);
        console.log('Profile API: Clerk user updated successfully');
    }

    // Get updated user data from Clerk
    const updatedUser = await clerk.users.getUser(userId);
    
    return NextResponse.json({
        first_name: updatedUser.firstName || '',
        last_name: updatedUser.lastName || '',
        email: updatedUser.emailAddresses[0]?.emailAddress || '',
        profile_image_url: profileImageUrl || updatedUser.imageUrl || ''
    });

  } catch (error) {
    console.error('Profile API: Unexpected error in PUT handler:', error);
    return NextResponse.json(
        { message: 'Internal server error', error: String(error) }, 
        { status: 500 }
    );
  }
}