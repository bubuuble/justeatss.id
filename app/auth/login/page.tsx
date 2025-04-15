// app/auth/login/page.tsx // Ensure this path matches your project structure
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { createClient } from '@/lib/supabase/client'; // Import Supabase client helper
import type { AuthError } from '@supabase/supabase-js'; // Import error type
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() { // Renamed component for clarity if needed
  const router = useRouter(); // Initialize router
  const supabase = createClient(); // Initialize Supabase client

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for Supabase errors
  const [message, setMessage] = useState<string | null>(null); // State for success/info messages


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    setMessage(null);

    try {
      // --- Supabase Login Logic ---
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      // --- End Supabase Login Logic ---

      if (signInError) {
        // Handle specific errors
        if (signInError.message.includes('Email not confirmed')) {
          setError(
            'Email not confirmed. Please check your inbox for the confirmation link.'
          );
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.');
        } else {
          setError(signInError.message); // Show generic Supabase error
        }
        throw signInError; // Stop execution here if error occurred
      }

      // --- Login Successful ---
      setMessage('Login successful! Redirecting to dashboard...');
      console.log('Login successful, redirecting to /dashboard');

      // --- Redirect to Dashboard ---
      // Option 1: Explicit push (more direct)
      router.push('/dashboard');

      // Option 2: Refresh (often preferred with SSR helpers, lets middleware/server handle state)
      // router.refresh();
      // --- End Redirect ---

      // No need to clear form on success if redirecting immediately

    } catch (err) {
      console.error('Login process failed:', err);
      // Error state should already be set in the try block for signInError
      // Set a generic error only if one wasn't set by the Supabase check
      if (!error && err instanceof Error) {
        setError(err.message || 'An unexpected error occurred during login.');
      }
    } finally {
      // Stop loading indicator *unless* redirecting immediately
      // If using router.push, the component might unmount quickly anyway
      // If using router.refresh, you might want to keep loading until refresh completes
      // Let's set loading false here for simplicity with router.push
      setLoading(false);
    }
  };

  // ----- Your Existing JSX Structure -----
  // (Make sure to add elements to display 'error' and 'message' states)

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Image/Brand area (Keep as is) */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-900 flex-col justify-center items-center p-8">
         {/* ... your existing left side content ... */}
         <div className="max-w-md text-center">
          <Link href="/">
            <img
              src="/assets/logo.png"
              alt="JustEatsss Logo"
              className="w-24 h-24 mx-auto mb-8 rounded-full"
            />
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back to JustEatsss</h2>
          <p className="text-zinc-400 mb-6">
            Log in to access your account, place orders, and explore our delicious selection of sweet and savory treats.
          </p>
          {/* ... rest of left side features ... */}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
            <p className="text-zinc-400">Please enter your details to continue</p>
          </div>

          {/* Display Messages/Errors */}
          {error && <p className="mb-4 text-center text-red-500 bg-red-900 border border-red-700 p-3 rounded">{error}</p>}
          {message && <p className="mb-4 text-center text-green-500 bg-green-900 border border-green-700 p-3 rounded">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input (Add disabled prop) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading} // Add disabled state
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password Input (Add disabled prop to input and button) */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading} // Add disabled state
                  className="block w-full pl-10 pr-10 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading} // Add disabled state
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <FiEye className="h-5 w-5 text-zinc-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me / Forgot password (Keep as is) */}
            {/* ... */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={loading}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-600 focus:ring-0 disabled:opacity-60"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className={`text-zinc-400 hover:text-white ${loading ? 'pointer-events-none opacity-60' : ''}`}>
                  Forgot password?
                </Link>
              </div>
            </div>


            {/* Submit Button (Keep as is, already handles disabled state) */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className={`text-zinc-400 ${loading ? 'opacity-60' : ''}`}>
              Don't have an account?{" "}
              <Link href="/auth/register" className={`text-white hover:underline ${loading ? 'pointer-events-none' : ''}`}>
                Sign up
              </Link>
            </p>
          </div>

          {/* Optional: Social login buttons (Keep as is) */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
}