import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isUserAdmin } from './admin';

export async function withAdminAuth<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const { userId } = await auth();
      
      if (!userId) {
        return NextResponse.json({ 
          message: 'Authentication required' 
        }, { status: 401 });
      }

      const hasAdminAccess = await isUserAdmin();
      if (!hasAdminAccess) {
        return NextResponse.json({ 
          message: 'Admin access required' 
        }, { status: 403 });
      }

      return handler(request, ...args);
    } catch (error) {
      console.error('Admin auth error:', error);
      return NextResponse.json({ 
        message: 'Authentication error' 
      }, { status: 500 });
    }
  };
}

// Alternative approach: direct middleware function
export async function requireAdminAPI(): Promise<NextResponse | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    const hasAdminAccess = await isUserAdmin();
    if (!hasAdminAccess) {
      return NextResponse.json({ 
        message: 'Admin access required' 
      }, { status: 403 });
    }

    return null; // No error, continue
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ 
      message: 'Authentication error' 
    }, { status: 500 });
  }
}
