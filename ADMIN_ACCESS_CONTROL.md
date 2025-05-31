# Admin Access Control System

This document explains how to configure and manage the role-based access control system for the JustEatss.id admin dashboard.

## Overview

The admin access control system provides secure, multi-method authentication for administrative access to the platform. It supports four different authentication methods and centralizes all access control logic.

## Features

- **Multiple Authentication Methods**: User IDs, email addresses, role-based access, and organization admin roles
- **Centralized Protection**: All admin routes protected through admin layout
- **API Route Security**: Admin API endpoints protected with middleware
- **Configuration-based**: Easy to configure through code settings
- **User-friendly**: Proper redirects and error handling

## Authentication Methods

### 1. User ID-based Access
Add specific Clerk user IDs to the admin configuration:

```typescript
// lib/admin.ts
export const ADMIN_CONFIG = {
  adminUserIds: [
    'user_2xnoEskOEfnHqkvxjMeiVJ49y2C', // Replace with actual user IDs
    'user_2xnmG41k2tYEl99NVpadtWeHOqB',
  ],
  // ...
};
```

**How to find User IDs:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to Users
3. Click on a user to see their User ID

### 2. Email-based Access
Add email addresses to the admin configuration:

```typescript
// lib/admin.ts
export const ADMIN_CONFIG = {
  adminEmails: [
    'admin@justeatss.id',
    'owner@justeatss.id',
    'manager@justeatss.id',
  ],
  // ...
};
```

### 3. Role-based Access (Public Metadata)
Set a user's role in their Clerk public metadata:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to Users
3. Click on a user
4. Go to the "Metadata" tab
5. Add to Public metadata:
   ```json
   {
     "role": "admin"
   }
   ```

### 4. Organization Admin Role
Make users organization admins in Clerk:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to Organizations
3. Select an organization
4. Add users with "Admin" role

## File Structure

### Core Files

- **`lib/admin.ts`** - Configuration and utility functions
- **`lib/admin-middleware.ts`** - API route protection middleware
- **`app/admin/layout.tsx`** - Centralized admin access control
- **`middleware.ts`** - Route-level middleware (existing)

### Admin Pages

- **`app/admin/dashboard/page.tsx`** - Main admin dashboard
- **`app/admin/orders/page.tsx`** - Order management
- **`app/admin/orders/[orderId]/page.tsx`** - Individual order details
- **`app/admin/settings/page.tsx`** - Admin settings and user management

### Admin API Routes

- **`app/api/admin/orders/[orderId]/route.ts`** - Order CRUD operations
- **`app/api/admin/orders/[orderId]/status/route.ts`** - Order status updates
- **`app/api/admin/orders/[orderId]/buyer-address/route.ts`** - Buyer address info
- **`app/api/admin/orders/export/route.ts`** - Order data export

## Configuration

### Admin Configuration (`lib/admin.ts`)

```typescript
export const ADMIN_CONFIG = {
  // Specific Clerk user IDs that should have admin access
  adminUserIds: [
    // Add your admin user IDs here
  ] as string[],
  
  // Email addresses that should have admin access
  adminEmails: [
    'admin@justeatss.id',
    'owner@justeatss.id', 
    'manager@justeatss.id',
  ],
  
  // Whether to allow users with 'admin' role in publicMetadata
  allowRoleBasedAccess: true,
  
  // Whether to allow organization admins
  allowOrgAdmins: true,
};
```

### Key Functions

- **`isUserAdmin()`** - Checks if current user has admin access
- **`requireAdmin()`** - Throws error if user is not admin (for server components)
- **`requireAdminAPI()`** - Returns error response if user is not admin (for API routes)

## How It Works

### Page Protection (Server Components)

All admin pages are automatically protected by the admin layout:

```typescript
// app/admin/layout.tsx
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in'); // Redirect to login
  }

  const hasAdminAccess = await isUserAdmin();
  
  if (!hasAdminAccess) {
    redirect('/'); // Redirect to home if not admin
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
```

### API Route Protection

Admin API routes use middleware for protection:

```typescript
// Example: app/api/admin/orders/[orderId]/route.ts
export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  // Check admin access
  const authError = await requireAdminAPI();
  if (authError) return authError;

  // Admin-only logic here
}
```

### Middleware Protection

Route-level protection in `middleware.ts`:

```typescript
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

if (isAdminRoute(req)) {
  if (!userId) {
    auth.protect(); // Redirect to sign-in
    return;
  }

  // Check admin role
  if (orgRole === 'org:admin' || sessionClaims?.publicMetadata?.role === 'admin') {
    return NextResponse.next(); // Allow access
  } else {
    return NextResponse.redirect(new URL('/', req.url)); // Deny access
  }
}
```

## Setup Instructions

### 1. Configure Admin Users

Choose one or more methods to grant admin access:

**Option A: By User ID**
1. Find user IDs in Clerk Dashboard
2. Add them to `ADMIN_CONFIG.adminUserIds` in `lib/admin.ts`

**Option B: By Email**
1. Add email addresses to `ADMIN_CONFIG.adminEmails` in `lib/admin.ts`

**Option C: By Role**
1. Set user's public metadata role to "admin" in Clerk Dashboard

**Option D: By Organization**
1. Create an organization in Clerk
2. Add users as organization admins

### 2. Test Access

1. Start the development server: `npm run dev`
2. Sign in with an admin user
3. Navigate to `/admin/dashboard`
4. Verify access to admin pages and API endpoints

### 3. Monitor Access

Check the browser console and server logs for admin access attempts:

```
[Middleware] Path: /admin/dashboard, UserID: user_123, OrgRole: org:admin
[Middleware] User HAS admin role. Allowing access to admin route.
```

## Security Features

### Protection Layers

1. **Route Middleware** - First line of defense at the route level
2. **Admin Layout** - Centralized protection for all admin pages
3. **API Middleware** - Protection for admin API endpoints
4. **Function-level Checks** - Additional checks within specific functions

### Access Denied Handling

- **Unauthenticated users** → Redirected to sign-in page
- **Authenticated non-admins** → Redirected to home page
- **API requests without admin access** → 403 Forbidden response

### Configuration Security

- Admin configuration is server-side only
- No admin credentials exposed to client
- Multiple authentication methods for flexibility

## Troubleshooting

### Common Issues

**User can't access admin dashboard:**
1. Check if user is in `adminUserIds` or `adminEmails`
2. Verify user's public metadata role in Clerk
3. Check organization membership and role
4. Look at server logs for middleware messages

**API requests failing:**
1. Ensure API routes use `requireAdminAPI()` middleware
2. Check authentication headers in requests
3. Verify user session is valid

**Configuration not working:**
1. Restart development server after config changes
2. Check TypeScript compilation errors
3. Verify environment variables are set

### Debug Tips

1. **Check middleware logs** in browser console and server logs
2. **Use admin settings page** at `/admin/settings` to view current configuration
3. **Test with different authentication methods** to isolate issues
4. **Check Clerk Dashboard** for user details and metadata

## Admin Settings Page

The admin settings page at `/admin/settings` provides:

- Current admin user list
- Configuration overview
- Setup instructions
- Links to Clerk Dashboard

Use this page to verify your admin configuration and manage admin users.

## Best Practices

1. **Use multiple authentication methods** for redundancy
2. **Regularly audit admin users** through the settings page
3. **Monitor access logs** for security purposes
4. **Keep admin emails up to date** in the configuration
5. **Use organization roles** for team-based admin access
6. **Test admin access** after configuration changes

## Next Steps

1. **Configure your first admin user** using one of the four methods
2. **Test the admin dashboard** to ensure access works
3. **Set up additional admin users** as needed
4. **Customize admin permissions** if required
5. **Monitor admin activity** through logs and analytics
