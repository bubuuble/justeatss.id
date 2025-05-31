import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin, ADMIN_CONFIG } from '../../../lib/admin';

async function getAdminUsers() {
  try {
    const clerk = await clerkClient();
    const adminUsers = [];
    
    // Get users by admin IDs
    for (const userId of ADMIN_CONFIG.adminUserIds) {
      try {
        const user = await clerk.users.getUser(userId);
        adminUsers.push({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          type: 'userId',
          imageUrl: user.imageUrl,
        });
      } catch (error) {
        console.warn(`Could not fetch admin user ${userId}:`, error);
      }
    }
    
    // Get users by admin emails
    for (const email of ADMIN_CONFIG.adminEmails) {
      try {
        const users = await clerk.users.getUserList({
          emailAddress: [email],
        });
        
        if (users.data.length > 0) {
          const user = users.data[0];
          if (!adminUsers.find(au => au.id === user.id)) {
            adminUsers.push({
              id: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              type: 'email',
              imageUrl: user.imageUrl,
            });
          }
        }
      } catch (error) {
        console.warn(`Could not fetch user with email ${email}:`, error);
      }
    }
    
    return adminUsers;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

export default async function AdminSettingsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const hasAdminAccess = await isUserAdmin();
  
  if (!hasAdminAccess) {
    redirect('/');
  }

  const currentUserInfo = await currentUser();
  const adminUsers = await getAdminUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white p-8">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
          <p className="text-zinc-400">Manage administrator access and permissions</p>
        </div>

        {/* Current User Info */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-3">👤</span>
            Your Admin Status
          </h2>
          
          <div className="flex items-center space-x-4">
            {currentUserInfo?.imageUrl && (
              <img 
                src={currentUserInfo.imageUrl} 
                alt="Profile" 
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="text-white font-medium">
                {currentUserInfo?.firstName} {currentUserInfo?.lastName}
              </p>
              <p className="text-zinc-400 text-sm">
                {currentUserInfo?.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center mt-1">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  ✅ Admin Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Users List */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-3">👥</span>
            Current Admin Users
          </h2>
          
          {adminUsers.length > 0 ? (
            <div className="space-y-4">
              {adminUsers.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/50">
                  <div className="flex items-center space-x-4">
                    {admin.imageUrl && (
                      <img 
                        src={admin.imageUrl} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{admin.name || 'No name'}</p>
                      <p className="text-zinc-400 text-sm">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      admin.type === 'userId' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {admin.type === 'userId' ? 'User ID' : 'Email'}
                    </span>
                    {admin.id === currentUserInfo?.id && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔒</div>
              <p className="text-zinc-400">No admin users configured</p>
            </div>
          )}
        </div>

        {/* Configuration Info */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-3">⚙️</span>
            Admin Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-white mb-2">Admin User IDs</h3>
              <div className="bg-zinc-900/50 rounded-lg p-3 text-sm">
                <code className="text-green-400">
                  {ADMIN_CONFIG.adminUserIds.length > 0 
                    ? ADMIN_CONFIG.adminUserIds.join(', ') 
                    : 'None configured'
                  }
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Admin Emails</h3>
              <div className="bg-zinc-900/50 rounded-lg p-3 text-sm">
                <code className="text-green-400">
                  {ADMIN_CONFIG.adminEmails.join(', ')}
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Role-based Access</h3>
              <div className="bg-zinc-900/50 rounded-lg p-3 text-sm">
                <code className="text-green-400">
                  {ADMIN_CONFIG.allowRoleBasedAccess ? 'Enabled' : 'Disabled'}
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Organization Admins</h3>
              <div className="bg-zinc-900/50 rounded-lg p-3 text-sm">
                <code className="text-green-400">
                  {ADMIN_CONFIG.allowOrgAdmins ? 'Enabled' : 'Disabled'}
                </code>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <h4 className="font-medium text-blue-200 mb-2">💡 How to Add Admin Users</h4>
            <div className="text-blue-200 text-sm space-y-2">
              <p>1. <strong>By User ID:</strong> Add Clerk user IDs to <code className="bg-blue-900/30 px-1 rounded">ADMIN_CONFIG.adminUserIds</code> in <code className="bg-blue-900/30 px-1 rounded">lib/admin.ts</code></p>
              <p>2. <strong>By Email:</strong> Add email addresses to <code className="bg-blue-900/30 px-1 rounded">ADMIN_CONFIG.adminEmails</code></p>
              <p>3. <strong>By Role:</strong> Set user's public metadata role to 'admin' in Clerk Dashboard</p>
              <p>4. <strong>Organization:</strong> Make user an organization admin in Clerk</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <a 
            href="/admin/dashboard" 
            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </a>
          
          <a 
            href="https://dashboard.clerk.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            Open Clerk Dashboard ↗
          </a>
        </div>
      </div>
    </div>
  );
}
