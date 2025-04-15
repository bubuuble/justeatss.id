// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Use the server client helper
import LogoutButton from '../components/auth/LogoutButton'; // Import the client component for logout
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient(); // Use the async server client helper

  // Fetch user session
  const { data, error } = await supabase.auth.getUser();

  // If error fetching user or no user session exists, redirect to login
  if (error || !data?.user) {
    console.log('User not authenticated, redirecting from dashboard server page.');
    redirect('/auth/login'); // Or your preferred login route
  }

  // If we reach here, the user is authenticated
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Welcome, {data.user.email}!</p>
      <p className="text-sm text-gray-600 mb-4">User ID: {data.user.id}</p>
      <p className="mb-4">You are logged in and viewing a server-protected page.</p>

      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          Go back Home
        </Link>
      </div>
    </div>
  );
}