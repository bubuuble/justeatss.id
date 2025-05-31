'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home and trigger modal
    router.push('/?openAccount=true');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-400">Redirecting to account settings...</p>
      </div>
    </div>
  );
}