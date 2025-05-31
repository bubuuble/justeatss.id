import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { isUserAdmin } from '../../lib/admin';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  const hasAdminAccess = await isUserAdmin();
  
  if (!hasAdminAccess) {
    redirect('/access-denied');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <header className="bg-zinc-900/50 border-b border-zinc-700 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-zinc-400 text-sm">Justeatss.id Management</p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
    </div>
  );
}
