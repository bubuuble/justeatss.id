// app/api/addresses/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize DB client (ensure these are set in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables");
    // Optionally throw an error or handle appropriately
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- GET Handler: Fetch user's addresses ---
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
        console.warn("GET /api/addresses: Unauthorized access attempt.");
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error; // Let the catch block handle DB errors

    return NextResponse.json(addresses || []);

  } catch (error: any) {
    // Tambahkan detail error Supabase ke response saat development
    console.error("GET /api/addresses Error:", error);
    let message = 'Error fetching addresses';
    if (process.env.NODE_ENV !== 'production') {
      if (error?.message) message += `: ${error.message}`;
      if (error?.code) message += ` (code: ${error.code})`;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}

// --- POST Handler: Add a new address ---
export async function POST(req: Request) {
   try {
    const { userId } = await auth();
    if (!userId) {
        console.warn("POST /api/addresses: Unauthorized access attempt.");
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    // Destructure phone_number from body
    const { street_address, city, state_province, postal_code, country, is_default, phone_number } = body;

    // Basic validation
    if (!street_address || !city || !postal_code || !country) {
       return NextResponse.json({ message: 'Missing required address fields' }, { status: 400 });
    }

    const { data: newAddress, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        street_address,
        city,
        state_province: state_province || null, // Ensure null if empty
        postal_code,
        country,
        is_default: is_default || false,
        phone_number: phone_number || null // Add phone_number, default to null if empty/missing
      })
      .select()
      .single();

    if (error) throw error;

    // Handle default logic (only if insert succeeded and is_default is true)
    if (newAddress && newAddress.is_default) {
         await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', userId)
            .neq('id', newAddress.id); // Don't unset the one we just added
    }

    return NextResponse.json(newAddress, { status: 201 }); // 201 Created status

  } catch (error: any) {
     console.error("POST /api/addresses Error:", error);
     const message = process.env.NODE_ENV === 'production' ? 'Error adding address' : error.message;
     return NextResponse.json({ message: message }, { status: 500 });
  }
}

// --- PUT Handler: Update an existing address ---
export async function PUT(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.warn("PUT /api/addresses: Unauthorized access attempt.");
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        // Destructure phone_number
        const { id, street_address, city, state_province, postal_code, country, is_default, phone_number } = body;

        // Validate required fields for update
        if (!id) return NextResponse.json({ message: 'Address ID is required for update' }, { status: 400 });
        if (!street_address || !city || !postal_code || !country) {
           return NextResponse.json({ message: 'Missing required address fields' }, { status: 400 });
        }

        // Update the specific address, ensuring it belongs to the user
        const { data: updatedAddress, error } = await supabase
            .from('addresses')
            .update({
                street_address,
                city,
                state_province: state_province || null,
                postal_code,
                country,
                is_default: is_default || false,
                phone_number: phone_number || null // Add phone_number update
            })
            .eq('id', id)          // Match the address ID
            .eq('user_id', userId) // Ensure it belongs to this user (CRITICAL SECURITY)
            .select()
            .single();

        // Check for errors or if no row was updated (wrong ID or user)
        if (error?.code === 'PGRST116' || !updatedAddress) {
             return NextResponse.json({ message: 'Address not found or unauthorized' }, { status: 404 });
        }
        if (error) throw error; // Throw other DB errors

        // Handle default logic if needed (similar to POST)
        if (updatedAddress.is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', userId)
                .neq('id', updatedAddress.id);
        }

        return NextResponse.json(updatedAddress);

    } catch (error: any) {
        console.error("PUT /api/addresses Error:", error);
        const message = process.env.NODE_ENV === 'production' ? 'Error updating address' : error.message;
        return NextResponse.json({ message: message }, { status: 500 });
    }
}


// --- DELETE Handler: Remove an address ---
export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.warn("DELETE /api/addresses: Unauthorized access attempt.");
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Assumes ID is sent in the request body
        const { id } = await req.json();

        if (!id) return NextResponse.json({ message: 'Address ID is required for deletion' }, { status: 400 });

        // Delete the address, ensuring it belongs to the user
        const { error, count } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id)          // Match the address ID
            .eq('user_id', userId); // Ensure it belongs to this user (CRITICAL SECURITY)

        if (error) throw error; // Throw DB errors

        // Check if any row was actually deleted
        if (count === 0) {
             return NextResponse.json({ message: 'Address not found or unauthorized' }, { status: 404 });
        }

        // Return success, 204 No Content is standard for DELETE
        return new NextResponse(null, { status: 204 });

    } catch (error: any) {
        console.error("DELETE /api/addresses Error:", error);
        const message = process.env.NODE_ENV === 'production' ? 'Error deleting address' : error.message;
        return NextResponse.json({ message: message }, { status: 500 });
    }
}