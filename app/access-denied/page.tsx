import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="text-zinc-400 text-lg mb-2">
            You don't have permission to access this area.
          </p>
          <p className="text-zinc-500 text-sm">
            Administrator privileges are required to view this content.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
          >
            Return to Home
          </Link>
          
          <Link 
            href="/sign-in"
            className="block w-full px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors font-medium"
          >
            Sign In with Different Account
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Need admin access? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
