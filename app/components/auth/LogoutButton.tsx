// components/auth/LogoutButton.tsx
'use client'; // <-- Essential: This component needs browser interaction

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Use the client-side helper

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient(); // Create client-side instance
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);

        if (error) {
            console.error('Error logging out:', error);
            alert(`Logout failed: ${error.message}`); // Provide feedback
        } else {
            // Refresh the current route. If the user is on a protected route,
            // the server component logic (like in dashboard/page.tsx)
            // will re-run, detect no user, and redirect.
            router.refresh();
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
        >
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
}