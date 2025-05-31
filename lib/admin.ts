import { auth, currentUser } from '@clerk/nextjs/server';

// Configuration for admin access
export const ADMIN_CONFIG = {
  // Specific Clerk user IDs that should have admin access
  adminUserIds: [
    'user_2xnoEskOEfnHqkvxjMeiVJ49y2C', // Replace with actual user IDs
    'user_2xnmG41k2tYEl99NVpadtWeHOqB',
  ] as string[],
  
  // Email addresses that should have admin access
  adminEmails: [
    'harsya.powerup@gmail.com',
    'hsnkupin@gmail.com', 
    // Add more admin emails as needed
  ],
  
  // Whether to allow users with 'admin' role in publicMetadata
  allowRoleBasedAccess: true,
  
  // Whether to allow organization admins
  allowOrgAdmins: true,
};

export async function isUserAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return false;
    }

    const user = await currentUser();
    
    if (!user) {
      return false;
    }

    // Check if user has admin role in public metadata
    if (ADMIN_CONFIG.allowRoleBasedAccess) {
      const userRole = user.publicMetadata?.role as string;
      if (userRole === 'admin') {
        return true;
      }
    }

    // Check if user ID is in admin list
    if (ADMIN_CONFIG.adminUserIds.includes(userId)) {
      return true;
    }    // Check if user email is in admin list
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail && ADMIN_CONFIG.adminEmails.includes(userEmail)) {
      return true;
    }

    // Check organization role - use auth() to get org role instead
    if (ADMIN_CONFIG.allowOrgAdmins) {
      const { orgRole } = await auth();
      if (orgRole === 'org:admin') {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  const isAdmin = await isUserAdmin();
  
  if (!isAdmin) {
    throw new Error('Admin access required');
  }
}

// Helper function to get current user info with admin status
export async function getCurrentUserWithAdminStatus() {
  const user = await currentUser();
  const isAdmin = await isUserAdmin();
  
  return {
    user,
    isAdmin,
  };
}
